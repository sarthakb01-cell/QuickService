"""
ZenServe Authentication & Database Manager (SQLite + Bcrypt)
Handles Users, Roles (Customer & Partner), Verification, Bookings & Sessions.
"""

import os
import sqlite3
import json
import uuid
import time
import bcrypt
from datetime import datetime, timedelta

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "zenserve.db")

def get_db():
    conn = sqlite3.connect(DB_PATH, timeout=25.0)
    conn.row_factory = sqlite3.Row
    return conn

def hash_password(password: str) -> str:
    """Hash password securely using bcrypt."""
    salt = bcrypt.gensalt(rounds=12)
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    """Verify password against bcrypt hash."""
    try:
        return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))
    except Exception:
        return False

def init_db():
    """Initialize database tables and seed demo accounts if not existing."""
    conn = get_db()
    cursor = conn.cursor()

    # 1. Users Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        role TEXT NOT NULL, -- 'customer' or 'partner'
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT,
        password_hash TEXT NOT NULL,
        language TEXT DEFAULT 'en',
        created_at TEXT NOT NULL,
        -- Partner specific fields
        category TEXT, -- 'plumber', 'electrician', 'cab', etc.
        area TEXT,
        years_exp INTEGER DEFAULT 0,
        price_range TEXT,
        bio TEXT,
        verification_status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
        is_online INTEGER DEFAULT 1,
        rating REAL DEFAULT 4.9,
        total_reviews INTEGER DEFAULT 0,
        vehicle_model TEXT,
        vehicle_plate TEXT,
        documents_meta TEXT,
        UNIQUE(phone, role)
    )
    """)

    # Automatic Migration: ensure phone allows dual roles (Customer & Partner)
    cursor.execute("SELECT sql FROM sqlite_master WHERE type='table' AND name='users'")
    sql_row = cursor.fetchone()
    if sql_row and "phone TEXT UNIQUE" in sql_row[0]:
        cursor.execute("""
        CREATE TABLE users_migrated (
            id TEXT PRIMARY KEY,
            role TEXT NOT NULL,
            name TEXT NOT NULL,
            phone TEXT NOT NULL,
            email TEXT,
            password_hash TEXT NOT NULL,
            language TEXT DEFAULT 'en',
            created_at TEXT NOT NULL,
            category TEXT,
            area TEXT,
            years_exp INTEGER DEFAULT 0,
            price_range TEXT,
            bio TEXT,
            verification_status TEXT DEFAULT 'pending',
            is_online INTEGER DEFAULT 1,
            rating REAL DEFAULT 4.9,
            total_reviews INTEGER DEFAULT 0,
            vehicle_model TEXT,
            vehicle_plate TEXT,
            documents_meta TEXT,
            UNIQUE(phone, role)
        )
        """)
        cursor.execute("INSERT OR IGNORE INTO users_migrated SELECT * FROM users")
        cursor.execute("DROP TABLE users")
        cursor.execute("ALTER TABLE users_migrated RENAME TO users")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_users_phone_role ON users(phone, role)")
        conn.commit()

    # 2. Bookings Table (Shared between Customer and Partner)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS bookings (
        id TEXT PRIMARY KEY,
        customer_id TEXT NOT NULL,
        customer_name TEXT NOT NULL,
        customer_phone TEXT NOT NULL,
        customer_address TEXT NOT NULL,
        partner_id TEXT,
        service_slug TEXT NOT NULL,
        service_name TEXT NOT NULL,
        booking_date TEXT NOT NULL,
        time_slot TEXT NOT NULL,
        notes TEXT,
        price TEXT,
        status TEXT DEFAULT 'pending', -- 'pending', 'accepted', 'ongoing', 'completed', 'cancelled'
        rating INTEGER,
        review TEXT,
        created_at TEXT NOT NULL,
        is_cab INTEGER DEFAULT 0,
        pickup TEXT,
        drop_loc TEXT,
        otp TEXT
    )
    """)

    # 3. OTP Codes (Simulated SMS OTP)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS otp_codes (
        phone TEXT PRIMARY KEY,
        code TEXT NOT NULL,
        expires_at REAL NOT NULL
    )
    """)

    # 4. Login Attempts (Rate Limiting)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS login_attempts (
        identifier TEXT PRIMARY KEY, -- phone or IP
        failed_count INTEGER DEFAULT 0,
        locked_until REAL DEFAULT 0
    )
    """)

    # 5. User Metadata (Saved addresses, contacts, favorites, AI estimates)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS user_meta (
        user_id TEXT PRIMARY KEY,
        saved_addresses TEXT,
        saved_emergency_contacts TEXT,
        favorite_providers TEXT,
        ai_estimates TEXT
    )
    """)

    conn.commit()

    # Pre-seed Demo Accounts if not already created
    _seed_demo_accounts(cursor, conn)
    conn.close()

def _seed_demo_accounts(cursor, conn):
    """Seed customer and partner demo accounts for quick testing."""
    # Check if customer exists
    cursor.execute("SELECT id FROM users WHERE phone = ? AND role = 'customer'", ("9999900001",))
    if not cursor.fetchone():
        cust_id = "demo-customer-01"
        cust_pw = hash_password("Demo@1234")
        now = datetime.now().isoformat()
        cursor.execute("""
        INSERT INTO users (id, role, name, phone, email, password_hash, language, created_at)
        VALUES (?, 'customer', 'Ravi Kumar', '9999900001', 'ravi.demo@zenserve.in', ?, 'en', ?)
        """, (cust_id, cust_pw, now))

        # Seed Customer Metadata (Addresses & Emergency contacts)
        sample_addresses = json.dumps([
            {"label": "Home", "address": "House 412, Sector 70, Mohali", "is_default": True},
            {"label": "Office", "address": "Plot C-112, Industrial Area Phase 7, Mohali", "is_default": False}
        ])
        sample_contacts = json.dumps([
            {"name": "Amit Sharma (Brother)", "phone": "+91 98140 12345"},
            {"name": "Simran Kaur (Sister)", "phone": "+91 98765 43210"},
            {"name": "Local Police Control", "phone": "112"}
        ])
        sample_favs = json.dumps(["plumber-01", "electrician-02", "ac-01"])
        sample_estimates = json.dumps([
            {
                "id": "est-01",
                "item": "Kitchen Sink Tap Faucet Repair",
                "problem": "Continuous dripping from ceramic spindle valve",
                "price": "₹350 – ₹600",
                "date": "Yesterday"
            }
        ])
        cursor.execute("""
        INSERT INTO user_meta (user_id, saved_addresses, saved_emergency_contacts, favorite_providers, ai_estimates)
        VALUES (?, ?, ?, ?, ?)
        """, (cust_id, sample_addresses, sample_contacts, sample_favs, sample_estimates))

    # Check if admin exists
    cursor.execute("SELECT id FROM users WHERE role = 'admin' OR phone = '9999900000'")
    if not cursor.fetchone():
        admin_id = "demo-admin-01"
        admin_pw = hash_password("Admin@1234")
        now = datetime.now().isoformat()
        cursor.execute("""
        INSERT INTO users (id, role, name, phone, email, password_hash, language, created_at)
        VALUES (?, 'admin', 'ZenServe Administrator', '9999900000', 'admin@zenserve.in', ?, 'en', ?)
        """, (admin_id, admin_pw, now))

    # Check if a pending partner exists for verification queue demo
    cursor.execute("SELECT id FROM users WHERE phone = '9814055661'")
    if not cursor.fetchone():
        pending_p_id = "partner-pending-03"
        p_pw = hash_password("Demo@1234")
        now = datetime.now().isoformat()
        docs = json.dumps({
            "id_proof": "Aadhaar Card Uploaded (PB-XXXX-4421)",
            "work_proof": "Plumbing Trade ITI Certificate",
            "police_cert": "Police Verification Clearance Pending"
        })
        cursor.execute("""
        INSERT INTO users (
            id, role, name, phone, email, password_hash, language, created_at,
            category, area, years_exp, price_range, bio, verification_status,
            is_online, rating, total_reviews
        ) VALUES (
            ?, 'partner', 'Gurdeep Singh', '9814055661', 'gurdeep.plumb@zenserve.in', ?, 'en', ?,
            'plumber', 'Phase 7, Mohali', 6, '₹249 inspection',
            'Experienced master plumber specializing in bathroom fittings, pipe leakages and water tanks.',
            'pending', 1, 4.8, 42
        )
        """, (pending_p_id, p_pw, now))

    # Check if partner exists
    cursor.execute("SELECT id FROM users WHERE phone = ? AND role = 'partner'", ("9999900002",))
    if not cursor.fetchone():
        partner_id = "demo-partner-02"
        partner_pw = hash_password("Demo@1234")
        now = datetime.now().isoformat()
        partner_docs = json.dumps({
            "id_proof": "Aadhaar Card (Verified: PB-XXXX-9912)",
            "work_proof": "Commercial Passenger Driving Badge PB-65-D-4821",
            "police_cert": "Punjab Police Verification Pass (Valid till Jan 2027)",
            "vehicle_rc": "CH 01 CB 3920 (Fitness Valid 2028)",
            "insurance": "Commercial Passenger Protection Insurance (HDFC ERGO)"
        })
        cursor.execute("""
        INSERT INTO users (
            id, role, name, phone, email, password_hash, language, created_at,
            category, area, years_exp, price_range, bio, verification_status,
            is_online, rating, total_reviews, vehicle_model, vehicle_plate, documents_meta
        ) VALUES (
            ?, 'partner', 'Harpreet Singh', '9999900002', 'harpreet.cab@zenserve.in', ?, 'en', ?,
            'cab', 'Mohali & Chandigarh', 8, 'Standard City Rates (₹14/km)',
            'Certified safe driver with 8+ years experience in Tricity airport and city routes. 100% clean safety score.',
            'approved', 1, 4.95, 610, 'Maruti WagonR (Silver AC)', 'CH 01 CB 3920', ?
        )
        """, (partner_id, partner_pw, now, partner_docs))

        # Seed sample bookings between demo customer and demo partner
        _seed_sample_bookings(cursor, "demo-customer-01", partner_id)


    # Dual profile: Check if partner profile for 9999900001 exists
    cursor.execute("SELECT id FROM users WHERE phone = '9999900001' AND role = 'partner'")
    if not cursor.fetchone():
        partner_id_1 = "demo-partner-01"
        p_pw_1 = hash_password("Demo@1234")
        now = datetime.now().isoformat()
        docs_1 = json.dumps({
            "id_proof": "Aadhaar Card (Verified: PB-XXXX-5510)",
            "work_proof": "ITI Electrical Engineering Trade Certificate",
            "police_cert": "Police Background Clearance Pass (2026)",
            "uploaded_at": datetime.now().strftime("%d %b %Y, %I:%M %p")
        })
        cursor.execute("""
        INSERT INTO users (
            id, role, name, phone, email, password_hash, language, created_at,
            category, area, years_exp, price_range, bio, verification_status,
            is_online, rating, total_reviews, documents_meta
        ) VALUES (
            ?, 'partner', 'Ravi Kumar', '9999900001', 'ravi.demo@zenserve.in', ?, 'en', ?,
            'electrician', 'Sector 70, Mohali', 5, '₹199 inspection',
            'Certified residential & commercial electrician with 5+ years experience in Tricity.',
            'approved', 1, 4.85, 38, ?
        )
        """, (partner_id_1, p_pw_1, now, docs_1))

    # Dual profile: Check if customer profile for 9999900002 exists
    cursor.execute("SELECT id FROM users WHERE phone = '9999900002' AND role = 'customer'")
    if not cursor.fetchone():
        cust_id_2 = "demo-customer-02"
        cust_pw_2 = hash_password("Demo@1234")
        now = datetime.now().isoformat()
        cursor.execute("""
        INSERT INTO users (id, role, name, phone, email, password_hash, language, created_at)
        VALUES (?, 'customer', 'Harpreet Singh', '9999900002', 'harpreet.cab@zenserve.in', ?, 'en', ?)
        """, (cust_id_2, cust_pw_2, now))
        cursor.execute("INSERT INTO user_meta (user_id, saved_addresses, saved_emergency_contacts, favorite_providers, ai_estimates) VALUES (?, '[]', '[]', '[]', '[]')", (cust_id_2,))

    conn.commit()

def _seed_sample_bookings(cursor, cust_id, partner_id):
    """Seed realistic initial bookings for demo review & history."""
    now = datetime.now()
    yesterday = (now - timedelta(days=1)).strftime("%Y-%m-%d")
    tomorrow = (now + timedelta(days=1)).strftime("%Y-%m-%d")

    bookings = [
        # Upcoming Booking
        (
            "bk-1001", cust_id, "Ravi Kumar", "9999900001", "House 412, Sector 70, Mohali",
            partner_id, "cab", "Cab Booking", tomorrow, "09:30 AM",
            "Flight pickup to Chandigarh Airport terminal 2", "₹349", "accepted",
            None, None, now.isoformat(), 1, "Sector 70, Mohali", "Chandigarh Airport", "4829"
        ),
        # Completed Job
        (
            "bk-1002", cust_id, "Ravi Kumar", "9999900001", "House 412, Sector 70, Mohali",
            partner_id, "cab", "Cab Booking", yesterday, "06:15 PM",
            "Evening commute from Elante Mall", "₹240", "completed",
            5, "Very polite driver, spotless car and clean driving. Highly recommended!", (now - timedelta(days=1)).isoformat(), 1, "Elante Mall, Phase 1", "Sector 70, Mohali", "1904"
        ),
        # Pending Job for Partner Dashboard New Requests
        (
            "bk-1003", cust_id, "Pooja Verma", "9814088991", "Flat 302, Phase 3B2, Mohali",
            partner_id, "cab", "Cab Booking", now.strftime("%Y-%m-%d"), "04:00 PM",
            "Need immediate cab to Sector 35 market", "₹180", "pending",
            None, None, now.isoformat(), 1, "Phase 3B2, Mohali", "Sector 35, Chandigarh", "7712"
        )
    ]

    for b in bookings:
        cursor.execute("SELECT id FROM bookings WHERE id = ?", (b[0],))
        if not cursor.fetchone():
            cursor.execute("""
            INSERT INTO bookings (
                id, customer_id, customer_name, customer_phone, customer_address,
                partner_id, service_slug, service_name, booking_date, time_slot,
                notes, price, status, rating, review, created_at, is_cab, pickup, drop_loc, otp
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, b)

# ---------------------------------------------------------------------------
# Rate Limiting Utilities
# ---------------------------------------------------------------------------
def check_rate_limit(identifier: str) -> tuple[bool, str]:
    """Check if identifier is locked due to too many failed attempts."""
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT failed_count, locked_until FROM login_attempts WHERE identifier = ?", (identifier,))
    row = cur.fetchone()
    now = time.time()
    if row:
        failed_count, locked_until = row["failed_count"], row["locked_until"]
        if locked_until > now:
            remaining = int(locked_until - now)
            conn.close()
            return False, f"Too many failed attempts. Account temporarily locked for {remaining} seconds."
    conn.close()
    return True, ""

def record_login_failure(identifier: str):
    """Increment failed login attempts; lock for 60 seconds after 5 failures."""
    conn = get_db()
    cur = conn.cursor()
    now = time.time()
    cur.execute("SELECT failed_count FROM login_attempts WHERE identifier = ?", (identifier,))
    row = cur.fetchone()
    if row:
        new_count = row["failed_count"] + 1
        locked_until = now + 60 if new_count >= 5 else 0
        cur.execute("UPDATE login_attempts SET failed_count = ?, locked_until = ? WHERE identifier = ?",
                    (new_count, locked_until, identifier))
    else:
        cur.execute("INSERT INTO login_attempts (identifier, failed_count, locked_until) VALUES (?, 1, 0)",
                    (identifier,))
    conn.commit()
    conn.close()

def clear_login_failures(identifier: str):
    """Clear failed login attempts on successful login."""
    conn = get_db()
    cur = conn.cursor()
    cur.execute("DELETE FROM login_attempts WHERE identifier = ?", (identifier,))
    conn.commit()
    conn.close()

# ---------------------------------------------------------------------------
# User Data Access
# ---------------------------------------------------------------------------
def find_user_by_phone(phone: str, role: str = None):
    conn = get_db()
    cur = conn.cursor()
    if role:
        cur.execute("SELECT * FROM users WHERE phone = ? AND role = ?", (phone, role))
    else:
        cur.execute("SELECT * FROM users WHERE phone = ?", (phone,))
    row = cur.fetchone()
    conn.close()
    return dict(row) if row else None

def get_user_profiles_by_phone(phone: str) -> list[str]:
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT role FROM users WHERE phone = ?", (phone,))
    roles = [r[0] for r in cur.fetchall()]
    conn.close()
    return roles

def find_user_by_id(user_id: str):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT * FROM users WHERE id = ?", (user_id,))
    row = cur.fetchone()
    conn.close()
    return dict(row) if row else None

def sanitize_user_dict(u: dict) -> dict:
    """Return safe user dictionary with password hash removed."""
    safe = dict(u)
    safe.pop("password_hash", None)
    if "documents_meta" in safe and safe["documents_meta"]:
        try:
            safe["documents_meta"] = json.loads(safe["documents_meta"])
        except Exception:
            pass
    if "phone" in safe and safe["phone"]:
        roles = get_user_profiles_by_phone(safe["phone"])
        safe["available_roles"] = roles
        safe["has_dual_profile"] = len(roles) > 1
    return safe
