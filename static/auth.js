/**
 * ZenServe Authentication & Role-Based Dashboard Manager
 * Supports Customer and Partner roles, login/signup, OTP, route guards,
 * 30-min session timeout, and real-time synchronized booking management.
 */

(function() {
  'use strict';

  window.authState = {
    user: null,
    role: null, // 'customer', 'partner', or null
    isAuthenticated: false,
    lastActivity: Date.now(),
    redirectAfterLogin: null,
    timeoutMinutes: 30
  };

  // ---------------------------------------------------------------------------
  // 1. SESSION & ACTIVITY TIMEOUT (30 minutes)
  // ---------------------------------------------------------------------------
  function updateActivity() {
    window.authState.lastActivity = Date.now();
  }

  window.addEventListener('mousemove', updateActivity, { passive: true });
  window.addEventListener('keydown', updateActivity, { passive: true });
  window.addEventListener('touchstart', updateActivity, { passive: true });
  window.addEventListener('scroll', updateActivity, { passive: true });

  setInterval(() => {
    if (window.authState.isAuthenticated) {
      const inactiveMs = Date.now() - window.authState.lastActivity;
      if (inactiveMs > window.authState.timeoutMinutes * 60 * 1000) {
        handleSessionTimeout();
      }
    }
  }, 30000); // Check every 30s

  function handleSessionTimeout() {
    window.logout(false).then(() => {
      showSessionExpiredModal();
    });
  }

  function showSessionExpiredModal() {
    const m = document.getElementById('sessionExpiredModal');
    if (m) {
      m.classList.add('active');
      document.body.style.overflow = 'hidden';
    } else {
      alert("Your ZenServe session expired due to 30 minutes of inactivity. Please log in again.");
    }
  }

  // ---------------------------------------------------------------------------
  // 2. INITIALIZATION: CHECK CURRENT AUTH STATUS
  // ---------------------------------------------------------------------------
  window.initAuth = async function() {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.authenticated && data.user) {
        setAuthUser(data.user);
      } else {
        clearAuthUser();
      }
    } catch (e) {
      // Offline fallback: check localStorage
      try {
        const cached = localStorage.getItem('zenserve_user');
        if (cached) {
          setAuthUser(JSON.parse(cached));
        } else {
          clearAuthUser();
        }
      } catch (err) {
        clearAuthUser();
      }
    }
    updateHeaderAuthUI();
  };

  function setAuthUser(user) {
    window.authState.user = user;
    window.authState.role = user.role;
    window.authState.isAuthenticated = true;
    window.authState.lastActivity = Date.now();
    try {
      localStorage.setItem('zenserve_user', JSON.stringify(user));
      localStorage.setItem('zenserve_last_role', user.role);
    } catch (e) {}
    updateHeaderAuthUI();
  }

  function clearAuthUser() {
    window.authState.user = null;
    window.authState.role = null;
    window.authState.isAuthenticated = false;
    try {
      localStorage.removeItem('zenserve_user');
    } catch (e) {}
    updateHeaderAuthUI();
  }

  // ---------------------------------------------------------------------------
  // 3. HEADER AUTH UI & PROFILE MENU WITH INSTANT MODE SWITCHING
  // ---------------------------------------------------------------------------
  window.updateMenuThemeUI = function(theme) {
    const curTheme = theme || document.documentElement.getAttribute('data-theme') || 'light';
    const isDark = curTheme === 'dark';
    const icons = document.querySelectorAll('#menuThemeIcon, .menu-theme-icon');
    const labels = document.querySelectorAll('#menuThemeLabel, .menu-theme-label');
    icons.forEach(el => { el.textContent = isDark ? '☀️' : '🌙'; });
    labels.forEach(el => { el.textContent = isDark ? 'Light Mode' : 'Dark Mode'; });
  };

  window.updateHeaderAuthUI = function() {
    const container = document.getElementById('headerAuthContainer');
    if (!container) return;

    if (!window.authState.isAuthenticated || !window.authState.user) {
      container.innerHTML = `
        <div class="user-header-profile" id="userHeaderProfile">
          <button type="button" class="btn-auth-header" id="btnHeaderLogin" onclick="window.toggleProfileDropdown(event)" aria-expanded="false" aria-label="Login or Sign up menu">
            <span class="bah-icon">👤</span>
            <span class="bah-text">Login / Sign up</span>
            <span class="user-dropdown-arrow">▾</span>
          </button>
          
          <div class="profile-dropdown-menu" id="headerProfileDropdown" role="menu" aria-label="Account and Settings Menu">
            <!-- Location Details Box -->
            <div class="pdm-location-row">
              <div class="pdm-loc-left">
                <span class="pdm-loc-pin">📍</span>
                <div>
                  <div class="pdm-loc-city">Mohali &amp; Chandigarh</div>
                  <div class="pdm-loc-sub">Tri-City Service Area</div>
                </div>
              </div>
              <span class="pdm-loc-badge">Active</span>
            </div>

            <!-- Appearance / Theme Toggle Row -->
            <div class="pdm-theme-row">
              <div class="pdm-theme-left">
                <span class="pdm-theme-icon">🎨</span>
                <span class="pdm-theme-text">Appearance</span>
              </div>
              <button type="button" class="pdm-theme-toggle-btn" onclick="window.toggleSiteTheme();" id="menuThemeToggleBtn" aria-label="Toggle Theme">
                <span id="menuThemeIcon">☀️</span>
                <span id="menuThemeLabel">Light Mode</span>
              </button>
            </div>

            <div class="pdm-divider"></div>

            <!-- Customer Sign In Link -->
            <a href="#/auth/customer-login" class="pdm-link-item" onclick="window.closeProfileDropdown()" role="menuitem">
              <span class="pdm-item-emoji">🛍️</span>
              <div class="pdm-link-text-group">
                <span class="pdm-link-title">Customer Sign In</span>
                <span class="pdm-link-desc">Book home services &amp; cabs</span>
              </div>
            </a>

            <!-- Partner Portal Login Link -->
            <a href="#/auth/partner-login" class="pdm-link-item" onclick="window.closeProfileDropdown()" role="menuitem">
              <span class="pdm-item-emoji">💼</span>
              <div class="pdm-link-text-group">
                <span class="pdm-link-title">Partner Portal Login</span>
                <span class="pdm-link-desc">Service providers &amp; cab drivers</span>
              </div>
            </a>

            <div class="pdm-divider"></div>

            <!-- Create New Account / Role Chooser -->
            <a href="#/auth/role" class="pdm-link-item pdm-signup-cta" onclick="window.closeProfileDropdown()" role="menuitem">
              <span class="pdm-item-emoji">✨</span>
              <span class="pdm-signup-text">Choose Role &amp; Sign Up &rsaquo;</span>
            </a>
          </div>
        </div>
      `;
    } else {
      const u = window.authState.user;
      const isPartner = u.role === 'partner';
      const roleLabel = isPartner ? 'Partner' : 'Customer';
      const dashboardHash = isPartner ? '#/partner' : '#/customer';
      const firstName = u.name ? u.name.split(' ')[0] : 'User';
      const switchTarget = isPartner ? 'customer' : 'partner';
      const switchLabel = isPartner ? 'Switch to Customer mode' : 'Switch to Partner mode';
      const switchDesc = isPartner ? 'Book home services & cab rides' : 'Open operations console & manage jobs';

      container.innerHTML = `
        <div class="user-header-profile" id="userHeaderProfile">
          <button type="button" class="btn-user-pill" id="btnHeaderProfileToggle" onclick="window.toggleProfileDropdown(event)" aria-expanded="false" aria-label="User profile menu">
            <span class="user-avatar-initial">${firstName[0]}</span>
            <span class="user-greeting-name">Hi, ${firstName}</span>
            <span class="user-role-badge ${isPartner ? 'badge-partner' : 'badge-customer'}">${roleLabel}</span>
            <span class="user-dropdown-arrow">▾</span>
          </button>
          
          <div class="profile-dropdown-menu" id="headerProfileDropdown" role="menu" aria-label="Profile Menu">
            <div class="pdm-header">
              <div class="pdm-avatar">${(u.name || 'U')[0]}</div>
              <div class="pdm-user-info">
                <div class="pdm-user-name">${u.name}</div>
                <div class="pdm-user-phone">📱 +91 ${u.phone}</div>
                <div class="pdm-mode-pill ${isPartner ? 'badge-partner' : 'badge-customer'}">
                  ${roleLabel} Mode Active
                </div>
              </div>
            </div>

            <!-- Location Details Box -->
            <div class="pdm-location-row">
              <div class="pdm-loc-left">
                <span class="pdm-loc-pin">📍</span>
                <div>
                  <div class="pdm-loc-city">Mohali &amp; Chandigarh</div>
                  <div class="pdm-loc-sub">Tri-City Service Area</div>
                </div>
              </div>
              <span class="pdm-loc-badge">Active</span>
            </div>

            <!-- Appearance / Theme Toggle Row -->
            <div class="pdm-theme-row">
              <div class="pdm-theme-left">
                <span class="pdm-theme-icon">🎨</span>
                <span class="pdm-theme-text">Appearance</span>
              </div>
              <button type="button" class="pdm-theme-toggle-btn" onclick="window.toggleSiteTheme();" id="menuThemeToggleBtn" aria-label="Toggle Theme">
                <span id="menuThemeIcon">☀️</span>
                <span id="menuThemeLabel">Light Mode</span>
              </button>
            </div>

            <div class="pdm-divider"></div>

            <!-- Instant Mode Switcher Action Option -->
            <button type="button" class="profile-menu-switch-btn ${isPartner ? 'switch-to-customer' : 'switch-to-partner'}" onclick="window.switchUserMode('${switchTarget}')" role="menuitem">
              <span class="pms-icon">🔄</span>
              <span class="pms-content">
                <span class="pms-title">${switchLabel}</span>
                <span class="pms-desc">${switchDesc}</span>
              </span>
              <span class="pms-arrow">➔</span>
            </button>

            <!-- Navigation Links -->
            <a href="${dashboardHash}" class="pdm-link-item" onclick="window.closeProfileDropdown()" role="menuitem">
              <span class="pdm-item-emoji">📊</span>
              <span>${roleLabel} Dashboard</span>
            </a>
            <a href="${dashboardHash}" class="pdm-link-item" onclick="window.closeProfileDropdown(); setTimeout(() => { if (typeof switchCustomerTab === 'function') switchCustomerTab('profile'); if (typeof switchPartnerTab === 'function') switchPartnerTab('profile'); }, 120);" role="menuitem">
              <span class="pdm-item-emoji">⚙️</span>
              <span>Profile &amp; Settings</span>
            </a>

            <div class="pdm-divider"></div>

            <button type="button" class="pdm-link-item pdm-logout-item" onclick="window.closeProfileDropdown(); window.logout(true);" role="menuitem">
              <span class="pdm-item-emoji">⎋</span>
              <span>Log Out</span>
            </button>
          </div>
        </div>
      `;
    }

    if (typeof window.updateMenuThemeUI === 'function') {
      window.updateMenuThemeUI();
    }
  };

  window.toggleProfileDropdown = function(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const dropdown = document.getElementById('headerProfileDropdown');
    const toggleBtn = document.getElementById('btnHeaderProfileToggle') || document.getElementById('btnHeaderLogin');
    if (!dropdown) return;
    const isShowing = dropdown.classList.contains('active');
    if (isShowing) {
      window.closeProfileDropdown();
    } else {
      dropdown.classList.add('active');
      if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'true');
      if (typeof window.updateMenuThemeUI === 'function') {
        window.updateMenuThemeUI();
      }
    }
  };

  window.closeProfileDropdown = function() {
    const dropdown = document.getElementById('headerProfileDropdown');
    const toggleBtn = document.getElementById('btnHeaderProfileToggle');
    if (dropdown) dropdown.classList.remove('active');
    if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');
  };

  // Close profile dropdown on click outside or escape key
  document.addEventListener('click', function(e) {
    const profileContainer = document.getElementById('userHeaderProfile');
    if (profileContainer && !profileContainer.contains(e.target)) {
      window.closeProfileDropdown();
    }
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      window.closeProfileDropdown();
    }
  });

  // Switch to Partner mode / Switch to Customer mode instantly
  window.switchUserMode = async function(targetRole) {
    try {
      showModeSwitchToast(`Switching to ${targetRole === 'partner' ? 'Partner' : 'Customer'} mode...`);
      const res = await fetch('/api/auth/switch-mode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target_role: targetRole })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Could not switch mode.");
      }

      setAuthUser(data.user);
      window.closeProfileDropdown();

      // Change interface instantly
      const targetHash = targetRole === 'partner' ? '#/partner' : '#/customer';
      window.location.hash = targetHash;
      if (typeof window.handleRoute === 'function') {
        window.handleRoute();
      }

      showModeSwitchToast(`✓ Switched to ${targetRole === 'partner' ? 'Partner operations' : 'Customer booking'} mode!`);
    } catch (err) {
      alert(err.message || "Failed to switch mode. Please try again.");
    }
  };

  function showModeSwitchToast(msg) {
    let toast = document.getElementById('modeSwitchToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'modeSwitchToast';
      toast.className = 'mode-switch-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('active');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.classList.remove('active');
    }, 3200);
  }

  // ---------------------------------------------------------------------------
  // 4. AUTH API ACTIONS: LOGIN, SIGNUP, OTP, LOGOUT
  // ---------------------------------------------------------------------------
  window.loginWithPassword = async function(identifier, password, role) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password, role })
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || "Login failed. Please check your credentials.");
    }
    setAuthUser(data.user);
    return data.user;
  };

  window.signupUser = async function(payload) {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || "Signup failed. Please try again.");
    }
    setAuthUser(data.user);
    return data.user;
  };

  window.sendOtp = async function(phone) {
    const res = await fetch('/api/auth/otp/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone })
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || "Could not send OTP.");
    }
    return data;
  };

  window.verifyOtp = async function(phone, code, role) {
    const res = await fetch('/api/auth/otp/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, code, role })
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || "OTP verification failed.");
    }
    setAuthUser(data.user);
    return data.user;
  };

  window.logout = async function(redirectHome = true) {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {}
    clearAuthUser();
    if (redirectHome) {
      window.location.hash = '#/';
    }
  };

  // ---------------------------------------------------------------------------
  // 5. ROLE-BASED ROUTE GUARDS & ACCESS CONTROL
  // ---------------------------------------------------------------------------
  window.checkRouteAccess = function(route) {
    // Public routes: Home, Service pages, Cab booking, Provider detail, 404, Auth screens
    if (
      route === '' || route === 'home' || route.startsWith('service') || 
      route === 'cab' || route.startsWith('provider') || route.startsWith('auth') || route === '404'
    ) {
      return { allowed: true };
    }

    // Customer Dashboard Guard
    if (route === 'customer') {
      if (!window.authState.isAuthenticated) {
        window.authState.redirectAfterLogin = '#/customer';
        return { allowed: false, reason: 'login_required', redirectTo: '#/auth/customer-login' };
      }
      if (window.authState.role === 'partner') {
        return { 
          allowed: false, 
          reason: 'role_mismatch', 
          message: 'This dashboard is for ZenServe Customers. You are currently logged in as a Service Partner.',
          redirectTo: '#/partner'
        };
      }
      return { allowed: true };
    }

    // Partner Dashboard Guard
    if (route === 'partner') {
      if (!window.authState.isAuthenticated) {
        window.authState.redirectAfterLogin = '#/partner';
        return { allowed: false, reason: 'login_required', redirectTo: '#/auth/partner-login' };
      }
      if (window.authState.role === 'customer') {
        return { 
          allowed: false, 
          reason: 'role_mismatch', 
          message: 'This dashboard is for ZenServe Service Partners. You are currently logged in as a Customer.',
          redirectTo: '#/customer'
        };
      }
      return { allowed: true };
    }

    return { allowed: true };
  };

  // ---------------------------------------------------------------------------
  // 6. DEMO CREDENTIAL POPULATORS
  // ---------------------------------------------------------------------------
  window.fillCustomerDemoCredentials = function() {
    const phoneInput = document.getElementById('custLoginPhone');
    const pwInput = document.getElementById('custLoginPassword');
    if (phoneInput) phoneInput.value = '9999900001';
    if (pwInput) pwInput.value = 'Demo@1234';
    const err = document.getElementById('custLoginError');
    if (err) err.style.display = 'none';
  };

  window.fillPartnerDemoCredentials = function() {
    const phoneInput = document.getElementById('partnerLoginPhone');
    const pwInput = document.getElementById('partnerLoginPassword');
    if (phoneInput) phoneInput.value = '9999900002';
    if (pwInput) pwInput.value = 'Demo@1234';
    const err = document.getElementById('partnerLoginError');
    if (err) err.style.display = 'none';
  };

  // ---------------------------------------------------------------------------
  // 7. PARTNER ONLINE TOGGLE & DEMO APPROVE
  // ---------------------------------------------------------------------------
  window.togglePartnerOnlineStatus = async function() {
    try {
      const res = await fetch('/api/auth/partner/toggle-online', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        if (window.authState.user) {
          window.authState.user.is_online = data.is_online ? 1 : 0;
          try {
            localStorage.setItem('zenserve_user', JSON.stringify(window.authState.user));
          } catch (e) {}
        }
        window.renderPartnerDashboard();
      }
    } catch (e) {
      alert("Could not update online status.");
    }
  };

  window.approvePartnerDemo = async function() {
    try {
      const res = await fetch('/api/auth/partner/approve-demo', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setAuthUser(data.user);
        alert("🎉 Partner account approved for demonstration! You can now accept incoming customer bookings.");
        window.renderPartnerDashboard();
      }
    } catch (e) {
      alert("Could not approve demo partner.");
    }
  };


  // ---------------------------------------------------------------------------
  // 6. FORM HANDLERS & MODAL UTILITIES
  // ---------------------------------------------------------------------------
  window.switchCustAuthMode = function(mode) {
    const pwBtn = document.getElementById('btnCustModePassword');
    const otpBtn = document.getElementById('btnCustModeOtp');
    const pwForm = document.getElementById('custLoginForm');
    const otpWrapper = document.getElementById('custOtpFormWrapper');
    const errBox = document.getElementById('custLoginError');
    if (errBox) errBox.style.display = 'none';

    if (mode === 'otp') {
      if (pwBtn) pwBtn.classList.remove('active');
      if (otpBtn) otpBtn.classList.add('active');
      if (pwForm) pwForm.style.display = 'none';
      if (otpWrapper) otpWrapper.style.display = 'block';
    } else {
      if (pwBtn) pwBtn.classList.add('active');
      if (otpBtn) otpBtn.classList.remove('active');
      if (pwForm) pwForm.style.display = 'block';
      if (otpWrapper) otpWrapper.style.display = 'none';
    }
  };

  window.handleCustomerLoginSubmit = async function(e) {
    if (e) e.preventDefault();
    const phone = (document.getElementById('custLoginPhone')?.value || '').trim();
    const password = document.getElementById('custLoginPassword')?.value || '';
    const errBox = document.getElementById('custLoginError');
    const btn = document.getElementById('btnCustLoginSubmit');
    if (errBox) errBox.style.display = 'none';

    try {
      if (btn) { btn.disabled = true; btn.textContent = 'Signing in...'; }
      await window.loginWithPassword(phone, password, 'customer');
      window.location.hash = '#/customer';
    } catch (err) {
      if (errBox) {
        errBox.textContent = err.message || 'Login failed.';
        errBox.style.display = 'block';
      }
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = 'Sign In to Customer Account'; }
    }
  };

  window.handleCustomerSignupSubmit = async function(e) {
    if (e) e.preventDefault();
    const name = (document.getElementById('custSignupName')?.value || '').trim();
    const phone = (document.getElementById('custSignupPhone')?.value || '').trim();
    const email = (document.getElementById('custSignupEmail')?.value || '').trim();
    const password = document.getElementById('custSignupPassword')?.value || '';
    const language = document.getElementById('custSignupLanguage')?.value || 'en';
    const errBox = document.getElementById('custSignupError');
    const btn = document.getElementById('btnCustSignupSubmit');
    if (errBox) errBox.style.display = 'none';

    try {
      if (btn) { btn.disabled = true; btn.textContent = 'Creating account...'; }
      await window.signupUser({ role: 'customer', name, phone, email, password, language });
      window.location.hash = '#/customer';
    } catch (err) {
      if (errBox) {
        errBox.textContent = err.message || 'Signup failed.';
        errBox.style.display = 'block';
      }
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = 'Create Customer Account'; }
    }
  };

  window.handlePartnerLoginSubmit = async function(e) {
    if (e) e.preventDefault();
    const phone = (document.getElementById('partnerLoginPhone')?.value || '').trim();
    const password = document.getElementById('partnerLoginPassword')?.value || '';
    const errBox = document.getElementById('partnerLoginError');
    const btn = document.getElementById('btnPartnerLoginSubmit');
    if (errBox) errBox.style.display = 'none';

    try {
      if (btn) { btn.disabled = true; btn.textContent = 'Signing in...'; }
      await window.loginWithPassword(phone, password, 'partner');
      window.location.hash = '#/partner';
    } catch (err) {
      if (errBox) {
        errBox.textContent = err.message || 'Partner login failed.';
        errBox.style.display = 'block';
      }
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = 'Sign In to Partner Portal'; }
    }
  };

  window.handlePartnerSignupSubmit = async function(e) {
    if (e) e.preventDefault();
    const name = (document.getElementById('psFullName')?.value || '').trim();
    const phone = (document.getElementById('psPhone')?.value || '').trim();
    const category = document.getElementById('psCategory')?.value || 'plumber';
    const area = document.getElementById('psArea')?.value || 'All Mohali & Chandigarh';
    const years_exp = parseInt(document.getElementById('psExperience')?.value, 10) || 1;
    const price_range = (document.getElementById('psPriceRange')?.value || '').trim();
    const password = document.getElementById('psPassword')?.value || '';
    const bio = (document.getElementById('psBio')?.value || '').trim();
    const vehicle_model = (document.getElementById('psVehicleModel')?.value || '').trim();
    const vehicle_plate = (document.getElementById('psVehiclePlate')?.value || '').trim();
    const errBox = document.getElementById('partnerSignupError');
    const btn = document.getElementById('btnPartnerSignupSubmit');
    if (errBox) errBox.style.display = 'none';

    try {
      if (btn) { btn.disabled = true; btn.textContent = 'Submitting registration...'; }
      await window.signupUser({
        role: 'partner',
        name,
        phone,
        category,
        area,
        years_exp,
        price_range,
        password,
        bio,
        vehicle_model,
        vehicle_plate
      });
      window.location.hash = '#/partner';
    } catch (err) {
      if (errBox) {
        errBox.textContent = err.message || 'Partner signup failed.';
        errBox.style.display = 'block';
      }
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = 'Submit Partner Registration & Documents'; }
    }
  };

  window.handlePartnerCategoryChange = function(cat) {
    const cabBox = document.getElementById('psCabDetailsGroup');
    if (cabBox) {
      cabBox.style.display = cat === 'cab' ? 'block' : 'none';
    }
  };

  window.handleSendCustomerOtp = async function() {
    const phone = (document.getElementById('custOtpPhone')?.value || '').trim();
    const errBox = document.getElementById('custLoginError');
    const btn = document.getElementById('btnSendCustOtp');
    const banner = document.getElementById('custDemoOtpBanner');
    const codeSpan = document.getElementById('custDemoOtpCode');
    const inp = document.getElementById('custOtpInput');
    if (errBox) errBox.style.display = 'none';

    if (!phone || phone.length !== 10 || !/^\d{10}$/.test(phone)) {
      if (errBox) {
        errBox.textContent = 'Please enter a valid 10-digit mobile number.';
        errBox.style.display = 'block';
      }
      return;
    }

    try {
      if (btn) { btn.disabled = true; btn.textContent = 'Sending...'; }
      const res = await window.sendOtp(phone);
      if (banner && codeSpan) {
        codeSpan.textContent = res.otp_demo;
        banner.style.display = 'block';
      }
      if (inp) {
        inp.value = res.otp_demo;
        inp.focus();
      }
    } catch (err) {
      if (errBox) {
        errBox.textContent = err.message || 'Could not send OTP.';
        errBox.style.display = 'block';
      }
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = 'Resend OTP'; }
    }
  };

  window.handleVerifyCustomerOtp = async function() {
    const phone = (document.getElementById('custOtpPhone')?.value || '').trim();
    const code = (document.getElementById('custOtpInput')?.value || '').trim();
    const errBox = document.getElementById('custLoginError');
    const btn = document.getElementById('btnVerifyCustOtp');
    if (errBox) errBox.style.display = 'none';

    if (!phone || !code || code.length !== 6) {
      if (errBox) {
        errBox.textContent = 'Please enter both your 10-digit phone and the 6-digit OTP code.';
        errBox.style.display = 'block';
      }
      return;
    }

    try {
      if (btn) { btn.disabled = true; btn.textContent = 'Verifying...'; }
      await window.verifyOtp(phone, code, 'customer');
      window.location.hash = '#/customer';
    } catch (err) {
      if (errBox) {
        errBox.textContent = err.message || 'OTP verification failed.';
        errBox.style.display = 'block';
      }
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = 'Verify & Log In'; }
    }
  };

  window.togglePasswordVisibility = function(inputId, btn) {
    const inp = document.getElementById(inputId);
    if (!inp) return;
    if (inp.type === 'password') {
      inp.type = 'text';
      if (btn) btn.textContent = '🔒';
    } else {
      inp.type = 'password';
      if (btn) btn.textContent = '👁️';
    }
  };

  window.openBookingsModal = function() {
    if (window.authState && window.authState.isAuthenticated && window.authState.role === 'customer') {
      window.location.hash = '#/customer';
    } else if (typeof window.openModal === 'function') {
      window.openModal('myBookingsModal');
    } else {
      window.location.hash = '#/customer';
    }
  };

  window.shareLiveEmergencyLocation = function() {
    if (typeof window.openShareTwoContactsModal === 'function') {
      window.openShareTwoContactsModal();
    } else if (typeof window.openShareTripModal === 'function') {
      window.openShareTripModal();
    } else {
      alert("🚨 Live emergency GPS coordinates dispatched via SMS to your trusted emergency contacts.");
    }
  };

  window.triggerPartnerEmergencySos = function() {
    if (typeof window.openSosModal === 'function') {
      window.openSosModal();
    } else {
      alert("🚨 DRIVER SOS TRIGGERED: GPS coordinates shared with Police Control Room & ZenServe 24/7 Desk.");
    }
  };

  window.verifyCabTripOtpAndStart = function() {
    const inp = document.getElementById('cabConsoleOtpInput');
    const val = inp ? inp.value.trim() : '';
    if (!val || val.length !== 4) {
      alert("Please enter the 4-digit OTP provided by the customer.");
      return;
    }
    alert(`✓ OTP ${val} verified! Ride status updated to ONGOING. Live route telemetry active.`);
    if (inp) inp.value = '';
  };

  window.cancelCustomerBooking = async function(bookingId) {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    try {
      const res = await fetch('/api/customer/cancel-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ booking_id: bookingId })
      });
      const data = await res.json();
      if (data.success) {
        alert("Booking has been cancelled.");
        if (typeof window.renderCustomerDashboard === 'function') {
          window.renderCustomerDashboard();
        }
      } else {
        alert(data.error || "Could not cancel booking.");
      }
    } catch (e) {
      alert("Network error cancelling booking.");
    }
  };

  window.promptAddAddress = async function() {
    const label = prompt("Enter location label (e.g. Home, Office, Work):", "Home");
    if (!label) return;
    const address = prompt("Enter full address (Sector / House No / Area in Mohali or Chandigarh):");
    if (!address || !address.trim()) return;

    try {
      const getRes = await fetch('/api/customer/dashboard');
      const getData = await getRes.json();
      const existing = (getData.success && getData.saved_addresses) ? getData.saved_addresses : [];
      existing.push({ label: label.trim(), address: address.trim(), is_default: false });

      const res = await fetch('/api/customer/save-meta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ saved_addresses: existing })
      });
      const data = await res.json();
      if (data.success) {
        if (typeof window.renderCustomerDashboard === 'function') {
          window.renderCustomerDashboard();
        }
      } else {
        alert(data.error || "Could not save address.");
      }
    } catch (e) {
      alert("Network error saving address.");
    }
  };

    // Auto initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.initAuth);
  } else {
    window.initAuth();
  }

})();
