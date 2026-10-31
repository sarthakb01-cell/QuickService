/**
 * ZenServe Multi-Language Translation Dictionary & Offline Multilingual Keyword Matcher
 * Supported Languages:
 *   - en: English
 *   - hi: हिन्दी (Hindi)
 *   - pa: ਪੰਜਾਬੀ (Punjabi)
 *   - bho: भोजपुरी (Bhojpuri)
 *
 * Code Comments: To add a new language, add its ISO code and key dictionary below.
 */

window.ZENSERVE_LANGUAGES = [
  { code: 'en', name: 'English', native: 'English', speechLang: 'en-IN' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', speechLang: 'hi-IN' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ', speechLang: 'pa-IN' },
  { code: 'bho', name: 'Bhojpuri', native: 'भोजपुरी', speechLang: 'hi-IN' } // Browser uses hi-IN voice for Bhojpuri
];

window.ZENSERVE_TRANSLATIONS = {
  en: {
    // Header & Navigation
    nav_services: "Services",
    nav_providers: "Providers",
    nav_book_cab: "Book Cab",
    nav_ai_estimate: "AI Estimate",
    nav_my_bookings: "Bookings",
    sos_button: "SOS",
    tagline: "All services, one app",
    city_badge: "📍 Mohali & Chandigarh",
    
    // Hero
    hero_title: "Trusted Local Services",
    hero_subtitle: "Book certified local home services and cabs directly.",
    hero_pill: "⚡ Verified Services",
    search_placeholder: "Search services or sectors...",
    search_button: "Search",
    popular_label: "Popular:",
    
    // Core Services
    services_title: "Our Services",
    services_subtitle: "Verified local services for your home.",
    ai_strip_title: "AI Price Estimator",
    ai_strip_desc: "Instant repair estimates from photo or video.",
    get_estimate_btn: "Get Estimate",
    
    // Category Names
    cat_ac_repair: "AC Repair",
    cat_plumber: "Plumber",
    cat_electrician: "Electrician",
    cat_home_cleaner: "Home Cleaner",
    cat_cab: "Cab",
    cat_blood_test: "Blood Test at Home",
    cat_personal_chef: "Personal Chef",
    cat_barber_home: "Barber at Home",
    cat_massage_therapy: "Massage Therapy",
    cat_painter: "Painter",
    cat_carpenter: "Carpenter",
    cat_labour_work: "Labour Work",
    
    // Providers Section
    providers_title: "Verified Providers",
    providers_subtitle: "Trusted professionals ready to serve you.",
    filter_all: "All Services",
    id_verified_btn: "ID Verified Only",
    gender_all: "Any Gender",
    gender_male: "Male Only",
    gender_female: "Female Only",
    price_label: "Price",
    details_btn: "Details",
    call_btn: "Call",
    book_btn: "Book",
    verified_badge: "✓ Verified",
    
    // Provider Details Popup
    pdm_title: "Provider Details",
    rate_availability: "Rate & Availability",
    highlights_label: "Highlights:",
    available_services_label: "Available Services:",
    monthly_plan_title: "Monthly Plan",
    past_work_btn: "Past Work",
    free_estimate_btn: "Free Estimate",
    back_btn: "← Back",
    close_btn: "Close",
    
    // Booking Modal
    schedule_service: "Schedule Service",
    modal_subtitle: "Direct booking with verified provider",
    full_name_label: "Full Name",
    phone_label: "Phone Number",
    date_label: "Service Date",
    time_label: "Preferred Time",
    address_label: "Service Address (Mohali / Chandigarh)",
    notes_label: "Problem Description / Notes (Optional)",
    confirm_booking_btn: "Confirm Booking",
    
    // Cab Booking
    cab_title: "Book a Cab",
    cab_subtitle: "Direct drivers, zero surge, pay after trip.",
    instant_rides_badge: "⚡ Instant Rides",
    pickup_label: "Pickup Location",
    drop_label: "Drop Destination",
    pickup_placeholder: "Enter pickup address / sector",
    drop_placeholder: "Enter drop destination / airport / station",
    my_location_btn: "📍 My Location",
    pick_on_map_btn: "🗺️ Pick on Map",
    book_cab_btn: "Book Cab",
    police_verified_driver: "Police Verified Driver",
    view_safety_details: "Safety Details",
    become_driver: "Become Driver",
    admin_portal: "Verification Portal",
    report_driver: "Report this driver",
    share_driver_wa: "Share Driver",
    back_btn: "Back",
    popular_services: "Popular Services",
    recently_viewed: "Recently Viewed",
    view_details: "View Details",
    how_it_works: "How It Works",
    frequently_asked: "Frequently Asked Questions",
    page_not_found_title: "Page Not Found",
    page_not_found_desc: "The service or provider you are looking for does not exist or has been moved.",
    leave_confirm_title: "Leave this screen?",
    leave_confirm_desc: "You have an active action or trip in progress. Are you sure you want to go back?",
    calculating_fare: "Calculating estimated fare...",
    est_fare_label: "Estimated Fare",
    est_distance_label: "Distance",
    est_duration_label: "Duration",
    
    // Cab Tracking
    driver_assigned: "Driver Assigned",
    driver_on_way: "Driver on the way",
    driver_arrived: "Driver arrived",
    trip_started: "Trip started",
    trip_completed: "Trip completed",
    otp_label: "Share OTP with driver",
    share_trip_btn: "Share Trip",
    cancel_ride_btn: "Cancel Ride",
    speed_toggle_label: "Demo Speed:",
    safety_check_title: "Is everything okay?",
    safety_check_desc: "Your cab has stopped for over 30 seconds. Please confirm you are safe.",
    im_safe_btn: "I'm safe",
    need_help_btn: "Need help",
    
    // Trip Completed & Review
    trip_completed_title: "Trip Completed!",
    trip_completed_desc: "You have safely arrived at your destination.",
    rate_ride_title: "Trip Review",
    rating_label: "Rate your ride",
    driver_tip_label: "Add Driver Tip (Optional)",
    review_placeholder: "Leave feedback for driver (optional)...",
    submit_review_btn: "Submit Review",
    my_trips_btn: "My Trips",
    
    // Emergency Panel
    emergency_title: "Emergency SOS",
    emergency_subtitle: "Immediate emergency dispatch & personal contacts alert",
    police_call_btn: "Police (112 / 100)",
    ambulance_call_btn: "Ambulance (102 / 108)",
    women_helpline_btn: "Women Helpline (1091)",
    fire_call_btn: "Fire Force (101)",
    share_location_btn: "Share Live Location on WhatsApp",
    emergency_contacts_title: "Saved Emergency Contacts",
    add_contact_btn: "Add Contact",
    save_contacts_btn: "Save Contacts",
    
    // AI Estimate Modal
    ai_estimate_modal_title: "AI Estimate",
    ai_mode_repair: "Repair",
    ai_mode_install: "New Installation",
    ai_drag_drop: "Drag & drop photos or video here, or tap to choose",
    ai_describe_placeholder: "Describe the problem or installation needed...",
    ai_calculating: "AI is analyzing your images...",
    ai_quote_btn: "Get quotes from providers",
    
    // Voice Assistant
    assistant_title: "ZenServe Voice Assistant",
    assistant_badge: "AI Powered",
    assistant_listening: "Listening...",
    assistant_processing: "Understanding your request...",
    assistant_speaking: "Speaking...",
    assistant_idle: "Tap the mic and speak in any language",
    assistant_mic_blocked: "Microphone blocked or not supported. Please type below.",
    assistant_offline_mode: "Offline Mode",
    assistant_privacy_note: "Your voice is used only to understand your request",
    assistant_try_saying: "Try saying:",
    assistant_input_placeholder: "Speak or type your problem in any language...",
    assistant_send_btn: "Send",
    assistant_show_providers: "Show Providers",
    assistant_get_estimate: "Get Photo Estimate",
    assistant_book_now: "Book Now",
    assistant_safety_tip_label: "Safety Tip:",
    assistant_mute_label: "Voice Mute",
    assistant_stop_speaking: "Stop Speaking",
    
    // Common / Errors
    no_providers_found: "No providers found. Try another category or clear filters.",
    clear_filters_btn: "Show All",
    no_bookings_yet: "No bookings yet. Schedule your first home service.",
    browse_services_btn: "Browse Services",
    no_trips_yet: "No completed trips yet. Book a cab to see your trips here.",
    home_link: "Home",
    footer_desc: "Trusted home and cab services across Mohali and Chandigarh."
  },
  
  hi: {
    // Header & Navigation
    nav_services: "सेवाएं",
    nav_providers: "कारीगर",
    nav_book_cab: "कैब बुक करें",
    nav_ai_estimate: "एआई एस्टीमेट",
    nav_my_bookings: "बुकिंग्स",
    sos_button: "एसओएस (आपातकाल)",
    tagline: "सभी सेवाएं, एक ऐप",
    city_badge: "📍 मोहाली एवं चंडीगढ़",
    
    // Hero
    hero_title: "भरोसेमंद स्थानीय सेवाएं",
    hero_subtitle: "सत्यापित होम सर्विस और कैब सीधे बुक करें, बिना किसी बिचौलिए के।",
    hero_pill: "⚡ सत्यापित सेवाएं",
    search_placeholder: "प्लंबर, इलेक्ट्रीशियन, एसी, कैब खोजें...",
    search_button: "खोजें",
    popular_label: "लोकप्रिय:",
    
    // Core Services
    services_title: "हमारी सेवाएं",
    services_subtitle: "आपके घर के लिए सत्यापित स्थानीय सेवाएं।",
    ai_strip_title: "एआई मूल्य अनुमानक",
    ai_strip_desc: "फोटो या वीडियो से तुरंत खर्च का अनुमान पाएं।",
    get_estimate_btn: "अनुमान पाएं",
    
    // Category Names
    cat_ac_repair: "एसी रिपेयर",
    cat_plumber: "प्लंबर (नलसाज)",
    cat_electrician: "इलेक्ट्रीशियन (बिजली मिस्त्री)",
    cat_home_cleaner: "घर की सफाई",
    cat_cab: "कैब एवं टैक्सी",
    cat_blood_test: "घर पर ब्लड टेस्ट",
    cat_personal_chef: "पर्सनल कुक / शेफ",
    cat_barber_home: "घर पर नाई",
    cat_massage_therapy: "मसाज थेरेपी",
    cat_painter: "पेंटर (रंगाई)",
    cat_carpenter: "बढ़ई (कारपेंटर)",
    cat_labour_work: "मजदूर / लेबर वर्क",
    
    // Providers Section
    providers_title: "सत्यापित कारीगर",
    providers_subtitle: "आपकी सेवा के लिए तैयार प्रशिक्षित पेशेवर।",
    filter_all: "सभी सेवाएं",
    id_verified_btn: "केवल आईडी सत्यापित",
    gender_all: "कोई भी जेंडर",
    gender_male: "केवल पुरुष",
    gender_female: "केवल महिला",
    price_label: "शुल्क",
    details_btn: "विवरण",
    call_btn: "कॉल करें",
    book_btn: "बुक करें",
    verified_badge: "✓ सत्यापित",
    
    // Provider Details Popup
    pdm_title: "कारीगर विवरण",
    rate_availability: "दर एवं उपलब्धता",
    highlights_label: "खासियतें:",
    available_services_label: "उपलब्ध सेवाएं:",
    monthly_plan_title: "मासिक प्लान",
    past_work_btn: "पिछला काम",
    free_estimate_btn: "मुफ्त अनुमान",
    back_btn: "← वापस",
    close_btn: "बंद करें",
    
    // Booking Modal
    schedule_service: "सेवा का समय तय करें",
    modal_subtitle: "सत्यापित कारीगर के साथ सीधी बुकिंग",
    full_name_label: "पूरा नाम",
    phone_label: "मोबाइल नंबर",
    date_label: "सेवा की तारीख",
    time_label: "पसंदीदा समय",
    address_label: "पता (मोहाली / चंडीगढ़ / पंचकूला)",
    notes_label: "समस्या का विवरण (वैकल्पिक)",
    confirm_booking_btn: "बुकिंग पक्की करें",
    
    // Cab Booking
    cab_title: "कैब बुक करें",
    cab_subtitle: "सीधा ड्राइवर संपर्क, कोई सर्ज चार्ज नहीं, यात्रा बाद भुगतान।",
    instant_rides_badge: "⚡ तुरंत सवारी",
    pickup_label: "पिकअप स्थान",
    drop_label: "कहाँ जाना है (ड्रॉप)",
    pickup_placeholder: "पिकअप पता या सेक्टर दर्ज करें",
    drop_placeholder: "गंतव्य पता / एयरपोर्ट / स्टेशन दर्ज करें",
    my_location_btn: "📍 मेरा स्थान",
    pick_on_map_btn: "🗺️ मैप पर चुनें",
    book_cab_btn: "कैब बुक करें",
    police_verified_driver: "पुलिस सत्यापित ड्राइवर",
    view_safety_details: "सुरक्षा विवरण",
    become_driver: "ड्राइवर बनें",
    admin_portal: "सत्यापन पोर्टल",
    report_driver: "ड्राइवर की रिपोर्ट करें",
    share_driver_wa: "ड्राइवर शेयर करें",
    back_btn: "वापस",
    popular_services: "लोकप्रिय सेवाएँ",
    recently_viewed: "हाल ही में देखे गए",
    view_details: "विवरण देखें",
    how_it_works: "यह कैसे काम करता है",
    frequently_asked: "अक्सर पूछे जाने वाले सवाल",
    page_not_found_title: "पेज नहीं मिला",
    page_not_found_desc: "आप जिस सेवा या प्रोवाइडर को खोज रहे हैं, वह मौजूद नहीं है।",
    leave_confirm_title: "क्या आप बाहर निकलना चाहते हैं?",
    leave_confirm_desc: "आपकी बुकिंग या राइड अभी चालू है। क्या आप सच में वापस जाना चाहते हैं?",
    calculating_fare: "किराया आंका जा रहा है...",
    est_fare_label: "अनुमानित किराया",
    est_distance_label: "दूरी",
    est_duration_label: "समय",
    
    // Cab Tracking
    driver_assigned: "ड्राइवर मिल गया",
    driver_on_way: "ड्राइवर रास्ते में है",
    driver_arrived: "ड्राइवर पहुंच गया",
    trip_started: "यात्रा शुरू हुई",
    trip_completed: "यात्रा पूरी हुई",
    otp_label: "ड्राइवर को ओटीपी बताएं",
    share_trip_btn: "सवारी शेयर करें",
    cancel_ride_btn: "राइड रद्द करें",
    speed_toggle_label: "डेमो स्पीड:",
    safety_check_title: "क्या सब ठीक है?",
    safety_check_desc: "आपकी कैब 30 सेकंड से अधिक समय से रुकी हुई है। कृपया बताएं कि आप सुरक्षित हैं।",
    im_safe_btn: "मैं सुरक्षित हूँ",
    need_help_btn: "मदद चाहिए",
    
    // Trip Completed & Review
    trip_completed_title: "सवारी पूरी हुई!",
    trip_completed_desc: "आप सुरक्षित रूप से अपनी मंजिल पर पहुंच गए हैं।",
    rate_ride_title: "सवारी की समीक्षा",
    rating_label: "ड्राइवर को रेटिंग दें",
    driver_tip_label: "ड्राइवर को टिप दें (वैकल्पिक)",
    review_placeholder: "ड्राइवर के बारे में अपनी राय लिखें...",
    submit_review_btn: "रिव्यू जमा करें",
    my_trips_btn: "मेरी यात्राएं",
    
    // Emergency Panel
    emergency_title: "आपातकालीन एसओएस",
    emergency_subtitle: "तुरंत पुलिस, एम्बुलेंस एवं परिजनों को लोकेशन अलर्ट भेजें",
    police_call_btn: "पुलिस (112 / 100)",
    ambulance_call_btn: "एम्बुलेंस (102 / 108)",
    women_helpline_btn: "महिला हेल्पलाइन (1091)",
    fire_call_btn: "दमकल केंद्र (101)",
    share_location_btn: "व्हाट्सएप पर लाइव लोकेशन भेजें",
    emergency_contacts_title: "सहेजे गए आपातकालीन संपर्क",
    add_contact_btn: "नया संपर्क जोड़ें",
    save_contacts_btn: "संपर्क सुरक्षित करें",
    
    // AI Estimate Modal
    ai_estimate_modal_title: "एआई एस्टीमेट",
    ai_mode_repair: "मरम्मत",
    ai_mode_install: "नई फिटिंग / इंस्टॉलेशन",
    ai_drag_drop: "फोटो या वीडियो यहाँ डालें या चुनें",
    ai_describe_placeholder: "खराबी या आवश्यकता का संक्षेप में विवरण दें...",
    ai_calculating: "एआई फोटो की जांच कर रहा है...",
    ai_quote_btn: "कारीगरों से कोटेशन प्राप्त करें",
    
    // Voice Assistant
    assistant_title: "ज़ेनसर्व वॉयस असिस्टेंट",
    assistant_badge: "एआई संचालित",
    assistant_listening: "सुन रहे हैं...",
    assistant_processing: "आपकी बात समझी जा रही है...",
    assistant_speaking: "बोल रहे हैं...",
    assistant_idle: "माइक दबाकर किसी भी भाषा में बोलें",
    assistant_mic_blocked: "माइक की अनुमति नहीं मिली। कृपया नीचे लिखकर बताएं।",
    assistant_offline_mode: "ऑफलाइन मोड",
    assistant_privacy_note: "आपकी आवाज़ केवल समस्या समझने के लिए उपयोग होती है",
    assistant_try_saying: "बोलकर देखें:",
    assistant_input_placeholder: "अपनी समस्या बोलें या यहाँ लिखें...",
    assistant_send_btn: "भेजें",
    assistant_show_providers: "कारीगर देखें",
    assistant_get_estimate: "फोटो से एस्टीमेट लें",
    assistant_book_now: "अभी बुक करें",
    assistant_safety_tip_label: "सुरक्षा टिप:",
    assistant_mute_label: "म्यूट",
    assistant_stop_speaking: "बोलना रोकें",
    
    // Common / Errors
    no_providers_found: "कोई कारीगर नहीं मिला। कृपया दूसरी श्रेणी चुनें या फ़िल्टर हटाएं।",
    clear_filters_btn: "सभी दिखाएं",
    no_bookings_yet: "अभी कोई बुकिंग नहीं है। अपनी पहली सेवा बुक करें।",
    browse_services_btn: "सेवाएं देखें",
    no_trips_yet: "कोई यात्रा इतिहास नहीं है। कैब बुक करें।",
    home_link: "होम",
    footer_desc: "मोहाली और चंडीगढ़ भर में भरोसेमंद होम और कैब सेवाएं।"
  },
  
  pa: {
    // Header & Navigation
    nav_services: "ਸੇਵਾਵਾਂ",
    nav_providers: "ਕਾਰੀਗਰ",
    nav_book_cab: "ਕੈਬ ਬੁੱਕ ਕਰੋ",
    nav_ai_estimate: "ਏਆਈ ਅੰਦਾਜ਼ਾ",
    nav_my_bookings: "ਬੁਕਿੰਗਾਂ",
    sos_button: "ਐਮਰਜੈਂਸੀ (SOS)",
    tagline: "ਸਾਰੀਆਂ ਸੇਵਾਵਾਂ, ਇੱਕੋ ਐਪ",
    city_badge: "📍 ਮੋਹਾਲੀ ਅਤੇ ਚੰਡੀਗੜ੍ਹ",
    
    // Hero
    hero_title: "ਭਰੋਸੇਯੋਗ ਸਥਾਨਕ ਸੇਵਾਵਾਂ",
    hero_subtitle: "ਪ੍ਰਮਾਣਿਤ ਸਥਾਨਕ ਹੋਮ ਸਰਵਿਸਿਜ਼ ਅਤੇ ਕੈਬ ਸਿੱਧਾ ਬੁੱਕ ਕਰੋ।",
    hero_pill: "⚡ ਪ੍ਰਮਾਣਿਤ ਸੇਵਾਵਾਂ",
    search_placeholder: "ਪਲੰਬਰ, ਬਿਜਲੀ ਮਿਸਤਰੀ, ਕੈਬ, ਏਸੀ ਰਿਪੇਅਰ ਖੋਜੋ...",
    search_button: "ਖੋਜੋ",
    popular_label: "ਪ੍ਰਸਿੱਧ:",
    
    // Core Services
    services_title: "ਸਾਡੀਆਂ ਸੇਵਾਵਾਂ",
    services_subtitle: "ਤੁਹਾਡੇ ਘਰ ਲਈ ਭਰੋਸੇਮੰਦ ਸਥਾਨਕ ਸੇਵਾਵਾਂ।",
    ai_strip_title: "ਏਆਈ ਖਰਚਾ ਅੰਦਾਜ਼ਾ",
    ai_strip_desc: "ਫੋਟੋ ਜਾਂ ਵੀਡੀਓ ਤੋਂ ਤੁਰੰਤ ਖਰਚੇ ਦਾ ਅੰਦਾਜ਼ਾ ਲਗਾਓ।",
    get_estimate_btn: "ਅੰਦਾਜ਼ਾ ਲਓ",
    
    // Category Names
    cat_ac_repair: "ਏਸੀ ਰਿਪੇਅਰ",
    cat_plumber: "ਪਲੰਬਰ",
    cat_electrician: "ਇਲੈਕਟ੍ਰੀਸ਼ੀਅਨ (ਬਿਜਲੀ ਮਿਸਤਰੀ)",
    cat_home_cleaner: "ਘਰ ਦੀ ਸਫ਼ਾਈ",
    cat_cab: "ਕੈਬ / ਟੈਕਸੀ",
    cat_blood_test: "ਘਰ ਬੈਠੇ ਖ਼ੂਨ ਟੈਸਟ",
    cat_personal_chef: "ਰਸੋਈਆ / ਸ਼ੈੱਫ",
    cat_barber_home: "ਘਰ 'ਤੇ ਨਾਈ",
    cat_massage_therapy: "ਮਸਾਜ ਥੈਰੇਪੀ",
    cat_painter: "ਪੇਂਟਰ (ਰੰਗ ਰੋਗਨ)",
    cat_carpenter: "ਤਰਖਾਣ (ਕਾਰਪੈਂਟਰ)",
    cat_labour_work: "ਮਜ਼ਦੂਰ / ਲੇਬਰ ਕੰਮ",
    
    // Providers Section
    providers_title: "ਪ੍ਰਮਾਣਿਤ ਕਾਰੀਗਰ",
    providers_subtitle: "ਤੁਹਾਡੀ ਸੇਵਾ ਲਈ ਤਿਆਰ ਤਜਰਬੇਕਾਰ ਪੇਸ਼ੇਵਰ।",
    filter_all: "ਸਾਰੀਆਂ ਸੇਵਾਵਾਂ",
    id_verified_btn: "ਸਿਰਫ਼ ਆਈਡੀ ਤਸਦੀਕਸ਼ੁਦਾ",
    gender_all: "ਕੋਈ ਵੀ ਜੈਂਡਰ",
    gender_male: "ਸਿਰਫ਼ ਪੁਰਸ਼",
    gender_female: "ਸਿਰਫ਼ ਮਹਿਲਾ",
    price_label: "ਰੇਟ",
    details_btn: "ਵੇਰਵਾ",
    call_btn: "ਕਾਲ ਕਰੋ",
    book_btn: "ਬੁੱਕ ਕਰੋ",
    verified_badge: "✓ ਤਸਦੀਕਸ਼ੁਦਾ",
    
    // Provider Details Popup
    pdm_title: "ਕਾਰੀਗਰ ਦਾ ਪੂਰਾ ਵੇਰਵਾ",
    rate_availability: "ਰੇਟ ਅਤੇ ਉਪਲਬਧਤਾ",
    highlights_label: "ਖ਼ਾਸੀਅਤਾਂ:",
    available_services_label: "ਉਪਲਬਧ ਸੇਵਾਵਾਂ:",
    monthly_plan_title: "ਮਹੀਨਾਵਾਰ ਪਲਾਨ",
    past_work_btn: "ਪਿਛਲਾ ਕੰਮ",
    free_estimate_btn: "ਮੁਫ਼ਤ ਅੰਦਾਜ਼ਾ",
    back_btn: "← ਪਿੱਛੇ",
    close_btn: "ਬੰਦ ਕਰੋ",
    
    // Booking Modal
    schedule_service: "ਸੇਵਾ ਦਾ ਸਮਾਂ ਚੁਣੋ",
    modal_subtitle: "ਪ੍ਰਮਾਣਿਤ ਕਾਰੀਗਰ ਨਾਲ ਸਿੱਧੀ ਬੁਕਿੰਗ",
    full_name_label: "ਪੂਰਾ ਨਾਮ",
    phone_label: "ਮੋਬਾਈਲ ਨੰਬਰ",
    date_label: "ਸੇਵਾ ਦੀ ਮਿਤੀ",
    time_label: "ਪਸੰਦੀਦਾ ਸਮਾਂ",
    address_label: "ਪਤਾ (ਮੋਹਾਲੀ / ਚੰਡੀਗੜ੍ਹ / ਪੰਚਕੂਲਾ)",
    notes_label: "ਕੰਮ ਦਾ ਵੇਰਵਾ (ਵਿਕਲਪਿਕ)",
    confirm_booking_btn: "ਬੁਕਿੰਗ ਪੱਕੀ ਕਰੋ",
    
    // Cab Booking
    cab_title: "ਕੈਬ ਬੁੱਕ ਕਰੋ",
    cab_subtitle: "ਸਿੱਧਾ ਡਰਾਈਵਰ, ਕੋਈ ਸਰਜ ਨਹੀਂ, ਸਫ਼ਰ ਤੋਂ ਬਾਅਦ ਭੁਗਤਾਨ।",
    instant_rides_badge: "⚡ ਤੁਰੰਤ ਸਵਾਰੀ",
    pickup_label: "ਪਿਕਅੱਪ ਥਾਂ",
    drop_label: "ਕਿੱਥੇ ਜਾਣਾ ਹੈ (ਡਰਾਪ)",
    pickup_placeholder: "ਪਿਕਅੱਪ ਪਤਾ ਜਾਂ ਸੈਕਟਰ ਭਰੋ",
    drop_placeholder: "ਮੰਜ਼ਿਲ / ਏਅਰਪੋਰਟ / ਸਟੇਸ਼ਨ ਭਰੋ",
    my_location_btn: "📍 ਮੇਰੀ ਥਾਂ",
    pick_on_map_btn: "🗺️ ਨਕਸ਼ੇ 'ਤੇ ਚੁਣੋ",
    book_cab_btn: "ਕੈਬ ਬੁੱਕ ਕਰੋ",
    police_verified_driver: "ਪੁਲਿਸ ਪ੍ਰਮਾਣਿਤ ਡਰਾਈਵਰ",
    view_safety_details: "ਸੁਰੱਖਿਆ ਵੇਰਵੇ",
    become_driver: "ਡਰਾਈਵਰ ਬਣੋ",
    admin_portal: "ਪ੍ਰਮਾਣੀਕਰਨ ਪੋਰਟਲ",
    report_driver: "ਡਰਾਈਵਰ ਦੀ ਰਿਪੋਰਟ ਕਰੋ",
    share_driver_wa: "ਡਰਾਈਵਰ ਸਾਂਝਾ ਕਰੋ",
    back_btn: "ਪਿੱਛੇ",
    popular_services: "ਪ੍ਰਸਿੱਧ ਸੇਵਾਵਾਂ",
    recently_viewed: "ਹਾਲ ਹੀ ਵਿੱਚ ਦੇਖੇ ਗਏ",
    view_details: "ਵੇਰਵੇ ਦੇਖੋ",
    how_it_works: "ਇਹ ਕਿਵੇਂ ਕੰਮ ਕਰਦਾ ਹੈ",
    frequently_asked: "ਅਕਸਰ ਪੁੱਛੇ ਜਾਂਦੇ ਸਵਾਲ",
    page_not_found_title: "ਪੰਨਾ ਨਹੀਂ ਮਿਲਿਆ",
    page_not_found_desc: "ਜਿਸ ਸੇਵਾ ਜਾਂ ਪ੍ਰਦਾਤਾ ਦੀ ਤੁਸੀਂ ਭਾਲ ਕਰ ਰਹੇ ਹੋ ਉਹ ਮੌਜੂਦ ਨਹੀਂ ਹੈ।",
    leave_confirm_title: "ਕੀ ਤੁਸੀਂ ਬਾਹਰ ਜਾਣਾ ਚਾਹੁੰਦੇ ਹੋ?",
    leave_confirm_desc: "ਤੁਹਾਡੀ ਬੁਕਿੰਗ ਜਾਂ ਯਾਤਰਾ ਅਜੇ ਚਾਲੂ ਹੈ। ਕੀ ਤੁਸੀਂ ਵਾਪਸ ਜਾਣਾ ਚਾਹੁੰਦੇ ਹੋ?",
    calculating_fare: "ਕਿਰਾਇਆ ਗਿਣਿਆ ਜਾ ਰਿਹਾ ਹੈ...",
    est_fare_label: "ਅੰਦਾਜ਼ਨ ਕਿਰਾਇਆ",
    est_distance_label: "ਦੂਰੀ",
    est_duration_label: "ਸਮਾਂ",
    
    // Cab Tracking
    driver_assigned: "ਡਰਾਈਵਰ ਲੱਭ ਗਿਆ",
    driver_on_way: "ਡਰਾਈਵਰ ਰਸਤੇ ਵਿੱਚ ਹੈ",
    driver_arrived: "ਡਰਾਈਵਰ ਪਹੁੰਚ ਗਿਆ",
    trip_started: "ਸਫ਼ਰ ਸ਼ੁਰੂ ਹੋਇਆ",
    trip_completed: "ਸਫ਼ਰ ਪੂਰਾ ਹੋਇਆ",
    otp_label: "ਡਰਾਈਵਰ ਨੂੰ ਓਟੀਪੀ ਦੱਸੋ",
    share_trip_btn: "ਸਫ਼ਰ ਸਾਂਝਾ ਕਰੋ",
    cancel_ride_btn: "ਸਵਾਰੀ ਰੱਦ ਕਰੋ",
    speed_toggle_label: "ਡੈਮੋ ਰਫ਼ਤਾਰ:",
    safety_check_title: "ਕੀ ਸਭ ਠੀਕ ਹੈ?",
    safety_check_desc: "ਤੁਹਾਡੀ ਕੈਬ 30 ਸਕਿੰਟ ਤੋਂ ਵੱਧ ਸਮੇਂ ਤੋਂ ਰੁਕੀ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਦੱਸੋ ਕਿ ਤੁਸੀਂ ਸੁਰੱਖਿਅਤ ਹੋ।",
    im_safe_btn: "ਮੈਂ ਸੁਰੱਖਿਅਤ ਹਾਂ",
    need_help_btn: "ਮਦਦ ਚਾਹੀਦੀ ਹੈ",
    
    // Trip Completed & Review
    trip_completed_title: "ਸਫ਼ਰ ਸੰਪੰਨ!",
    trip_completed_desc: "ਤੁਸੀਂ ਸੁਰੱਖਿਅਤ ਢੰਗ ਨਾਲ ਆਪਣੀ ਮੰਜ਼ਿਲ 'ਤੇ ਪਹੁੰਚ ਗਏ ਹੋ।",
    rate_ride_title: "ਸਫ਼ਰ ਦੀ ਸਮੀਖਿਆ",
    rating_label: "ਡਰਾਈਵਰ ਨੂੰ ਰੇਟਿੰਗ ਦਿਓ",
    driver_tip_label: "ਟਿਪ ਦਿਓ (ਵਿਕਲਪਿਕ)",
    review_placeholder: "ਡਰਾਈਵਰ ਬਾਰੇ ਆਪਣੇ ਵਿਚਾਰ ਲਿਖੋ...",
    submit_review_btn: "ਸਮੀਖਿਆ ਭੇਜੋ",
    my_trips_btn: "ਮੇਰੇ ਸਫ਼ਰ",
    
    // Emergency Panel
    emergency_title: "ਐਮਰਜੈਂਸੀ SOS",
    emergency_subtitle: "ਤੁਰੰਤ ਪੁਲਿਸ, ਐਂਬੂਲੈਂਸ ਅਤੇ ਪਰਿਵਾਰ ਨੂੰ ਲਾਈਵ ਲੋਕੇਸ਼ਨ ਭੇਜੋ",
    police_call_btn: "ਪੁਲਿਸ (112 / 100)",
    ambulance_call_btn: "ਐਂਬੂਲੈਂਸ (102 / 108)",
    women_helpline_btn: "ਮਹਿਲਾ ਹੈਲਪਲਾਈਨ (1091)",
    fire_call_btn: "ਅੱਗ ਬੁਝਾਊ ਵਿਭਾਗ (101)",
    share_location_btn: "ਵਟਸਐਪ 'ਤੇ ਲਾਈਵ ਲੋਕੇਸ਼ਨ ਭੇਜੋ",
    emergency_contacts_title: "ਸੰਭਾਲੇ ਗਏ ਐਮਰਜੈਂਸੀ ਨੰਬਰ",
    add_contact_btn: "ਨਵਾਂ ਨੰਬਰ ਜੋੜੋ",
    save_contacts_btn: "ਨੰਬਰ ਸੇਵ ਕਰੋ",
    
    // AI Estimate Modal
    ai_estimate_modal_title: "ਏਆਈ ਅੰਦਾਜ਼ਾ",
    ai_mode_repair: "ਮੁਰੰਮਤ (ਰਿਪੇਅਰ)",
    ai_mode_install: "ਨਵੀਂ ਫਿਟਿੰਗ",
    ai_drag_drop: "ਫੋਟੋ ਜਾਂ ਵੀਡੀਓ ਇੱਥੇ ਪਾਓ ਜਾਂ ਚੁਣੋ",
    ai_describe_placeholder: "ਸਮੱਸਿਆ ਜਾਂ ਲੋੜੀਂਦੇ ਕੰਮ ਬਾਰੇ ਦੱਸੋ...",
    ai_calculating: "ਏਆਈ ਫੋਟੋ ਦੀ ਜਾਂਚ ਕਰ ਰਿਹਾ ਹੈ...",
    ai_quote_btn: "ਕਾਰੀਗਰਾਂ ਤੋਂ ਰੇਟ ਮੰਗਵਾਓ",
    
    // Voice Assistant
    assistant_title: "ਜ਼ੈਨਸਰਵ ਵੌਇਸ ਅਸਿਸਟੈਂਟ",
    assistant_badge: "ਏਆਈ ਅਧਾਰਤ",
    assistant_listening: "ਸੁਣ ਰਿਹਾ ਹੈ...",
    assistant_processing: "ਤੁਹਾਡੀ ਗੱਲ ਸਮਝੀ ਜਾ ਰਹੀ ਹੈ...",
    assistant_speaking: "ਬੋਲ ਰਿਹਾ ਹੈ...",
    assistant_idle: "ਮਾਈਕ ਦਬਾ ਕੇ ਕਿਸੇ ਵੀ ਬੋਲੀ ਵਿੱਚ ਬੋਲੋ",
    assistant_mic_blocked: "ਮਾਈਕ ਦੀ ਆਗਿਆ ਨਹੀਂ ਮਿਲੀ। ਕਿਰਪਾ ਕਰਕੇ ਹੇਠਾਂ ਲਿਖੋ।",
    assistant_offline_mode: "ਆਫ਼ਲਾਈਨ ਮੋਡ",
    assistant_privacy_note: "ਤੁਹਾਡੀ ਆਵਾਜ਼ ਸਿਰਫ਼ ਲੋੜ ਸਮਝਣ ਲਈ ਵਰਤੀ ਜਾਂਦੀ ਹੈ",
    assistant_try_saying: "ਇਹ ਬੋਲ ਕੇ ਵੇਖੋ:",
    assistant_input_placeholder: "ਬੋਲੋ ਜਾਂ ਆਪਣੀ ਸਮੱਸਿਆ ਇੱਥੇ ਲਿਖੋ...",
    assistant_send_btn: "ਭੇਜੋ",
    assistant_show_providers: "ਕਾਰੀਗਰ ਵੇਖੋ",
    assistant_get_estimate: "ਫੋਟੋ ਤੋਂ ਅੰਦਾਜ਼ਾ ਲਓ",
    assistant_book_now: "ਹੁਣੇ ਬੁੱਕ ਕਰੋ",
    assistant_safety_tip_label: "ਸੁਰੱਖਿਆ ਸੁਝਾਅ:",
    assistant_mute_label: "ਅਵਾਜ਼ ਬੰਦ",
    assistant_stop_speaking: "ਬੋਲਣਾ ਬੰਦ ਕਰੋ",
    
    // Common / Errors
    no_providers_found: "ਕੋਈ ਕਾਰੀਗਰ ਨਹੀਂ ਮਿਲਿਆ। ਕੋਈ ਹੋਰ ਸ਼੍ਰੇਣੀ ਚੁਣੋ ਜਾਂ ਫਿਲਟਰ ਹਟਾਓ।",
    clear_filters_btn: "ਸਾਰੇ ਵਿਖਾਓ",
    no_bookings_yet: "ਅਜੇ ਕੋਈ ਬੁਕਿੰਗ ਨਹੀਂ ਹੈ। ਆਪਣੀ ਪਹਿਲੀ ਸੇਵਾ ਬੁੱਕ ਕਰੋ।",
    browse_services_btn: "ਸੇਵਾਵਾਂ ਵੇਖੋ",
    no_trips_yet: "ਅਜੇ ਕੋਈ ਸਫ਼ਰ ਨਹੀਂ ਹੋਇਆ। ਕੈਬ ਬੁੱਕ ਕਰੋ।",
    home_link: "ਹੋਮ",
    footer_desc: "ਮੋਹਾਲੀ ਅਤੇ ਚੰਡੀਗੜ੍ਹ ਵਿੱਚ ਭਰੋਸੇਯੋਗ ਘਰੇਲੂ ਅਤੇ ਕੈਬ ਸੇਵਾਵਾਂ।"
  },
  
  bho: {
    // Header & Navigation
    nav_services: "सेवा सब",
    nav_providers: "मिस्त्री लोग",
    nav_book_cab: "गाड़ी बुक करीं",
    nav_ai_estimate: "एआई अंदाजा",
    nav_my_bookings: "बुकिंग",
    sos_button: "आपातकाल (SOS)",
    tagline: "सगरी सेवा, एके गो ऐप में",
    city_badge: "📍 मोहाली आ चंडीगढ़",
    
    // Hero
    hero_title: "भरोसेमंद घरेलु सेवा",
    hero_subtitle: "बिना कौनों बिचौलिया के, घरेलु कारीगर आ कैब सीधा बुक करीं।",
    hero_pill: "⚡ जाँचल परsubिटल सेवा",
    search_placeholder: "नल, बिजली, एसी, कैब खोजीं...",
    search_button: "खोजीं",
    popular_label: "खास सेवा:",
    
    // Core Services
    services_title: "हमार सेवा",
    services_subtitle: "रउआ घरे बदे भरोसेमंद लोकल सेवा।",
    ai_strip_title: "एआई खर्चा अंदाजा",
    ai_strip_desc: "फोटो भा वीडियो से तुरंते खर्चा के अंदाजा पाईं।",
    get_estimate_btn: "अंदाजा पाईं",
    
    // Category Names
    cat_ac_repair: "एसी रिपेयर",
    cat_plumber: "नलसाज (प्लंबर)",
    cat_electrician: "बिजली मिस्त्री",
    cat_home_cleaner: "घर के सफाई",
    cat_cab: "गाड़ी भा कैब",
    cat_blood_test: "घरे खून जांच",
    cat_personal_chef: "खाना बनावे वाला / शेफ",
    cat_barber_home: "घरे बाल काटे वाला",
    cat_massage_therapy: "मालिश आ थेरेपी",
    cat_painter: "रंग रोगन / पेंटर",
    cat_carpenter: "बढ़ई (कारपेंटर)",
    cat_labour_work: "मजदूर / लेबर",
    
    // Providers Section
    providers_title: "सत्यापित मिस्त्री",
    providers_subtitle: "रउआ खातिर तैयार जाँचल-परखल कारीगर लोग।",
    filter_all: "सगरी सेवा",
    id_verified_btn: "आईडी जाँचल मात्र",
    gender_all: "कौनो भी",
    gender_male: "मरद मिस्त्री",
    gender_female: "मेहरारू",
    price_label: "खर्चा",
    details_btn: "विवरण",
    call_btn: "फोन करीं",
    book_btn: "बुक करीं",
    verified_badge: "✓ जाँचल",
    
    // Provider Details Popup
    pdm_title: "मिस्त्री के पूरा विवरण",
    rate_availability: "दर आ उपलब्धता",
    highlights_label: "खासियत:",
    available_services_label: "उपलब्ध सेवा सब:",
    monthly_plan_title: "महिनावार योजना",
    past_work_btn: "पहिले के काम",
    free_estimate_btn: "मुफ्त अंदाजा",
    back_btn: "← पाछे",
    close_btn: "बंद करीं",
    
    // Booking Modal
    schedule_service: "बुकिंग के समय चुनीं",
    modal_subtitle: "सत्यापित मिस्त्री से सीधा बात आ बुकिंग",
    full_name_label: "पूरा नाम",
    phone_label: "मोबाइल नंबर",
    date_label: "तारीख",
    time_label: "समय",
    address_label: "पता (मोहाली / चंडीगढ़)",
    notes_label: "का समस्या बा बताईं (मन करे त)",
    confirm_booking_btn: "बुकिंग पक्का करीं",
    
    // Cab Booking
    cab_title: "गाड़ी बुक करीं",
    cab_subtitle: "सीधा ड्राइवर से बात, बिना कवनो फालतू किराया, उतरे पर पईसा।",
    instant_rides_badge: "⚡ तुरंत सवारी",
    pickup_label: "कहाँ से बईठब (पिकअप)",
    drop_label: "कहाँ जाये के बा (ड्रॉप)",
    pickup_placeholder: "पिकअप पता भा सेक्टर लिखीं",
    drop_placeholder: "मंजिल / स्टेशन / एयरपोर्ट लिखीं",
    my_location_btn: "📍 हमार लोकेशन",
    pick_on_map_btn: "🗺️ नक्शा पर चुनीं",
    book_cab_btn: "गाड़ी बुक करीं",
    calculating_fare: "किराया जोड़ा रहल बा...",
    est_fare_label: "अंदाजन किराया",
    est_distance_label: "दूरी",
    est_duration_label: "समय",
    
    // Cab Tracking
    driver_assigned: "ड्राइवर मिल गइलें",
    driver_on_way: "ड्राइवर आ रहल बाड़ें",
    driver_arrived: "ड्राइवर पहुँच गइलें",
    trip_started: "सवारी शुरू भइल",
    trip_completed: "सवारी पूरा भइल",
    otp_label: "ड्राइवर के ओटीपी बताईं",
    share_trip_btn: "सवारी शेयर करीं",
    cancel_ride_btn: "राइड रद्द करीं",
    speed_toggle_label: "डेमो स्पीड:",
    safety_check_title: "का सभे ठीक बा?",
    safety_check_desc: "रउआ गाड़ी 30 सेकंड से बेसी देर से रुक गईल बा। बताईं कि रउआ सुरक्षित बानी ना?",
    im_safe_btn: "हम ठीक बानी",
    need_help_btn: "मदद चाहीं",
    
    // Trip Completed & Review
    trip_completed_title: "सवारी पूरा भइल!",
    trip_completed_desc: "रउआ सकुशल अपनी मंजिल पर पहुँच गइनी।",
    rate_ride_title: "सवारी के रेटिंग",
    rating_label: "ड्राइवर के रेटिंग दीं",
    driver_tip_label: "खुशी से टिप दीं (इच्छा बा त)",
    review_placeholder: "ड्राइवर के बारे में कुछ लिखीं...",
    submit_review_btn: "रेटिंग जमा करीं",
    my_trips_btn: "हमार सवारी",
    
    // Emergency Panel
    emergency_title: "आपातकाल SOS",
    emergency_subtitle: "तुरंत पुलिस, एम्बुलेंस आ घर के लोगन के लोकेशन भेजीं",
    police_call_btn: "पुलिस (112 / 100)",
    ambulance_call_btn: "एम्बुलेंस (102 / 108)",
    women_helpline_btn: "महिला हेल्पलाइन (1091)",
    fire_call_btn: "आग बुझावे वाला (101)",
    share_location_btn: "व्हाट्सएप पर लोकेशन भेजीं",
    emergency_contacts_title: "सुरक्षित कइल नंबर",
    add_contact_btn: "नया नंबर जोड़ीं",
    save_contacts_btn: "नंबर सहेजीं",
    
    // AI Estimate Modal
    ai_estimate_modal_title: "एआई अंदाजा",
    ai_mode_repair: "मरम्मत",
    ai_mode_install: "नया फिटिंग / इंस्टॉलेशन",
    ai_drag_drop: "फोटो भा वीडियो यहाँ डालीं",
    ai_describe_placeholder: "का बिगड़ल बा भा का करावे के बा बताईं...",
    ai_calculating: "एआई फोटो देख के जांच रहल बा...",
    ai_quote_btn: "मिस्त्री लोग से रेट मंगवाईं",
    
    // Voice Assistant
    assistant_title: "ज़ेनसर्व बोल के मदद (Assistant)",
    assistant_badge: "एआई तकनीक",
    assistant_listening: "सुनत बानी...",
    assistant_processing: "रउआ बात समझ रहल बानी...",
    assistant_speaking: "बोल रहल बानी...",
    assistant_idle: "माइक छुईं आ आपन भोजपुरी, हिंदी भा अंग्रेज़ी में बोलीं",
    assistant_mic_blocked: "माइक के इजाजत ना मिलल। नीचे लिख के बताईं।",
    assistant_offline_mode: "ऑफलाइन मोड",
    assistant_privacy_note: "रउआ आवाज के इस्तेमाल खाली समस्या समझे खातिर होला",
    assistant_try_saying: "ई बोल के देखीं:",
    assistant_input_placeholder: "बोलीं भा आपन समस्या यहाँ लिखीं...",
    assistant_send_btn: "भेजीं",
    assistant_show_providers: "मिस्त्री देखीं",
    assistant_get_estimate: "फोटो से अंदाजा लीं",
    assistant_book_now: "अभी बुक करीं",
    assistant_safety_tip_label: "सुरक्षा सलाह:",
    assistant_mute_label: "आवाज बंद",
    assistant_stop_speaking: "बोलल रोकीं",
    
    // Common / Errors
    no_providers_found: "कौनो मिस्त्री ना मिलल। दोसर श्रेणी चुनीं भा फिल्टर हटाईं।",
    clear_filters_btn: "सगरी देखीं",
    no_bookings_yet: "अबतक कौनों बुकिंग नइखे। पहिला सेवा बुक करीं।",
    browse_services_btn: "सेवा देखीं",
    no_trips_yet: "कौनो यात्रा नइखे भइल। गाड़ी बुक करीं।",
    home_link: "पहिला पन्ना",
    footer_desc: "मोहाली आ चंडीगढ़ में घरेलु कारीगर आ गाड़ी के भरोसेमंद सेवा।"
  }
};

/**
 * Multilingual Keywords for Offline / Demo Voice Matching
 * Covers English, Hindi, Punjabi, and Bhojpuri
 */
window.ZENSERVE_MULTILINGUAL_KEYWORDS = {
  Emergency: [
    'emergency', 'police', 'ambulance', 'fire', 'accident', 'danger', 'unsafe', 'help', 'threat', 'thief', 'chori',
    'aag', 'hamla', 'khatra', 'chot', 'khoon', 'hospital', 'gas leak', 'cylinder', 'bijli ka jhatka', 'current',
    'ਅੱਗ', 'ਖ਼ਤਰਾ', 'ਪੁਲਿਸ', 'ਐਂਬੂਲੈਂਸ', 'ਚੋਰੀ', 'ਐਕਸੀਡੈਂਟ', 'ਮਦਦ', 'ਖੂਨ', 'ਬੇਹੋਸ਼', 'ਗੈਸ ਲੀਕ',
    'आग', 'खतरा', 'मदद', 'चोरी', 'पुलिस', 'हादसा', 'गैस लीक', 'सिलेंडर', 'खून', 'अस्पताल', 'मारपीट'
  ],
  Plumber: [
    'plumber', 'pipe', 'leak', 'tap', 'drain', 'flush', 'water tank', 'geyser', 'sewer', 'nal', 'nalasaaz', 'totiyan',
    'pani', 'tapki', 'seepage', 'geyser fitting', 'commode', 'sink', 'basin', 'leakage', 'bathroom',
    'ਪਲੰਬਰ', 'ਪਾਣੀ', 'ਨਲਕਾ', 'ਟੂਟੀ', 'ਪਾਈਪ', 'ਲੀਕ', 'ਟੈਂਕੀ', 'ਸੀਪੇਜ', 'ਨਲ', 'ਗੰਦਾ ਪਾਣੀ', 'ਗ਼ੁਸਲਖ਼ਾਨਾ',
    'नल से पानी', 'नलका', 'टोंटी', 'पनिया चुवत बा', 'पाइप फुटल', 'प्लंबर', 'टंकी', 'गीजर'
  ],
  Electrician: [
    'electrician', 'wiring', 'mcb', 'fuse', 'fan', 'switch', 'light', 'short circuit', 'bijli', 'power cut', 'inverter',
    'geyser connection', 'sparking', 'board', 'motor', 'socket', 'bulb', 'chhat ka pankha',
    'ਇਲੈਕਟ੍ਰੀਸ਼ੀਅਨ', 'ਬਿਜਲੀ', 'ਤਾਰਾਂ', 'ਸਵਿੱਚ', 'ਪੱਖਾ', 'ਫਿਊਜ਼', 'ਲਾਈਟ', 'ਸ਼ਾਰਟ ਸਰਕਟ', 'ਇਨਵਰਟਰ',
    'बिजली नइखे आवत', 'पंखा खराब', 'तार जर गइल', 'स्विच', 'इलेक्ट्रीशियन', 'शार्ट सर्किट', 'बत्ती गुल'
  ],
  'AC Repair': [
    'ac', 'air conditioner', 'cooling', 'gas filling', 'compressor', 'split ac', 'window ac', 'servicing', 'chilling',
    'ac leak', 'remote', 'filter cleaning', 'ac service',
    'ਏਸੀ', 'ਠੰਢਾ ਨਹੀਂ ਕਰ ਰਿਹਾ', 'ਏਸੀ ਰਿਪੇਅਰ', 'ਕੰਪ੍ਰੈਸਰ', 'ਗੈਸ', 'ਏਅਰ ਕੰਡੀਸ਼ਨਰ', 'ਕੂਲਿੰਗ',
    'AC ठंडा नइखे करत', 'हवा नईखे देवल', 'एसी बिगड़ गइल', 'गैस खतम', 'एसी सर्विसिंग'
  ],
  Carpenter: [
    'carpenter', 'door', 'wood', 'furniture', 'almirah', 'cupboard', 'hinge', 'lock', 'table', 'chair', 'bed',
    'darwaza', 'darwaja', 'chokhat', 'tarkhan', 'khati', 'polish', 'modular kitchen', 'wardrobe',
    'ਤਰਖਾਣ', 'ਦਰਵਾਜ਼ਾ', 'ਫਰਨੀਚਰ', 'ਕੁੰਡੀ', 'ਜਿੰਦਾ', 'ਮੇਜ਼', 'ਕੁਰਸੀ', 'ਲੱਕੜ', 'ਅਲਮਾਰੀ', 'ਤਾਲਾ',
    'कपाट', 'दरवाजा जाम', 'काठ के काम', 'बढ़ई', 'कुर्सी टूट गइल', 'पलंग', 'लकड़ी', 'ताला खराब'
  ],
  Painter: [
    'painter', 'paint', 'whitewash', 'distemper', 'waterproofing', 'wall putty', 'damp', 'seepage', 'texture', 'rang',
    'safedi', 'putti', 'diwar', 'rangai',
    'ਪੇਂਟਰ', 'ਰੰਗ', 'ਕੰਧਾਂ', 'ਵਾਈਟ ਵਾਸ਼', 'ਸਫ਼ੇਦੀ', 'ਪੁੱਟੀ', 'ਸੀਲਣ', 'ਰੰਗ ਰੋਗਨ',
    'पेंटर', 'रंग रोगन', 'दीवाल के रंगाई', 'सफेदी', 'पुट्टी', 'पेंट'
  ],
  'Home Cleaning': [
    'cleaning', 'cleaner', 'deep clean', 'sofa clean', 'bathroom clean', 'safai', 'sanitization', 'dusting', 'mop',
    'safai karwana', 'kitchen cleaning', 'water tank clean',
    'ਸਫ਼ਾਈ', 'ਘਰ ਦੀ ਸਫ਼ਾਈ', 'ਸੋਫ਼ਾ ਕਲੀਨਿੰਗ', 'ਝਾੜੂ ਪੋਚਾ', 'ਗੰਦਗੀ', 'ਕਲੀਨਰ',
    'सफाई करावे के बा', 'घर के सफाई', 'सोफा साफ', 'झाड़ू पोछा', 'गंदगी', 'सफाईकर्मी'
  ],
  Cab: [
    'cab', 'taxi', 'ride', 'auto', 'driver', 'airport', 'railway station', 'pick up', 'car ride', 'gaadi',
    'ਕੈਬ', 'ਟੈਕਸੀ', 'ਸਵਾਰੀ', 'ਗੱਡੀ', 'ਆਟੋ', 'ਏਅਰਪੋਰਟ ਕੈਬ', 'ਸਟੇਸ਼ਨ',
    'गाड़ी चाहीं', 'कैब बुक करे के बा', 'टैक्सी', 'गाड़ी', 'ऑटो', 'स्टेशन जाये के बा'
  ],
  'Blood Test': [
    'blood test', 'lab', 'phlebotomist', 'sugar test', 'cbc', 'thyroid', 'lipid', 'sample collection', 'blood report',
    'ਖ਼ੂਨ ਟੈਸਟ', 'ਲੈਬ', 'ਸ਼ੂਗਰ ਟੈਸਟ', 'ਟੈਸਟ ਰਿਪੋਰਟ', 'ਸੈਂਪਲ',
    'खून जांच', 'ब्लड टेस्ट', 'शुगर के जांच', 'सीबीसी', 'लैब वाला चाहीं'
  ],
  'Personal Chef': [
    'cook', 'chef', 'khana', 'rasoi', 'meal', 'tiffin', 'dinner', 'lunch', 'breakfast', 'rotis', 'sabzi',
    'ਖਾਣਾ ਬਣਾਉਣ ਵਾਲਾ', 'ਰਸੋਈਆ', 'ਸ਼ੈੱਫ', 'ਰੋਟੀ', 'ਦੁਪਹਿਰ ਦਾ ਖਾਣਾ', 'ਟਿਫ਼ਿਨ',
    'खाना बनावे वाला', 'रसोइया', 'रोटी बनावे वाला', 'महाराज', 'भोजन बनावे के बा'
  ],
  'Barber at Home': [
    'barber', 'haircut', 'shave', 'beard', 'grooming', 'salon at home', 'baal katana', 'facial',
    'ਵਾਲ ਕੱਟਣੇ', 'ਨਾਈ', 'ਦਾੜ੍ਹੀ', 'ਹੇਅਰ ਕੱਟ', 'ਵਾਲਾਂ ਦੀ ਸੈਟਿੰਗ',
    'बाल काटे वाला', 'हजामत', 'दाढ़ी बनावे के बा', 'नाई चाहीं', 'हेयरकट'
  ],
  'Massage Therapy': [
    'massage', 'therapy', 'physiotherapy', 'body pain', 'back pain', 'spa', 'relief', 'malish',
    'ਮਸਾਜ', 'ਮਾਲਿਸ਼', 'ਸਰੀਰ ਦਾ ਦਰਦ', 'ਪਿੱਠ ਦਰਦ', 'ਫਿਜ਼ੀਓਥੈਰੇਪੀ',
    'मालिश करावे के बा', 'बदन दर्द', 'कमर दर्द', 'मसाज', 'थेरेपी'
  ],
  'Labour Work': [
    'labour', 'labor', 'helper', 'shifting', 'heavy lifting', 'debris', 'construction', 'mazdoor', 'hamali', 'loading',
    'ਮਜ਼ਦੂਰ', 'ਸਮਾਨ ਚੁੱਕਣਾ', 'ਲੇਬਰ', 'ਮਕਾਨ ਬਦਲਣਾ', 'ਮਿੱਟੀ ਰੋੜੀ', 'ਹੈਲਪਰ',
    'मजदूर चाहीं', 'सामान उठाए वाला', 'घर बदले के बा', 'बोझा उठाए वाला', 'लेबर'
  ]
};

// Helper for translation lookup with fallback
window.t = function(key, fallback) {
  const lang = localStorage.getItem('zenserve_language') || 'en';
  const dict = window.ZENSERVE_TRANSLATIONS[lang] || window.ZENSERVE_TRANSLATIONS['en'];
  if (dict && dict[key] !== undefined) {
    return dict[key];
  }
  const enDict = window.ZENSERVE_TRANSLATIONS['en'];
  if (enDict && enDict[key] !== undefined) {
    return enDict[key];
  }
  return fallback || key;
};
