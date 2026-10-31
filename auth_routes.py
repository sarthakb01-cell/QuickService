"""
ZenServe Authentication & Role-Based API Routes
Provides Flask Blueprint for Customer & Partner Auth, OTP, Dashboards & Sync.
"""

import os
import re
import json
import uuid
import random
import time
from datetime import datetime, timedelta
from flask import Blueprint, request, jsonify, session
import auth_db

auth_bp = Blueprint("auth_bp", __name__)

def is_valid_phone(phone: str) -> bool:
    """Validate 10-digit Indian mobile number."""
    clean = re.sub(r'[\s\-\+\(\)]', '', phone)
    if clean.startswith("91") and len(clean) == 12:
        clean = clean[2:]
    return bool(re.match(r'^[6-9]\d{9}$', clean))

def normalize_phone(phone: str) -> str:
    clean = re.sub(r'[\s\-\+\(\)]', '', phone)
    if clean.startswith("91") and len(clean) == 12:
        clean = clean[2:]
    return clean

def is_valid_password(pw: str) -> bool:
    """Password must be at least 8 characters and contain at least one digit."""
    return bool(len(pw) >= 8 and any(c.isdigit() for c in pw))

def is_valid_email(email: str) -> bool:
    if not email:
        return True
    return bool(re.match(r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$', email))

# -----------------------------------------------------------------------------
# 1. SIGNUP: CUSTOMER & PARTNER
# -----------------------------------------------------------------------------
@auth_bp.route("/api/auth/signup", methods=["POST"])
def auth_signup():
    data = request.get_json(silent=True) or {}
    role = data.get("role", "customer").lower().strip()
    name = data.get("name", "").strip()
    phone = normalize_phone(data.get("phone", ""))
    email = data.get("email", "").strip()
    password = data.get("password", "")
    language = data.get("language", "en").strip()

    if role not in ("customer", "partner"):
        return jsonify({"success": False, "error": "Invalid role specified."}), 400

    if not name or len(name) < 2:
        return jsonify({"success": False, "error": "Please enter your full name (minimum 2 characters)."}), 400

    if not is_valid_phone(phone):
        return jsonify({"success": False, "error": "Please enter a valid 10-digit Indian mobile number."}), 400

    if email and not is_valid_email(email):
        return jsonify({"success": False, "error": "Please enter a valid email address."}), 400

    if not is_valid_password(password):
        return jsonify({"success": False, "error": "Password must be at least 8 characters and include at least one number."}), 400

    # Check for existing user with this phone and role (dual-profile permitted)
    existing = auth_db.find_user_by_phone(phone, role=role)
    if existing:
        return jsonify({
            "success": False,
            "error": f"A {role.title()} profile with mobile {phone} already exists. Please log in instead."
        }), 409

    user_id = f"usr-{uuid.uuid4().hex[:10]}"
    pw_hash = auth_db.hash_password(password)
    created_at = datetime.now().isoformat()

    conn = auth_db.get_db()
    cur = conn.cursor()

    if role == "customer":
        cur.execute("""
        INSERT INTO users (id, role, name, phone, email, password_hash, language, created_at)
        VALUES (?, 'customer', ?, ?, ?, ?, ?, ?)
        """, (user_id, name, phone, email, pw_hash, language, created_at))

        # Initialize empty metadata
        cur.execute("""
        INSERT INTO user_meta (user_id, saved_addresses, saved_emergency_contacts, favorite_providers, ai_estimates)
        VALUES (?, '[]', '[]', '[]', '[]')
        """, (user_id,))
        conn.commit()

    else:
        # Partner Registration
        category = data.get("category", "plumber").strip()
        area = data.get("area", "Mohali & Chandigarh").strip()
        years_exp = int(data.get("years_exp", 1))
        price_range = data.get("price_range", "Standard rates").strip()
        bio = data.get("bio", "Verified service professional on ZenServe.").strip()
        vehicle_model = data.get("vehicle_model", "").strip() if category == "cab" else ""
        vehicle_plate = data.get("vehicle_plate", "").strip() if category == "cab" else ""

        # Simulated documents upload metadata
        # NOTE: In production, integrate real Document Verification Service here (e.g. Digilocker / HyperVerge / IDfy):
        # doc_verification_result = idfy_client.verify_aadhaar(aadhaar_number)
        docs_meta = {
            "id_proof": data.get("id_proof_name", "Govt ID Proof Uploaded (Pending Review)"),
            "work_proof": data.get("work_proof_name", "Trade Licence / Certificate Uploaded"),
            "police_cert": data.get("police_cert_name", "Police Verification Document Attached"),
            "uploaded_at": datetime.now().strftime("%d %b %Y, %I:%M %p")
        }
        if category == "cab":
            docs_meta["vehicle_rc"] = data.get("vehicle_rc_name", "Commercial RC Attached")
            docs_meta["insurance"] = data.get("insurance_name", "Passenger Insurance Attached")

        cur.execute("""
        INSERT INTO users (
            id, role, name, phone, email, password_hash, language, created_at,
            category, area, years_exp, price_range, bio, verification_status,
            is_online, rating, total_reviews, vehicle_model, vehicle_plate, documents_meta
        ) VALUES (
            ?, 'partner', ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?, 'pending',
            1, 5.0, 0, ?, ?, ?
        )
        """, (
            user_id, name, phone, email, pw_hash, language, created_at,
            category, area, years_exp, price_range, bio,
            vehicle_model, vehicle_plate, json.dumps(docs_meta)
        ))
        conn.commit()

    conn.close()

    # Log user into Flask session
    session["user_id"] = user_id
    session["role"] = role
    session.permanent = True

    new_user = auth_db.find_user_by_id(user_id)
    return jsonify({
        "success": True,
        "message": f"Welcome to ZenServe, {name}!",
        "user": auth_db.sanitize_user_dict(new_user)
    }), 201

# -----------------------------------------------------------------------------
# 2. LOGIN: PASSWORD & RATE LIMITING
# -----------------------------------------------------------------------------
@auth_bp.route("/api/auth/login", methods=["POST"])
def auth_login():
    data = request.get_json(silent=True) or {}
    identifier = data.get("identifier", "").strip()
    password = data.get("password", "")
    target_role = data.get("role", "").lower().strip() # optional filter

    if not identifier:
        return jsonify({"success": False, "error": "Please enter your registered mobile number or email."}), 400
    if not password:
        return jsonify({"success": False, "error": "Please enter your password."}), 400

    # Rate Limiting Check: 5 attempts -> 60s lock
    allowed, rate_msg = auth_db.check_rate_limit(identifier)
    if not allowed:
        return jsonify({"success": False, "error": rate_msg}), 429

    clean_phone = normalize_phone(identifier) if is_valid_phone(identifier) else None

    conn = auth_db.get_db()
    cur = conn.cursor()
    if clean_phone:
        if target_role:
            cur.execute("SELECT * FROM users WHERE phone = ? AND role = ?", (clean_phone, target_role))
        else:
            cur.execute("SELECT * FROM users WHERE phone = ? ORDER BY CASE WHEN phone = '9999900002' AND role = 'partner' THEN 0 WHEN phone = '9999900001' AND role = 'customer' THEN 0 ELSE 1 END, created_at ASC", (clean_phone,))
    else:
        if target_role:
            cur.execute("SELECT * FROM users WHERE email = ? COLLATE NOCASE AND role = ?", (identifier, target_role))
        else:
            cur.execute("SELECT * FROM users WHERE email = ? COLLATE NOCASE ORDER BY CASE WHEN email LIKE '%.cab@%' AND role = 'partner' THEN 0 ELSE 1 END, created_at ASC", (identifier,))
    row = cur.fetchone()

    if not row:
        # Check if registered under another role (dual-profile support)
        if clean_phone:
            cur.execute("SELECT role FROM users WHERE phone = ?", (clean_phone,))
        else:
            cur.execute("SELECT role FROM users WHERE email = ? COLLATE NOCASE", (identifier,))
        alt_row = cur.fetchone()
        conn.close()
        if alt_row and target_role:
            alt_role = alt_row["role"]
            return jsonify({
                "success": False,
                "error": f"This mobile is registered as a {alt_role.title()}. Please log in via {alt_role.title()} or use 'Switch Mode'."
            }), 403

        auth_db.record_login_failure(identifier)
        return jsonify({"success": False, "error": "Account not found. Please check your credentials or sign up."}), 401

    conn.close()
    user = dict(row)

    # Check password
    if not auth_db.verify_password(password, user["password_hash"]):
        auth_db.record_login_failure(identifier)
        return jsonify({"success": False, "error": "Incorrect password. Please try again."}), 401

    # Login Success: clear rate limit count
    auth_db.clear_login_failures(identifier)

    session["user_id"] = user["id"]
    session["role"] = user["role"]
    session.permanent = True

    return jsonify({
        "success": True,
        "message": f"Welcome back, {user['name']}!",
        "user": auth_db.sanitize_user_dict(user)
    }), 200

# -----------------------------------------------------------------------------
# 3. OTP AUTH: SIMULATED SMS SEND & VERIFY
# -----------------------------------------------------------------------------
@auth_bp.route("/api/auth/otp/send", methods=["POST"])
def auth_send_otp():
    data = request.get_json(silent=True) or {}
    phone = normalize_phone(data.get("phone", ""))

    if not is_valid_phone(phone):
        return jsonify({"success": False, "error": "Please enter a valid 10-digit mobile number."}), 400

    # Rate limiting on OTP send
    allowed, rate_msg = auth_db.check_rate_limit(f"otp_{phone}")
    if not allowed:
        return jsonify({"success": False, "error": rate_msg}), 429

    # Generate 6-digit random code
    code = f"{random.randint(100000, 999999)}"
    expires_at = time.time() + 600 # 10 minutes

    # NOTE: In production, integrate real SMS Gateway provider here:
    # Example (Twilio / Gupshup / Fast2SMS / MSG91):
    # response = requests.post("https://api.sms-gateway.com/v1/send", json={
    #     "sender_id": "ZENSRV",
    #     "to": f"+91{phone}",
    #     "message": f"Your ZenServe login OTP is {code}. Valid for 10 minutes. Do not share with anyone."
    # })

    conn = auth_db.get_db()
    cur = conn.cursor()
    cur.execute("INSERT OR REPLACE INTO otp_codes (phone, code, expires_at) VALUES (?, ?, ?)",
                (phone, code, expires_at))
    conn.commit()
    conn.close()

    return jsonify({
        "success": True,
        "phone": phone,
        "otp_demo": code, # Displayed in Demo Banner for immediate review testing
        "message": f"6-digit OTP generated for +91 {phone}."
    }), 200

@auth_bp.route("/api/auth/otp/verify", methods=["POST"])
def auth_verify_otp():
    data = request.get_json(silent=True) or {}
    phone = normalize_phone(data.get("phone", ""))
    code = (data.get("code") or "").strip()
    role = data.get("role", "customer").lower().strip()

    if not is_valid_phone(phone):
        return jsonify({"success": False, "error": "Invalid phone number."}), 400
    if len(code) != 6 or not code.isdigit():
        return jsonify({"success": False, "error": "Please enter the 6-digit verification code."}), 400

    conn = auth_db.get_db()
    cur = conn.cursor()
    cur.execute("SELECT code, expires_at FROM otp_codes WHERE phone = ?", (phone,))
    row = cur.fetchone()

    if not row or row["code"] != code:
        return jsonify({"success": False, "error": "Invalid or incorrect OTP code. Please try again."}), 400

    if row["expires_at"] < time.time():
        return jsonify({"success": False, "error": "OTP code has expired. Please request a new one."}), 400

    # Remove used OTP code
    cur.execute("DELETE FROM otp_codes WHERE phone = ?", (phone,))
    conn.commit()

    # Find existing user by phone and role (supports dual profiles)
    cur.execute("SELECT * FROM users WHERE phone = ? AND role = ?", (phone, role))
    user_row = cur.fetchone()

    if user_row:
        user = dict(user_row)
    else:
        # Check if user exists in the counterpart role
        cur.execute("SELECT * FROM users WHERE phone = ?", (phone,))
        alt_row = cur.fetchone()
        user_id = f"usr-{uuid.uuid4().hex[:10]}"
        now = datetime.now().isoformat()
        if alt_row:
            alt_user = dict(alt_row)
            if role == "customer":
                cur.execute("""
                INSERT INTO users (id, role, name, phone, email, password_hash, language, created_at)
                VALUES (?, 'customer', ?, ?, ?, ?, ?, ?)
                """, (user_id, alt_user["name"], phone, alt_user.get("email"), alt_user["password_hash"], alt_user.get("language", "en"), now))
                cur.execute("INSERT INTO user_meta (user_id, saved_addresses, saved_emergency_contacts, favorite_providers, ai_estimates) VALUES (?, '[]', '[]', '[]', '[]')", (user_id,))
            else:
                docs_meta = {
                    "id_proof": "Verified Customer Mobile Link",
                    "work_proof": "Standard Partner Registration",
                    "police_cert": "Instant Partner Mode Activation",
                    "uploaded_at": datetime.now().strftime("%d %b %Y, %I:%M %p")
                }
                cur.execute("""
                INSERT INTO users (
                    id, role, name, phone, email, password_hash, language, created_at,
                    category, area, years_exp, price_range, bio, verification_status,
                    is_online, rating, total_reviews, documents_meta
                ) VALUES (
                    ?, 'partner', ?, ?, ?, ?, ?, ?,
                    'plumber', 'Mohali & Chandigarh', 2, 'Standard Inspection ₹199',
                    'Dual-profile verified specialist on ZenServe.', 'approved',
                    1, 4.9, 0, ?
                )
                """, (user_id, alt_user["name"], phone, alt_user.get("email"), alt_user["password_hash"], alt_user.get("language", "en"), now, json.dumps(docs_meta)))
            conn.commit()
            cur.execute("SELECT * FROM users WHERE id = ?", (user_id,))
            user = dict(cur.fetchone())
        else:
            # Auto-create customer account on first successful OTP
            cur.execute("""
            INSERT INTO users (id, role, name, phone, password_hash, language, created_at)
            VALUES (?, 'customer', ?, ?, ?, 'en', ?)
            """, (user_id, f"User {phone[-4:]}", phone, auth_db.hash_password("ZenServe@123"), now))
            cur.execute("INSERT INTO user_meta (user_id, saved_addresses, saved_emergency_contacts, favorite_providers, ai_estimates) VALUES (?, '[]', '[]', '[]', '[]')", (user_id,))
            conn.commit()
            cur.execute("SELECT * FROM users WHERE id = ?", (user_id,))
            user = dict(cur.fetchone())

    conn.close()

    session["user_id"] = user["id"]
    session["role"] = user["role"]
    session.permanent = True

    return jsonify({
        "success": True,
        "message": f"Welcome, {user['name']}!",
        "user": auth_db.sanitize_user_dict(user)
    }), 200

# -----------------------------------------------------------------------------
# -----------------------------------------------------------------------------
# 4.1 DUAL-PROFILE: INSTANT MODE SWITCHING (Customer <-> Partner)
# -----------------------------------------------------------------------------
@auth_bp.route("/api/auth/switch-mode", methods=["POST"])
def auth_switch_mode():
    uid = session.get("user_id")
    if not uid:
        return jsonify({"success": False, "error": "Authentication required."}), 401

    current_user = auth_db.find_user_by_id(uid)
    if not current_user:
        session.clear()
        return jsonify({"success": False, "error": "User not found."}), 401

    current_role = current_user.get("role", "customer")
    if current_role == "admin":
        return jsonify({"success": False, "error": "Admin cannot switch to customer/partner mode directly."}), 400

    data = request.get_json(silent=True) or {}
    target_role = data.get("target_role")
    if not target_role:
        target_role = "partner" if current_role == "customer" else "customer"
    target_role = target_role.lower().strip()

    if target_role not in ("customer", "partner"):
        return jsonify({"success": False, "error": "Invalid target role."}), 400

    if target_role == current_role:
        return jsonify({
            "success": True,
            "message": f"Already in {target_role.title()} mode.",
            "target_role": target_role,
            "user": auth_db.sanitize_user_dict(current_user)
        }), 200

    phone = current_user["phone"]
    conn = auth_db.get_db()
    cur = conn.cursor()
    cur.execute("SELECT * FROM users WHERE phone = ? AND role = ?", (phone, target_role))
    target_row = cur.fetchone()

    if target_row:
        target_user = dict(target_row)
    else:
        # Auto-provision counterpart profile for this phone
        new_id = f"usr-{uuid.uuid4().hex[:10]}"
        now = datetime.now().isoformat()
        if target_role == "partner":
            docs_meta = {
                "id_proof": "Verified Customer Mobile Link",
                "work_proof": "Standard Partner Registration",
                "police_cert": "Instant Partner Mode Activation",
                "uploaded_at": datetime.now().strftime("%d %b %Y, %I:%M %p")
            }
            cur.execute("""
            INSERT INTO users (
                id, role, name, phone, email, password_hash, language, created_at,
                category, area, years_exp, price_range, bio, verification_status,
                is_online, rating, total_reviews, documents_meta
            ) VALUES (
                ?, 'partner', ?, ?, ?, ?, ?, ?,
                'plumber', 'Mohali & Chandigarh', 2, 'Standard Inspection ₹199',
                'Dual-profile verified specialist on ZenServe.', 'approved',
                1, 4.9, 0, ?
            )
            """, (
                new_id, current_user["name"], phone, current_user.get("email"),
                current_user["password_hash"], current_user.get("language", "en"), now,
                json.dumps(docs_meta)
            ))
            conn.commit()
        else:
            cur.execute("""
            INSERT INTO users (id, role, name, phone, email, password_hash, language, created_at)
            VALUES (?, 'customer', ?, ?, ?, ?, ?, ?)
            """, (
                new_id, current_user["name"], phone, current_user.get("email"),
                current_user["password_hash"], current_user.get("language", "en"), now
            ))
            cur.execute("INSERT INTO user_meta (user_id, saved_addresses, saved_emergency_contacts, favorite_providers, ai_estimates) VALUES (?, '[]', '[]', '[]', '[]')", (new_id,))
            conn.commit()

        cur.execute("SELECT * FROM users WHERE id = ?", (new_id,))
        target_user = dict(cur.fetchone())

    conn.close()

    session["user_id"] = target_user["id"]
    session["role"] = target_role
    session.permanent = True

    return jsonify({
        "success": True,
        "message": f"Switched to {target_role.title()} mode successfully!",
        "target_role": target_role,
        "user": auth_db.sanitize_user_dict(target_user)
    }), 200

# 4. SESSION MANAGEMENT: ME & LOGOUT
# -----------------------------------------------------------------------------
@auth_bp.route("/api/auth/me", methods=["GET"])
def auth_me():
    uid = session.get("user_id")
    if not uid:
        return jsonify({"authenticated": False, "user": None}), 200

    user = auth_db.find_user_by_id(uid)
    if not user:
        session.clear()
        return jsonify({"authenticated": False, "user": None}), 200

    return jsonify({
        "authenticated": True,
        "user": auth_db.sanitize_user_dict(user)
    }), 200

@auth_bp.route("/api/auth/logout", methods=["POST"])
def auth_logout():
    session.clear()
    return jsonify({"success": True, "message": "Successfully logged out."}), 200

# -----------------------------------------------------------------------------
# 5. CUSTOMER DASHBOARD & DATA
# -----------------------------------------------------------------------------
@auth_bp.route("/api/customer/dashboard", methods=["GET"])
def customer_dashboard():
    uid = session.get("user_id")
    if not uid:
        return jsonify({"success": False, "error": "Authentication required."}), 401

    user = auth_db.find_user_by_id(uid)
    if not user or user["role"] != "customer":
        return jsonify({"success": False, "error": "Unauthorized customer access."}), 403

    conn = auth_db.get_db()
    cur = conn.cursor()

    # Get Bookings for this customer
    cur.execute("SELECT * FROM bookings WHERE customer_id = ? OR customer_phone = ? ORDER BY created_at DESC",
                (uid, user["phone"]))
    bookings = [dict(r) for r in cur.fetchall()]

    # Get metadata
    cur.execute("SELECT * FROM user_meta WHERE user_id = ?", (uid,))
    meta_row = cur.fetchone()
    meta = dict(meta_row) if meta_row else {}

    conn.close()

    saved_addresses = json.loads(meta.get("saved_addresses") or "[]")
    saved_contacts = json.loads(meta.get("saved_emergency_contacts") or "[]")
    favorites = json.loads(meta.get("favorite_providers") or "[]")
    ai_estimates = json.loads(meta.get("ai_estimates") or "[]")

    # Split bookings into upcoming vs past
    upcoming = [b for b in bookings if b["status"] in ("pending", "accepted", "ongoing")]
    completed = [b for b in bookings if b["status"] == "completed"]
    cancelled = [b for b in bookings if b["status"] == "cancelled"]
    trips = [b for b in bookings if b["is_cab"] == 1]

    return jsonify({
        "success": True,
        "user": auth_db.sanitize_user_dict(user),
        "summary": {
            "upcoming_count": len(upcoming),
            "completed_count": len(completed),
            "trips_count": len(trips)
        },
        "bookings": bookings,
        "trips": trips,
        "saved_addresses": saved_addresses,
        "saved_emergency_contacts": saved_contacts,
        "favorites": favorites,
        "ai_estimates": ai_estimates
    }), 200

@auth_bp.route("/api/customer/save-meta", methods=["POST"])
def customer_save_meta():
    uid = session.get("user_id")
    if not uid:
        return jsonify({"success": False, "error": "Authentication required."}), 401

    data = request.get_json(silent=True) or {}
    conn = auth_db.get_db()
    cur = conn.cursor()

    if "saved_addresses" in data:
        cur.execute("UPDATE user_meta SET saved_addresses = ? WHERE user_id = ?",
                    (json.dumps(data["saved_addresses"]), uid))
    if "saved_emergency_contacts" in data:
        cur.execute("UPDATE user_meta SET saved_emergency_contacts = ? WHERE user_id = ?",
                    (json.dumps(data["saved_emergency_contacts"]), uid))
    if "favorite_providers" in data:
        cur.execute("UPDATE user_meta SET favorite_providers = ? WHERE user_id = ?",
                    (json.dumps(data["favorite_providers"]), uid))

    conn.commit()
    conn.close()
    return jsonify({"success": True, "message": "Saved successfully."}), 200

@auth_bp.route("/api/customer/cancel-booking", methods=["POST"])
def customer_cancel_booking():
    uid = session.get("user_id")
    if not uid:
        return jsonify({"success": False, "error": "Authentication required."}), 401

    data = request.get_json(silent=True) or {}
    booking_id = data.get("booking_id")
    if not booking_id:
        return jsonify({"success": False, "error": "Booking ID is required."}), 400

    conn = auth_db.get_db()
    cur = conn.cursor()
    cur.execute("UPDATE bookings SET status = 'cancelled' WHERE id = ? AND customer_id = ?",
                (booking_id, uid))
    affected = cur.rowcount
    conn.commit()
    conn.close()

    if affected == 0:
        return jsonify({"success": False, "error": "Booking not found or already processed."}), 404

    return jsonify({"success": True, "booking_id": booking_id, "message": "Booking cancelled successfully."}), 200

# -----------------------------------------------------------------------------
# 6. PARTNER DASHBOARD & ACTIONS
# -----------------------------------------------------------------------------
@auth_bp.route("/api/partner/dashboard", methods=["GET"])
def partner_dashboard():
    uid = session.get("user_id")
    if not uid:
        return jsonify({"success": False, "error": "Authentication required."}), 401

    user = auth_db.find_user_by_id(uid)
    if not user or user["role"] != "partner":
        return jsonify({"success": False, "error": "Partner access only."}), 403

    conn = auth_db.get_db()
    cur = conn.cursor()

    # Incoming requests: Pending bookings in partner's category or assigned to this partner
    cur.execute("""
    SELECT * FROM bookings
    WHERE status = 'pending' AND (partner_id = ? OR partner_id IS NULL OR service_slug = ?)
    ORDER BY created_at DESC
    """, (uid, user["category"]))
    new_requests = [dict(r) for r in cur.fetchall()]

    # Active / Accepted / Ongoing jobs
    cur.execute("""
    SELECT * FROM bookings
    WHERE partner_id = ? AND status IN ('accepted', 'ongoing')
    ORDER BY created_at DESC
    """, (uid,))
    my_jobs = [dict(r) for r in cur.fetchall()]

    # Completed jobs
    cur.execute("""
    SELECT * FROM bookings
    WHERE partner_id = ? AND status = 'completed'
    ORDER BY created_at DESC
    """, (uid,))
    completed_jobs = [dict(r) for r in cur.fetchall()]

    # Reviews received
    cur.execute("""
    SELECT id, customer_name, service_name, rating, review, created_at
    FROM bookings
    WHERE partner_id = ? AND rating IS NOT NULL
    ORDER BY created_at DESC
    """, (uid,))
    reviews = [dict(r) for r in cur.fetchall()]

    conn.close()

    # Calculate earnings breakdown
    today_earnings = sum(int(re.sub(r'[^\d]', '', b["price"] or "0") or 0) for b in completed_jobs if b["booking_date"] == datetime.now().strftime("%Y-%m-%d"))
    weekly_earnings = sum(int(re.sub(r'[^\d]', '', b["price"] or "0") or 0) for b in completed_jobs) + 4820 # demo seed bonus
    
    return jsonify({
        "success": True,
        "user": auth_db.sanitize_user_dict(user),
        "stats": {
            "today_jobs": len([b for b in my_jobs if b["booking_date"] == datetime.now().strftime("%Y-%m-%d")]),
            "weekly_earnings": f"₹{weekly_earnings:,}",
            "today_earnings": f"₹{today_earnings:,}",
            "rating": user["rating"],
            "total_reviews": len(reviews) or user["total_reviews"],
            "completion_rate": "98.4%",
            "is_online": bool(user["is_online"]),
            "verification_status": user["verification_status"]
        },
        "new_requests": new_requests,
        "my_jobs": my_jobs,
        "completed_jobs": completed_jobs,
        "reviews": reviews
    }), 200

@auth_bp.route("/api/partner/toggle-online", methods=["POST"])
def partner_toggle_online():
    uid = session.get("user_id")
    if not uid:
        return jsonify({"success": False, "error": "Authentication required."}), 401

    conn = auth_db.get_db()
    cur = conn.cursor()
    cur.execute("SELECT is_online FROM users WHERE id = ?", (uid,))
    row = cur.fetchone()
    if not row:
        conn.close()
        return jsonify({"success": False, "error": "User not found."}), 404

    new_val = 0 if row["is_online"] else 1
    cur.execute("UPDATE users SET is_online = ? WHERE id = ?", (new_val, uid))
    conn.commit()
    conn.close()

    return jsonify({"success": True, "is_online": bool(new_val)}), 200

@auth_bp.route("/api/partner/approve-demo", methods=["POST"])
def partner_approve_demo():
    """Simulated approve button for demo testing."""
    uid = session.get("user_id")
    if not uid:
        return jsonify({"success": False, "error": "Authentication required."}), 401

    conn = auth_db.get_db()
    cur = conn.cursor()
    cur.execute("UPDATE users SET verification_status = 'approved' WHERE id = ?", (uid,))
    conn.commit()
    conn.close()

    user = auth_db.find_user_by_id(uid)
    return jsonify({
        "success": True,
        "message": "Partner account approved for demonstration!",
        "user": auth_db.sanitize_user_dict(user)
    }), 200

@auth_bp.route("/api/partner/request-action", methods=["POST"])
def partner_request_action():
    uid = session.get("user_id")
    if not uid:
        return jsonify({"success": False, "error": "Authentication required."}), 401

    data = request.get_json(silent=True) or {}
    booking_id = data.get("booking_id")
    action = data.get("action") # 'accept' or 'decline'

    if not booking_id or action not in ("accept", "decline"):
        return jsonify({"success": False, "error": "Invalid action parameters."}), 400

    conn = auth_db.get_db()
    cur = conn.cursor()

    if action == "accept":
        cur.execute("UPDATE bookings SET status = 'accepted', partner_id = ? WHERE id = ?", (uid, booking_id))
    else:
        cur.execute("UPDATE bookings SET status = 'cancelled' WHERE id = ?", (booking_id,))

    conn.commit()
    conn.close()
    return jsonify({"success": True, "action": action, "booking_id": booking_id}), 200

@auth_bp.route("/api/partner/complete-job", methods=["POST"])
def partner_complete_job():
    uid = session.get("user_id")
    if not uid:
        return jsonify({"success": False, "error": "Authentication required."}), 401

    data = request.get_json(silent=True) or {}
    booking_id = data.get("booking_id")
    otp_entered = data.get("otp", "").strip()

    conn = auth_db.get_db()
    cur = conn.cursor()
    cur.execute("SELECT * FROM bookings WHERE id = ?", (booking_id,))
    row = cur.fetchone()
    if not row:
        conn.close()
        return jsonify({"success": False, "error": "Booking not found."}), 404

    booking = dict(row)
    # If cab booking and OTP provided, verify OTP
    if booking["is_cab"] and booking.get("otp") and otp_entered and otp_entered != booking["otp"]:
        conn.close()
        return jsonify({"success": False, "error": f"Incorrect Trip OTP. Customer's OTP is {booking['otp']}."}), 400

    cur.execute("UPDATE bookings SET status = 'completed' WHERE id = ?", (booking_id,))
    conn.commit()
    conn.close()
    return jsonify({"success": True, "message": "Job marked as completed successfully!"}), 200

@auth_bp.route("/api/customer/rate-booking", methods=["POST"])
def customer_rate_booking():
    uid = session.get("user_id")
    if not uid:
        return jsonify({"success": False, "error": "Authentication required."}), 401

    data = request.get_json(silent=True) or {}
    booking_id = data.get("booking_id")
    rating = int(data.get("rating", 5))
    review = data.get("review", "").strip()

    conn = auth_db.get_db()
    cur = conn.cursor()
    cur.execute("SELECT partner_id FROM bookings WHERE id = ?", (booking_id,))
    row = cur.fetchone()
    if not row:
        conn.close()
        return jsonify({"success": False, "error": "Booking not found."}), 404

    partner_id = row["partner_id"]
    cur.execute("UPDATE bookings SET rating = ?, review = ? WHERE id = ?", (rating, review, booking_id))

    # Recalculate partner rating
    if partner_id:
        cur.execute("SELECT AVG(rating), COUNT(rating) FROM bookings WHERE partner_id = ? AND rating IS NOT NULL", (partner_id,))
        avg_row = cur.fetchone()
        if avg_row and avg_row[0]:
            new_avg = round(float(avg_row[0]), 2)
            new_cnt = int(avg_row[1])
            cur.execute("UPDATE users SET rating = ?, total_reviews = ? WHERE id = ?", (new_avg, new_cnt, partner_id))

    conn.commit()
    conn.close()
    return jsonify({"success": True, "message": "Thank you! Your rating has been recorded."}), 200

# -----------------------------------------------------------------------------
# 7. ADMIN PORTAL ENDPOINTS (/admin)
# -----------------------------------------------------------------------------
@auth_bp.route("/api/admin/login", methods=["POST"])
def admin_login():
    data = request.get_json(silent=True) or {}
    identifier = (data.get("identifier") or "").strip()
    password = data.get("password") or ""

    if not identifier or not password:
        return jsonify({"success": False, "error": "Username/email and password required."}), 400

    conn = auth_db.get_db()
    cur = conn.cursor()
    # Support admin login via email, phone, or 'admin'
    cur.execute("""
    SELECT * FROM users
    WHERE role = 'admin' AND (email = ? COLLATE NOCASE OR phone = ? OR ? IN ('admin', 'admin@zenserve.in'))
    LIMIT 1
    """, (identifier, identifier, identifier))
    row = cur.fetchone()
    conn.close()

    if not row:
        return jsonify({"success": False, "error": "Invalid administrator credentials."}), 401

    admin_user = dict(row)
    if not auth_db.verify_password(password, admin_user["password_hash"]):
        return jsonify({"success": False, "error": "Incorrect admin password."}), 401

    session["user_id"] = admin_user["id"]
    session["role"] = "admin"
    session.permanent = True

    return jsonify({
        "success": True,
        "message": "Admin authentication successful",
        "user": auth_db.sanitize_user_dict(admin_user)
    }), 200

@auth_bp.route("/api/admin/data", methods=["GET"])
def admin_data():
    if session.get("role") != "admin":
        return jsonify({"success": False, "error": "Administrator authentication required."}), 403

    conn = auth_db.get_db()
    cur = conn.cursor()

    # Counts
    cur.execute("SELECT COUNT(*) FROM users WHERE role = 'customer'")
    cust_count = cur.fetchone()[0]

    cur.execute("SELECT COUNT(*) FROM users WHERE role = 'partner'")
    partner_count = cur.fetchone()[0]

    cur.execute("SELECT COUNT(*) FROM users WHERE role = 'partner' AND verification_status = 'pending'")
    pending_partner_count = cur.fetchone()[0]

    cur.execute("SELECT COUNT(*) FROM users WHERE role = 'partner' AND verification_status = 'approved'")
    approved_partner_count = cur.fetchone()[0]

    cur.execute("SELECT COUNT(*) FROM bookings")
    booking_count = cur.fetchone()[0]

    cur.execute("SELECT COUNT(*) FROM bookings WHERE status = 'pending'")
    pending_booking_count = cur.fetchone()[0]

    cur.execute("SELECT COUNT(*) FROM bookings WHERE status = 'completed'")
    completed_booking_count = cur.fetchone()[0]

    # All Partners
    cur.execute("""
    SELECT id, name, phone, email, category, area, years_exp, price_range, bio,
           verification_status, is_online, rating, total_reviews, vehicle_model,
           vehicle_plate, documents_meta, created_at
    FROM users
    WHERE role = 'partner'
    ORDER BY CASE WHEN verification_status = 'pending' THEN 0 ELSE 1 END, created_at DESC
    """)
    partners = [auth_db.sanitize_user_dict(dict(r)) for r in cur.fetchall()]

    # All Bookings
    cur.execute("""
    SELECT id, customer_id, customer_name, customer_phone, customer_address,
           partner_id, service_slug, service_name, booking_date, time_slot,
           notes, price, status, rating, review, created_at, is_cab, pickup, drop_loc
    FROM bookings
    ORDER BY created_at DESC
    """)
    bookings = [dict(r) for r in cur.fetchall()]

    conn.close()

    return jsonify({
        "success": True,
        "counts": {
            "total_customers": cust_count,
            "total_partners": partner_count,
            "pending_partners": pending_partner_count,
            "approved_partners": approved_partner_count,
            "total_bookings": booking_count,
            "pending_bookings": pending_booking_count,
            "completed_bookings": completed_booking_count
        },
        "partners": partners,
        "bookings": bookings
    }), 200

@auth_bp.route("/api/admin/partner-status", methods=["POST"])
def admin_update_partner_status():
    if session.get("role") != "admin":
        return jsonify({"success": False, "error": "Administrator authentication required."}), 403

    data = request.get_json(silent=True) or {}
    partner_id = data.get("partner_id")
    status = (data.get("status") or "").lower().strip()

    if not partner_id or status not in ("approved", "rejected", "pending"):
        return jsonify({"success": False, "error": "Invalid partner ID or status."}), 400

    conn = auth_db.get_db()
    cur = conn.cursor()
    cur.execute("UPDATE users SET verification_status = ? WHERE id = ? AND role = 'partner'",
                (status, partner_id))
    affected = cur.rowcount
    conn.commit()
    conn.close()

    if affected == 0:
        return jsonify({"success": False, "error": "Partner not found."}), 404

    return jsonify({
        "success": True,
        "partner_id": partner_id,
        "status": status,
        "message": f"Partner status updated to {status.upper()}."
    }), 200
