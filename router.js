/**
 * ZenServe Client-Side Router & View Controller
 * Handles dedicated pages for 15 services, cab booking, provider details, and 404
 * Supports sticky back button, internal history traversal, fallback to Home,
 * scroll position preservation, and multi-step modal guards.
 */

(function() {
  'use strict';

  window.routerState = {
    currentRoute: '',
    previousRoute: '',
    previousServiceSlug: '',
    savedServiceScroll: 0,
    currentServiceSlug: '',
    selectedSubservice: '',
    serviceSort: 'recommended',
    serviceVerifiedOnly: false,
    serviceGender: 'all',
    pendingLeaveCallback: null
  };

  // --- INTERNAL NAVIGATION STACK & FALLBACK HANDLING ---
  function normalizeHash(hash) {
    if (!hash) return '#/';
    let h = String(hash).trim();
    if (!h.startsWith('#')) h = '#' + h;
    if (h === '#' || h === '#/home' || h === '') return '#/';
    return h;
  }

  function getInternalStack() {
    try {
      const raw = sessionStorage.getItem('zenserve_nav_stack');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function saveInternalStack(stack) {
    try {
      sessionStorage.setItem('zenserve_nav_stack', JSON.stringify(stack));
    } catch (e) {}
  }

  function recordRoute(hash) {
    const norm = normalizeHash(hash);
    const stack = getInternalStack();
    // Avoid pushing duplicate consecutive entries
    if (stack.length === 0 || stack[stack.length - 1] !== norm) {
      stack.push(norm);
      if (stack.length > 30) stack.shift();
      saveInternalStack(stack);
    }
  }

  // Canonical slug normalizer
  function normalizeServiceSlug(raw) {
    if (!raw) return '';
    const s = raw.toLowerCase().trim();
    if (s === 'cab' || s === 'cab-booking') return 'cab';
    if (s === 'barber-at-home' || s === 'barber-home' || s === 'barber') return 'barber-home';
    if (s === 'home-cleaning' || s === 'home-cleaner') return 'home-cleaning';
    if (s === 'blood-test' || s === 'blood-test-at-home') return 'blood-test';
    if (s === 'ac-repair' || s === 'acrepair') return 'ac-repair';
    if (s === 'personal-chef' || s === 'chef') return 'personal-chef';
    if (s === 'massage-therapy' || s === 'massage') return 'massage-therapy';
    if (s === 'labour-work' || s === 'labour') return 'labour-work';
    if (s === 'computer-service' || s === 'computer') return 'computer-service';
    if (s === 'camera-rental' || s === 'camera') return 'camera-rental';
    if (s === 'home-tuition' || s === 'tuition') return 'home-tuition';
    return s;
  }

  // All 15 supported service slugs
  const ALL_SERVICE_SLUGS = [
    'plumber', 'electrician', 'ac-repair', 'carpenter', 'painter',
    'home-cleaning', 'labour-work', 'personal-chef', 'barber-home',
    'massage-therapy', 'blood-test', 'computer-service', 'camera-rental',
    'home-tuition', 'cab'
  ];

  // Helper: Get translation safely
  function t(key, fallback) {
    if (typeof window.t === 'function') {
      const val = window.t(key, fallback);
      if (val && val !== key) return val;
    }
    if (typeof window.getTranslation === 'function') {
      const val = window.getTranslation(key);
      if (val && val !== key) return val;
    }
    return fallback || key;
  }
  if (typeof window.t === 'function' && !window.getTranslation) {
    window.getTranslation = window.t;
  }

  // Hide all view containers
  function hideAllViews() {
    const views = [
      'viewHome', 'viewService', 'viewCabBooking', 'viewProviderDetail', 'viewNotFound',
      'viewAuthRole', 'viewCustomerLogin', 'viewCustomerSignup',
      'viewPartnerLogin', 'viewPartnerSignup', 'viewCustomerDashboard',
      'viewPartnerDashboard', 'viewRoleMismatch'
    ];
    views.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.style.display = 'none';
        el.classList.remove('active');
      }
    });
  }

  // Show a specific view container with fade transition
  function showView(viewId) {
    hideAllViews();
    const el = document.getElementById(viewId);
    if (el) {
      el.style.display = 'block';
      setTimeout(() => {
        el.classList.add('active');
      }, 10);
    }
  }

  // Navigate to Hash
  window.navigateTo = function(hash) {
    if (!hash.startsWith('#')) hash = '#' + hash;
    window.location.hash = hash;
  };

  // Navigate Back with Internal History & Fallback to Home
  window.navigateBack = function() {
    // 1. Check if any modal or panel is open
    const openModals = Array.from(document.querySelectorAll('.modal-overlay.active, .modal.active, .popup.active, .assistant-panel.active, .emergency-panel.active, .mobile-nav.active, .modal[style*="display: block"], .modal[style*="display: flex"]'));
    if (openModals.length > 0) {
      const topModal = openModals[openModals.length - 1];
      if (topModal.id === 'bookingModal') {
        const nameInput = document.getElementById('custName');
        const phoneInput = document.getElementById('custPhone');
        const addrInput = document.getElementById('custAddress');
        const hasData = (nameInput && nameInput.value.trim().length > 0) || 
                        (phoneInput && phoneInput.value.trim().length > 0) ||
                        (addrInput && addrInput.value.trim().length > 0);
        if (hasData) {
          showLeaveConfirmModal('Leave this booking?', 'You have filled in booking details. Are you sure you want to discard them?', () => {
            if (typeof window.closeModal === 'function') window.closeModal('bookingModal');
            else topModal.classList.remove('active');
            document.body.style.overflow = '';
          });
          return;
        }
      }
      // If voice assistant panel is open
      if (topModal.id === 'voiceAssistantPanel') {
        if (typeof window.closeVoiceAssistantPanel === 'function') window.closeVoiceAssistantPanel();
        else topModal.classList.remove('active');
        document.body.style.overflow = '';
        return;
      }
      // If emergency panel is open
      if (topModal.id === 'emergencyPanel') {
        if (typeof window.closeEmergencyPanel === 'function') window.closeEmergencyPanel();
        else topModal.classList.remove('active');
        document.body.style.overflow = '';
        return;
      }
      // If mobile navigation is open
      if (topModal.id === 'mobileNav') {
        if (typeof window.closeMobileMenu === 'function') window.closeMobileMenu();
        else topModal.classList.remove('active');
        document.body.style.overflow = '';
        return;
      }
      // Non-dirty modal: close it directly
      if (typeof window.closeModal === 'function') {
        window.closeModal(topModal.id);
      } else {
        topModal.classList.remove('active');
        topModal.style.display = 'none';
      }
      document.body.style.overflow = '';
      return;
    }

    // 2. Check if currently on Cab Booking view and trip is actively in progress
    if (window.routerState.currentRoute === 'cab' && window.cabState && window.cabState.statusStep > 0 && window.cabState.statusStep < 4) {
      showLeaveConfirmModal('Leave active trip?', 'Your cab trip is currently live. Leaving will minimize the live view, but your trip will continue.', () => {
        executeDirectBack();
      });
      return;
    }

    // 3. Perform history back
    executeDirectBack();
  };

  function executeDirectBack() {
    let stack = getInternalStack();
    const currentHash = normalizeHash(window.location.hash);

    // Pop the current page off the stack if present
    if (stack.length > 0 && stack[stack.length - 1] === currentHash) {
      stack.pop();
    }

    let targetRoute = null;
    // Pop previous route until we find a distinct route
    while (stack.length > 0) {
      const prev = stack.pop();
      if (prev && prev !== currentHash) {
        targetRoute = prev;
        break;
      }
    }
    saveInternalStack(stack);

    // Contextual Fallbacks when there is no prior internal history
    if (!targetRoute) {
      if (currentHash.startsWith('#/provider/')) {
        // Return to that provider's service page, or to Home
        const providerId = currentHash.replace('#/provider/', '').split('?')[0].split('/')[0];
        const provider = findProviderById(providerId);
        if (provider) {
          const serviceSlug = normalizeServiceSlug(provider.service_slug || provider.service || '');
          targetRoute = serviceSlug ? `#/service/${serviceSlug}` : '#/';
        } else if (window.routerState.previousServiceSlug) {
          targetRoute = `#/service/${window.routerState.previousServiceSlug}`;
        } else {
          targetRoute = '#/';
        }
      } else if (currentHash.startsWith('#/service/')) {
        // Return to Home
        targetRoute = '#/';
      } else if (currentHash === '#/cab') {
        // Return to Home
        targetRoute = '#/';
      } else {
        // Default Fallback: Home
        targetRoute = '#/';
      }
    }

    // If returning from Provider Detail to Service Page, restore saved scroll position
    if (currentHash.startsWith('#/provider/') && targetRoute.startsWith('#/service/')) {
      const savedScroll = window.routerState.savedServiceScroll || 0;
      window.location.hash = targetRoute;
      if (savedScroll > 0) {
        setTimeout(() => {
          window.scrollTo({ top: savedScroll, behavior: 'smooth' });
        }, 60);
      }
      return;
    }

    window.location.hash = targetRoute;
  }

  // Leave Confirmation Modal Handlers
  function showLeaveConfirmModal(title, msg, onConfirm) {
    const modal = document.getElementById('leaveConfirmModal');
    const titleEl = document.getElementById('leaveConfirmTitle');
    const msgEl = document.getElementById('leaveConfirmMessage');
    if (!modal) {
      if (confirm(msg)) onConfirm();
      return;
    }
    if (titleEl) titleEl.textContent = title;
    if (msgEl) msgEl.textContent = msg;
    window.routerState.pendingLeaveCallback = onConfirm;
    modal.style.display = 'flex';
    modal.classList.add('active');
  }

  window.closeLeaveConfirmModal = function() {
    const modal = document.getElementById('leaveConfirmModal');
    if (modal) {
      modal.classList.remove('active');
      modal.style.display = 'none';
    }
    window.routerState.pendingLeaveCallback = null;
  };

  window.executeLeaveAction = function() {
    const cb = window.routerState.pendingLeaveCallback;
    window.closeLeaveConfirmModal();
    if (typeof cb === 'function') {
      cb();
    }
  };

  // Main Route Handler
  window.handleRoute = function() {
    const rawHash = window.location.hash || '';
    const hash = rawHash.replace(/^#\/?/, '').trim();

    // Record route in internal history stack
    recordRoute(rawHash || '#/');

    // Update Back Button Text based on language
    updateAllBackButtonLabels();

        // -------------------------------------------------------------------------
    // AUTH & ROLE-BASED ROUTES
    // -------------------------------------------------------------------------
    if (hash === 'auth/role') {
      window.routerState.previousRoute = window.routerState.currentRoute;
      window.routerState.currentRoute = 'auth-role';
      showView('viewAuthRole');
      document.title = 'Choose Account Type - ZenServe';
      window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }

    if (hash === 'auth/customer-login') {
      window.routerState.previousRoute = window.routerState.currentRoute;
      window.routerState.currentRoute = 'auth-customer-login';
      showView('viewCustomerLogin');
      document.title = 'Customer Sign In - ZenServe';
      window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }

    if (hash === 'auth/customer-signup') {
      window.routerState.previousRoute = window.routerState.currentRoute;
      window.routerState.currentRoute = 'auth-customer-signup';
      showView('viewCustomerSignup');
      document.title = 'Customer Registration - ZenServe';
      window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }

    if (hash === 'auth/partner-login') {
      window.routerState.previousRoute = window.routerState.currentRoute;
      window.routerState.currentRoute = 'auth-partner-login';
      showView('viewPartnerLogin');
      document.title = 'Partner Portal Sign In - ZenServe';
      window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }

    if (hash === 'auth/partner-signup') {
      window.routerState.previousRoute = window.routerState.currentRoute;
      window.routerState.currentRoute = 'auth-partner-signup';
      showView('viewPartnerSignup');
      document.title = 'Partner Registration - ZenServe';
      window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }

    if (hash === 'customer') {
      if (typeof window.checkRouteAccess === 'function') {
        const check = window.checkRouteAccess('customer');
        if (!check.allowed) {
          if (check.reason === 'login_required') {
            window.location.hash = check.redirectTo;
            return;
          }
          if (check.reason === 'role_mismatch') {
            showRoleMismatchView(check.message, '#/partner', 'Go to Partner Dashboard');
            return;
          }
        }
      }
      window.routerState.previousRoute = window.routerState.currentRoute;
      window.routerState.currentRoute = 'customer';
      showView('viewCustomerDashboard');
      document.title = 'My Customer Account - ZenServe';
      if (typeof window.renderCustomerDashboard === 'function') {
        window.renderCustomerDashboard();
      }
      window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }

    if (hash === 'partner') {
      if (typeof window.checkRouteAccess === 'function') {
        const check = window.checkRouteAccess('partner');
        if (!check.allowed) {
          if (check.reason === 'login_required') {
            window.location.hash = check.redirectTo;
            return;
          }
          if (check.reason === 'role_mismatch') {
            showRoleMismatchView(check.message, '#/customer', 'Go to Customer Dashboard');
            return;
          }
        }
      }
      window.routerState.previousRoute = window.routerState.currentRoute;
      window.routerState.currentRoute = 'partner';
      showView('viewPartnerDashboard');
      document.title = 'Partner Operations Portal - ZenServe';
      if (typeof window.renderPartnerDashboard === 'function') {
        window.renderPartnerDashboard();
      }
      window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }

    if (hash === 'admin' || hash.startsWith('admin/')) {
      window.location.href = '/admin';
      return;
    }

    if (!hash || hash === 'home') {
      // HOME PAGE
      window.routerState.previousRoute = window.routerState.currentRoute;
      window.routerState.currentRoute = 'home';
      showView('viewHome');
      document.title = 'ZenServe - Instant Local Services';
      renderPopularServices();
      renderRecentlyViewed();
      window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }

    if (hash === 'cab' || hash === 'service/cab' || hash === 'service/cab-booking') {
      // CAB BOOKING PAGE
      window.routerState.previousRoute = window.routerState.currentRoute;
      window.routerState.currentRoute = 'cab';
      showView('viewCabBooking');
      document.title = 'Cab Booking & Live Tracking - ZenServe';
      addToRecentlyViewed('cab', 'Cab Booking', '🚖');
      if (typeof window.openCabBookingSection === 'function') {
        const sec = document.getElementById('cabBookingSection');
        if (sec) sec.style.display = 'block';
        if (typeof window.updateMyTripsCountBadge === 'function') window.updateMyTripsCountBadge();
        if (typeof window.initScheduleFields === 'function') window.initScheduleFields();
      }
      window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }

    if (hash.startsWith('service/')) {
      // DEDICATED SERVICE PAGE
      const rawSlug = hash.replace('service/', '').split('?')[0].split('/')[0];
      const slug = normalizeServiceSlug(rawSlug);

      if (slug === 'cab') {
        window.location.hash = '#/cab';
        return;
      }

      const serviceMeta = (window.ZENSERVE_SERVICES_DIRECTORY && window.ZENSERVE_SERVICES_DIRECTORY[slug]) || null;
      if (!serviceMeta && !ALL_SERVICE_SLUGS.includes(slug)) {
        // Unknown service -> 404
        show404Page();
        return;
      }

      window.routerState.previousRoute = window.routerState.currentRoute;
      window.routerState.currentRoute = 'service';
      window.routerState.currentServiceSlug = slug;
      window.routerState.previousServiceSlug = slug;

      showView('viewService');
      renderServicePage(slug, serviceMeta);
      addToRecentlyViewed(slug, serviceMeta ? serviceMeta.name : slug, serviceMeta ? serviceMeta.icon : '⚡');
      document.title = `${serviceMeta ? serviceMeta.name : slug} - ZenServe`;
      window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }

    if (hash.startsWith('provider/')) {
      // PROVIDER DETAIL PAGE
      const providerId = hash.replace('provider/', '').split('?')[0].split('/')[0];
      const provider = findProviderById(providerId);

      if (!provider) {
        show404Page();
        return;
      }

      // Save scroll position of service page if we navigated from it
      if (window.routerState.currentRoute === 'service') {
        window.routerState.savedServiceScroll = window.scrollY || 0;
      }

      window.routerState.previousRoute = window.routerState.currentRoute;
      window.routerState.currentRoute = 'provider';
      if (provider.service_slug) {
        window.routerState.previousServiceSlug = normalizeServiceSlug(provider.service_slug);
      }

      showView('viewProviderDetail');
      renderProviderDetailPage(provider);
      document.title = `${provider.name} - ZenServe`;
      window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }

    // Unmatched Route -> 404
    show404Page();
  };

  
  function showRoleMismatchView(msg, targetHash, targetLabel) {
    showView('viewRoleMismatch');
    const msgEl = document.getElementById('roleMismatchMsg');
    const btnEl = document.getElementById('roleMismatchActionBtn');
    if (msgEl) msgEl.textContent = msg || 'This portal is restricted to another account role.';
    if (btnEl) {
      btnEl.setAttribute('href', targetHash || '#/');
      btnEl.textContent = targetLabel || 'Go to My Dashboard';
    }
    document.title = 'Access Restricted - ZenServe';
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  function show404Page() {
    window.routerState.previousRoute = window.routerState.currentRoute;
    window.routerState.currentRoute = '404';
    showView('viewNotFound');
    document.title = '404 Not Found - ZenServe';
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  window.updateAllBackButtonLabels = function() {
    const text = t('back_btn', 'Back');
    document.querySelectorAll('.btn-inner-back .bib-text').forEach(el => {
      el.textContent = text;
    });
  };
  function updateAllBackButtonLabels() {
    window.updateAllBackButtonLabels();
  }

  // Find provider in local state or global directory
  function findProviderById(id) {
    if (window.state && Array.isArray(window.state.providers)) {
      const match = window.state.providers.find(p => String(p.id) === String(id));
      if (match) return match;
    }
    if (Array.isArray(window.providersData)) {
      const match = window.providersData.find(p => String(p.id) === String(id));
      if (match) return match;
    }
    if (typeof window.getProviderById === 'function') {
      const match = window.getProviderById(id);
      if (match) return match;
    }
    return null;
  }

  // RENDER DEDICATED SERVICE PAGE
  function renderServicePage(slug, meta) {
    const service = meta || (window.ZENSERVE_SERVICES_DIRECTORY && window.ZENSERVE_SERVICES_DIRECTORY[slug]) || {
      name: slug.charAt(0).toUpperCase() + slug.slice(1).replace('-', ' '),
      icon: '⚡',
      tagline: 'Verified local professionals ready for home visit.',
      subservices: ['Standard Inspection', 'General Repair', 'Replacement'],
      faqs: [
        { q: 'How quickly can a provider arrive?', a: 'Most verified pros can reach your location within 30 to 60 minutes across Chandigarh and Mohali.' },
        { q: 'Is there a warranty on work done?', a: 'Yes, all verified ZenServe bookings come with a 30-day service satisfaction warranty.' }
      ],
      howItWorks: [
        { step: 1, title: 'Choose Problem', desc: 'Select your issue and view upfront verified pricing.' },
        { step: 2, title: 'Book Instant Pro', desc: 'Connect directly with an ID-verified local specialist.' },
        { step: 3, title: 'Pay After Service', desc: 'Verify work quality and pay via cash or UPI securely.' }
      ]
    };

    // 1. Breadcrumbs & Hero
    const bcCurrent = document.getElementById('serviceBreadcrumbCurrent');
    if (bcCurrent) bcCurrent.textContent = service.name;

    const iconEl = document.getElementById('serviceHeroIcon');
    if (iconEl) iconEl.textContent = service.icon || '⚡';

    const titleEl = document.getElementById('serviceHeroTitle');
    if (titleEl) titleEl.textContent = service.name;

    const descEl = document.getElementById('serviceHeroDesc');
    if (descEl) descEl.textContent = service.tagline || 'Verified local service professionals for your home.';

    // 2. Sub-services Chips
    const chipsContainer = document.getElementById('serviceSubservicesChips');
    if (chipsContainer) {
      const sublist = service.subservices || ['General Service', 'Inspection', 'Emergency Repair'];
      chipsContainer.innerHTML = `
        <button type="button" class="sub-chip ${!window.routerState.selectedSubservice ? 'active' : ''}" onclick="selectSubserviceFilter('')">
          All Issues
        </button>
      ` + sublist.map(sub => `
        <button type="button" class="sub-chip ${window.routerState.selectedSubservice === sub ? 'active' : ''}" onclick="selectSubserviceFilter('${sub.replace(/'/g, "\\'")}')">
          ${sub}
        </button>
      `).join('');
    }

    // 3. Gender Filter (Barber at home & Massage therapy)
    const genderWrap = document.getElementById('serviceGenderFilterWrap');
    if (genderWrap) {
      if (slug === 'barber-home' || slug === 'massage-therapy') {
        genderWrap.style.display = 'inline-flex';
      } else {
        genderWrap.style.display = 'none';
      }
    }

    // 4. Render How It Works
    const hiwContainer = document.getElementById('serviceHiwSteps');
    if (hiwContainer) {
      const steps = service.howItWorks || [
        { step: 1, title: 'Select Service', desc: 'Choose your issue from the list.' },
        { step: 2, title: 'Connect with Pro', desc: 'Verified professional contacts you instantly.' },
        { step: 3, title: 'Pay Safely', desc: 'Pay securely after the job is done.' }
      ];
      hiwContainer.innerHTML = steps.map(s => `
        <div class="hiw-step-card">
          <div class="hiw-step-num">${s.step}</div>
          <div class="hiw-step-title">${s.title}</div>
          <div class="hiw-step-desc">${s.desc}</div>
        </div>
      `).join('');
    }

    // 5. Render FAQ Accordion
    const faqContainer = document.getElementById('serviceFaqList');
    if (faqContainer) {
      const faqs = service.faqs || [
        { q: 'Are providers police and ID verified?', a: 'Yes, every provider carries a verified government ID check and badge.' },
        { q: 'What if I need to reschedule?', a: 'You can reschedule anytime directly through the app or by calling the provider.' }
      ];
      faqContainer.innerHTML = faqs.map((f, idx) => `
        <div class="faq-item" onclick="toggleFaqItem(this)">
          <div class="faq-question">
            <span>${f.q}</span>
            <span class="faq-toggle-icon">+</span>
          </div>
          <div class="faq-answer">
            <p>${f.a}</p>
          </div>
        </div>
      `).join('');
    }

    // 6. Render Provider Cards
    applyServiceFilters();
  }

  // Filter & Render Providers for the active Service Page
  window.applyServiceFilters = function() {
    const slug = window.routerState.currentServiceSlug;
    if (!slug) return;

    // Collect all providers matching this service
    let allProviders = [];
    if (typeof window.getProvidersForService === 'function') {
      allProviders = window.getProvidersForService(slug);
    } else if (window.state && Array.isArray(window.state.providers)) {
      allProviders = window.state.providers.filter(p => {
        const pSlug = normalizeServiceSlug(p.service_slug || p.service || '');
        return pSlug === slug;
      });
    }

    let list = [...allProviders];

    // Filter by Sub-service
    const activeSub = window.routerState.selectedSubservice;
    if (activeSub) {
      list = list.filter(p => {
        if (!p.subServices || !Array.isArray(p.subServices)) return true;
        return p.subServices.some(s => s.toLowerCase().includes(activeSub.toLowerCase()) || activeSub.toLowerCase().includes(s.toLowerCase()));
      });
    }

    // Filter by Verified Only
    if (window.routerState.serviceVerifiedOnly) {
      list = list.filter(p => p.id_verified === true || (Array.isArray(p.badges) && p.badges.includes('ID Verified')));
    }

    // Filter by Gender
    if (window.routerState.serviceGender && window.routerState.serviceGender !== 'all') {
      list = list.filter(p => p.gender && p.gender.toLowerCase() === window.routerState.serviceGender.toLowerCase());
    }

    // Sorting
    const sortVal = document.getElementById('serviceSortSelect')?.value || 'recommended';
    window.routerState.serviceSort = sortVal;
    if (sortVal === 'rating_high') {
      list.sort((a, b) => (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0));
    } else if (sortVal === 'price_low') {
      list.sort((a, b) => extractPrice(a.price) - extractPrice(b.price));
    } else if (sortVal === 'price_high') {
      list.sort((a, b) => extractPrice(b.price) - extractPrice(a.price));
    }

    // Update Counter
    const countEl = document.getElementById('serviceProvidersCount');
    if (countEl) {
      countEl.textContent = `Showing ${list.length} provider${list.length === 1 ? '' : 's'}`;
    }

    // Render Grid
    const grid = document.getElementById('serviceProvidersGrid');
    const emptyState = document.getElementById('serviceEmptyState');

    if (!grid) return;

    if (list.length === 0) {
      grid.innerHTML = '';
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    grid.innerHTML = list.map(p => {
      const cleanPhone = (p.phone || '').replace(/[^0-9+]/g, '');
      const cleanWa = (p.whatsapp || p.phone || '').replace(/[^0-9]/g, '');
      const isChef = slug === 'personal-chef';
      const isMonthly = isChef && Boolean(window.state?.chefMonthlyPlans && window.state.chefMonthlyPlans[p.id]);
      const displayPrice = isMonthly ? (p.monthlyPlanPrice || '₹6,000 / mo') : p.price;

      return `
        <article class="provider-card" id="card-${p.id}">
          <div class="provider-header" onclick="window.location.hash='#/provider/${p.id}'" style="cursor:pointer;" title="View details">
            <div class="provider-avatar">${p.name.charAt(0)}</div>
            <div class="provider-name-box">
              <h3 class="provider-name">${p.name}</h3>
              <div class="provider-meta">
                <span class="provider-category-tag">${p.service}</span>
                ${p.gender ? `<span class="provider-gender-tag">${p.gender === 'female' ? '👩 Female' : '👨 Male'}</span>` : ''}
              </div>
            </div>
            <div class="provider-rating-badge">★ ${p.rating}</div>
          </div>

          <div class="provider-details-row" onclick="window.location.hash='#/provider/${p.id}'" style="cursor:pointer;">
            <span class="provider-badge badge-verified">✓ Verified</span>
            <span class="provider-location">📍 ${p.location}</span>
          </div>

          ${p.subServices && p.subServices.length ? `
            <div class="provider-subservices-chips-inline">
              ${p.subServices.slice(0, 3).map(s => `<span class="ps-mini-chip">${s}</span>`).join('')}
            </div>
          ` : ''}

          <div class="provider-footer">
            <div class="provider-price-box" onclick="window.location.hash='#/provider/${p.id}'" style="cursor:pointer;">
              <span class="provider-price-label">Price</span>
              <span class="provider-price-val">${displayPrice}</span>
            </div>
            <div class="provider-actions">
              <button type="button" class="btn-secondary btn-sm" onclick="window.location.hash='#/provider/${p.id}'">Details</button>
              <a href="tel:${cleanPhone}" class="btn-secondary btn-sm" title="Call">Call</a>
              ${cleanWa ? `<a href="https://wa.me/${cleanWa}" target="_blank" class="btn-secondary btn-sm" title="WhatsApp" style="color:#25D366;">WA</a>` : ''}
              <button type="button" class="btn-primary btn-sm" onclick="openBookingModal('${p.id}', false)">Book</button>
            </div>
          </div>
        </article>
      `;
    }).join('');
  };

  function extractPrice(priceStr) {
    if (!priceStr) return 0;
    const digits = priceStr.replace(/[^0-9]/g, '');
    return parseInt(digits, 10) || 0;
  }

  window.selectSubserviceFilter = function(sub) {
    window.routerState.selectedSubservice = sub;
    const chips = document.querySelectorAll('#serviceSubservicesChips .sub-chip');
    chips.forEach(btn => {
      if (!sub && btn.textContent.trim() === 'All Issues') {
        btn.classList.add('active');
      } else if (sub && btn.textContent.trim() === sub) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    applyServiceFilters();
  };

  window.toggleServiceVerifiedFilter = function() {
    window.routerState.serviceVerifiedOnly = !window.routerState.serviceVerifiedOnly;
    const btn = document.getElementById('serviceVerifiedToggle');
    if (btn) {
      btn.classList.toggle('active', window.routerState.serviceVerifiedOnly);
    }
    applyServiceFilters();
  };

  window.setServiceGenderFilter = function(gender) {
    window.routerState.serviceGender = gender;
    document.querySelectorAll('#serviceGenderFilterWrap .gfi-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.gender === gender);
    });
    applyServiceFilters();
  };

  window.resetServiceFilters = function() {
    window.routerState.selectedSubservice = '';
    window.routerState.serviceVerifiedOnly = false;
    window.routerState.serviceGender = 'all';
    window.routerState.serviceSort = 'recommended';
    const sortSelect = document.getElementById('serviceSortSelect');
    if (sortSelect) sortSelect.value = 'recommended';
    const verBtn = document.getElementById('serviceVerifiedToggle');
    if (verBtn) verBtn.classList.remove('active');
    selectSubserviceFilter('');
  };

  window.toggleFaqItem = function(item) {
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
  };

  // RENDER PROVIDER DETAIL PAGE
  function renderProviderDetailPage(p) {
    const container = document.getElementById('providerDetailContent');
    if (!container) return;

    const bcService = document.getElementById('providerBcService');
    const bcName = document.getElementById('providerBcName');
    const serviceSlug = normalizeServiceSlug(p.service_slug || p.service || '');

    if (bcService) {
      bcService.textContent = p.service;
      bcService.href = `#/service/${serviceSlug}`;
    }
    if (bcName) bcName.textContent = p.name;

    const cleanPhone = (p.phone || '').replace(/[^0-9+]/g, '');
    const cleanWa = (p.whatsapp || p.phone || '').replace(/[^0-9]/g, '');

    const badges = p.badges && p.badges.length ? p.badges : [
      'ID Verified',
      'Police Verified',
      'Background Checked',
      'Satisfaction Guaranteed'
    ];

    const subservices = p.subServices || ['Inspection & Diagnostics', 'Standard Repair', 'Complete Overhaul'];
    const reviews = p.sampleReviews || [
      { name: 'Amit Sharma', rating: 5, date: '2 days ago', comment: 'Very professional, arrived in 25 minutes and solved the issue cleanly.' },
      { name: 'Pooja Verma', rating: 5, date: '1 week ago', comment: 'Polite behavior, transparent pricing. Highly recommended for home visit.' }
    ];

    container.innerHTML = `
      <div class="provider-detail-card">
        <!-- Header Section -->
        <div class="pd-hero-header">
          <div class="pd-avatar">${p.name.charAt(0)}</div>
          <div class="pd-hero-info">
            <div class="pd-badge-row">
              <span class="pd-category-pill">${p.service}</span>
              ${p.gender ? `<span class="pd-gender-pill">${p.gender === 'female' ? '👩 Female' : '👨 Male'}</span>` : ''}
              <span class="pd-verified-shield">🛡️ Police &amp; ID Verified</span>
            </div>
            <h1 class="pd-name">${p.name}</h1>
            <div class="pd-meta-row">
              <span class="pd-rating-badge">★ ${p.rating} (${p.reviewsCount || 48} reviews)</span>
              <span class="pd-location">📍 ${p.location}</span>
              <span class="pd-hours">🕒 Available Today (8 AM - 8 PM)</span>
            </div>
          </div>
        </div>

        <!-- Trust & Verification Highlights -->
        <div class="pd-trust-strip">
          <div class="pd-trust-item">
            <span class="pti-icon">🛡️</span>
            <div>
              <strong>Government ID Verified</strong>
              <p>Identity confirmed with photo ID match</p>
            </div>
          </div>
          <div class="pd-trust-item">
            <span class="pti-icon">👮</span>
            <div>
              <strong>Police Verified Record</strong>
              <p>Clean background check on file</p>
            </div>
          </div>
          <div class="pd-trust-item">
            <span class="pti-icon">⭐</span>
            <div>
              <strong>Top Rated Pro</strong>
              <p>Consistently rated 4.8+ by local households</p>
            </div>
          </div>
        </div>

        <!-- Services & Price List -->
        <div class="pd-section-box">
          <h3 class="pd-section-title">Services &amp; Pricing</h3>
          <div class="pd-price-table">
            ${subservices.map(sub => `
              <div class="pd-price-row">
                <span class="ppr-name">✓ ${sub}</span>
                <span class="ppr-price">${p.price}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Customer Reviews -->
        <div class="pd-section-box">
          <h3 class="pd-section-title">Customer Reviews</h3>
          <div class="pd-reviews-list">
            ${reviews.map(r => `
              <div class="pd-review-item">
                <div class="pri-header">
                  <strong>${r.name}</strong>
                  <span class="pri-stars">${'★'.repeat(r.rating || 5)}</span>
                  <span class="pri-date">${r.date}</span>
                </div>
                <p class="pri-comment">${r.comment}</p>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Action Sticky Bar -->
        <div class="pd-bottom-actions">
          <div class="pd-price-summary">
            <span class="pps-label">Starting Price</span>
            <span class="pps-val">${p.price}</span>
          </div>
          <div class="pd-buttons-group">
            <a href="tel:${cleanPhone}" class="btn-secondary" style="min-height:48px; padding: 0.75rem 1.25rem; font-weight:600;">
              📞 Call
            </a>
            ${cleanWa ? `
              <a href="https://wa.me/${cleanWa}?text=Hi%20${encodeURIComponent(p.name)},%20I%20found%20you%20on%20ZenServe." target="_blank" class="btn-secondary" style="min-height:48px; padding: 0.75rem 1.25rem; font-weight:600; color:#25D366; border-color:#25D366;">
                💬 WhatsApp
              </a>
            ` : ''}
            <button type="button" class="btn-primary" onclick="openBookingModal('${p.id}', false)" style="min-height:48px; padding: 0.75rem 1.75rem; font-weight:700;">
              Book Now
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // POPULAR SERVICES & RECENTLY VIEWED ROWS (HOME PAGE)
  const POPULAR_SERVICES = [
    { slug: 'ac-repair', name: 'AC Repair', icon: '❄️' },
    { slug: 'plumber', name: 'Plumber', icon: '🔧' },
    { slug: 'cab', name: 'Cab Booking', icon: '🚖' },
    { slug: 'barber-home', name: 'Barber at Home', icon: '✂️' },
    { slug: 'electrician', name: 'Electrician', icon: '⚡' },
    { slug: 'personal-chef', name: 'Personal Chef', icon: '👨‍🍳' }
  ];

  function renderPopularServices() {
    const container = document.getElementById('homePopularServices');
    if (!container) return;

    container.innerHTML = POPULAR_SERVICES.map(s => {
      const isCab = s.slug === 'cab';
      const targetHash = isCab ? '#/cab' : `#/service/${s.slug}`;
      return `
        <a href="${targetHash}" class="quick-service-pill">
          <span class="qsp-icon">${s.icon}</span>
          <span class="qsp-name">${s.name}</span>
        </a>
      `;
    }).join('');
  }

  function getRecentlyViewed() {
    try {
      const raw = localStorage.getItem('zenserve_recently_viewed');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function addToRecentlyViewed(slug, name, icon) {
    if (!slug) return;
    try {
      let list = getRecentlyViewed();
      list = list.filter(item => item.slug !== slug);
      list.unshift({ slug, name, icon: icon || '⚡', timestamp: Date.now() });
      if (list.length > 6) list = list.slice(0, 6);
      localStorage.setItem('zenserve_recently_viewed', JSON.stringify(list));
      renderRecentlyViewed();
    } catch (e) {
      console.warn('Failed to update recently viewed:', e);
    }
  }

  function renderRecentlyViewed() {
    const section = document.getElementById('recentlyViewedSection');
    const container = document.getElementById('homeRecentlyViewed');
    if (!section || !container) return;

    const list = getRecentlyViewed();
    if (list.length === 0) {
      section.style.display = 'none';
      return;
    }

    section.style.display = 'block';
    container.innerHTML = list.map(item => {
      const isCab = item.slug === 'cab';
      const targetHash = isCab ? '#/cab' : `#/service/${item.slug}`;
      return `
        <a href="${targetHash}" class="quick-service-pill recent-pill">
          <span class="qsp-icon">${item.icon || '⚡'}</span>
          <span class="qsp-name">${item.name}</span>
        </a>
      `;
    }).join('');
  }

  window.clearRecentlyViewed = function() {
    try {
      localStorage.removeItem('zenserve_recently_viewed');
      renderRecentlyViewed();
    } catch (e) {}
  };

  // Keyboard (Escape, Alt + Left Arrow) and Popstate listeners
  window.addEventListener('popstate', function(e) {
    // If a modal is open, prevent navigating away and close the modal
    const openModals = Array.from(document.querySelectorAll('.modal-overlay.active, .modal.active, .popup.active, .assistant-panel.active, .emergency-panel.active, .mobile-nav.active, .modal[style*="display: block"], .modal[style*="display: flex"]'));
    if (openModals.length > 0) {
      const topModal = openModals[openModals.length - 1];
      if (topModal.id !== 'leaveConfirmModal') {
        if (topModal.id === 'voiceAssistantPanel' && typeof window.closeVoiceAssistantPanel === 'function') {
          window.closeVoiceAssistantPanel();
        } else if (topModal.id === 'emergencyPanel' && typeof window.closeEmergencyPanel === 'function') {
          window.closeEmergencyPanel();
        } else if (topModal.id === 'mobileNav' && typeof window.closeMobileMenu === 'function') {
          window.closeMobileMenu();
        } else if (typeof window.closeModal === 'function') {
          window.closeModal(topModal.id);
        } else {
          topModal.classList.remove('active');
          topModal.style.display = 'none';
        }
        document.body.style.overflow = '';
        return;
      }
    }
    handleRoute();
  });

  window.addEventListener('keydown', function(e) {
    // Escape key closes open popups, modals, emergency panel and voice assistant
    if (e.key === 'Escape' || e.keyCode === 27) {
      let closedSomething = false;

      // Close voice assistant panel if open
      const vap = document.getElementById('voiceAssistantPanel');
      if (vap && (vap.classList.contains('active') || vap.style.display === 'block')) {
        if (typeof window.closeVoiceAssistantPanel === 'function') window.closeVoiceAssistantPanel();
        else vap.classList.remove('active');
        closedSomething = true;
      }

      // Close emergency panel if open
      const ep = document.getElementById('emergencyPanel');
      if (ep && (ep.classList.contains('active') || ep.style.display === 'block')) {
        if (typeof window.closeEmergencyPanel === 'function') window.closeEmergencyPanel();
        else ep.classList.remove('active');
        closedSomething = true;
      }

      // Close mobile menu if open
      const mn = document.getElementById('mobileNav');
      if (mn && mn.classList.contains('active')) {
        if (typeof window.closeMobileMenu === 'function') window.closeMobileMenu();
        else mn.classList.remove('active');
        closedSomething = true;
      }

      // Close leave confirmation modal if open
      const lcm = document.getElementById('leaveConfirmModal');
      if (lcm && (lcm.classList.contains('active') || lcm.style.display === 'flex' || lcm.style.display === 'block')) {
        if (typeof window.closeLeaveConfirmModal === 'function') window.closeLeaveConfirmModal();
        else { lcm.classList.remove('active'); lcm.style.display = 'none'; }
        closedSomething = true;
      }

      // Close any active modal overlay or modal dialog
      const openModals = document.querySelectorAll('.modal-overlay.active, .modal.active, .popup.active, .modal[style*="display: block"], .modal[style*="display: flex"]');
      openModals.forEach(m => {
        if (m.id === 'sosModal' && typeof window.closeSosModal === 'function') {
          window.closeSosModal();
        } else if (m.id === 'shareTripModal' && typeof window.closeShareTripModal === 'function') {
          window.closeShareTripModal();
        } else if (m.id === 'emergencyAlertModal' && typeof window.closeEmergencyAlertModal === 'function') {
          window.closeEmergencyAlertModal();
        } else if (typeof window.closeModal === 'function') {
          window.closeModal(m.id);
        } else {
          m.classList.remove('active');
          m.style.display = 'none';
        }
        closedSomething = true;
      });

      document.body.style.overflow = '';
      if (closedSomething) {
        e.preventDefault();
      }
    }

    // Alt + Left Arrow goes back to previous screen
    if (e.altKey && (e.key === 'ArrowLeft' || e.key === 'Left' || e.keyCode === 37)) {
      e.preventDefault();
      window.navigateBack();
    }
  });

  // Attach Router initialization
  window.addEventListener('hashchange', window.handleRoute);
  window.addEventListener('DOMContentLoaded', function() {
    window.handleRoute();
  });

  // In case DOMContentLoaded already fired
  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    setTimeout(window.handleRoute, 50);
  }

})();
