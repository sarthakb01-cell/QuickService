/**
 * ZenServe Auth Views & Dynamic Dashboard Controller
 * Powers Customer Dashboard, Partner Dashboard, Booking Sync,
 * Reviews, Document Tracker, and Demo Controls.
 */

(function() {
  'use strict';

  // ---------------------------------------------------------------------------
  // 1. CUSTOMER DASHBOARD RENDERING
  // ---------------------------------------------------------------------------
  window.renderCustomerDashboard = async function() {
    const container = document.getElementById('customerDashboardContent');
    if (!container) return;

    container.innerHTML = `
      <div style="text-align:center; padding:3rem 1rem; color:var(--text-soft);">
        <div style="font-size:2rem; margin-bottom:0.75rem;">⏳</div>
        <div>Loading your bookings, trips and saved data...</div>
      </div>
    `;

    try {
      const res = await fetch('/api/customer/dashboard');
      if (res.status === 401 || res.status === 403) {
        window.location.hash = '#/auth/customer-login';
        return;
      }
      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      const u = data.user;
      const bookings = data.bookings || [];
      const trips = data.trips || [];
      const addresses = data.saved_addresses || [];
      const contacts = data.saved_emergency_contacts || [];
      const estimates = data.ai_estimates || [];

      container.innerHTML = `
        <!-- Welcome Hero -->
        <div class="cust-dash-hero">
          <div class="cdh-left">
            <div class="cdh-avatar">${(u.name || 'User')[0]}</div>
            <div>
              <h2 class="cdh-name">Welcome back, ${u.name}! 👋</h2>
              <div class="cdh-phone">📱 +91 ${u.phone} &bull; <span class="badge-role-tag">Customer Account</span></div>
            </div>
          </div>
          <div class="cdh-right">
            <button type="button" class="btn-primary" onclick="window.location.hash='#/'" style="padding:0.6rem 1.25rem;">
              <span>⚡</span> Book New Service
            </button>
          </div>
        </div>

        <!-- Quick Service Shortcuts Row -->
        <div class="cust-shortcuts-bar">
          <span class="csb-title">Quick Book:</span>
          <a href="#/service/plumber" class="csb-item"><span>🔧</span> Plumber</a>
          <a href="#/service/electrician" class="csb-item"><span>⚡</span> Electrician</a>
          <a href="#/cab" class="csb-item"><span>🚖</span> Cab</a>
          <a href="#/service/ac-repair" class="csb-item"><span>❄️</span> AC Repair</a>
          <a href="#/service/home-cleaning" class="csb-item"><span>🧹</span> Cleaning</a>
        </div>

        <!-- Dashboard Tabs Header -->
        <div class="cust-tabs-header" role="tablist">
          <button type="button" class="cust-tab-btn active" data-cust-tab="bookings" onclick="switchCustomerTab('bookings')">
            📅 My Bookings (${bookings.length})
          </button>
          <button type="button" class="cust-tab-btn" data-cust-tab="trips" onclick="switchCustomerTab('trips')">
            🚖 My Cab Trips (${trips.length})
          </button>
          <button type="button" class="cust-tab-btn" data-cust-tab="places" onclick="switchCustomerTab('places')">
            📍 Saved Places &amp; Contacts
          </button>
          <button type="button" class="cust-tab-btn" data-cust-tab="estimates" onclick="switchCustomerTab('estimates')">
            ⚡ AI Estimates &amp; Favorites
          </button>
          <button type="button" class="cust-tab-btn" data-cust-tab="profile" onclick="switchCustomerTab('profile')">
            ⚙️ Settings
          </button>
        </div>

        <!-- TAB 1: BOOKINGS -->
        <div id="custTabBookings" class="cust-tab-pane active">
          ${renderCustomerBookingsList(bookings)}
        </div>

        <!-- TAB 2: CAB TRIPS -->
        <div id="custTabTrips" class="cust-tab-pane" style="display:none;">
          ${renderCustomerTripsList(trips)}
        </div>

        <!-- TAB 3: SAVED PLACES & CONTACTS -->
        <div id="custTabPlaces" class="cust-tab-pane" style="display:none;">
          <div class="places-grid">
            <div class="places-col">
              <div class="pc-header">
                <h3>🏠 Saved Addresses</h3>
                <button type="button" class="btn-secondary btn-sm" onclick="promptAddAddress()">+ Add New</button>
              </div>
              <div id="custAddressList" class="places-cards">
                ${addresses.length ? addresses.map((a, i) => `
                  <div class="saved-item-card">
                    <div class="sic-icon">📍</div>
                    <div class="sic-body">
                      <div class="sic-label">${a.label} ${a.is_default ? '<span class="badge-default">Default</span>' : ''}</div>
                      <div class="sic-desc">${a.address}</div>
                    </div>
                  </div>
                `).join('') : '<p class="empty-hint">No saved addresses yet. Save your home or office address for fast 1-tap bookings.</p>'}
              </div>
            </div>

            <div class="places-col">
              <div class="pc-header">
                <h3>🚨 Emergency SOS Contacts</h3>
                <span class="pc-badge">Synced with SOS Button</span>
              </div>
              <div id="custContactsList" class="places-cards">
                ${contacts.length ? contacts.map(c => `
                  <div class="saved-item-card">
                    <div class="sic-icon">👤</div>
                    <div class="sic-body">
                      <div class="sic-label">${c.name}</div>
                      <div class="sic-desc">${c.phone}</div>
                    </div>
                  </div>
                `).join('') : '<p class="empty-hint">No emergency contacts saved. Use the SOS panel to add trusted contacts.</p>'}
              </div>
            </div>
          </div>
        </div>

        <!-- TAB 4: AI ESTIMATES -->
        <div id="custTabEstimates" class="cust-tab-pane" style="display:none;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
            <h3 style="margin:0;">⚡ Past Gemini AI Estimates</h3>
            <button type="button" class="btn-primary btn-sm" onclick="if(typeof openAiEstimateModal==='function') openAiEstimateModal()">
              + Run New AI Estimate
            </button>
          </div>
          <div class="estimates-list">
            ${estimates.length ? estimates.map(e => `
              <div class="estimate-item-card">
                <div class="eic-header">
                  <strong>${e.item}</strong>
                  <span class="eic-price">${e.price}</span>
                </div>
                <div class="eic-body">${e.problem}</div>
                <div class="eic-footer">
                  <span class="eic-date">📅 ${e.date || 'Recent session'}</span>
                  <button type="button" class="btn-secondary btn-sm" onclick="window.location.hash='#/service/plumber'">Find Matching Provider &rsaquo;</button>
                </div>
              </div>
            `).join('') : '<p class="empty-hint">No saved estimates. Snap a photo of any home issue to get instant AI pricing.</p>'}
          </div>
        </div>

        <!-- TAB 5: PROFILE & SETTINGS -->
        <div id="custTabProfile" class="cust-tab-pane" style="display:none;">
          <!-- Dual Profile & Instant Mode Switcher Card -->
          <div class="dual-profile-switch-card">
            <div class="dpsc-info">
              <span class="dpsc-badge">Dual Profile Enabled</span>
              <h3 class="dpsc-title">Provide services on ZenServe?</h3>
              <p class="dpsc-desc">Your phone number (+91 ${u.phone}) holds both Customer and Partner profiles. Switch instantly to access your Partner operations console, active jobs, and earnings.</p>
            </div>
            <button type="button" class="btn-primary" onclick="window.switchUserMode('partner')" style="white-space:nowrap; padding:0.75rem 1.4rem;">
              <span>🔄</span> Switch to Partner mode
            </button>
          </div>

          <div class="settings-card">
            <h3>Profile Information</h3>
            <div class="setting-row">
              <span class="sr-label">Full Name:</span>
              <span class="sr-val"><strong>${u.name}</strong></span>
            </div>
            <div class="setting-row">
              <span class="sr-label">Mobile Number:</span>
              <span class="sr-val">${u.phone}</span>
            </div>
            <div class="setting-row">
              <span class="sr-label">Email:</span>
              <span class="sr-val">${u.email || 'Not specified'}</span>
            </div>
            <div class="setting-row">
              <span class="sr-label">Language:</span>
              <span class="sr-val">English / Regional (Tricity)</span>
            </div>
            <div style="margin-top:2rem; padding-top:1.5rem; border-top:1px solid var(--border); display:flex; justify-content:space-between; align-items:center;">
              <span style="color:var(--text-soft); font-size:0.88rem;">Need to sign out from this device?</span>
              <button type="button" class="btn-secondary" onclick="window.logout(true)" style="color:var(--danger); border-color:rgba(255,59,48,0.3);">
                Log Out
              </button>
            </div>
          </div>
        </div>
      `;
    } catch (err) {
      container.innerHTML = `
        <div style="background:rgba(255,59,48,0.1); border:1px solid var(--danger); padding:1.5rem; border-radius:var(--radius-md); text-align:center;">
          <div style="color:var(--danger); font-weight:800; font-size:1.1rem; margin-bottom:0.5rem;">Could not load dashboard</div>
          <div style="color:var(--text-soft); margin-bottom:1rem;">${err.message || 'Please verify that the Flask server is running.'}</div>
          <button type="button" class="btn-secondary" onclick="renderCustomerDashboard()">Retry</button>
        </div>
      `;
    }
  };

  function renderCustomerBookingsList(bookings) {
    if (!bookings.length) {
      return `
        <div class="empty-state-box">
          <div class="esb-icon">📅</div>
          <h3>No bookings yet</h3>
          <p>Book verified professionals for home repairs, cleaning, tests and more.</p>
          <button type="button" class="btn-primary" onclick="window.location.hash='#/'">Explore Services</button>
        </div>
      `;
    }

    return `
      <div class="bookings-grid">
        ${bookings.map(b => {
          const statusClass = b.status === 'completed' ? 'badge-completed' : (b.status === 'cancelled' ? 'badge-cancelled' : 'badge-pending');
          const isCompleted = b.status === 'completed';
          const isPending = b.status === 'pending' || b.status === 'accepted';
          return `
            <div class="booking-card-item">
              <div class="bci-top">
                <div>
                  <span class="bci-id">#${b.id}</span>
                  <h4 class="bci-service">${b.service_name}</h4>
                  <div class="bci-provider">👤 ${b.customer_name || 'Assigned Provider'}</div>
                </div>
                <div style="text-align:right;">
                  <span class="status-pill ${statusClass}">${b.status.toUpperCase()}</span>
                  <div class="bci-price">${b.price || '₹299 onwards'}</div>
                </div>
              </div>
              <div class="bci-details">
                <div>📅 <strong>Date:</strong> ${b.booking_date} (${b.time_slot})</div>
                <div>📍 <strong>Address:</strong> ${b.customer_address}</div>
                ${b.notes ? `<div>📝 <em>"${b.notes}"</em></div>` : ''}
              </div>
              <div class="bci-actions">
                ${isCompleted ? `
                  ${b.rating ? `
                    <div class="bci-rated">⭐ You rated this: ${b.rating}/5 "${b.review || ''}"</div>
                  ` : `
                    <button type="button" class="btn-primary btn-sm" onclick="openRateBookingModal('${b.id}')">
                      ★ Rate &amp; Review
                    </button>
                  `}
                  <button type="button" class="btn-secondary btn-sm" onclick="window.location.hash='#/service/${b.service_slug}'">
                    Rebook Service
                  </button>
                ` : `
                  ${isPending ? `
                    <button type="button" class="btn-secondary btn-sm" style="color:var(--danger);" onclick="cancelCustomerBooking('${b.id}')">
                      Cancel Booking
                    </button>
                  ` : ''}
                `}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  function renderCustomerTripsList(trips) {
    if (!trips.length) {
      return `
        <div class="empty-state-box">
          <div class="esb-icon">🚖</div>
          <h3>No cab trips yet</h3>
          <p>Book verified cabs with live GPS tracking, police-verified drivers and emergency SOS.</p>
          <button type="button" class="btn-primary" onclick="window.location.hash='#/cab'">Book a Cab</button>
        </div>
      `;
    }

    return `
      <div class="trips-grid">
        ${trips.map(t => `
          <div class="trip-card-item">
            <div class="tci-header">
              <div>
                <span class="status-pill ${t.status === 'completed' ? 'badge-completed' : 'badge-pending'}">${t.status.toUpperCase()}</span>
                <h4 style="margin:0.35rem 0 0 0;">Trip #${t.id}</h4>
              </div>
              <div class="tci-fare">${t.price || '₹249'}</div>
            </div>
            <div class="tci-route">
              <div class="tci-pt">🟢 <strong>Pickup:</strong> ${t.pickup || 'Sector 70, Mohali'}</div>
              <div class="tci-pt">🔴 <strong>Drop:</strong> ${t.drop_loc || 'Chandigarh Airport'}</div>
            </div>
            <div class="tci-driver-info">
              <div>🚖 <strong>Vehicle:</strong> Maruti WagonR (CH 01 CB 3920)</div>
              <div>🔑 <strong>Start OTP:</strong> <strong style="color:var(--accent);">${t.otp || '4829'}</strong></div>
            </div>
            ${t.rating ? `
              <div style="font-size:0.82rem; color:#8F7C3A; margin-top:0.5rem;">
                ★ Review: ${t.rating}/5 &bull; "${t.review || 'Great trip!'}"
              </div>
            ` : `
              <div style="margin-top:0.75rem;">
                <button type="button" class="btn-secondary btn-sm" onclick="openRateBookingModal('${t.id}')">
                  ★ Rate Driver
                </button>
              </div>
            `}
          </div>
        `).join('')}
      </div>
    `;
  }

  window.switchCustomerTab = function(tabName) {
    document.querySelectorAll('.cust-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-cust-tab') === tabName);
    });
    ['custTabBookings', 'custTabTrips', 'custTabPlaces', 'custTabEstimates', 'custTabProfile'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = 'none';
    });
    const map = {
      'bookings': 'custTabBookings',
      'trips': 'custTabTrips',
      'places': 'custTabPlaces',
      'estimates': 'custTabEstimates',
      'profile': 'custTabProfile'
    };
    const activePane = document.getElementById(map[tabName]);
    if (activePane) activePane.style.display = 'block';
  };

  // ---------------------------------------------------------------------------
  // 2. PARTNER DASHBOARD RENDERING (WORK-FOCUSED DARK BLUE/SLATE ACCENT)
  // ---------------------------------------------------------------------------
  window.renderPartnerDashboard = async function() {
    const container = document.getElementById('partnerDashboardContent');
    if (!container) return;

    container.innerHTML = `
      <div style="text-align:center; padding:3rem 1rem; color:var(--text-soft);">
        <div style="font-size:2rem; margin-bottom:0.75rem;">⏳</div>
        <div>Connecting to Partner Operations Network...</div>
      </div>
    `;

    try {
      const res = await fetch('/api/partner/dashboard');
      if (res.status === 401 || res.status === 403) {
        window.location.hash = '#/auth/partner-login';
        return;
      }
      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      const u = data.user;
      const stats = data.stats;
      const newRequests = data.new_requests || [];
      const myJobs = data.my_jobs || [];
      const completedJobs = data.completed_jobs || [];
      const reviews = data.reviews || [];
      const isApproved = u.verification_status === 'approved';
      const isOnline = stats.is_online;
      const isCabDriver = u.category === 'cab';

      container.innerHTML = `
        <!-- PARTNER LAYOUT: SIDEBAR + MAIN WORK PANEL -->
        <div class="partner-dashboard-wrapper">
          
          <!-- LEFT SIDEBAR -->
          <aside class="partner-sidebar" aria-label="Partner Navigation">
            <div class="ps-profile-card">
              <div class="ps-avatar">${(u.name || 'P')[0]}</div>
              <h3 class="ps-name">${u.name}</h3>
              <div class="ps-category-badge">
                ${isCabDriver ? '🚖 Cab Driver' : '🔧 Service Specialist'} &bull; ★ ${stats.rating}
              </div>
              
              <!-- Online / Offline Toggle Switch -->
              <div class="ps-online-switch-box">
                <span class="ps-status-indicator ${isOnline ? 'online' : 'offline'}"></span>
                <span class="ps-status-text">${isOnline ? 'Accepting Requests' : 'Currently Offline'}</span>
                <button type="button" class="btn-toggle-switch ${isOnline ? 'active' : ''}" onclick="togglePartnerOnlineStatus()" aria-label="Toggle Online Availability">
                  <span class="switch-handle"></span>
                </button>
              </div>

              <!-- Verification Status Pill -->
              <div class="ps-verification-pill ${isApproved ? 'verified' : 'pending'}">
                ${isApproved ? '🛡️ Police Verified &amp; Approved' : '⏳ Verification In Progress'}
              </div>
              ${!isApproved ? `
                <button type="button" class="btn-approve-demo" onclick="approvePartnerDemo()" title="Instantly approve partner in demo mode">
                  ⚡ Click to Approve Instantly (Demo)
                </button>
              ` : ''}

              <!-- Mode Switcher Pill in Partner Sidebar -->
              <div class="ps-mode-switch-box">
                <button type="button" class="btn-partner-switch-mode" onclick="window.switchUserMode('customer')" title="Switch to Customer mode">
                  <span>🔄</span> Switch to Customer mode
                </button>
              </div>
            </div>

            <nav class="ps-nav-list" role="tablist">
              <button type="button" class="ps-nav-item active" data-part-tab="overview" onclick="switchPartnerTab('overview')">
                <span>📊</span> Overview &amp; Stats
              </button>
              <button type="button" class="ps-nav-item" data-part-tab="requests" onclick="switchPartnerTab('requests')">
                <span>🔔</span> New Requests <span class="ps-count-badge">${newRequests.length}</span>
              </button>
              <button type="button" class="ps-nav-item" data-part-tab="jobs" onclick="switchPartnerTab('jobs')">
                <span>📋</span> Active Jobs <span class="ps-count-badge">${myJobs.length}</span>
              </button>
              <button type="button" class="ps-nav-item" data-part-tab="earnings" onclick="switchPartnerTab('earnings')">
                <span>💰</span> Earnings &amp; Payouts
              </button>
              <button type="button" class="ps-nav-item" data-part-tab="reviews" onclick="switchPartnerTab('reviews')">
                <span>⭐</span> Reviews (${reviews.length})
              </button>
              <button type="button" class="ps-nav-item" data-part-tab="profile" onclick="switchPartnerTab('profile')">
                <span>📄</span> Documents &amp; Rates
              </button>
              ${isCabDriver ? `
                <button type="button" class="ps-nav-item" data-part-tab="cab" onclick="switchPartnerTab('cab')">
                  <span>🚖</span> Cab Trip Console
                </button>
              ` : ''}
              <button type="button" class="ps-nav-item ps-logout-btn" onclick="window.logout(true)">
                <span>⎋</span> Log Out
              </button>
            </nav>
          </aside>

          <!-- MAIN OPERATIONS PANEL -->
          <main class="partner-main-panel">
            
            <!-- SECTION 1: OVERVIEW -->
            <div id="partTabOverview" class="part-tab-pane active">
              
              <!-- Metric Stat Cards -->
              <div class="partner-stats-grid">
                <div class="pstat-card">
                  <div class="psc-icon">💼</div>
                  <div class="psc-label">Today's Jobs</div>
                  <div class="psc-val">${stats.today_jobs}</div>
                  <div class="psc-trend">Scheduled for today</div>
                </div>
                <div class="pstat-card">
                  <div class="psc-icon">💰</div>
                  <div class="psc-label">Weekly Earnings</div>
                  <div class="psc-val psc-gold">${stats.weekly_earnings}</div>
                  <div class="psc-trend">Direct UPI Settlements</div>
                </div>
                <div class="pstat-card">
                  <div class="psc-icon">⭐</div>
                  <div class="psc-label">Client Rating</div>
                  <div class="psc-val">${stats.rating}</div>
                  <div class="psc-trend">Based on ${stats.total_reviews} reviews</div>
                </div>
                <div class="pstat-card">
                  <div class="psc-icon">🎯</div>
                  <div class="psc-label">Completion Rate</div>
                  <div class="psc-val">${stats.completion_rate}</div>
                  <div class="psc-trend">Zero cancellation penalty</div>
                </div>
              </div>

              <!-- Quick Action & Incoming Banner -->
              <div class="partner-quick-banner">
                <div>
                  <h3 style="margin:0 0 0.25rem 0; color:#38BDF8;">🚨 Incoming Booking Alerts</h3>
                  <p style="margin:0; font-size:0.86rem; color:var(--text-soft);">
                    You have <strong>${newRequests.length} pending request(s)</strong> waiting for acceptance in Mohali &amp; Chandigarh.
                  </p>
                </div>
                <div style="display:flex; gap:0.5rem; align-items:center;">
                  <button type="button" class="btn-primary btn-sm" onclick="switchPartnerTab('requests')">
                    View Requests &rsaquo;
                  </button>
                  <button type="button" class="btn-secondary btn-sm" onclick="simulateNewIncomingBooking()" title="Generate sample request for testing">
                    ⚡ Simulate Request
                  </button>
                </div>
              </div>

              <!-- Active Jobs Preview -->
              <h3 style="margin:2rem 0 1rem 0;">Current Ongoing &amp; Upcoming Jobs</h3>
              ${renderPartnerJobsList(myJobs)}
            </div>

            <!-- SECTION 2: NEW REQUESTS -->
            <div id="partTabRequests" class="part-tab-pane" style="display:none;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem;">
                <div>
                  <h3 style="margin:0;">Incoming Customer Requests</h3>
                  <p style="margin:0.25rem 0 0 0; color:var(--text-soft); font-size:0.86rem;">
                    Respond quickly to maintain your 98% priority dispatcher score.
                  </p>
                </div>
                <button type="button" class="btn-secondary btn-sm" onclick="simulateNewIncomingBooking()">
                  ⚡ Simulate New Request
                </button>
              </div>
              ${renderPartnerRequestsList(newRequests, isApproved)}
            </div>

            <!-- SECTION 3: MY JOBS -->
            <div id="partTabJobs" class="part-tab-pane" style="display:none;">
              <h3 style="margin:0 0 1rem 0;">Accepted &amp; Ongoing Work Orders</h3>
              ${renderPartnerJobsList(myJobs)}

              <h3 style="margin:2.5rem 0 1rem 0;">Completed Work Orders History (${completedJobs.length})</h3>
              ${renderPartnerCompletedList(completedJobs)}
            </div>

            <!-- SECTION 4: EARNINGS -->
            <div id="partTabEarnings" class="part-tab-pane" style="display:none;">
              <div class="earnings-summary-card">
                <div>
                  <div style="font-size:0.84rem; text-transform:uppercase; color:var(--text-soft); font-weight:800;">Available Payout Balance</div>
                  <div style="font-size:2.2rem; font-weight:900; color:#38BDF8;">${stats.weekly_earnings}</div>
                  <div style="font-size:0.8rem; color:var(--text-soft);">Next auto-settlement: Monday 10:00 AM to HDFC Bank UPI</div>
                </div>
                <button type="button" class="btn-primary" onclick="alert('⚡ Payout request of ' + '${stats.weekly_earnings}' + ' initiated! In demo mode, settlements simulate instant UPI transfer.')">
                  Request Instant Payout
                </button>
              </div>

              <h3 style="margin:2rem 0 1rem 0;">Recent Payout Transactions</h3>
              <div class="payouts-table-card">
                <table class="payouts-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Work Order</th>
                      <th>Customer</th>
                      <th>Method</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Today, 06:15 PM</td>
                      <td>Cab Booking #bk-1002</td>
                      <td>Ravi Kumar</td>
                      <td>Cash / UPI</td>
                      <td><strong>₹240</strong></td>
                      <td><span class="status-pill badge-completed">Settled</span></td>
                    </tr>
                    <tr>
                      <td>Yesterday</td>
                      <td>AC Gas Refill #bk-982</td>
                      <td>Simran Sandhu</td>
                      <td>Direct Pay</td>
                      <td><strong>₹1,850</strong></td>
                      <td><span class="status-pill badge-completed">Settled</span></td>
                    </tr>
                    <tr>
                      <td>28 Oct 2026</td>
                      <td>Tap &amp; Waste Pipe Care #bk-954</td>
                      <td>Vikram Bajaj</td>
                      <td>Direct Pay</td>
                      <td><strong>₹450</strong></td>
                      <td><span class="status-pill badge-completed">Settled</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- SECTION 5: REVIEWS -->
            <div id="partTabReviews" class="part-tab-pane" style="display:none;">
              <div class="reviews-header-card">
                <div class="rhc-score">★ ${stats.rating}</div>
                <div>
                  <h3 style="margin:0 0 0.25rem 0;">Overall Partner Trust Score</h3>
                  <div style="color:var(--text-soft); font-size:0.88rem;">Based on verified customer reviews across Mohali and Chandigarh</div>
                </div>
              </div>
              <div class="reviews-list-grid">
                ${reviews.length ? reviews.map(r => `
                  <div class="partner-review-card">
                    <div class="prc-top">
                      <div class="prc-cust">👤 ${r.customer_name} &bull; <small>${r.service_name}</small></div>
                      <div class="prc-stars">★ ${r.rating}/5</div>
                    </div>
                    <div class="prc-comment">"${r.review || 'Excellent service!'}"</div>
                    <div class="prc-date">${r.created_at ? r.created_at.split('T')[0] : 'Recent'}</div>
                  </div>
                `).join('') : '<p class="empty-hint">No reviews received yet. Deliver great service on your first job to receive your first 5-star rating!</p>'}
              </div>
            </div>

            <!-- SECTION 6: PROFILE & DOCUMENTS -->
            <div id="partTabProfile" class="part-tab-pane" style="display:none;">
              <!-- Dual Profile & Instant Mode Switcher Card -->
              <div class="dual-profile-switch-card partner-style" style="margin-bottom:1.5rem;">
                <div class="dpsc-info">
                  <span class="dpsc-badge" style="background:rgba(56,189,248,0.2); color:#38BDF8; border-color:#38BDF8;">Dual Profile Enabled</span>
                  <h3 class="dpsc-title">Need to book a service for yourself?</h3>
                  <p class="dpsc-desc">Switch interface to Customer mode to book home repairs, tests, cab rides, and view personal bookings under your account (+91 ${u.phone}).</p>
                </div>
                <button type="button" class="btn-primary" onclick="window.switchUserMode('customer')" style="white-space:nowrap; padding:0.75rem 1.4rem;">
                  <span>🔄</span> Switch to Customer mode
                </button>
              </div>

              <div class="partner-doc-card">
                <h3>Verification &amp; Licencing Status</h3>
                <div class="doc-row">
                  <div>
                    <strong>Govt ID Proof (Aadhaar / Voter ID)</strong>
                    <div class="doc-sub">Identity verification with Punjab / Chandigarh database</div>
                  </div>
                  <span class="status-pill badge-completed">✓ Verified</span>
                </div>
                <div class="doc-row">
                  <div>
                    <strong>Police Clearance Certificate</strong>
                    <div class="doc-sub">Clean criminal background check on file (Valid till Jan 2027)</div>
                  </div>
                  <span class="status-pill badge-completed">✓ Verified Clear</span>
                </div>
                <div class="doc-row">
                  <div>
                    <strong>Service Area Coverage</strong>
                    <div class="doc-sub">All Sectors of Mohali (Phase 1–11, Sectors 66–82) &amp; Chandigarh</div>
                  </div>
                  <span class="status-pill badge-pending">Active</span>
                </div>
              </div>
            </div>

            <!-- SECTION 7: CAB DRIVER TRIP CONSOLE (IF CAB DRIVER) -->
            ${isCabDriver ? `
              <div id="partTabCab" class="part-tab-pane" style="display:none;">
                <div class="cab-console-card">
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
                    <div>
                      <h3 style="margin:0; color:#38BDF8;">🚖 Live Cab Driver Dispatch Console</h3>
                      <div style="color:var(--text-soft); font-size:0.86rem;">Vehicle: Maruti WagonR (CH 01 CB 3920)</div>
                    </div>
                    <button type="button" class="btn-primary btn-sm" onclick="triggerPartnerEmergencySos()">
                      🚨 SOS Driver Emergency
                    </button>
                  </div>
                  <div style="background:#0F172A; border:1px solid #1E293B; border-radius:12px; padding:1.25rem; margin-bottom:1rem;">
                    <div style="font-weight:800; color:#F8FAFC; margin-bottom:0.5rem;">Active Navigation Trip</div>
                    <div style="color:#94A3B8; font-size:0.88rem; margin-bottom:0.75rem;">
                      📍 <strong>Pickup:</strong> House 412, Sector 70, Mohali ➔ <strong>Drop:</strong> Chandigarh Airport
                    </div>
                    <div style="display:flex; gap:0.5rem; align-items:center; flex-wrap:wrap;">
                      <input type="text" id="cabConsoleOtpInput" placeholder="Enter Customer 4-digit OTP" class="form-input" style="width:220px;" maxlength="4">
                      <button type="button" class="btn-primary" onclick="verifyCabTripOtpAndStart()">
                        Verify OTP &amp; Start Trip
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ` : ''}

          </main>
        </div>
      `;
    } catch (err) {
      container.innerHTML = `
        <div style="background:rgba(255,59,48,0.1); border:1px solid var(--danger); padding:1.5rem; border-radius:var(--radius-md); text-align:center;">
          <div style="color:var(--danger); font-weight:800; font-size:1.1rem; margin-bottom:0.5rem;">Could not connect to Partner Operations</div>
          <div style="color:var(--text-soft); margin-bottom:1rem;">${err.message || 'Please check if server is active.'}</div>
          <button type="button" class="btn-secondary" onclick="renderPartnerDashboard()">Retry</button>
        </div>
      `;
    }
  };

  function renderPartnerRequestsList(requests, isApproved) {
    if (!requests.length) {
      return `
        <div class="empty-state-box">
          <div class="esb-icon">🔔</div>
          <h3>No pending requests</h3>
          <p>You're all caught up! New customer requests in your area will appear here in real-time.</p>
          <button type="button" class="btn-secondary btn-sm" onclick="simulateNewIncomingBooking()">⚡ Simulate Customer Request</button>
        </div>
      `;
    }

    return `
      <div class="requests-grid">
        ${requests.map(r => `
          <div class="request-card-item">
            <div class="rci-header">
              <div>
                <span class="status-pill badge-pending">NEW REQUEST</span>
                <h4 style="margin:0.35rem 0 0 0;">${r.service_name}</h4>
                <div class="rci-cust">👤 <strong>${r.customer_name}</strong> &bull; +91 ${r.customer_phone}</div>
              </div>
              <div class="rci-price">${r.price || '₹299 onwards'}</div>
            </div>
            <div class="rci-body">
              <div>📅 <strong>Scheduled:</strong> ${r.booking_date} (${r.time_slot})</div>
              <div>📍 <strong>Address:</strong> ${r.customer_address}</div>
              ${r.notes ? `<div>📝 <em>"${r.notes}"</em></div>` : ''}
            </div>
            <div class="rci-footer">
              ${!isApproved ? `
                <div style="color:#F59E0B; font-size:0.8rem; font-weight:700;">
                  ⚠️ Your verification is pending. Click "⚡ Approve Instantly (Demo)" in sidebar to accept jobs.
                </div>
              ` : `
                <button type="button" class="btn-primary btn-sm" onclick="partnerHandleRequest('${r.id}', 'accept')">
                  ✓ Accept Job
                </button>
                <button type="button" class="btn-secondary btn-sm" style="color:var(--danger);" onclick="partnerHandleRequest('${r.id}', 'decline')">
                  ✕ Decline
                </button>
              `}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  function renderPartnerJobsList(jobs) {
    if (!jobs.length) {
      return `
        <div class="empty-hint" style="padding:1.5rem; background:rgba(255,255,255,0.02); border:1px dashed var(--border); border-radius:12px; text-align:center;">
          No active ongoing jobs right now. Check New Requests to accept upcoming work orders.
        </div>
      `;
    }

    return `
      <div class="jobs-grid">
        ${jobs.map(j => `
          <div class="job-card-item">
            <div class="jci-header">
              <div>
                <span class="status-pill badge-ongoing">${j.status.toUpperCase()}</span>
                <h4 style="margin:0.35rem 0 0 0;">${j.service_name}</h4>
                <div style="color:var(--text-soft); font-size:0.85rem;">Client: <strong>${j.customer_name}</strong> (+91 ${j.customer_phone})</div>
              </div>
              <div style="text-align:right;">
                <div style="font-weight:800; color:#38BDF8; font-size:1.15rem;">${j.price}</div>
                ${j.otp ? `<div style="font-size:0.8rem; color:var(--text-soft);">Start OTP: <strong style="color:var(--accent);">${j.otp}</strong></div>` : ''}
              </div>
            </div>
            <div class="jci-body">
              <div>📍 <strong>Address:</strong> ${j.customer_address}</div>
              <div>📅 <strong>Time:</strong> ${j.booking_date} (${j.time_slot})</div>
            </div>
            <div class="jci-footer">
              <button type="button" class="btn-primary btn-sm" onclick="partnerMarkJobComplete('${j.id}')">
                ✓ Mark as Completed
              </button>
              <a href="tel:${j.customer_phone}" class="btn-secondary btn-sm">
                📞 Call Client
              </a>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  function renderPartnerCompletedList(jobs) {
    if (!jobs.length) {
      return `<p class="empty-hint">No completed work orders yet.</p>`;
    }
    return `
      <div class="completed-jobs-list">
        ${jobs.map(j => `
          <div class="completed-job-row">
            <div>
              <strong>${j.service_name} &bull; ${j.customer_name}</strong>
              <div style="color:var(--text-soft); font-size:0.82rem;">Completed on ${j.booking_date} &bull; ${j.customer_address}</div>
            </div>
            <div style="text-align:right;">
              <span class="status-pill badge-completed">Paid</span>
              <div style="font-weight:800; color:#38BDF8;">${j.price}</div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  window.switchPartnerTab = function(tabName) {
    document.querySelectorAll('.ps-nav-item').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-part-tab') === tabName);
    });
    const allPanes = ['partTabOverview', 'partTabRequests', 'partTabJobs', 'partTabEarnings', 'partTabReviews', 'partTabProfile', 'partTabCab'];
    allPanes.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = 'none';
    });
    const map = {
      'overview': 'partTabOverview',
      'requests': 'partTabRequests',
      'jobs': 'partTabJobs',
      'earnings': 'partTabEarnings',
      'reviews': 'partTabReviews',
      'profile': 'partTabProfile',
      'cab': 'partTabCab'
    };
    const target = document.getElementById(map[tabName]);
    if (target) target.style.display = 'block';
  };

  // ---------------------------------------------------------------------------
  // 3. PARTNER ACTION CONTROLLERS
  // ---------------------------------------------------------------------------
  window.partnerHandleRequest = async function(bookingId, action) {
    try {
      const res = await fetch('/api/partner/request-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ booking_id: bookingId, action: action })
      });
      const data = await res.json();
      if (data.success) {
        window.renderPartnerDashboard();
      } else {
        alert(data.error || "Action failed.");
      }
    } catch (e) {
      alert("Error handling request.");
    }
  };

  window.partnerMarkJobComplete = async function(bookingId) {
    if (!confirm("Confirm that this work order has been completed to the customer's satisfaction?")) return;
    try {
      const res = await fetch('/api/partner/complete-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ booking_id: bookingId })
      });
      const data = await res.json();
      if (data.success) {
        alert("🎉 Job marked as completed! Payout added to your balance.");
        window.renderPartnerDashboard();
      } else {
        alert(data.error || "Could not complete job.");
      }
    } catch (e) {
      alert("Error completing job.");
    }
  };

  window.simulateNewIncomingBooking = async function() {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const services = ['Plumber', 'Electrician', 'AC Repair', 'Cab Booking', 'Home Cleaning'];
    const chosen = services[Math.floor(Math.random() * services.length)];
    const names = ['Pooja Verma', 'Gurpreet Singh', 'Manish Sharma', 'Simranjeet Kaur', 'Amit Batra'];
    const chosenName = names[Math.floor(Math.random() * names.length)];
    const areas = ['Phase 7, Mohali', 'Sector 35, Chandigarh', 'Sector 70, Mohali', 'Phase 3B2, Mohali'];

    try {
      await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service: chosen,
          name: chosenName,
          phone: `98140${randomNum}`,
          address: areas[Math.floor(Math.random() * areas.length)],
          date: new Date().toISOString().split('T')[0],
          time_slot: 'Afternoon (01:00 PM - 04:00 PM)',
          notes: 'Customer requested immediate inspection',
          price: '₹349'
        })
      });
      alert(`⚡ Simulated request created from ${chosenName} for ${chosen}! Check New Requests tab.`);
      window.renderPartnerDashboard();
    } catch (e) {
      alert("Could not simulate request.");
    }
  };

  // ---------------------------------------------------------------------------
  // 4. RATE BOOKING MODAL
  // ---------------------------------------------------------------------------
  window.openRateBookingModal = function(bookingId) {
    const modal = document.getElementById('rateBookingModal');
    const input = document.getElementById('rateBookingIdInput');
    if (input) input.value = bookingId;
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  window.submitBookingRating = async function() {
    const bookingId = document.getElementById('rateBookingIdInput')?.value;
    const ratingEl = document.querySelector('input[name="starRating"]:checked');
    const rating = ratingEl ? ratingEl.value : 5;
    const review = (document.getElementById('rateReviewText')?.value || '').trim();

    try {
      const res = await fetch('/api/customer/rate-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ booking_id: bookingId, rating: rating, review: review })
      });
      const data = await res.json();
      if (data.success) {
        alert("Thank you! Your verified rating and review have been submitted.");
        if (typeof closeModal === 'function') closeModal('rateBookingModal');
        window.renderCustomerDashboard();
      } else {
        alert(data.error || "Could not submit rating.");
      }
    } catch (e) {
      alert("Error submitting rating.");
    }
  };

})();
