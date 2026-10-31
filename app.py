"""
Zenserve - All-in-One Home & Local Services App for Mohali / Chandigarh
Backend: Python Flask REST API
"""

import os
import re
import json
import urllib.request
import uuid
import random
from datetime import datetime, timedelta
from flask import Flask, jsonify, request, render_template, send_from_directory, session
import auth_db
from auth_routes import auth_bp

app = Flask(__name__, template_folder="templates", static_folder="static")

# Load environment variables securely from .env
try:
    from dotenv import load_dotenv
    load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"), override=True)
except Exception as _e:
    pass

# Clean and sanitize GEMINI_API_KEY
_raw_key = os.environ.get("GEMINI_API_KEY", "").strip().strip("'").strip('"')
if _raw_key:
    os.environ["GEMINI_API_KEY"] = _raw_key

_is_real_key_loaded = bool(_raw_key and _raw_key != "YOUR_GEMINI_API_KEY_HERE" and not _raw_key.startswith("your_"))
print(f"===============================================================")
print(f"GEMINI_API_KEY loaded: {_is_real_key_loaded}")
print(f"===============================================================")

app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "zenserve-mohali-chandigarh-secret-key-2026")
app.config["SESSION_COOKIE_HTTPONLY"] = True
app.config["SESSION_COOKIE_SAMESITE"] = "Lax"
app.config["PERMANENT_SESSION_LIFETIME"] = timedelta(minutes=30) # 30 min session timeout

# Initialize SQLite Authentication Database & Seed Demo Accounts
try:
    auth_db.init_db()
except Exception as _dbe:
    print(f"Warning initializing auth db: {_dbe}")

# Register Authentication Blueprint
app.register_blueprint(auth_bp)

# =============================================================================
# 1. DUMMY DATA STORE (In-Memory Python Structures)
# =============================================================================

SERVICES = [
    {
        "id": "ac-repair",
        "name": "AC Repair",
        "slug": "ac-repair",
        "icon": "snowflake",
        "description": "Filter cleaning, gas filling, compressor repair & seasonal servicing",
        "starting_price": "₹399",
        "badge": "Most Popular"
    },
    {
        "id": "plumber",
        "name": "Plumber",
        "slug": "plumber",
        "icon": "wrench",
        "description": "Pipe leakages, tap repairs, bathroom fittings & water tank care",
        "starting_price": "₹249",
        "badge": "Quick 30-min arrival"
    },
    {
        "id": "electrician",
        "name": "Electrician",
        "slug": "electrician",
        "icon": "zap",
        "description": "Wiring repair, fan installation, switchboards, MCBs & fuse fixes",
        "starting_price": "₹199",
        "badge": "Certified Pros"
    },
    {
        "id": "home-cleaner",
        "name": "Home Cleaner",
        "slug": "home-cleaner",
        "icon": "sparkles",
        "description": "Deep home cleaning, sofa shampooing, kitchen & bathroom sanitization",
        "starting_price": "₹699",
        "badge": "Eco-friendly"
    },
    {
        "id": "cab",
        "name": "Cab",
        "slug": "cab",
        "icon": "car",
        "description": "Bike, Auto, Mini & Sedan instant rides across Mohali & Chandigarh",
        "starting_price": "₹7/km",
        "badge": "Instant Ride"
    },
    {
        "id": "blood-test",
        "name": "Blood Test at Home",
        "slug": "blood-test",
        "icon": "droplet",
        "description": "Certified phlebotomists, fasting sugar, CBC, lipid & digital reports in 6 hrs",
        "starting_price": "Free Pickup",
        "badge": "NABL Accredited"
    },
    {
        "id": "personal-chef",
        "name": "Personal Chef",
        "slug": "personal-chef",
        "icon": "chef",
        "description": "Daily home cook, party & event chef, diet & healthy meal prep",
        "starting_price": "₹300/meal",
        "badge": "Custom Menus"
    },
    {
        "id": "barber-home",
        "name": "Barber at Home",
        "slug": "barber-home",
        "icon": "scissors",
        "description": "Doorstep haircuts, beard trim, kids styling, hair spa & grooming packages",
        "starting_price": "₹150",
        "badge": "Carries own kit"
    },
    {
        "id": "massage-therapy",
        "name": "Massage Therapy",
        "slug": "massage-therapy",
        "icon": "spa",
        "description": "Certified therapists, deep tissue, relaxation, sports recovery & pain relief",
        "starting_price": "₹799",
        "badge": "Certified Pros"
    },
    {
        "id": "painter",
        "name": "Painter",
        "slug": "painter",
        "icon": "paintbrush",
        "description": "Interior & exterior wall painting, damp treatment, textures & polishing",
        "starting_price": "₹12/sq.ft",
        "badge": "1-Yr Warranty"
    },
    {
        "id": "carpenter",
        "name": "Carpenter",
        "slug": "carpenter",
        "icon": "hammer",
        "description": "Door/window fixes, lock fittings, furniture repair, assembly & modular woodwork",
        "starting_price": "₹149 visit / ₹800/day",
        "badge": "Carries own tools"
    },
    {
        "id": "labour-work",
        "name": "Labour Work",
        "slug": "labour-work",
        "icon": "hard-hat",
        "description": "Daily wage helpers, house shifting, heavy lifting, construction & debris clearance",
        "starting_price": "₹500/half day",
        "badge": "Verified Helpers"
    },
    {
        "id": "computer-service",
        "name": "Computer Service",
        "slug": "computer-service",
        "icon": "laptop",
        "description": "Laptop repairs, Mac servicing, SSD upgrades, virus removal & OS installation",
        "starting_price": "₹299",
        "badge": "Same Day Fix"
    },
    {
        "id": "camera-rental",
        "name": "Camera Rental",
        "slug": "camera-rental",
        "icon": "camera",
        "description": "DSLR, cinema cameras, Sony/Canon lenses, gimbals, lighting kits & 4K drones",
        "starting_price": "₹599/day",
        "badge": "Zero Deposit Options"
    },
    {
        "id": "home-tuition",
        "name": "Home Tuition",
        "slug": "home-tuition",
        "icon": "book-open",
        "description": "Verified home tutors for Classes 1-12, IIT-JEE, NEET, CBSE & spoken English",
        "starting_price": "₹350/hr",
        "badge": "1-on-1 Mentorship"
    },
]

PROVIDERS = [
    # -------------------------------------------------------------------------
    # 1. AC REPAIR (Mohali & Chandigarh)
    # -------------------------------------------------------------------------
    {
        "id": "ac-1",
        "service": "AC Repair",
        "service_slug": "ac-repair",
        "name": "CoolTech Air Conditioning Care",
        "rating": 4.9,
        "reviews_count": 148,
        "price": "₹499 onwards",
        "price_val": 499,
        "distance": "1.2 km away",
        "location": "Phase 7, Mohali",
        "experience": "8+ yrs exp",
        "phone": "+91 98150 12345",
        "features": ["30-Day Service Warranty", "Genuine Spare Parts", "Free Inspection on Repair"],
        "id_verified": True,
        "bg_checked": True,
        "insured": True,
        "badges": ["ID Verified", "Background Checked", "Rated 4.5+", "Insured Work"]
    },
    {
        "id": "ac-2",
        "service": "AC Repair",
        "service_slug": "ac-repair",
        "name": "TriCity HVAC & Cooling Masters",
        "rating": 4.8,
        "reviews_count": 112,
        "price": "₹399 onwards",
        "price_val": 399,
        "distance": "2.4 km away",
        "location": "Sector 35-C, Chandigarh",
        "experience": "6+ yrs exp",
        "phone": "+91 98720 23456",
        "features": ["Jet-Pump Cleaning", "Gas Leak Detection", "All AC Brands Supported"],
        "id_verified": True,
        "bg_checked": True,
        "insured": True,
        "badges": ["ID Verified", "Background Checked", "Rated 4.5+", "Insured Work"]
    },
    {
        "id": "ac-3",
        "service": "AC Repair",
        "service_slug": "ac-repair",
        "name": "Chandigarh CoolBreeze Solutions",
        "rating": 4.7,
        "reviews_count": 89,
        "price": "₹450 onwards",
        "price_val": 450,
        "distance": "3.1 km away",
        "location": "Sector 22-B, Chandigarh",
        "experience": "5+ yrs exp",
        "phone": "+91 98880 34567",
        "features": ["Inverter AC Specialists", "Same-Day Visits", "Transparent Quotes"],
        "id_verified": False,
        "bg_checked": True,
        "insured": True,
        "badges": ["Background Checked", "Rated 4.5+", "Insured Work"]
    },
    {
        "id": "ac-4",
        "service": "AC Repair",
        "service_slug": "ac-repair",
        "name": "Punjab Aircon & Heating Pros",
        "rating": 4.8,
        "reviews_count": 125,
        "price": "₹550 onwards",
        "price_val": 550,
        "distance": "1.8 km away",
        "location": "Sector 70, Mohali",
        "experience": "10+ yrs exp",
        "phone": "+91 98140 45678",
        "features": ["Emergency AC Repair", "Commercial & Residential", "Uniformed Staff"],
        "id_verified": True,
        "bg_checked": True,
        "insured": True,
        "badges": ["ID Verified", "Background Checked", "Rated 4.5+", "Insured Work"]
    },

    # -------------------------------------------------------------------------
    # 2. PLUMBER (Mohali & Chandigarh)
    # -------------------------------------------------------------------------
    {
        "id": "plumb-1",
        "service": "Plumber",
        "service_slug": "plumber",
        "name": "Mohali ZenPlumb Services",
        "rating": 4.9,
        "reviews_count": 164,
        "price": "₹299 onwards",
        "price_val": 299,
        "distance": "0.8 km away",
        "location": "Phase 3B2, Mohali",
        "experience": "7+ yrs exp",
        "phone": "+91 98155 56789",
        "features": ["Arrives within 30 mins", "Modern Pipe Camera", "Zero Visit Fee if Repaired"],
        "id_verified": True,
        "bg_checked": True,
        "insured": True,
        "badges": ["ID Verified", "Background Checked", "Rated 4.5+", "Insured Work"]
    },
    {
        "id": "plumb-2",
        "service": "Plumber",
        "service_slug": "plumber",
        "name": "Sharma Sanitation & Pipe Works",
        "rating": 4.8,
        "reviews_count": 105,
        "price": "₹249 onwards",
        "price_val": 249,
        "distance": "1.6 km away",
        "location": "Sector 40, Chandigarh",
        "experience": "12+ yrs exp",
        "phone": "+91 98765 67890",
        "features": ["Commode & Basin Fittings", "Geyser Pipeline Repair", "Clean Worksite Guarantee"],
        "id_verified": True,
        "bg_checked": True,
        "insured": True,
        "badges": ["ID Verified", "Background Checked", "Rated 4.5+", "Insured Work"]
    },
    {
        "id": "plumb-3",
        "service": "Plumber",
        "service_slug": "plumber",
        "name": "TriCity LeakFix & Motor Pros",
        "rating": 4.7,
        "reviews_count": 92,
        "price": "₹349 onwards",
        "price_val": 349,
        "distance": "2.8 km away",
        "location": "Phase 5, Mohali",
        "experience": "5+ yrs exp",
        "phone": "+91 98888 78901",
        "features": ["Submersible & Water Motor", "Overhead Tank Valve Fixes", "100% Genuine Fittings"],
        "id_verified": False,
        "bg_checked": True,
        "insured": True,
        "badges": ["Background Checked", "Rated 4.5+", "Insured Work"]
    },
    {
        "id": "plumb-4",
        "service": "Plumber",
        "service_slug": "plumber",
        "name": "Cityline Water Solutions",
        "rating": 4.8,
        "reviews_count": 118,
        "price": "₹299 onwards",
        "price_val": 299,
        "distance": "3.3 km away",
        "location": "Sector 19, Chandigarh",
        "experience": "9+ yrs exp",
        "phone": "+91 98144 89012",
        "features": ["Blocked Drain Unclogging", "Bathroom Remodeling", "Direct Transparent Billing"],
        "id_verified": True,
        "bg_checked": True,
        "insured": True,
        "badges": ["ID Verified", "Background Checked", "Rated 4.5+", "Insured Work"]
    },

    # -------------------------------------------------------------------------
    # 3. ELECTRICIAN (Mohali & Chandigarh)
    # -------------------------------------------------------------------------
    {
        "id": "elec-1",
        "service": "Electrician",
        "service_slug": "electrician",
        "name": "Singh Electricals & Power Care",
        "rating": 4.9,
        "reviews_count": 182,
        "price": "₹199 onwards",
        "price_val": 199,
        "distance": "1.1 km away",
        "location": "Sector 62 (Phase 8), Mohali",
        "experience": "9+ yrs exp",
        "phone": "+91 98151 90123",
        "features": ["Licensed Electricians", "Inverter & Battery Wiring", "Safety-First Equipment"],
        "id_verified": True,
        "bg_checked": True,
        "insured": True,
        "badges": ["ID Verified", "Background Checked", "Rated 4.5+", "Insured Work"]
    },
    {
        "id": "elec-2",
        "service": "Electrician",
        "service_slug": "electrician",
        "name": "TriCity 24x7 Emergency Electrician",
        "rating": 4.8,
        "reviews_count": 134,
        "price": "₹249 onwards",
        "price_val": 249,
        "distance": "2.0 km away",
        "location": "Sector 32-D, Chandigarh",
        "experience": "11+ yrs exp",
        "phone": "+91 98766 01234",
        "features": ["Short Circuit Diagnostics", "Ceiling Fan & Chandelier", "Instant Fault Isolation"],
        "id_verified": True,
        "bg_checked": True,
        "insured": True,
        "badges": ["ID Verified", "Background Checked", "Rated 4.5+", "Insured Work"]
    },
    {
        "id": "elec-3",
        "service": "Electrician",
        "service_slug": "electrician",
        "name": "VoltMaster Appliance & Wire Hub",
        "rating": 4.7,
        "reviews_count": 96,
        "price": "₹199 onwards",
        "price_val": 199,
        "distance": "2.9 km away",
        "location": "Phase 10, Mohali",
        "experience": "6+ yrs exp",
        "phone": "+91 98885 12345",
        "features": ["Switchboard Replacement", "MCB Box Upgrade", "Quick 45-min Attendance"],
        "id_verified": False,
        "bg_checked": True,
        "insured": True,
        "badges": ["Background Checked", "Rated 4.5+", "Insured Work"]
    },
    {
        "id": "elec-4",
        "service": "Electrician",
        "service_slug": "electrician",
        "name": "Apex Power Solutions",
        "rating": 4.8,
        "reviews_count": 110,
        "price": "₹299 onwards",
        "price_val": 299,
        "distance": "3.5 km away",
        "location": "Sector 44, Chandigarh",
        "experience": "8+ yrs exp",
        "phone": "+91 98141 23456",
        "features": ["Earthing Check", "LED Panel Installation", "Post-Service Test Guarantee"],
        "id_verified": True,
        "bg_checked": True,
        "insured": True,
        "badges": ["ID Verified", "Background Checked", "Rated 4.5+", "Insured Work"]
    },

    # -------------------------------------------------------------------------
    # 4. HOME CLEANER (Mohali & Chandigarh)
    # -------------------------------------------------------------------------
    {
        "id": "clean-1",
        "service": "Home Cleaner",
        "service_slug": "home-cleaner",
        "name": "NeatNest Deep Cleaning Mohali",
        "rating": 4.9,
        "reviews_count": 195,
        "price": "₹899 onwards",
        "price_val": 899,
        "distance": "1.4 km away",
        "location": "Phase 11, Mohali",
        "experience": "6+ yrs exp",
        "phone": "+91 98157 34567",
        "features": ["German Vacuum Machines", "Hospital-Grade Disinfectant", "Kitchen Degreasing"],
        "id_verified": True,
        "bg_checked": True,
        "insured": True,
        "badges": ["ID Verified", "Background Checked", "Rated 4.5+", "Insured Work"]
    },
    {
        "id": "clean-2",
        "service": "Home Cleaner",
        "service_slug": "home-cleaner",
        "name": "TriCity Sparkle Sofa & Home Wash",
        "rating": 4.8,
        "reviews_count": 142,
        "price": "₹799 onwards",
        "price_val": 799,
        "distance": "2.5 km away",
        "location": "Sector 43, Chandigarh",
        "experience": "5+ yrs exp",
        "phone": "+91 98768 45678",
        "features": ["Sofa & Carpet Shampooing", "Bathroom Tile Descaling", "Background-Verified Crew"],
        "id_verified": True,
        "bg_checked": True,
        "insured": True,
        "badges": ["ID Verified", "Background Checked", "Rated 4.5+", "Insured Work"]
    },
    {
        "id": "clean-3",
        "service": "Home Cleaner",
        "service_slug": "home-cleaner",
        "name": "CleanSpace Sanitization Squad",
        "rating": 4.7,
        "reviews_count": 108,
        "price": "₹699 onwards",
        "price_val": 699,
        "distance": "3.0 km away",
        "location": "Sector 20, Chandigarh",
        "experience": "4+ yrs exp",
        "phone": "+91 98889 56789",
        "features": ["Move-in / Move-out Clean", "Balcony & Window Scrubbing", "Pet-Friendly Chemicals"],
        "id_verified": False,
        "bg_checked": True,
        "insured": True,
        "badges": ["Background Checked", "Rated 4.5+", "Insured Work"]
    },
    {
        "id": "clean-4",
        "service": "Home Cleaner",
        "service_slug": "home-cleaner",
        "name": "Mohali EcoClean Home Care",
        "rating": 4.8,
        "reviews_count": 94,
        "price": "₹849 onwards",
        "price_val": 849,
        "distance": "1.9 km away",
        "location": "Sector 68, Mohali",
        "experience": "7+ yrs exp",
        "phone": "+91 98149 67890",
        "features": ["100% Organic Detergents", "Full Apartment Packages", "Quality Re-check"],
        "id_verified": True,
        "bg_checked": True,
        "insured": True,
        "badges": ["ID Verified", "Background Checked", "Rated 4.5+", "Insured Work"]
    },

    # -------------------------------------------------------------------------
    # 5. CAB BOOKING (Mohali & Chandigarh)
    # -------------------------------------------------------------------------
    {
        "id": "cab-1",
        "service": "Cab Booking",
        "service_slug": "cab-booking",
        "name": "Chandigarh-Mohali City Cabs",
        "rating": 4.9,
        "reviews_count": 340,
        "price": "₹12/km (Base ₹99)",
        "price_val": 99,
        "distance": "0.5 km away",
        "location": "Phase 7 Market, Mohali",
        "experience": "AC Hatchback & Sedan",
        "phone": "+91 98159 78901",
        "features": ["Instant Arrival in 8 mins", "Clean & Sanitized Cabs", "Cash & UPI Accepted"],
        "id_verified": True,
        "bg_checked": True,
        "insured": True,
        "badges": ["ID Verified", "Background Checked", "Rated 4.5+", "Insured Work"]
    },
    {
        "id": "cab-2",
        "service": "Cab Booking",
        "service_slug": "cab-booking",
        "name": "TriCity Express Airport & Local Taxi",
        "rating": 4.8,
        "reviews_count": 275,
        "price": "₹14/km (Base ₹120)",
        "price_val": 120,
        "distance": "1.5 km away",
        "location": "Sector 17 ISBT, Chandigarh",
        "experience": "Airport & Station Cabs",
        "phone": "+91 98761 89012",
        "features": ["Flight Delay Tracking", "Fixed Airport Rates", "Verified Commercial Drivers"],
        "id_verified": True,
        "bg_checked": True,
        "insured": True,
        "badges": ["ID Verified", "Background Checked", "Rated 4.5+", "Insured Work"]
    },
    {
        "id": "cab-3",
        "service": "Cab Booking",
        "service_slug": "cab-booking",
        "name": "Prime Mohali Chauffeur Cabs (SUV)",
        "rating": 4.8,
        "reviews_count": 195,
        "price": "₹18/km (Base ₹150)",
        "price_val": 150,
        "distance": "2.2 km away",
        "location": "Sector 71, Mohali",
        "experience": "Innova & Ertiga Fleet",
        "phone": "+91 98881 90123",
        "features": ["Family & Group Travel", "Luggage Friendly", "Highway & Outstation Ready"],
        "id_verified": False,
        "bg_checked": True,
        "insured": True,
        "badges": ["Background Checked", "Rated 4.5+", "Insured Work"]
    },
    {
        "id": "cab-4",
        "service": "Cab Booking",
        "service_slug": "cab-booking",
        "name": "Zirakpur & Tricity Direct Cabs",
        "rating": 4.7,
        "reviews_count": 160,
        "price": "₹11/km (Base ₹89)",
        "price_val": 89,
        "distance": "3.8 km away",
        "location": "Tribune Chowk, Chandigarh",
        "experience": "Economy City Rides",
        "phone": "+91 98142 01234",
        "features": ["Zero Cancellation Penalty", "GPS Monitored", "Fast Local Pickups"],
        "id_verified": True,
        "bg_checked": True,
        "insured": True,
        "badges": ["ID Verified", "Background Checked", "Rated 4.5+", "Insured Work"]
    },

    # -------------------------------------------------------------------------
    # 6. BLOOD TEST AT HOME (Mohali & Chandigarh)
    # -------------------------------------------------------------------------
    {
        "id": "blood-1",
        "service": "Blood Test at Home",
        "service_slug": "blood-test",
        "name": "Redcliffe Labs Home Diagnostics",
        "rating": 4.9,
        "reviews_count": 260,
        "price": "Free Pickup (Tests ₹199+)",
        "price_val": 199,
        "distance": "1.0 km away",
        "location": "Phase 6, Mohali",
        "experience": "NABL Accredited",
        "phone": "+91 98153 12345",
        "features": ["Vaccinated Phlebotomists", "Reports on WhatsApp in 6 hrs", "Sugar, CBC, Lipid & Thyroid"],
        "id_verified": True,
        "bg_checked": True,
        "insured": True,
        "badges": ["ID Verified", "Background Checked", "Rated 4.5+", "Insured Work"]
    },
    {
        "id": "blood-2",
        "service": "Blood Test at Home",
        "service_slug": "blood-test",
        "name": "Dr. Lal PathLabs Direct Collection",
        "rating": 4.8,
        "reviews_count": 210,
        "price": "Free Pickup (Tests ₹249+)",
        "price_val": 249,
        "distance": "2.1 km away",
        "location": "Sector 34, Chandigarh",
        "experience": "ISO Certified Labs",
        "phone": "+91 98762 23456",
        "features": ["Barcoded Sealed Vials", "Fasting Slot 6 AM onwards", "Doctor Consultation Free"],
        "id_verified": True,
        "bg_checked": True,
        "insured": True,
        "badges": ["ID Verified", "Background Checked", "Rated 4.5+", "Insured Work"]
    },
    {
        "id": "blood-3",
        "service": "Blood Test at Home",
        "service_slug": "blood-test",
        "name": "Chandigarh Pathology & Care",
        "rating": 4.8,
        "reviews_count": 155,
        "price": "Free Pickup (Tests ₹299+)",
        "price_val": 299,
        "distance": "2.7 km away",
        "location": "Sector 16, Chandigarh",
        "experience": "Senior Phlebotomists",
        "phone": "+91 98883 34567",
        "features": ["Painless Sample Collection", "Full Body Checkup Packages", "Accurate Digital Reports"],
        "id_verified": True,
        "bg_checked": True,
        "insured": True,
        "badges": ["ID Verified", "Background Checked", "Rated 4.5+", "Insured Work"]
    },
    {
        "id": "blood-4",
        "service": "Blood Test at Home",
        "service_slug": "blood-test",
        "name": "Apollo Clinic Home Phlebotomy Mohali",
        "rating": 4.7,
        "reviews_count": 130,
        "price": "Free Pickup (Tests ₹349+)",
        "price_val": 349,
        "distance": "1.7 km away",
        "location": "Sector 79, Mohali",
        "experience": "Hospital Quality Standards",
        "phone": "+91 98145 45678",
        "features": ["Sterile Single-use Needles", "Senior Citizen Discounts", "Real-time Tracking"],
        "id_verified": False,
        "bg_checked": True,
        "insured": True,
        "badges": ["Background Checked", "Rated 4.5+", "Insured Work"]
    },

    # -------------------------------------------------------------------------
    # 7. PERSONAL CHEF (Mohali & Chandigarh)
    # -------------------------------------------------------------------------
    {
        "id": "chef-1",
        "service": "Personal Chef",
        "service_slug": "personal-chef",
        "name": "Chef Sanjeev Anand Gourmet Home Kitchen",
        "rating": 4.9,
        "reviews_count": 185,
        "price": "₹350/meal (Events ₹2,500+)",
        "price_val": 350,
        "monthlyPlanPrice": "₹6,000 / month",
        "monthlyPlanDetails": "2 meals a day (Lunch & Dinner)",
        "priceRange": "₹350 - ₹600 per meal / ₹2,500 per event",
        "distance": "1.4 km away",
        "location": "Phase 7, Mohali",
        "experience": "12 years exp",
        "phone": "+91 98150 11990",
        "whatsapp": "919815011990",
        "features": ["Daily Home Cook & Event Chef", "North Indian, South Indian & Chinese", "Custom Spice Levels & Kitchen Cleanup"],
        "id_verified": True,
        "bg_checked": True,
        "insured": True,
        "badges": ["ID Verified", "Background Checked", "Rated 4.5+", "Insured Work"],
        "subServices": [
            "Daily Home Cook",
            "Party and Event Chef",
            "North Indian, South Indian and Chinese Specialist",
            "Tiffin and Meal Prep",
            "Diet and Healthy Meal Chef",
            "Weekend Special Chef"
        ]
    },
    {
        "id": "chef-2",
        "service": "Personal Chef",
        "service_slug": "personal-chef",
        "name": "Chef Harpreet Kaur Home Delights",
        "rating": 4.8,
        "reviews_count": 142,
        "price": "₹300/meal (Events ₹1,800+)",
        "price_val": 300,
        "monthlyPlanPrice": "₹5,500 / month",
        "monthlyPlanDetails": "2 meals a day (Wholesome Diet)",
        "priceRange": "₹300 - ₹550 per meal / ₹1,800 per event",
        "distance": "2.1 km away",
        "location": "Sector 70, Mohali",
        "experience": "9 years exp",
        "phone": "+91 98720 22334",
        "whatsapp": "919872022334",
        "features": ["Daily Home Cook & Tiffin Prep", "Diet & Healthy Meal Chef", "Fresh Ingredients & Zero Trans-fat"],
        "id_verified": True,
        "bg_checked": True,
        "insured": True,
        "badges": ["ID Verified", "Background Checked", "Rated 4.5+", "Insured Work"],
        "subServices": [
            "Daily Home Cook",
            "Party and Event Chef",
            "North Indian, South Indian and Chinese Specialist",
            "Tiffin and Meal Prep",
            "Diet and Healthy Meal Chef",
            "Weekend Special Chef"
        ]
    },
    {
        "id": "chef-3",
        "service": "Personal Chef",
        "service_slug": "personal-chef",
        "name": "MasterChef Vikramjit Singh Royal Caterers",
        "rating": 4.9,
        "reviews_count": 210,
        "price": "₹450/meal (Events ₹3,500+)",
        "price_val": 450,
        "monthlyPlanPrice": "₹7,500 / month",
        "monthlyPlanDetails": "2 meals a day (Multi-Cuisine Gourmet)",
        "priceRange": "₹450 - ₹600 per meal / ₹3,500 - ₹5,000 per event",
        "distance": "3.2 km away",
        "location": "Sector 17, Chandigarh",
        "experience": "15 years exp",
        "phone": "+91 98880 33445",
        "whatsapp": "919888033445",
        "features": ["Party and Event Chef Specialist", "North Indian, South Indian & Chinese", "Sous-Chef Team & Full Buffet Setup"],
        "id_verified": True,
        "bg_checked": True,
        "insured": True,
        "badges": ["ID Verified", "Background Checked", "Rated 4.5+", "Insured Work"],
        "subServices": [
            "Daily Home Cook",
            "Party and Event Chef",
            "North Indian, South Indian and Chinese Specialist",
            "Tiffin and Meal Prep",
            "Diet and Healthy Meal Chef",
            "Weekend Special Chef"
        ]
    },

    # -------------------------------------------------------------------------
    # 8. BARBER AT HOME (Mohali & Chandigarh)
    # -------------------------------------------------------------------------
    {
        "id": "barber-1",
        "gender": "male",
        "service": "Barber at Home",
        "service_slug": "barber-home",
        "name": "ZenStyle Doorstep Grooming by Manpreet",
        "rating": 4.9,
        "reviews_count": 240,
        "price": "₹150 Haircut (Combos ₹250)",
        "price_val": 150,
        "priceRange": "₹150 Haircut • ₹250 Combo • ₹499 Package",
        "distance": "1.1 km away",
        "location": "Sector 35, Chandigarh",
        "experience": "8 years exp",
        "phone": "+91 98140 44556",
        "whatsapp": "919814044556",
        "features": ["Haircut & Beard Trim Specialist", "Carries own kit & Disposable Capes", "UV Sterilized Equipment & Vacuum Cleanup"],
        "id_verified": True,
        "bg_checked": True,
        "insured": True,
        "badges": ["ID Verified", "Carries own kit", "Background Checked", "Rated 4.5+"],
        "subServices": [
            "Haircut",
            "Beard Trim and Shave",
            "Haircut + Beard Combo",
            "Kids Haircut",
            "Hair Spa and Head Massage",
            "Grooming Package"
        ]
    },
    {
        "id": "barber-2",
        "gender": "male",
        "service": "Barber at Home",
        "service_slug": "barber-home",
        "name": "Urban Doorstep Salon by Deepinder",
        "rating": 4.8,
        "reviews_count": 180,
        "price": "₹150 Haircut (Combos ₹250)",
        "price_val": 150,
        "priceRange": "₹150 Haircut • ₹250 Combo • ₹599 Grooming",
        "distance": "1.8 km away",
        "location": "Phase 5, Mohali",
        "experience": "10 years exp",
        "phone": "+91 98155 55667",
        "whatsapp": "919815555667",
        "features": ["Haircut + Beard Combo ₹250", "Hair Spa & Head Massage", "Carries own kit & Vacuum Cleanup"],
        "id_verified": True,
        "bg_checked": True,
        "insured": True,
        "badges": ["ID Verified", "Carries own kit", "Background Checked", "Rated 4.5+"],
        "subServices": [
            "Haircut",
            "Beard Trim and Shave",
            "Haircut + Beard Combo",
            "Kids Haircut",
            "Hair Spa and Head Massage",
            "Grooming Package"
        ]
    },
    {
        "id": "barber-3",
        "gender": "female",
        "service": "Barber at Home",
        "service_slug": "barber-home",
        "name": "GlamCut Doorstep Hair & Styling by Simran Kaur",
        "rating": 4.9,
        "reviews_count": 195,
        "price": "₹150 Haircut (Combos ₹250)",
        "price_val": 150,
        "priceRange": "₹150 Haircut • ₹250 Combo • ₹499 Package",
        "distance": "2.2 km away",
        "location": "Sector 22, Chandigarh",
        "experience": "7 years exp",
        "phone": "+91 98766 88991",
        "whatsapp": "919876688991",
        "features": ["Certified Female Hair Stylist", "Carries own kit & Disposable Capes", "Kids & Family Styling Specialist"],
        "id_verified": True,
        "bg_checked": True,
        "insured": True,
        "badges": ["ID Verified", "Carries own kit", "Background Checked", "Rated 4.5+"],
        "subServices": [
            "Haircut",
            "Beard Trim and Shave",
            "Haircut + Beard Combo",
            "Kids Haircut",
            "Hair Spa and Head Massage",
            "Grooming Package"
        ]
    },
    {
        "id": "barber-4",
        "gender": "male",
        "service": "Barber at Home",
        "service_slug": "barber-home",
        "name": "Royal Cut Grooming Studio Home Visit by Jaspreet",
        "rating": 4.7,
        "reviews_count": 115,
        "price": "₹150 Haircut (Combos ₹250)",
        "price_val": 150,
        "priceRange": "₹150 Haircut • ₹250 Combo • ₹399 Hair Spa",
        "distance": "2.6 km away",
        "location": "Sector 43, Chandigarh",
        "experience": "6 years exp",
        "phone": "+91 98766 66778",
        "whatsapp": "919876666778",
        "features": ["Beard Trim & Hot Towel Shave", "Kids Haircut Specialist", "Carries own kit & Disposable Blades"],
        "id_verified": True,
        "bg_checked": True,
        "insured": True,
        "badges": ["ID Verified", "Carries own kit", "Background Checked", "Rated 4.5+"],
        "subServices": [
            "Haircut",
            "Beard Trim and Shave",
            "Haircut + Beard Combo",
            "Kids Haircut",
            "Hair Spa and Head Massage",
            "Grooming Package"
        ]
    },

    # -------------------------------------------------------------------------
    # 9. MASSAGE THERAPY (Mohali & Chandigarh)
    # -------------------------------------------------------------------------
    {
        "id": "massage-1",
        "gender": "male",
        "service": "Massage Therapy",
        "service_slug": "massage-therapy",
        "name": "Healing Hands Doorstep Therapy (Amit Sharma)",
        "rating": 4.9,
        "reviews_count": 290,
        "price": "₹899/hr (Deep Tissue ₹1,299)",
        "price_val": 899,
        "priceRange": "₹899 (60 min Relaxation) • ₹1,299 (Deep Tissue)",
        "distance": "1.3 km away",
        "location": "Phase 3B2, Mohali",
        "experience": "11 years exp",
        "phone": "+91 98151 77889",
        "whatsapp": "919815177889",
        "features": ["Certified Physiotherapist (BPT)", "Carries Folding Therapy Bed & Linens", "Deep Tissue & Pain Relief Specialist"],
        "id_verified": True,
        "bg_checked": True,
        "insured": True,
        "badges": ["ID Verified", "Certified Therapist", "Background Checked", "Rated 4.5+", "Insured Work"],
        "subServices": [
            "Relaxation Massage",
            "Deep Tissue Massage",
            "Sports Massage",
            "Back and Shoulder Pain Relief",
            "Head, Neck and Foot Massage",
            "Physiotherapy-style Massage"
        ]
    },
    {
        "id": "massage-2",
        "gender": "female",
        "service": "Massage Therapy",
        "service_slug": "massage-therapy",
        "name": "Revive Wellness Doorstep Spa by Pooja Verma",
        "rating": 4.8,
        "reviews_count": 215,
        "price": "₹799/session (Full Body ₹999)",
        "price_val": 799,
        "priceRange": "₹799 (Head/Foot) • ₹999 (Relaxation) • ₹1,399 (Sports)",
        "distance": "2.0 km away",
        "location": "Sector 40, Chandigarh",
        "experience": "9 years exp",
        "phone": "+91 98722 88990",
        "whatsapp": "919872288990",
        "features": ["Certified Relaxation & Aroma Therapist", "Head, Neck & Foot Reflexology", "Warm Herbal Oils & Disposable Sheets"],
        "id_verified": True,
        "bg_checked": True,
        "insured": True,
        "badges": ["ID Verified", "Certified Therapist", "Background Checked", "Rated 4.5+"],
        "subServices": [
            "Relaxation Massage",
            "Deep Tissue Massage",
            "Sports Massage",
            "Back and Shoulder Pain Relief",
            "Head, Neck and Foot Massage",
            "Physiotherapy-style Massage"
        ]
    },
    {
        "id": "massage-3",
        "gender": "male",
        "service": "Massage Therapy",
        "service_slug": "massage-therapy",
        "name": "ProRelief Sports & Pain Management (Dr. Gurjit Singh)",
        "rating": 4.9,
        "reviews_count": 175,
        "price": "₹899/session (Physio ₹1,499)",
        "price_val": 899,
        "priceRange": "₹899 (Back/Shoulder) • ₹1,199 (Deep Tissue) • ₹1,499 (Physio)",
        "distance": "2.4 km away",
        "location": "Sector 68, Mohali",
        "experience": "14 years exp",
        "phone": "+91 98888 99001",
        "whatsapp": "919888899001",
        "features": ["Sports Recovery & Sciatica Relief", "Physiotherapy-style Alignment", "Percussion Massage Gun Included"],
        "id_verified": True,
        "bg_checked": True,
        "insured": True,
        "badges": ["ID Verified", "Certified Therapist", "Background Checked", "Rated 4.5+", "Insured Work"],
        "subServices": [
            "Relaxation Massage",
            "Deep Tissue Massage",
            "Sports Massage",
            "Back and Shoulder Pain Relief",
            "Head, Neck and Foot Massage",
            "Physiotherapy-style Massage"
        ]
    },
    {
        "id": "massage-4",
        "gender": "female",
        "service": "Massage Therapy",
        "service_slug": "massage-therapy",
        "name": "Serene Touch Holistic Therapy by Jasleen Kaur",
        "rating": 4.9,
        "reviews_count": 195,
        "price": "₹799/session (Full Body ₹999)",
        "price_val": 799,
        "priceRange": "₹799 (Head/Foot) • ₹999 (Relaxation) • ₹1,399 (Deep Tissue)",
        "distance": "1.7 km away",
        "location": "Sector 35, Chandigarh",
        "experience": "10 years exp",
        "phone": "+91 98725 11223",
        "whatsapp": "919872511223",
        "features": ["Certified Female Physiotherapist (BPT)", "Warm Herbal Oils & Disposable Sheets", "Relaxation & Pain Relief Specialist"],
        "id_verified": True,
        "bg_checked": True,
        "insured": True,
        "badges": ["ID Verified", "Certified Therapist", "Background Checked", "Rated 4.5+", "Insured Work"],
        "subServices": [
            "Relaxation Massage",
            "Deep Tissue Massage",
            "Sports Massage",
            "Back and Shoulder Pain Relief",
            "Head, Neck and Foot Massage",
            "Physiotherapy-style Massage"
        ]
    },

    # -------------------------------------------------------------------------
    # 10. PAINTER (Mohali & Chandigarh)
    # -------------------------------------------------------------------------
    {
        "id": "painter-1",
        "service": "Painter",
        "service_slug": "painter",
        "name": "Asian Paints Verified Mohali Painters (Rajesh & Team)",
        "rating": 4.9,
        "reviews_count": 210,
        "price": "₹12/sq.ft (1BHK ₹6,999+)",
        "price_val": 6999,
        "priceRange": "₹12 - ₹22/sq.ft • Rooms from ₹2,499",
        "distance": "1.2 km away",
        "location": "Phase 7, Mohali",
        "experience": "14 years exp",
        "phone": "+91 98150 77112",
        "whatsapp": "919815077112",
        "features": ["Dust-Free Machine Sanding", "Laser Accurate Wall Measurement", "1-Year Paint Flaking Warranty"],
        "id_verified": True,
        "bg_checked": True,
        "insured": True,
        "badges": ["ID Verified", "Background Checked", "Rated 4.5+", "Insured Work"],
        "subServices": [
            "Interior Wall",
            "Exterior Wall Painting",
            "Waterproofing & Damp Treatment",
            "Texture & Stencil Design",
            "Wood & Metal Polishing",
            "Full Home Repainting"
        ]
    },
    {
        "id": "painter-2",
        "service": "Painter",
        "service_slug": "painter",
        "name": "Tricity ColorCraft Studio & Wall Stencils",
        "rating": 4.8,
        "reviews_count": 165,
        "price": "₹14/sq.ft (Textures ₹35/sq.ft)",
        "price_val": 3500,
        "priceRange": "₹14 - ₹25/sq.ft • Luxury Finishes",
        "distance": "2.1 km away",
        "location": "Sector 35, Chandigarh",
        "experience": "10 years exp",
        "phone": "+91 98722 33445",
        "whatsapp": "919872233445",
        "features": ["Royale Luxury & Metallic Textures", "Color Consultation & 3D Preview", "Floor Masking & Complete Cleanup"],
        "id_verified": True,
        "bg_checked": True,
        "insured": True,
        "badges": ["ID Verified", "Background Checked", "Rated 4.5+", "Insured Work"],
        "subServices": [
            "Interior Wall",
            "Exterior Wall Painting",
            "Waterproofing & Damp Treatment",
            "Texture & Stencil Design",
            "Wood & Metal Polishing",
            "Full Home Repainting"
        ]
    },
    {
        "id": "painter-3",
        "service": "Painter",
        "service_slug": "painter",
        "name": "All-Weather Pro Painters & Waterproofing",
        "rating": 4.9,
        "reviews_count": 180,
        "price": "₹10/sq.ft (Whitewash ₹5/sq.ft)",
        "price_val": 4500,
        "priceRange": "₹10 - ₹20/sq.ft • Budget to Premium",
        "distance": "2.8 km away",
        "location": "Sector 68, Mohali",
        "experience": "12 years exp",
        "phone": "+91 98884 55667",
        "whatsapp": "919888455667",
        "features": ["Deep Damp & Seepage Repair", "Exterior Weatherproof Coating", "Same-Day Patch & Touch-up"],
        "id_verified": True,
        "bg_checked": True,
        "insured": True,
        "badges": ["ID Verified", "Background Checked", "Rated 4.5+", "Insured Work"],
        "subServices": [
            "Interior Wall",
            "Exterior Wall Painting",
            "Waterproofing & Damp Treatment",
            "Texture & Stencil Design",
            "Wood & Metal Polishing",
            "Full Home Repainting"
        ]
    },

    # -------------------------------------------------------------------------
    # 11. LABOUR WORK (Mohali & Chandigarh)
    # -------------------------------------------------------------------------
    {
        "id": "labour-1",
        "service": "Labour Work",
        "service_slug": "labour-work",
        "name": "Mohali StrongArm Shifting & Daily Labour Force",
        "rating": 4.9,
        "reviews_count": 250,
        "price": "₹850/day (Half day ₹500)",
        "price_val": 850,
        "priceRange": "₹500 (Half-Day) • ₹850 (Full-Day 8 hrs)",
        "distance": "0.9 km away",
        "location": "Phase 5, Mohali",
        "experience": "9 years exp",
        "phone": "+91 98141 66778",
        "whatsapp": "919814166778",
        "features": ["Verified & Police Checked Helpers", "Lifting Straps & Trolleys Included", "Punctual 8-Hour Workday"],
        "id_verified": True,
        "bg_checked": True,
        "insured": True,
        "badges": ["ID Verified", "Background Checked", "Rated 4.5+", "Insured Work"],
        "subServices": [
            "House Shifting & Loading",
            "Heavy Furniture Moving",
            "Construction & Debris Cleanup",
            "Renovation Helper",
            "Garden Soil & Yard Labour",
            "Daily Wage General Helper"
        ]
    },
    {
        "id": "labour-2",
        "service": "Labour Work",
        "service_slug": "labour-work",
        "name": "Tricity Rapid Helpers & Shifting Crew",
        "rating": 4.8,
        "reviews_count": 190,
        "price": "₹800/day (2 helpers ₹1,500)",
        "price_val": 800,
        "priceRange": "₹500 (Half-Day) • ₹800 (Full-Day 8 hrs)",
        "distance": "1.8 km away",
        "location": "Sector 20, Chandigarh",
        "experience": "8 years exp",
        "phone": "+91 98767 77889",
        "whatsapp": "919876777889",
        "features": ["Furniture Disassembly & Loading", "Luggage & Warehouse Shifting", "Honest & Hardworking Workers"],
        "id_verified": True,
        "bg_checked": True,
        "insured": True,
        "badges": ["ID Verified", "Background Checked", "Rated 4.5+", "Insured Work"],
        "subServices": [
            "House Shifting & Loading",
            "Heavy Furniture Moving",
            "Construction & Debris Cleanup",
            "Renovation Helper",
            "Garden Soil & Yard Labour",
            "Daily Wage General Helper"
        ]
    },
    {
        "id": "labour-3",
        "service": "Labour Work",
        "service_slug": "labour-work",
        "name": "ProClean Construction & Yard Helpers",
        "rating": 4.8,
        "reviews_count": 145,
        "price": "₹850/day (Debris Truck Extra)",
        "price_val": 850,
        "priceRange": "₹500 (Half-Day) • ₹850 (Full-Day)",
        "distance": "2.3 km away",
        "location": "Sector 70, Mohali",
        "experience": "11 years exp",
        "phone": "+91 98885 88990",
        "whatsapp": "919888588990",
        "features": ["Post-Construction Deep Hauling", "Demolition Waste & Yard Disposal", "Equipped with Shovels & Barrows"],
        "id_verified": True,
        "bg_checked": True,
        "insured": True,
        "badges": ["ID Verified", "Background Checked", "Rated 4.5+", "Insured Work"],
        "subServices": [
            "House Shifting & Loading",
            "Heavy Furniture Moving",
            "Construction & Debris Cleanup",
            "Renovation Helper",
            "Garden Soil & Yard Labour",
            "Daily Wage General Helper"
        ]
    },

    # -------------------------------------------------------------------------
    # 12. CARPENTER (Mohali & Chandigarh)
    # -------------------------------------------------------------------------
    {
        "id": "carpenter-1",
        "service": "Carpenter",
        "service_slug": "carpenter",
        "name": "TriCity WoodCraft & Door Specialists (Master Harminder Singh)",
        "rating": 4.9,
        "reviews_count": 235,
        "price": "₹199 visit • ₹850/day",
        "price_val": 199,
        "visit_charge": "₹199 visit charge",
        "day_rate": "₹850/day (Jobs from ₹299)",
        "priceRange": "Visit: ₹199 • ₹850/day (Jobs from ₹299)",
        "distance": "1.1 km away",
        "location": "Phase 7, Mohali",
        "area": "Phase 7, Mohali & Sector 35, Chandigarh",
        "experience": "15 years exp",
        "phone": "+91 98155 44332",
        "whatsapp": "919815544332",
        "features": ["Carries own power tools, cutters & cordless drills", "Door latch & hydraulic hinge expert", "Same-day emergency door/lock fix"],
        "id_verified": True,
        "bg_checked": True,
        "insured": True,
        "badges": ["ID Verified", "Background Checked", "Rated 4.5+", "Carries own tools"],
        "subServices": [
            "Furniture Repair",
            "Door and Window Repair",
            "Lock and Hinge Fitting",
            "Bed, Table and Chair Assembly",
            "Modular Kitchen and Wardrobe Work",
            "Custom Furniture Making",
            "Polish and Finishing",
            "Wood Partition and Shelves"
        ],
        "reviews": [
            { "id": "r-c1-1", "author": "Sukhdeep Dhillon", "rating": 5, "date": "2 days ago", "comment": "Master Harminder fixed our swelling wooden bedroom door and installed Godrej door locks smoothly. Brought his own power tools and finished in 45 mins!" },
            { "id": "r-c1-2", "author": "Simranjeet Bedi", "rating": 5, "date": "1 week ago", "comment": "Assembled our heavy teak king bed and customized a study desk. Clean cuts, zero mess, and very fair pricing." },
            { "id": "r-c1-3", "author": "Naveen Kaushal", "rating": 4.9, "date": "2 weeks ago", "comment": "Repaired antique dining chairs and modular wardrobe slider track. Very experienced carpenter in Phase 7 Mohali." }
        ]
    },
    {
        "id": "carpenter-2",
        "service": "Carpenter",
        "service_slug": "carpenter",
        "name": "Urban WoodWorks & Lock Masters (Gurmeet & Brothers)",
        "rating": 4.8,
        "reviews_count": 180,
        "price": "₹149 visit • ₹800/day",
        "price_val": 149,
        "visit_charge": "₹149 visit charge",
        "day_rate": "₹800/day (Jobs from ₹249)",
        "priceRange": "Visit: ₹149 • ₹800/day (Jobs from ₹249)",
        "distance": "1.9 km away",
        "location": "Sector 35, Chandigarh",
        "area": "Sector 34 & 35, Chandigarh",
        "experience": "11 years exp",
        "phone": "+91 98762 55667",
        "whatsapp": "919876255667",
        "features": ["Carries full kit with clamps, saws & hinges", "IKEA & Urban Ladder flatpack assembly specialist", "Glass & wood partition mounting"],
        "id_verified": True,
        "bg_checked": True,
        "insured": True,
        "badges": ["ID Verified", "Background Checked", "Rated 4.5+", "Carries own tools"],
        "subServices": [
            "Furniture Repair",
            "Door and Window Repair",
            "Lock and Hinge Fitting",
            "Bed, Table and Chair Assembly",
            "Modular Kitchen and Wardrobe Work",
            "Custom Furniture Making",
            "Polish and Finishing",
            "Wood Partition and Shelves"
        ],
        "reviews": [
            { "id": "r-c2-1", "author": "Manpreet Gill", "rating": 5, "date": "3 days ago", "comment": "Assembled 2 large wardrobes and a computer table from IKEA. Gurmeet arrived right on time with his electric drill kit." },
            { "id": "r-c2-2", "author": "Ritu Sharma", "rating": 4.8, "date": "10 days ago", "comment": "Repaired misaligned kitchen cabinet hinges and broken drawer channels. Great visit charge of just ₹149." },
            { "id": "r-c2-3", "author": "Harshvardhan", "rating": 4.9, "date": "3 weeks ago", "comment": "Prompt lock change and window frame adjustment in Sector 35. High work ethics." }
        ]
    },
    {
        "id": "carpenter-3",
        "service": "Carpenter",
        "service_slug": "carpenter",
        "name": "Modular Kitchen Studio & Custom Carpentry (Baljit Singh)",
        "rating": 4.9,
        "reviews_count": 215,
        "price": "₹249 visit • ₹950/day",
        "price_val": 249,
        "visit_charge": "₹249 visit charge",
        "day_rate": "₹950/day (Jobs from ₹350)",
        "priceRange": "Visit: ₹249 • ₹950/day (Jobs from ₹350)",
        "distance": "2.4 km away",
        "location": "Sector 70, Mohali",
        "area": "Sector 70 & 82, Mohali",
        "experience": "14 years exp",
        "phone": "+91 98881 77665",
        "whatsapp": "919888177665",
        "features": ["Modular kitchen drawer baskets & hydraulic lift-ups", "Melamine & PU wood polish finishing", "Solid wood partitions & display shelving"],
        "id_verified": True,
        "bg_checked": True,
        "insured": True,
        "badges": ["ID Verified", "Background Checked", "Rated 4.5+", "Carries own tools"],
        "subServices": [
            "Furniture Repair",
            "Door and Window Repair",
            "Lock and Hinge Fitting",
            "Bed, Table and Chair Assembly",
            "Modular Kitchen and Wardrobe Work",
            "Custom Furniture Making",
            "Polish and Finishing",
            "Wood Partition and Shelves"
        ],
        "reviews": [
            { "id": "r-c3-1", "author": "Jasleen Johar", "rating": 5, "date": "4 days ago", "comment": "Baljit and his assistant built custom shelving in our study and polished our 8-seater dining table. Master craftsmanship!" },
            { "id": "r-c3-2", "author": "Deepak Saini", "rating": 5, "date": "2 weeks ago", "comment": "Repaired sagging modular kitchen drawers and changed hydraulic hinges. Super sturdy results." },
            { "id": "r-c3-3", "author": "Kulwant Sandhu", "rating": 4.8, "date": "1 month ago", "comment": "Fitted new wooden mesh doors and replaced front door handle. Clean work with own equipment." }
        ]
    }
]

# In-memory storage for bookings created in this session
BOOKINGS = [
    {
        "booking_id": "ZS-10482",
        "service": "Plumber",
        "provider_id": "plumb-1",
        "provider_name": "Mohali ZenPlumb Services",
        "customer_name": "Priyanshu Sharma",
        "customer_phone": "9815012345",
        "customer_address": "House 412, Phase 3B2, Mohali",
        "booking_date": "2026-11-01",
        "time_slot": "Morning (09:00 AM - 12:00 PM)",
        "notes": "Kitchen tap is leaking and pipe fitting loose",
        "status": "Confirmed",
        "price": "₹299 onwards",
        "created_at": "2026-10-31 09:30 AM"
    },

    # -------------------------------------------------------------------------
    # 10. PAINTER (Mohali & Chandigarh)
    # -------------------------------------------------------------------------
    {
        "id": "painter-1",
        "service": "Painter",
        "service_slug": "painter",
        "name": "Asian Paints Verified Mohali Painters (Rajesh & Team)",
        "rating": 4.9,
        "reviews_count": 210,
        "price": "₹12/sq.ft (1BHK ₹6,999+)",
        "price_val": 6999,
        "priceRange": "₹12 - ₹22/sq.ft • Rooms from ₹2,499",
        "distance": "1.2 km away",
        "location": "Phase 7, Mohali",
        "experience": "14 years exp",
        "phone": "+91 98150 77112",
        "whatsapp": "919815077112",
        "features": ["Dust-Free Machine Sanding", "Laser Accurate Wall Measurement", "1-Year Paint Flaking Warranty"],
        "id_verified": True,
        "bg_checked": True,
        "insured": True,
        "badges": ["ID Verified", "Background Checked", "Rated 4.5+", "Insured Work"],
        "subServices": [
            "Interior Wall",
            "Exterior Wall Painting",
            "Waterproofing & Damp Treatment",
            "Texture & Stencil Design",
            "Wood & Metal Polishing",
            "Full Home Repainting"
        ]
    },
    {
        "id": "painter-2",
        "service": "Painter",
        "service_slug": "painter",
        "name": "Tricity ColorCraft Studio & Wall Stencils",
        "rating": 4.8,
        "reviews_count": 165,
        "price": "₹14/sq.ft (Textures ₹35/sq.ft)",
        "price_val": 3500,
        "priceRange": "₹14 - ₹25/sq.ft • Luxury Finishes",
        "distance": "2.1 km away",
        "location": "Sector 35, Chandigarh",
        "experience": "10 years exp",
        "phone": "+91 98722 33445",
        "whatsapp": "919872233445",
        "features": ["Royale Luxury & Metallic Textures", "Color Consultation & 3D Preview", "Floor Masking & Complete Cleanup"],
        "id_verified": True,
        "bg_checked": True,
        "insured": True,
        "badges": ["ID Verified", "Background Checked", "Rated 4.5+", "Insured Work"],
        "subServices": [
            "Interior Wall",
            "Exterior Wall Painting",
            "Waterproofing & Damp Treatment",
            "Texture & Stencil Design",
            "Wood & Metal Polishing",
            "Full Home Repainting"
        ]
    },
    {
        "id": "painter-3",
        "service": "Painter",
        "service_slug": "painter",
        "name": "All-Weather Pro Painters & Waterproofing",
        "rating": 4.9,
        "reviews_count": 180,
        "price": "₹10/sq.ft (Whitewash ₹5/sq.ft)",
        "price_val": 4500,
        "priceRange": "₹10 - ₹20/sq.ft • Budget to Premium",
        "distance": "2.8 km away",
        "location": "Sector 68, Mohali",
        "experience": "12 years exp",
        "phone": "+91 98884 55667",
        "whatsapp": "919888455667",
        "features": ["Deep Damp & Seepage Repair", "Exterior Weatherproof Coating", "Same-Day Patch & Touch-up"],
        "id_verified": True,
        "bg_checked": True,
        "insured": True,
        "badges": ["ID Verified", "Background Checked", "Rated 4.5+", "Insured Work"],
        "subServices": [
            "Interior Wall",
            "Exterior Wall Painting",
            "Waterproofing & Damp Treatment",
            "Texture & Stencil Design",
            "Wood & Metal Polishing",
            "Full Home Repainting"
        ]
    },

    # -------------------------------------------------------------------------
    # 11. LABOUR WORK (Mohali & Chandigarh)
    # -------------------------------------------------------------------------
    {
        "id": "labour-1",
        "service": "Labour Work",
        "service_slug": "labour-work",
        "name": "Mohali StrongArm Shifting & Daily Labour Force",
        "rating": 4.9,
        "reviews_count": 250,
        "price": "₹850/day (Half day ₹500)",
        "price_val": 850,
        "priceRange": "₹500 (Half-Day) • ₹850 (Full-Day 8 hrs)",
        "distance": "0.9 km away",
        "location": "Phase 5, Mohali",
        "experience": "9 years exp",
        "phone": "+91 98141 66778",
        "whatsapp": "919814166778",
        "features": ["Verified & Police Checked Helpers", "Lifting Straps & Trolleys Included", "Punctual 8-Hour Workday"],
        "id_verified": True,
        "bg_checked": True,
        "insured": True,
        "badges": ["ID Verified", "Background Checked", "Rated 4.5+", "Insured Work"],
        "subServices": [
            "House Shifting & Loading",
            "Heavy Furniture Moving",
            "Construction & Debris Cleanup",
            "Renovation Helper",
            "Garden Soil & Yard Labour",
            "Daily Wage General Helper"
        ]
    },
    {
        "id": "labour-2",
        "service": "Labour Work",
        "service_slug": "labour-work",
        "name": "Tricity Rapid Helpers & Shifting Crew",
        "rating": 4.8,
        "reviews_count": 190,
        "price": "₹800/day (2 helpers ₹1,500)",
        "price_val": 800,
        "priceRange": "₹500 (Half-Day) • ₹800 (Full-Day 8 hrs)",
        "distance": "1.8 km away",
        "location": "Sector 20, Chandigarh",
        "experience": "8 years exp",
        "phone": "+91 98767 77889",
        "whatsapp": "919876777889",
        "features": ["Furniture Disassembly & Loading", "Luggage & Warehouse Shifting", "Honest & Hardworking Workers"],
        "id_verified": True,
        "bg_checked": True,
        "insured": True,
        "badges": ["ID Verified", "Background Checked", "Rated 4.5+", "Insured Work"],
        "subServices": [
            "House Shifting & Loading",
            "Heavy Furniture Moving",
            "Construction & Debris Cleanup",
            "Renovation Helper",
            "Garden Soil & Yard Labour",
            "Daily Wage General Helper"
        ]
    },
    {
        "id": "labour-3",
        "service": "Labour Work",
        "service_slug": "labour-work",
        "name": "ProClean Construction & Yard Helpers",
        "rating": 4.8,
        "reviews_count": 145,
        "price": "₹850/day (Debris Truck Extra)",
        "price_val": 850,
        "priceRange": "₹500 (Half-Day) • ₹850 (Full-Day)",
        "distance": "2.3 km away",
        "location": "Sector 70, Mohali",
        "experience": "11 years exp",
        "phone": "+91 98885 88990",
        "whatsapp": "919888588990",
        "features": ["Post-Construction Deep Hauling", "Demolition Waste & Yard Disposal", "Equipped with Shovels & Barrows"],
        "id_verified": True,
        "bg_checked": True,
        "insured": True,
        "badges": ["ID Verified", "Background Checked", "Rated 4.5+", "Insured Work"],
        "subServices": [
            "House Shifting & Loading",
            "Heavy Furniture Moving",
            "Construction & Debris Cleanup",
            "Renovation Helper",
            "Garden Soil & Yard Labour",
            "Daily Wage General Helper"
        ]
    }
]

# =============================================================================
# 2. FLASK API ROUTES
# =============================================================================

@app.route("/")
def index():
    """Serves the single-page frontend application."""
    return render_template("index.html")


@app.route("/admin")
def serve_admin():
    """Serves the plain, fast administration portal."""
    return render_template("admin.html")


@app.route("/assets/<path:filename>")
def serve_assets(filename):
    """Serves static assets (logos, images, etc.) from the assets folder."""
    return send_from_directory("assets", filename)


@app.route("/api/services", methods=["GET"])
def get_services():
    """
    GET /api/services
    Returns the list of the 6 core services supported in Mohali/Chandigarh.
    """
    return jsonify({
        "success": True,
        "city": "Mohali & Chandigarh (Tricity)",
        "count": len(SERVICES),
        "services": SERVICES
    }), 200


@app.route("/api/providers/<service>", methods=["GET"])
def get_providers_by_service(service):
    """
    GET /api/providers/<service>
    Returns 3 to 4 dummy providers for the requested service.
    Accepts slug (e.g. 'ac-repair') or category name (e.g. 'AC Repair') or 'all'.
    """
    service_clean = service.strip().lower()
    
    if service_clean in ("all", "*", ""):
        matched = PROVIDERS
    else:
        # Match against service slug or lowercase service name (support both 'cab' and 'cab-booking')
        if service_clean in ("cab", "cab-booking"):
            matched = [
                p for p in PROVIDERS
                if p["service_slug"] in ("cab", "cab-booking") or p["service"].lower() in ("cab", "cab booking")
            ]
        elif service_clean in ("labour", "labour-work"):
            matched = [
                p for p in PROVIDERS
                if p["service_slug"] in ("labour", "labour-work") or p["service"].lower() in ("labour", "labour work")
            ]
        else:
            matched = [
                p for p in PROVIDERS
                if p["service_slug"] == service_clean or p["service"].lower() == service_clean
            ]
    
    # Filter by ID Verified if query param is passed
    id_verified_param = request.args.get("id_verified", "").strip().lower()
    if id_verified_param in ("true", "1", "yes"):
        matched = [p for p in matched if p.get("id_verified", False)]

    # Filter by Gender (Any, Male, Female)
    gender_param = request.args.get("gender", "").strip().lower()
    if gender_param in ("male", "female"):
        matched = [p for p in matched if p.get("gender", "").lower() == gender_param]

    return jsonify({
        "success": True,
        "service_requested": service,
        "count": len(matched),
        "providers": matched
    }), 200


@app.route("/api/book", methods=["POST"])
def create_booking():
    """
    POST /api/book
    Accepts JSON payload:
    {
        "service": "Plumber",
        "provider_id": "plumb-1",
        "provider_name": "Mohali ZenPlumb Services",
        "name": "John Doe",
        "phone": "9876543210",
        "address": "Flat 302, Sector 70, Mohali",
        "date": "2026-11-02",
        "time_slot": "Morning (09:00 AM - 12:00 PM)",
        "notes": "Optional comments"
    }
    """
    data = request.get_json(silent=True) or request.form.to_dict()
    
    if not data:
        return jsonify({"success": False, "error": "No data received. Please provide JSON payload."}), 400
    
    # Required fields validation
    name = (data.get("name") or "").strip()
    phone = (data.get("phone") or "").strip()
    address = (data.get("address") or "").strip()
    date_val = (data.get("date") or "").strip()
    time_slot = (data.get("time_slot") or "").strip()
    service = (data.get("service") or "").strip()
    
    if not name:
        return jsonify({"success": False, "error": "Please provide your full name."}), 400
    if not phone or len(phone) < 10:
        return jsonify({"success": False, "error": "Please provide a valid 10-digit phone number."}), 400
    if not address:
        return jsonify({"success": False, "error": "Please provide your sector/address in Mohali or Chandigarh."}), 400
    if not date_val:
        return jsonify({"success": False, "error": "Please select a booking date."}), 400
    if not time_slot:
        return jsonify({"success": False, "error": "Please select a preferred time slot."}), 400
    if not service:
        return jsonify({"success": False, "error": "Service category is required."}), 400
    
    provider_id = data.get("provider_id", "")
    provider_name = data.get("provider_name", "")
    
    # If provider_name is missing, look it up
    provider = next((p for p in PROVIDERS if p["id"] == provider_id), None)
    if provider:
        provider_name = provider["name"]
        price = provider["price"]
    else:
        price = data.get("price", "Standard Service Rate")
    
    # Generate Unique Booking ID e.g. ZS-78241
    random_num = random.randint(10000, 99999)
    booking_id = f"ZS-{random_num}"
    
    booking_record = {
        "booking_id": booking_id,
        "service": service,
        "provider_id": provider_id,
        "provider_name": provider_name,
        "customer_name": name,
        "customer_phone": phone,
        "customer_address": address,
        "booking_date": date_val,
        "time_slot": time_slot,
        "notes": data.get("notes", "").strip(),
        "status": "Confirmed",
        "price": price,
        "created_at": datetime.now().strftime("%Y-%m-%d %I:%M %p")
    }
    
    # Store in session list (newest first)
    BOOKINGS.insert(0, booking_record)

    # Sync to SQLite bookings table for Customer and Partner Dashboards
    try:
        conn = auth_db.get_db()
        cur = conn.cursor()
        cust_id = session.get("user_id") or f"guest-{phone}"
        is_cab = 1 if service.lower() in ("cab", "cab booking") else 0
        cur.execute("SELECT id FROM users WHERE role = 'partner' AND (id = ? OR category = ?) LIMIT 1",
                    (provider_id, "cab" if is_cab else service.lower().replace(" ", "-")))
        matched_partner = cur.fetchone()
        assigned_partner_id = matched_partner["id"] if matched_partner else (provider_id or "demo-partner-02")
        trip_otp = f"{random.randint(1000, 9999)}"

        cur.execute("""
        INSERT INTO bookings (
            id, customer_id, customer_name, customer_phone, customer_address,
            partner_id, service_slug, service_name, booking_date, time_slot,
            notes, price, status, created_at, is_cab, pickup, drop_loc, otp
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?, ?, ?)
        """, (
            booking_id, cust_id, name, phone, address,
            assigned_partner_id, service.lower().replace(" ", "-"), service, date_val, time_slot,
            data.get("notes", "").strip(), price, datetime.now().isoformat(),
            is_cab, data.get("pickup", address), data.get("drop", ""), trip_otp
        ))
        conn.commit()
        conn.close()
    except Exception as _sqle:
        print(f"Warning syncing booking to sqlite: {_sqle}")
    
    return jsonify({
        "success": True,
        "message": "Booking scheduled successfully!",
        "booking_id": booking_id,
        "booking": booking_record
    }), 201



# =============================================================================
# AI ESTIMATE PROXY (GEMINI API) & DEMO FALLBACK SAMPLES
# =============================================================================

AI_DEMO_SAMPLES = {
    "plumber": {
        "item": "Chrome Kitchen Sink Faucet & Waste Pipe",
        "problem_summary": "Worn ceramic disc spindle causing persistent dripping from base & leaking slip-joint on P-trap",
        "category": "Plumber",
        "severity": "medium",
        "work_needed": [
            "Shut off under-sink angle isolation stopcock valve",
            "Dismantle aerator, tap handle & spindle head",
            "Replace degraded 35mm ceramic disc cartridge and silicone O-ring seal",
            "Re-align waste P-trap, apply PTFE thread seal tape & pressure test"
        ],
        "parts_or_materials": [
            "Ceramic disc tap cartridge (35mm)",
            "Nitrile rubber O-ring seal kit",
            "PTFE thread seal tape",
            "P-trap compression rubber washer"
        ],
        "estimated_cost_min_inr": 300,
        "estimated_cost_max_inr": 700,
        "estimated_time": "45 – 60 mins",
        "confidence": "high",
        "questions_to_confirm": [
            "Is the water dripping continuously or only when the tap is running?",
            "Is there any dampness or cabinet warping under the sink?"
        ],
        "safety_warning": ""
    },
    "electrician": {
        "item": "16A Heavy-Duty Modular Switchboard Socket",
        "problem_summary": "Loose terminal screw causing internal sparking, terminal overheating and carbon discoloration",
        "category": "Electrician",
        "severity": "high",
        "work_needed": [
            "Isolate sub-circuit breaker at main distribution panel",
            "Verify zero residual voltage with calibrated neon phase tester",
            "Cut back brittle heat-damaged wire ends and strip clean copper core",
            "Install new 16A modular 3-pin socket with spring-loaded brass terminals"
        ],
        "parts_or_materials": [
            "16A modular 3-pin switch socket (Anchor / Havells)",
            "1.5m 2.5 sq.mm heat-resistant FRLS copper wire",
            "Brass terminal lugs & insulation sleeve"
        ],
        "estimated_cost_min_inr": 250,
        "estimated_cost_max_inr": 600,
        "estimated_time": "30 – 45 mins",
        "confidence": "high",
        "questions_to_confirm": [
            "Did the sub-circuit MCB or inverter trip when the socket sparked?",
            "Do you notice any burning plastic odor?"
        ],
        "safety_warning": "ELECTRICAL HAZARD: Switch off the main MCB power switch immediately. Do not touch bare terminals or plug in heavy appliances until inspected by a certified electrician."
    },
    "carpenter": {
        "item": "Flush Bedroom Door & Mortise Lock Mechanism",
        "problem_summary": "Swollen moisture-expanded wooden door rubbing floor jamb; latch bolt misaligned with strike plate",
        "category": "Carpenter",
        "severity": "medium",
        "work_needed": [
            "Unmount door from 3 ball-bearing frame hinges",
            "Machine-plane 4mm clearance off bottom and strike edge",
            "Re-align mortise lock strike plate on door frame",
            "Apply moisture-sealer coat to raw planed edges and lubricate lock cylinder"
        ],
        "parts_or_materials": [
            "Reinforced mortise strike plate",
            "Stainless steel 3-inch hinge wood screws",
            "Clear wood grain moisture sealant"
        ],
        "estimated_cost_min_inr": 350,
        "estimated_cost_max_inr": 850,
        "estimated_time": "1 – 1.5 hours",
        "confidence": "high",
        "questions_to_confirm": [
            "Does the door stick primarily at the bottom or along the latch side?",
            "Does the key turn smoothly inside the mortise cylinder?"
        ],
        "safety_warning": ""
    },
    "ac-repair": {
        "item": "Split Air Conditioner Indoor Cooling Unit",
        "problem_summary": "Choked condensate drain trough causing water overflow into room; restricted airflow across dust-clogged evaporator fins",
        "category": "AC Repair",
        "severity": "medium",
        "work_needed": [
            "Unclog condensate drain tray and hose using pressurized jet flush",
            "Deep antibacterial foam wash of indoor cooling coils and blower wheel",
            "Inspect indoor-outdoor flare joints and check suction/discharge gas pressures",
            "Clean and sanitize air intake mesh filters"
        ],
        "parts_or_materials": [
            "Condensate drain hose connector",
            "Antibacterial fin cleaning solution",
            "Filter cleaning mesh clip"
        ],
        "estimated_cost_min_inr": 499,
        "estimated_cost_max_inr": 1199,
        "estimated_time": "1 hour",
        "confidence": "high",
        "questions_to_confirm": [
            "Is water dripping down the wall inside the room?",
            "Is the AC cooling normally or has airflow weakened?"
        ],
        "safety_warning": ""
    },
    "painter": {
        "item": "Interior Wall Plaster & Ceiling Seepage Patch",
        "problem_summary": "Efflorescence bubbling, hairline settlement cracks, and flaking paint over localized damp patch",
        "category": "Painter",
        "severity": "low",
        "work_needed": [
            "Scrape all peeling and chalking paint down to base plaster",
            "Treat underlying moisture with penetrating waterproof barrier coat",
            "Apply 2 coats of polymer-modified white wall putty and machine sand flat (180 grit)",
            "Apply interior acrylic primer followed by 2 topcoats matching existing wall color"
        ],
        "parts_or_materials": [
            "Waterproof acrylic putty (2kg)",
            "Damp-block acrylic wall primer (1L)",
            "Interior luxury emulsion matching shade"
        ],
        "estimated_cost_min_inr": 650,
        "estimated_cost_max_inr": 1850,
        "estimated_time": "2 – 3 hours",
        "confidence": "high",
        "questions_to_confirm": [
            "Has the source of moisture/leakage behind this wall been resolved?",
            "Do you have the paint code or leftover paint from the original wall painting?"
        ],
        "safety_warning": ""
    }
}

AI_INSTALLATION_DEMO_SAMPLES = {
    "ac-repair": {
        "item": "1.5 Ton Inverter Split Air Conditioner",
        "problem_summary": "Complete outdoor condenser bracket mounting, indoor backplate leveling, copper refrigeration line routing, nitrogen leak check & vacuum degassing",
        "category": "AC Repair",
        "service_type": "installation",
        "severity": "medium",
        "work_needed": [
            "Drill 75mm core passage through wall for suction/liquid lines and drain pipe",
            "Secure indoor backplate using heavy-duty masonry anchors and level alignment",
            "Mount outdoor condensing unit on anti-vibration powder-coated steel cantilever brackets",
            "Flare 1/4-inch and 1/2-inch copper tubing, attach brass union nuts and wrap nitrile insulation",
            "Deep vacuum refrigeration cycle to 500 microns with 2-stage rotary pump and pressure test"
        ],
        "parts_or_materials": [
            "Heavy-duty powder-coated outdoor wall brackets & vibration dampening rubber pads",
            "3m twin insulated refrigerant copper pipes (0.8mm wall gauge)",
            "3-core 2.5 sq.mm outdoor interconnecting FRLS copper electrical cable",
            "Reinforced corrugated PVC condensate drain pipe & wrapping vinyl tape"
        ],
        "installation_labor_min_inr": 999,
        "installation_labor_max_inr": 1499,
        "material_cost_min_inr": 2200,
        "material_cost_max_inr": 3800,
        "estimated_cost_min_inr": 3199,
        "estimated_cost_max_inr": 5299,
        "estimated_time": "2 – 3 hours",
        "confidence": "high",
        "questions_to_confirm": [
            "Is there a dedicated 16A power socket and MCB near the indoor installation point?",
            "What is the approximate distance between the indoor unit and outdoor condenser location?"
        ],
        "safety_warning": "Ensure outdoor condenser bracket is anchored into load-bearing brick/concrete wall. Keep children away from outdoor installation ledge."
    },
    "carpenter": {
        "item": "Modular Sliding Wardrobe / Custom Wall Unit",
        "problem_summary": "Full precision assembly and wall alignment of modular cabinet carcass, hydraulic soft-close sliding tracks, adjustable internal shelving & exterior laminate trim",
        "category": "Carpenter",
        "service_type": "installation",
        "severity": "low",
        "work_needed": [
            "Assemble engineered carcass panels with concealed cam-locks and wooden dowels",
            "Level and anchor back-wall support battens with laser plumb-line accuracy",
            "Mount heavy-duty top and bottom dual sliding tracks and ball-bearing rollers",
            "Fit hydraulic soft-close damping dampers and anti-jump guide blocks",
            "Fine-tune door gap tolerances and apply protective edge-banding seals"
        ],
        "parts_or_materials": [
            "Heavy-duty top & bottom aluminum sliding roller track channel set",
            "Concealed hydraulic soft-close hinges & anti-slam dampers",
            "High-tensile zinc-plated wood screws, L-brackets & wall anchor plugs",
            "PVC edge-banding tape & structural polyurethane adhesive"
        ],
        "installation_labor_min_inr": 1500,
        "installation_labor_max_inr": 2800,
        "material_cost_min_inr": 4500,
        "material_cost_max_inr": 9500,
        "estimated_cost_min_inr": 6000,
        "estimated_cost_max_inr": 12300,
        "estimated_time": "4 – 6 hours",
        "confidence": "high",
        "questions_to_confirm": [
            "Is the floor and wall surface finished and level at the target wardrobe location?",
            "Do you require internal motion-sensor LED lighting strip channels?"
        ],
        "safety_warning": ""
    },
    "plumber": {
        "item": "25L Storage Geyser & Premium Bathroom Sanitary Fittings",
        "problem_summary": "Structural wall mounting of 25L storage water heater, SS braided inlet/outlet flexi connection pipes, brass multi-function safety relief valve & isolation angle stopcocks",
        "category": "Plumber",
        "service_type": "installation",
        "severity": "medium",
        "work_needed": [
            "Drill precision holes through bathroom ceramic tile using carbide-tipped drill bit",
            "Insert heavy-duty metal expansion sleeve fasteners to support 45kg loaded water weight",
            "Connect braided SS 304 food-grade inlet/outlet flexible hoses to hot & cold lines",
            "Install 8-bar calibrated brass multi-function pressure safety relief valve",
            "Fill geyser tank, inspect hydraulic pressure for zero leaks and demonstrate operation"
        ],
        "parts_or_materials": [
            "2x SS 304 high-pressure braided flexible connection hoses (18-inch)",
            "Calibrated 8-bar brass multi-function safety relief & drain valve",
            "Chrome-plated brass angle stopcock valves with escutcheon wall plates",
            "PTFE thread seal tape & high-strength metal expansion fasteners"
        ],
        "installation_labor_min_inr": 450,
        "installation_labor_max_inr": 850,
        "material_cost_min_inr": 950,
        "material_cost_max_inr": 1850,
        "estimated_cost_min_inr": 1400,
        "estimated_cost_max_inr": 2700,
        "estimated_time": "1 – 1.5 hours",
        "confidence": "high",
        "questions_to_confirm": [
            "Are the concealed plumbing inlet/outlet female threaded sockets already positioned in the wall?",
            "What is the current water supply pressure (overhead tank vs booster pump)?"
        ],
        "safety_warning": "ELECTRICAL & SCALD HAZARD: Do NOT turn on electric geyser power switch until tank is completely filled with water and tested for zero dry-fire."
    },
    "electrician": {
        "item": "Heavy-Duty Inverter & Battery Backup Station / Ceiling Fan",
        "problem_summary": "Dedicated distribution board bypass wiring, high-amp battery interconnect cabling, MCB changeover switch fitting, ceiling fan downrod assembly & balancing",
        "category": "Electrician",
        "service_type": "installation",
        "severity": "medium",
        "work_needed": [
            "Identify and segregate essential inverter load sub-circuits at distribution panel",
            "Install 32A manual/auto changeover MCB with dedicated neutral isolation",
            "Crimp 25 sq.mm pure copper flexible battery interconnect cables with heavy brass lugs",
            "Mount inverter trolley and test automatic main-to-battery transfer timing",
            "Assemble and dynamic-balance ceiling fan downrod and canopy shroud"
        ],
        "parts_or_materials": [
            "32A double-pole changeover MCB switch (Schneider / Havells)",
            "25 sq.mm heavy-duty battery interconnect cables with heat-shrink lugs",
            "6 sq.mm FRLS pure copper input/output mains cabling",
            "Heavy-duty ceiling fan safety wire clamp & downrod bolt"
        ],
        "installation_labor_min_inr": 350,
        "installation_labor_max_inr": 750,
        "material_cost_min_inr": 800,
        "material_cost_max_inr": 1800,
        "estimated_cost_min_inr": 1150,
        "estimated_cost_max_inr": 2550,
        "estimated_time": "1 – 1.5 hours",
        "confidence": "high",
        "questions_to_confirm": [
            "How many lights and fans do you plan to run on the inverter backup backup circuit?",
            "Is the battery installation location well-ventilated?"
        ],
        "safety_warning": "HIGH CURRENT HAZARD: Inverter batteries can produce intense short-circuit currents. Keep tools insulated and isolate mains before wiring."
    },
    "painter": {
        "item": "Fresh Interior Room Putty, Primer & Emulsion Application",
        "problem_summary": "Full room surface preparation, 2 coats of water-resistant acrylic wall putty sanding, acrylic deep-penetrating primer and 2 coats of washable luxury interior emulsion",
        "category": "Painter",
        "service_type": "installation",
        "severity": "low",
        "work_needed": [
            "Mask floor borders, switch plates, door frames and windows with painter tape",
            "Apply 1st leveler coat of polymer-modified white wall putty across all plaster",
            "Machine-sand with 150-grit paper and apply 2nd fine-finish skim coat of putty",
            "Apply water-thinnable interior acrylic wall primer coat and allow 4-hr curing",
            "Apply 2 uniform coats of premium washable acrylic emulsion with microfibre roller"
        ],
        "parts_or_materials": [
            "Polymer-modified white acrylic wall putty (20kg bag)",
            "Interior deep-penetrating water-thinnable wall primer (4L)",
            "Premium washable interior emulsion paint matching customer chosen shade (10L)",
            "Protective floor drop sheets & masking tape rolls"
        ],
        "installation_labor_min_inr": 900,
        "installation_labor_max_inr": 1900,
        "material_cost_min_inr": 1600,
        "material_cost_max_inr": 3600,
        "estimated_cost_min_inr": 2500,
        "estimated_cost_max_inr": 5500,
        "estimated_time": "1 – 2 days",
        "confidence": "high",
        "questions_to_confirm": [
            "Are there any damp or water seepage spots on the walls requiring waterproofing first?",
            "Have you finalized the brand and finish (matte, silk, or sheen)?"
        ],
        "safety_warning": ""
    }
}

def get_demo_estimate(description="", estimate_type="repair", room_size="", item_model="", space_readiness=""):
    desc = f"{description or ''} {item_model or ''} {room_size or ''}".lower()
    is_installation = (estimate_type or "").lower() == "installation"

    # Category determination
    if any(k in desc for k in ["ac", "cooling", "air conditioner", "compressor", "chilled", "ton", "split ac", "duct"]):
        cat = "ac-repair"
    elif any(k in desc for k in ["wood", "door", "lock", "cabinet", "wardrobe", "table", "chair", "bed", "furniture", "hinge", "drawer", "plywood"]):
        cat = "carpenter"
    elif any(k in desc for k in ["electric", "spark", "switch", "socket", "wire", "mcb", "shock", "light", "fan", "current", "inverter"]):
        cat = "electrician"
    elif any(k in desc for k in ["paint", "wall", "plaster", "seepage", "damp", "crack", "whitewash", "flaking", "putty"]):
        cat = "painter"
    else:
        cat = "plumber"

    if is_installation:
        sample = dict(AI_INSTALLATION_DEMO_SAMPLES.get(cat, AI_INSTALLATION_DEMO_SAMPLES["ac-repair"]))
        if item_model:
            sample["item"] = f"{item_model.strip()} Installation"
        if room_size or space_readiness:
            extra_info = []
            if room_size:
                extra_info.append(f"Room size: {room_size.strip()}")
            if space_readiness:
                extra_info.append(f"Site condition: {space_readiness.strip()}")
            sample["problem_summary"] = f"{sample['problem_summary']} ({', '.join(extra_info)})"
        return sample
    else:
        sample = dict(AI_DEMO_SAMPLES.get(cat, AI_DEMO_SAMPLES["plumber"]))
        sample["service_type"] = "repair"
        sample["installation_labor_min_inr"] = 0
        sample["installation_labor_max_inr"] = 0
        sample["material_cost_min_inr"] = 0
        sample["material_cost_max_inr"] = 0
        return sample


# =============================================================================
# GEMINI API CLIENT & DIAGNOSTICS HELPER
# =============================================================================
def call_gemini_api(payload, model="gemini-2.5-flash", timeout=20):
    """
    Reusable helper to execute Gemini REST calls with granular error diagnostics.
    Returns: (success: bool, data_or_err: dict|str, error_type: str|None, status_code: int)
    """
    api_key = os.environ.get("GEMINI_API_KEY", "").strip().strip("'").strip('"')
    if not api_key or api_key == "YOUR_GEMINI_API_KEY_HERE" or api_key.startswith("your_"):
        return False, "GEMINI_API_KEY is missing or unconfigured in .env", "MISSING_KEY", 400

    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST"
    )

    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            return True, data, None, 200
    except urllib.error.HTTPError as e:
        status_code = e.code
        err_msg = ""
        try:
            err_body = json.loads(e.read().decode("utf-8"))
            err_msg = err_body.get("error", {}).get("message", "")
        except Exception:
            err_msg = str(e.reason)

        if status_code in (400, 401, 403) and ("API_KEY_INVALID" in err_msg or "not valid" in err_msg.lower() or "forbidden" in err_msg.lower()):
            return False, f"Invalid or unauthorized Gemini API key ({err_msg})", "INVALID_KEY", status_code
        elif status_code == 429:
            return False, f"Gemini API quota exceeded ({err_msg})", "QUOTA_EXCEEDED", 429
        elif status_code == 400:
            return False, f"Gemini API bad request ({err_msg})", "BAD_REQUEST", 400
        else:
            return False, f"Gemini API HTTP {status_code}: {err_msg}", "HTTP_ERROR", status_code
    except urllib.error.URLError as e:
        return False, f"Network failure connecting to Gemini API: {str(e.reason)}", "NETWORK_ERROR", 503
    except TimeoutError:
        return False, "Network timeout connecting to Gemini API", "TIMEOUT", 504
    except Exception as e:
        return False, f"Unexpected error calling Gemini API: {str(e)}", "UNKNOWN", 500


@app.route("/api/health", methods=["GET"])
def health_check():
    """
    GET /api/health
    Returns server health, key presence status (never exposes the key),
    and performs a fast tiny test call to Gemini 2.5 Flash if a real key is present.
    """
    raw_key = os.environ.get("GEMINI_API_KEY", "").strip().strip("'").strip('"')
    is_present = bool(raw_key)
    is_configured = bool(raw_key and raw_key != "YOUR_GEMINI_API_KEY_HERE" and not raw_key.startswith("your_"))
    
    health_data = {
        "status": "healthy",
        "server": "ZenServe Mohali & Chandigarh",
        "port": 5000,
        "gemini": {
            "key_present": is_present,
            "key_configured": is_configured,
            "model": "gemini-2.5-flash",
            "test_call": None
        }
    }

    if is_configured:
        ping_payload = {
            "contents": [{"parts": [{"text": "Reply with ok"}]}],
            "generationConfig": {"maxOutputTokens": 5}
        }
        success, res, err_type, code = call_gemini_api(ping_payload, model="gemini-2.5-flash", timeout=5)
        if success:
            health_data["gemini"]["test_call"] = {
                "success": True,
                "status_code": 200,
                "message": "Gemini 2.5 Flash test call succeeded."
            }
        else:
            health_data["gemini"]["test_call"] = {
                "success": False,
                "status_code": code,
                "error_type": err_type,
                "message": str(res)
            }
    else:
        health_data["gemini"]["test_call"] = {
            "success": False,
            "status_code": 400,
            "error_type": "MISSING_OR_PLACEHOLDER_KEY",
            "message": "GEMINI_API_KEY is not configured in .env (running in Demo mode)"
        }

    return jsonify(health_data), 200

@app.route("/api/estimate", methods=["POST"])
def ai_estimate_proxy():
    """
    POST /api/estimate
    Backend proxy for Gemini API (gemini-2.5-flash) multimodal estimation.
    Accepts:
    {
        "images": ["data:image/jpeg;base64,...", ...],
        "description": "User description",
        "area": "Phase 7, Mohali",
        "estimate_type": "repair" | "installation",
        "room_size": "10x12 ft Bedroom",
        "item_model": "1.5 Ton Split AC (Daikin)",
        "space_readiness": "Fresh Wall"
    }
    Never exposes API keys to client-side. Falls back to realistic demo estimation
    with is_demo: True if key is unconfigured, device offline, or API error occurs.
    """
    data = request.get_json(silent=True) or {}
    images = data.get("images", [])
    description = (data.get("description") or "").strip()
    area = (data.get("area") or "Mohali / Chandigarh").strip()
    estimate_type = (data.get("estimate_type") or "repair").strip().lower()
    room_size = (data.get("room_size") or "").strip()
    item_model = (data.get("item_model") or "").strip()
    space_readiness = (data.get("space_readiness") or "").strip()

    if not images or not isinstance(images, list):
        return jsonify({
            "success": False,
            "error": "Please provide at least one photo or video frame for estimation."
        }), 400

    api_key = os.environ.get("GEMINI_API_KEY", "").strip().strip("'").strip('"')
    is_real_key = bool(api_key and api_key != "YOUR_GEMINI_API_KEY_HERE" and not api_key.startswith("your_"))

    system_instruction_text = (
        "You are a home-services estimator for India. Look at the images and identify "
        "the item, the damage or installation needed, and the best-matching service category from: "
        "Plumber, Electrician, AC Repair, Carpenter, Painter, Home Cleaning, Labour Work, Computer Service. "
        "Reply ONLY in valid JSON with these keys: item, problem_summary, category, service_type ('repair' or 'installation'), "
        "severity (low/medium/high), work_needed (array of steps), parts_or_materials (array), "
        "estimated_cost_min_inr, estimated_cost_max_inr, installation_labor_min_inr, installation_labor_max_inr, "
        "material_cost_min_inr, material_cost_max_inr, estimated_time, confidence (low/medium/high), "
        "questions_to_confirm (array), safety_warning (string or empty). "
        "If service_type is 'installation', estimate installation/fitting labor charges and typical material costs separately, "
        "and ensure estimated_cost_min_inr = installation_labor_min_inr + material_cost_min_inr and "
        "estimated_cost_max_inr = installation_labor_max_inr + material_cost_max_inr."
    )

    demo_err_reason = None
    err_type_detected = None

    if is_real_key:
        try:
            parts = []
            if estimate_type == "installation":
                user_prompt = (
                    f"Customer requests NEW INSTALLATION estimate in Tricity (Mohali/Chandigarh). "
                    f"Item / Model: {item_model or 'Not specified'}. "
                    f"Room / Area dimensions: {room_size or 'Standard size'}. "
                    f"Space readiness: {space_readiness or 'General'}. "
                    f"Customer notes: {description or 'None'}. "
                    f"Location/City: {area}. "
                    "Analyze the attached image(s) or video frame(s) to verify location readiness and provide "
                    "separate installation labor charges and typical material costs in Indian Rupees (INR)."
                )
            else:
                user_prompt = (
                    f"Customer problem description: {description or 'Damage/repair inspection needed'}. "
                    f"Location/City: {area}. "
                    "Analyze the attached image(s) or video frame(s) and provide the repair estimation in Indian Rupees (INR)."
                )
            parts.append({"text": user_prompt})

            for img_str in images[:6]:
                if not isinstance(img_str, str):
                    continue
                if "," in img_str:
                    header, b64_data = img_str.split(",", 1)
                    mime_type = "image/jpeg"
                    if "png" in header.lower():
                        mime_type = "image/png"
                    elif "webp" in header.lower():
                        mime_type = "image/webp"
                else:
                    b64_data = img_str
                    mime_type = "image/jpeg"

                parts.append({
                    "inline_data": {
                        "mime_type": mime_type,
                        "data": b64_data.strip()
                    }
                })

            gemini_payload = {
                "system_instruction": {
                    "parts": [{"text": system_instruction_text}]
                },
                "contents": [
                    {"parts": parts}
                ],
                "generationConfig": {
                    "temperature": 0.2,
                    "responseMimeType": "application/json"
                }
            }

            # Call Gemini 2.5 Flash
            success, res, err_type, code = call_gemini_api(gemini_payload, model="gemini-2.5-flash", timeout=25)
            if success and isinstance(res, dict):
                candidates = res.get("candidates", [])
                if candidates and "content" in candidates[0]:
                    cand_parts = candidates[0]["content"].get("parts", [])
                    if cand_parts and "text" in cand_parts[0]:
                        raw_text = cand_parts[0]["text"].strip()
                        clean_text = re.sub(r"^```(?:json)?\s*", "", raw_text, flags=re.MULTILINE)
                        clean_text = re.sub(r"```\s*$", "", clean_text, flags=re.MULTILINE).strip()
                        parsed_result = json.loads(clean_text)
                        if isinstance(parsed_result, dict) and "category" in parsed_result:
                            parsed_result["service_type"] = estimate_type
                            return jsonify({
                                "success": True,
                                "is_demo": False,
                                "estimate": parsed_result
                            }), 200
            else:
                demo_err_reason = str(res)
                err_type_detected = err_type
                print(f"[Gemini Estimate Error] {err_type}: {demo_err_reason}")

        except Exception as api_err:
            demo_err_reason = str(api_err)
            print("[Gemini Estimate Exception]", api_err)
    else:
        demo_err_reason = "GEMINI_API_KEY is missing or unconfigured in .env"
        err_type_detected = "MISSING_KEY"

    # GRACEFUL DEMO / OFFLINE ESTIMATE FALLBACK
    demo_sample = get_demo_estimate(
        description=description,
        estimate_type=estimate_type,
        room_size=room_size,
        item_model=item_model,
        space_readiness=space_readiness
    )

    if description and not ("User noted:" in demo_sample.get("problem_summary", "")):
        demo_sample["problem_summary"] = f"{demo_sample['problem_summary']} (User noted: '{description}')"

    return jsonify({
        "success": True,
        "is_demo": True,
        "demo_reason": demo_err_reason or "Demo mode active (Tricity verified baseline)",
        "error_type": err_type_detected,
        "estimate": demo_sample
    }), 200

@app.route("/api/bookings", methods=["GET"])
def get_bookings():
    """
    GET /api/bookings
    Returns all session bookings.
    """
    return jsonify({
        "success": True,
        "count": len(BOOKINGS),
        "bookings": BOOKINGS
    }), 200



# =============================================================================
# VOICE ASSISTANT & MULTILINGUAL GEMINI PROXY (Requirement: POST /api/assistant)
# =============================================================================

# Code Comment: MODIFY_LANGUAGES_HERE
# ZenServe supported languages list for voice & text AI processing:
SUPPORTED_VOICE_LANGUAGES = ["English", "Hindi", "Punjabi", "Bhojpuri"]

# Code Comment: MODIFY_AI_PROMPT_HERE
# System instruction given to Gemini for intent detection & home-service classification:
ASSISTANT_SYSTEM_INSTRUCTION = (
    "You are ZenServe's friendly assistant for an Indian home-services app. "
    "The user may speak English, Hindi, Punjabi or Bhojpuri, including Hinglish and mixed speech. "
    "Understand the problem and reply ONLY in valid JSON with keys: "
    "detected_language, understood_problem, category (one of: Plumber, Electrician, AC Repair, "
    "Carpenter, Painter, Home Cleaning, Labour Work, Personal Chef, Barber at Home, Massage Therapy, "
    "Blood Test, Cab, Computer Service, Camera Rental, Home Tuition, Emergency, Unknown), "
    "urgency (low/medium/high/emergency), reply_text (short, 2 sentences max, in the user's selected language, simple words), "
    "follow_up_question (one short question or empty), safety_tip (short tip or empty). "
    "If the user describes danger such as fire, gas leak, an accident, a medical emergency or feeling unsafe, "
    "set category to Emergency and urgency to emergency."
)

OFFLINE_FALLBACK_PATTERNS = [
    {
        "category": "Emergency",
        "urgency": "emergency",
        "keywords": ["emergency", "police", "ambulance", "fire", "accident", "danger", "gas leak", "khatra", "aag", "cylinder", "khoon", "help", "unsafe", "current", "ਅੱਗ", "ਖ਼ਤਰਾ", "ਪੁਲਿਸ", "ਐਂਬੂਲੈਂਸ", "ਖੂਨ", "हादसा", "खून", "आग"],
        "tip": "Move to a safe place immediately and stay calm.",
        "reply": {
            "en": "This sounds like an emergency! Please stay in a safe place while we help connect emergency services.",
            "hi": "यह आपातकालीन स्थिति लग रही है! कृपया सुरक्षित स्थान पर रहें, हम सहायता उपलब्ध करा रहे हैं।",
            "pa": "ਇਹ ਇੱਕ ਐਮਰਜੈਂਸੀ ਲੱਗ ਰਹੀ ਹੈ! ਕਿਰਪਾ ਕਰਕੇ ਸੁਰੱਖਿਅਤ ਥਾਂ 'ਤੇ ਰਹੋ, ਅਸੀਂ ਤੁਰੰਤ ਮਦਦ ਭੇਜ ਰਹੇ ਹਾਂ।",
            "bho": "ई आपातकाल बुझा रहल बा! रउआ सुरक्षित जगह पर रहीं, हमनी के तुरंत मदद भेज रहल बानी।"
        }
    },
    {
        "category": "Plumber",
        "urgency": "medium",
        "keywords": ["nal", "pani", "leak", "tap", "pipe", "drain", "tank", "geyser", "commode", "sink", "flush", "टोंटी", "नल", "पाइप", "ਪਾਣੀ", "ਨਲਕਾ", "ਟੂਟੀ", "ਚੁਵਤ बा"],
        "tip": "Turn off the main water valve to prevent further flooding.",
        "reply": {
            "en": "I understand there is a plumbing issue with water leaking. Would you like to view verified plumbers?",
            "hi": "मैं समझ गया कि पानी या नलसाजी की समस्या है। क्या आप उपलब्ध प्लंबर देखना चाहते हैं?",
            "pa": "ਮੈਂ ਸਮਝ ਗਿਆ ਕਿ ਪਾਣੀ ਜਾਂ ਟੂਟੀ ਲੀਕ ਹੋਣ ਦੀ ਸਮੱਸਿਆ ਹੈ। ਕੀ ਤੁਸੀਂ ਪਲੰਬਰ ਵੇਖਣਾ ਚਾਹੁੰਦੇ ਹੋ?",
            "bho": "हम समझ गइनी कि पानी भा नल के समस्या बा। का रउआ प्लंबर लोग के लिस्ट देखे के बा?"
        }
    },
    {
        "category": "Electrician",
        "urgency": "high",
        "keywords": ["bijli", "light", "wire", "switch", "fuse", "mcb", "fan", "spark", "current", "short circuit", "बिजली", "पंखा", "ਤਾਰਾਂ", "ਬਿਜਲੀ", "ਸਵਿੱਚ", "ਸ਼ਾਰਟ ਸਰਕਟ", "बत्ती"],
        "tip": "Switch off the main MCB power before touching any exposed wires.",
        "reply": {
            "en": "I've detected an electrical issue. Please do not touch bare wires while we arrange an electrician.",
            "hi": "बिजली या वायरिंग में खराबी पहचानी गई है। कृपया मेन स्विच बंद कर लें, हम इलेक्ट्रीशियन दिखा रहे हैं।",
            "pa": "ਬਿਜਲੀ ਦੀ ਸਮੱਸਿਆ ਦੀ ਪਛਾਣ ਹੋ ਗਈ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਮੇਨ ਸਵਿੱਚ ਬੰਦ ਕਰੋ, ਅਸੀਂ ਇਲੈਕਟ੍ਰੀਸ਼ੀਅਨ ਦਿਖਾ ਰਹੇ ਹਾਂ।",
            "bho": "बिजली के खराबी समझ में आ गइल बा। कृपया मेन स्विच बंद करीं, हम इलेक्ट्रीशियन देखावत बानी।"
        }
    },
    {
        "category": "AC Repair",
        "urgency": "medium",
        "keywords": ["ac", "air conditioner", "cooling", "gas filling", "compressor", "thanda", "एसी", "ठंडा", "ਏਸੀ", "ਕੂਲਿੰਗ"],
        "tip": "Turn off the AC unit to protect the compressor from damage.",
        "reply": {
            "en": "Got it, your AC is not cooling properly. We can book a verified technician for inspection.",
            "hi": "समझ गया, आपका एसी सही से ठंडा नहीं कर रहा है। हम एसी मैकेनिक उपलब्ध करा सकते हैं।",
            "pa": "ਸਮਝ ਗਿਆ, ਤੁਹਾਡਾ ਏਸੀ ਠੰਢਾ ਨਹੀਂ ਕਰ ਰਿਹਾ। ਅਸੀਂ ਏਸੀ ਟੈਕਨੀਸ਼ੀਅਨ ਬੁੱਕ ਕਰ ਸਕਦੇ ਹਾਂ।",
            "bho": "समझ गइनी, रउआ एसी ठीक से ठंडा नईखे करत। हम मैकेनिक के जानकारी देखावत बानी।"
        }
    },
    {
        "category": "Carpenter",
        "urgency": "low",
        "keywords": ["door", "wood", "furniture", "darwaza", "almirah", "lock", "tarkhan", "bed", "darwaja", "बढ़ई", "ਦਰਵਾਜ਼ਾ", "ਤਰਖਾਣ", "काठ", "ताला"],
        "tip": "Keep the broken wooden pieces together for precise re-fitting.",
        "reply": {
            "en": "I can help you with carpentry and furniture repair. Let's find a skilled carpenter.",
            "hi": "दरवाजे या फर्नीचर मरम्मत की जरूरत है। आइए एक कुशल बढ़ई की सेवा लेते हैं।",
            "pa": "ਦਰਵਾਜ਼ੇ ਜਾਂ ਫਰਨੀਚਰ ਮੁਰੰਮਤ ਦੀ ਲੋੜ ਹੈ। ਆਓ ਪ੍ਰਮਾਣਿਤ ਤਰਖਾਣ ਵੇਖੀਏ।",
            "bho": "दरवाजा भा काठ के काम खातिर हम रउआ के बढ़िया बढ़ई देखावत बानी।"
        }
    },
    {
        "category": "Cab",
        "urgency": "medium",
        "keywords": ["cab", "taxi", "ride", "auto", "airport", "station", "drive", "गाड़ी", "कैब", "ਕੈਬ", "ਟੈਕਸੀ", "ਸਵਾਰੀ"],
        "tip": "Keep your destination and luggage ready for quick boarding.",
        "reply": {
            "en": "Ready to book a ride across Mohali and Chandigarh with zero surge pricing.",
            "hi": "मोहाली और चंडीगढ़ में बिना सर्ज चार्ज के कैब बुक करने के लिए तैयार हैं।",
            "pa": "ਮੋਹਾਲੀ ਅਤੇ ਚੰਡੀਗੜ੍ਹ ਵਿੱਚ ਬਿਨਾਂ ਸਰਜ ਤੋਂ ਕੈਬ ਬੁੱਕ ਕਰਨ ਲਈ ਤਿਆਰ ਹਾਂ।",
            "bho": "मोहाली आ चंडीगढ़ में बिना कवनो फालतू किराया के गाड़ी बुक करे खातिर तैयार बानी।"
        }
    },
    {
        "category": "Home Cleaning",
        "urgency": "low",
        "keywords": ["clean", "safai", "dust", "sofa", "deep clean", "bathroom", "सफाई", "ਸਫ਼ਾਈ", "झाड़ू"],
        "tip": "Remove fragile items beforehand for quick and safe deep cleaning.",
        "reply": {
            "en": "We offer deep home, sofa, and kitchen cleaning. Would you like to schedule cleaners?",
            "hi": "घर, सोफा और बाथरूम की गहरी सफाई उपलब्ध है। क्या आप सफाईकर्मी बुक करना चाहते हैं?",
            "pa": "ਘਰ ਅਤੇ ਸੋਫ਼ੇ ਦੀ ਸਫ਼ਾਈ ਲਈ ਪ੍ਰਮਾਣਿਤ ਕਲੀਨਰ ਬੁੱਕ ਕਰ ਸਕਦੇ ਹੋ।",
            "bho": "घर, सोफा आ किचन के सफाई खातिर हम सेवा देखावत बानी।"
        }
    }
]

def fallback_assistant_match(message, language):
    msg_lower = (message or "").lower()
    matched_cat = "Unknown"
    matched_urgency = "low"
    matched_reply = "I understand you need assistance with your home. Let me show you our services."
    matched_tip = ""
    follow_up = "Could you tell me a little more about what needs fixing?"

    lang_key = language if language in ["hi", "pa", "bho"] else "en"

    for pat in OFFLINE_FALLBACK_PATTERNS:
        if any(kw in msg_lower for kw in pat["keywords"]):
            matched_cat = pat["category"]
            matched_urgency = pat["urgency"]
            matched_reply = pat["reply"].get(lang_key, pat["reply"]["en"])
            matched_tip = pat.get("tip", "")
            follow_up = "Would you like to book a service now?" if matched_urgency != "emergency" else ""
            break

    if matched_cat == "Unknown":
        if lang_key == "hi":
            matched_reply = "नमस्ते! मैं आपकी समस्या समझ रहा हूँ। क्या आप मुझे थोड़ा और विस्तार से बता सकते हैं?"
            follow_up = "क्या आपको प्लंबर, इलेक्ट्रीशियन या कैब की जरूरत है?"
        elif lang_key == "pa":
            matched_reply = "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡੀ ਮਦਦ ਕਰਨ ਲਈ ਤਿਆਰ ਹਾਂ। ਕਿਰਪਾ ਕਰਕੇ ਥੋੜ੍ਹਾ ਹੋਰ ਦੱਸੋ।"
            follow_up = "ਕੀ ਤੁਹਾਨੂੰ ਪਲੰਬਰ, ਬਿਜਲੀ ਮਿਸਤਰੀ ਜਾਂ ਕੈਬ ਚਾਹੀਦੀ ਹੈ?"
        elif lang_key == "bho":
            matched_reply = "प्रणाम! हम रउआ के बात सुन रहल बानी। का समस्या बा तनी और बताईं?"
            follow_up = "का रउआ नलसाज, बिजली मिस्त्री भा गाड़ी के खोज करत बानी?"

    return {
        "detected_language": language,
        "understood_problem": message[:80],
        "category": matched_cat,
        "urgency": matched_urgency,
        "reply_text": matched_reply,
        "follow_up_question": follow_up,
        "safety_tip": matched_tip
    }

@app.route("/api/assistant", methods=["POST"])
def ai_assistant_proxy():
    """
    POST /api/assistant
    Multilingual AI Voice & Text Assistant proxy for Gemini API.
    Reads GEMINI_API_KEY from .env (never exposed client-side).
    Supports English, Hindi, Punjabi, and Bhojpuri with context memory.
    """
    data = request.get_json(silent=True) or {}
    user_text = (data.get("message") or "").strip()
    selected_language = (data.get("language") or "en").strip()
    history = data.get("history", [])

    if not user_text:
        return jsonify({
            "success": False,
            "error": "Empty message received"
        }), 400

    api_key = os.environ.get("GEMINI_API_KEY", "").strip().strip("'").strip('"')
    is_real_key = bool(api_key and api_key != "YOUR_GEMINI_API_KEY_HERE" and not api_key.startswith("your_"))

    categories_list = [
        "Plumber", "Electrician", "AC Repair", "Carpenter", "Painter",
        "Home Cleaning", "Labour Work", "Personal Chef", "Barber at Home",
        "Massage Therapy", "Blood Test", "Cab", "Computer Service",
        "Camera Rental", "Home Tuition", "Emergency", "Unknown"
    ]

    err_reason = None
    err_type_detected = None

    if is_real_key:
        try:
            recent_context = []
            if isinstance(history, list):
                for item in history[-6:]:
                    role = item.get("role", "user")
                    text = item.get("text", "")
                    if text:
                        recent_context.append(f"{role.capitalize()}: {text}")

            context_str = "\n".join(recent_context) if recent_context else "No prior history."

            user_prompt = (
                f"User Selected Language: {selected_language}\n"
                f"ZenServe Categories: {', '.join(categories_list)}\n"
                f"Recent Conversation History:\n{context_str}\n\n"
                f"New User Query: \"{user_text}\"\n\n"
                "Understand the problem and respond strictly in JSON according to system instructions."
            )

            payload = {
                "system_instruction": {
                    "parts": [{"text": ASSISTANT_SYSTEM_INSTRUCTION}]
                },
                "contents": [{
                    "role": "user",
                    "parts": [{"text": user_prompt}]
                }],
                "generationConfig": {
                    "temperature": 0.2,
                    "maxOutputTokens": 600,
                    "responseMimeType": "application/json"
                }
            }

            success, gemini_res, err_type, code = call_gemini_api(payload, model="gemini-2.5-flash", timeout=15)
            if success and isinstance(gemini_res, dict):
                candidates = gemini_res.get("candidates", [])
                if candidates:
                    raw_text = candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "").strip()
                    clean_json_str = re.sub(r"^```(?:json)?\s*", "", raw_text, flags=re.MULTILINE)
                    clean_json_str = re.sub(r"```\s*$", "", clean_json_str, flags=re.MULTILINE).strip()
                    parsed = json.loads(clean_json_str)

                    return jsonify({
                        "success": True,
                        "is_offline": False,
                        "response": parsed
                    }), 200
            else:
                err_reason = str(gemini_res)
                err_type_detected = err_type
                print(f"[Gemini Assistant Error] {err_type}: {err_reason}")

        except Exception as e:
            err_reason = str(e)
            print("[Gemini Assistant Exception]", e)
    else:
        err_reason = "GEMINI_API_KEY is missing or unconfigured in .env"
        err_type_detected = "MISSING_KEY"

    # Offline / Demo Fallback Mode
    fallback_response = fallback_assistant_match(user_text, selected_language)
    return jsonify({
        "success": True,
        "is_offline": True,
        "offline_reason": err_reason or "Local offline intelligence active",
        "error_type": err_type_detected,
        "response": fallback_response
    }), 200

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print(f"===============================================================")
    print(f"🚀 Zenserve Server running at: http://127.0.0.1:{port}")
    print(f"Serving Mohali & Chandigarh Local Services")
    print(f"===============================================================")
    app.run(host="0.0.0.0", port=port, debug=True)
