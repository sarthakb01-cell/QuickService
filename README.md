# 🏠 Zenserve - All-in-One Home & Local Services for Mohali / Chandigarh

> **"Your Trusted Tricity Neighborhood Services Hub"**  
> A fast, modern, and mobile-friendly web application connecting residents of **Mohali and Chandigarh** with verified local service providers and instant direct bookings.

---

## 📌 Project Overview

Zenserve solves the local home maintenance and transit puzzle for residents across the Tricity (Mohali & Chandigarh). Instead of juggling multiple disjointed apps or paying steep aggregator markups, Zenserve provides direct, transparent access to verified professionals across 6 core service categories:

1. **❄️ AC Repair**: Jet-pump cleaning, gas leak detection, compressor repair & seasonal servicing.
2. **🔧 Plumber**: Pipe leakages, bathroom sanitary fittings, water motor and tank repairs.
3. **⚡ Electrician**: MCB box fixes, wiring, switchboards, ceiling fans and appliance installation.
4. **🧹 Home Cleaner**: Deep apartment cleaning, sofa & carpet shampooing, kitchen degreasing.
5. **🚖 Cab**: Instant simulated ride booking with Bike, Auto, Mini, and Sedan, real-time fare/ETA estimation, and live trip status simulation.
6. **🩸 Blood Test at Home**: Certified phlebotomist home sample collection with digital reports in 6 hrs.

---

## 🛠️ Tech Stack & Architecture

- **Backend**: Python 3 + **Flask** lightweight REST API (`app.py`).
- **Data Layer**: In-memory Python data store with 24 verified dummy providers located across authentic Mohali Phases and Chandigarh Sectors. No database setup needed.
- **Frontend**: Single-page `templates/index.html` (HTML5, responsive CSS3, and vanilla JavaScript ES6+).
- **Communication**: Asynchronous Fetch API for seamless dynamic interactions without full page reloads.

---

## 🚀 How to Run the Project Locally

### 1. Requirements
- Python 3.8+ installed on your system.
- Flask installed:
  ```bash
  pip install flask
  ```

### 2. Start the Server
Open your terminal in the project directory (`Erric NIP`):
```bash
python app.py
```

You will see:
```text
===============================================================
🚀 Zenserve Server running at: http://127.0.0.1:5000
Serving Mohali & Chandigarh Local Services
===============================================================
```

### 3. Open in Browser
Visit **[http://127.0.0.1:5000](http://127.0.0.1:5000)** in Google Chrome, Microsoft Edge, Firefox, or Safari.

---

## 🌐 Flask REST API Endpoints

| Method | Endpoint | Description | Sample Response |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Serves the single-page application | HTML Frontend |
| `GET` | `/api/services` | Returns the 6 core Tricity services | `{"success": true, "services": [...]}` |
| `GET` | `/api/providers/<service>` | Returns 3–4 providers for a service (or `all`) | `{"success": true, "providers": [...]}` |
| `POST` | `/api/book` | Creates a new service appointment with Booking ID | `{"success": true, "booking_id": "ZS-..."}` |
| `GET` | `/api/bookings` | Returns all session appointments | `{"success": true, "bookings": [...]}` |

---

## ✨ Key Features

1. **Clean, Modern & Mobile-Friendly Homepage**:
   - Hero section with real-time live search bar and one-tap quick chips.
   - 6 interactive service cards with custom icons and starting rates.
2. **Provider Directory**:
   - 3 to 4 dummy providers per category with names, star ratings, review counts, starting prices, and distance tags (`📍 1.2 km away • Phase 7, Mohali`).
   - Filter tabs toolbar to switch effortlessly between services.
3. **Interactive Booking Modal**:
   - Pre-fills chosen provider and service category.
   - Captures customer name, 10-digit mobile number, address/sector, preferred date, time slot, and optional instructions.
   - Real-time client-side validation.
4. **Instant Confirmation Screen**:
   - Displays a unique generated **Booking ID** (e.g. `ZS-78421`).
   - Detailed summary card with scheduled slot, address, and zero-advance notice (*"Pay after work"*).
5. **Session "My Bookings" Page**:
   - Accessible via the top navigation bar at any time with an active counter badge.
   - Shows all appointments scheduled during the session.
6. **Simulated "Book a Cab" Feature**:
   - Dedicated Cab booking section opened by clicking the "Cab" category card or top navigation.
   - Pickup & Drop inputs with quick popular location chips and "Current Location" helper.
   - 4 Ride types: **Bike** (₹7/km), **Auto** (₹11/km), **Mini** (₹15/km), and **Sedan** (₹19/km).
   - Dynamic fake fare calculation, route distance, and driver ETA.
   - "Trip in progress" screen with driver details, car model, cab number, Call button, and 4-digit start OTP.
   - Automatic live status progression every few seconds: *Driver on the way* &rarr; *Driver arrived* &rarr; *Trip started* &rarr; *Trip completed*.

7. **⚡ AI Home Repair Cost & Service Estimator (Gemini AI)**:
   - Upload up to 3 photos or 1 short video (< 20s / 20MB) of damage or an installation spot.
   - Browser-side video frame extraction (4–6 keyframes resized up to 1024px max width).
   - Multimodal analysis via Google Gemini API (`gemini-2.5-flash`) through the secure backend proxy `POST /api/estimate`.
   - Automatic detection of item, problem, severity badge, step-by-step repair tasks, required materials/parts, Indian Rupee cost range (₹), and safety alerts.
   - Seamless transition to filtered provider lists or pre-filled direct booking.
   - Guaranteed zero-downtime offline demo fallback with `[Demo mode]` tag.

---

## 🔐 Security & Environment Variables

> ⚠️ **CRITICAL SECURITY NOTE**: Never commit `.env` or hardcode sensitive API keys in client-side code!
> The `.env` file contains your private `GEMINI_API_KEY` and is strictly ignored in `.gitignore`.

### Configuring your Gemini API Key:
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and insert your API key from [Google AI Studio](https://aistudio.google.com):
   ```env
   GEMINI_API_KEY=AIzaSy...your_real_key_here
   ```
3. If no key is set or the device is offline, Zenserve automatically activates **Demo Mode** with realistic local samples so all features remain functional for demonstrations.


---

## 📂 Project Structure

```text
├── app.py              # Flask server and REST API routes
├── templates/
│   └── index.html      # Complete frontend (HTML, CSS, and Vanilla JS)
├── index.html          # Root fallback frontend
└── README.md           # Documentation and run instructions
```
