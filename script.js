/**
 * Zenserve - Single Page Application Core JavaScript
 * 
 * Features:
 * 1. English / Hindi Language Localization with localStorage persistence
 * 2. Natural Language Smart Search with English & Hinglish keyword matching
 * 3. Interactive Category filtering with 500ms shimmer skeleton loader
 * 4. Verified-only toggle & multi-attribute sorting
 * 5. Direct Call (tel:) & WhatsApp (wa.me) quick actions
 * 6. "Request a Callback" popup modal with simulation & client-side validation
 * 7. "View reviews" modal with sample reviews & interactive "Write a review" form
 * 8. Sticky mobile emergency bar & pulsing red SOS floating button
 * 9. Friendly empty state with one-click filter reset
 * 
 * Beginner-friendly, modular vanilla JavaScript with zero external libraries.
 */

// =============================================================================
// 1. LOCALIZATION DICTIONARIES (English & Hindi)
// =============================================================================
const i18n = {
  en: {
    // Header
    emergencyPill: "Emergency SOS: 112",
    
    // Hero
    heroTitle: "Find Trusted Local Help in Seconds",
    heroTagline: "Verified plumbers, electricians, AC technicians, cleaning pros and emergency help in your neighborhood. Zero middlemen, direct calls.",
    searchPlaceholder: "Try 'my tap is leaking', 'fan not working', or 'AC thanda nahi kar raha'...",
    searchBtn: "Search",
    
    // Categories
    categoriesTitle: "Browse by Category",
    catPlumber: "Plumber",
    catElectrician: "Electrician",
    catACRepair: "AC Repair",
    catHomeCleaning: "Home Cleaning",
    catBloodTest: "Blood Test at Home",
    catEmergency: "Emergency",
    
    // Emergency Hub
    emergencyEyebrow: "24/7 HELPLINE DIRECTORY",
    emergencyHeading: "Emergency Services",
    emergencySubtitle: "One tap connects directly to official Indian emergency services",
    police: "Police",
    ambulance: "Ambulance",
    fire: "Fire Brigade",
    womenHelpline: "Women Helpline",
    
    // Filters & Sorting
    showingPrefix: "Showing",
    showingSuffix: "providers",
    verifiedOnly: "Verified only",
    sortBy: "Sort by:",
    sortRatingDesc: "Highest Rated (★ 5 → 1)",
    sortDistanceAsc: "Distance (Nearest First)",
    sortRatingAsc: "Lowest Rated (★ 1 → 5)",
    sortReviewsDesc: "Most Reviews",
    sortNameAsc: "Name (A → Z)",
    useLocationBtn: "Use my location",
    useLocationActive: "Near you (Active)",
    showingNearby: "Showing providers near you",
    sortedByDistance: "Sorted by nearest distance",
    distanceAway: "away",
    
    // Provider Cards
    verifiedBadge: "Verified",
    callBtn: "Call",
    whatsappBtn: "WhatsApp",
    bookNowBtn: "Book Now",
    callbackBtn: "Request a Callback",
    viewReviewsBtn: "View reviews",
    reviewsCountSuffix: "reviews",
    responsePrefix: "Arrives in",
    
    // Smart Search Hints
    smartSearchMatchPrefix: "Looks like you need a",
    smartSearchNoMatch: "No match found, try browsing categories below",
    clearFilter: "Clear",
    
    // Empty State
    emptyTitle: "No providers found",
    emptyDesc: "We couldn't find any provider matching your current filters. Try unchecking 'Verified only' or selecting a different category.",
    emptyResetBtn: "Reset All Filters",
    
    // Callback Modal
    cbModalEyebrow: "Zenserve Callback",
    cbModalTitle: "Request a Callback",
    cbModalFrom: "from",
    cbNameLabel: "Your Name",
    cbPhoneLabel: "Phone Number",
    cbProblemLabel: "Describe Your Problem / Service",
    cbNamePlaceholder: "e.g. Rahul Sharma",
    cbPhonePlaceholder: "e.g. 9876543210 (10 digits)",
    cbProblemPlaceholder: "e.g. Kitchen tap leaking, need repair today...",
    cbCancelBtn: "Cancel",
    cbSubmitBtn: "Submit Request",
    cbSuccessTitle: "Request sent! The provider will contact you soon",
    cbSuccessDescPre: "Your callback details have been forwarded to",
    cbSuccessDescPost: "You will receive a direct phone call shortly.",
    cbDoneBtn: "Done",
    
    // Validation Errors
    errNameRequired: "Please enter your full name.",
    errPhoneInvalid: "Please enter a valid 10-digit mobile number.",
    errReviewComment: "Please write a brief review comment.",
    errDateRequired: "Please select a preferred service date.",
    errTimeRequired: "Please choose a time slot.",
    errAddressRequired: "Please enter your service address.",

    // Booking Modal & Confirmation
    bookModalEyebrow: "Direct Appointment Booking",
    bookModalTitle: "Book Service Now",
    bookModalWith: "with",
    bookDateLabel: "Preferred Date",
    bookTimeLabel: "Time Slot",
    bookNameLabel: "Your Full Name",
    bookPhoneLabel: "Mobile Number",
    bookAddressLabel: "Service Address / Location",
    bookNotesLabel: "Special Instructions (Optional)",
    bookPayNote: "Zero upfront fee. Pay provider directly via Cash or UPI after service completion.",
    bookSubmitBtn: "Confirm Booking",
    confirmTitle: "Booking Confirmed!",
    confirmSubtitle: "Your service appointment has been scheduled successfully.",
    confirmIdLabel: "Booking ID:",
    confirmLblProvider: "Provider:",
    confirmLblCategory: "Category:",
    confirmLblDate: "Date & Time:",
    confirmLblAddress: "Address:",
    confirmLblCustomer: "Customer:",
    confirmLblPrice: "Est. Price:",
    confirmPayAfter: "(Pay after work)",
    confirmInfoBanner: "✓ Provider has received your booking details and will arrive at your location within the selected slot.",
    optSlotDefault: "Select a time slot",
    optSlotMorning: "Morning (09:00 AM - 12:00 PM)",
    optSlotAfternoon: "Afternoon (12:00 PM - 03:00 PM)",
    optSlotEvening: "Evening (03:00 PM - 06:00 PM)",
    optSlotLate: "Late Evening (06:00 PM - 09:00 PM)",
    
    // Reviews Modal
    revModalEyebrow: "Verified Customer Feedback",
    revModalTitle: "Customer Reviews",
    revModalFor: "for",
    revSummaryBasedOn: "Based on",
    revSummaryReviews: "reviews",
    revTrustBadge: "100% Genuine Reviews",
    revSummaryHint: "Local neighborhood ratings",
    revListTitle: "What Customers Are Saying",
    revWriteTitle: "Write a Review",
    revWriteInstruction: "Share your experience to help neighbors choose the right provider.",
    revRatingLabel: "Your Rating",
    revAuthorLabel: "Your Name",
    revCommentLabel: "Your Review & Experience",
    revAuthorPlaceholder: "e.g. Priyanshu Sharma",
    revCommentPlaceholder: "Describe work quality, punctuality, and pricing...",
    revSubmitBtn: "Submit Review",
    revSuccessMsg: "Review submitted! It has been added to the reviews list above.",
    
    // Star Rating Descriptions
    starRatingDescriptions: {
      1: "1 / 5 (Poor)",
      2: "2 / 5 (Fair)",
      3: "3 / 5 (Average)",
      4: "4 / 5 (Good)",
      5: "5 / 5 (Excellent)"
    },
    
    // Footer
    footerAbout: "Zenserve is a one-stop directory where people find trusted local services in one place instead of using many apps. Instant calls, direct WhatsApp bookings, and 24x7 emergency helplines.",
    footerPill1: "✓ Zero Middlemen",
    footerPill2: "✓ Direct Phone & WhatsApp",
    footerPill3: "✓ 100% Offline Single Page",
    footerPill4: "✓ 24x7 Emergency Help",
    footerBottom: "© Zenserve Local Services Directory • Fast, Free & Community-Verified.",

    // AI Chat Assistant
    chatBtnLabel: "AI Help",
    chatWidgetTitle: "Zenserve AI Assistant",
    chatStatusText: "Powered by Gemini AI • Multilingual",
    chatStatusFallback: "Smart Keyword Engine • Offline Ready",
    chatWelcomeText: "Hello! 👋 Describe your problem in <strong>any language</strong> (English, Hindi, Hinglish, etc.), and I'll recommend the right service category along with practical tips while you wait for the provider!",
    chatSuggestionsTitle: "Try asking:",
    chatInputPlaceholder: "Describe your problem in any language...",
    typingText: "Analyzing your request...",
    recCategoryLabel: "Recommended Category",
    recTipLabel: "While You Wait Tip",
    recViewProviders: "View Providers",
    recBookNow: "Book Top Provider",
    recEmergencyAction: "Open Emergency Helplines",
    recBadgeAI: "Gemini AI",
    recBadgeFallback: "Smart Fallback",
    chatKeySaved: "API key saved successfully!",
    chatFallbackNotice: "Smart keyword match applied."
  },
  
  hi: {
    // Header
    emergencyPill: "इमरजेंसी हेल्पलाइन: 112",
    
    // Hero
    heroTitle: "कुछ ही सेकंडों में विश्वसनीय स्थानीय मदद पाएं",
    heroTagline: "आपके पड़ोस में सत्यापित प्लंबर, इलेक्ट्रीशियन, एसी मैकेनिक, सफाई पेशेवर और आपातकालीन सहायता। बिना किसी बिचौलिए के, सीधे फोन पर बात करें।",
    searchPlaceholder: "लिखें जैसे 'nal se paani tapak raha hai', 'bijli nahi aa rahi', या 'AC thanda nahi kar raha'...",
    searchBtn: "खोजें",
    
    // Categories
    categoriesTitle: "श्रेणी अनुसार खोजें",
    catPlumber: "प्लंबर",
    catElectrician: "इलेक्ट्रीशियन",
    catACRepair: "एसी रिपेयर",
    catHomeCleaning: "होम क्लीनिंग",
    catBloodTest: "ब्लड टेस्ट एट होम",
    catEmergency: "इमरजेंसी",
    
    // Emergency Hub
    emergencyEyebrow: "24/7 आपातकालीन डायरेक्टरी",
    emergencyHeading: "आपातकालीन सेवाएं",
    emergencySubtitle: "एक टैप में आधिकारिक भारतीय आपातकालीन सेवाओं से सीधे संपर्क करें",
    police: "पुलिस",
    ambulance: "एम्बुलेंस",
    fire: "फायर ब्रिगेड",
    womenHelpline: "महिला हेल्पलाइन",
    
    // Filters & Sorting
    showingPrefix: "कुल",
    showingSuffix: "प्रदाता उपलब्ध",
    verifiedOnly: "केवल सत्यापित",
    sortBy: "क्रमबद्ध करें:",
    sortRatingDesc: "उच्चतम रेटिंग (★ 5 → 1)",
    sortDistanceAsc: "दूरी (निकटतम पहले)",
    sortRatingAsc: "न्यूनतम रेटिंग (★ 1 → 5)",
    sortReviewsDesc: "सर्वाधिक समीक्षाएं",
    sortNameAsc: "नाम अनुसार (A → Z)",
    useLocationBtn: "मेरे स्थान का उपयोग करें",
    useLocationActive: "आपके नज़दीक (सक्रिय)",
    showingNearby: "आपके नजदीकी प्रदाता दिखाए जा रहे हैं",
    sortedByDistance: "दूरी अनुसार क्रमबद्ध",
    distanceAway: "दूर",
    
    // Provider Cards (NOTE: Provider names remain unchanged)
    verifiedBadge: "सत्यापित",
    callBtn: "कॉल करें",
    whatsappBtn: "व्हाट्सएप",
    bookNowBtn: "अभी बुक करें",
    callbackBtn: "कॉलबैक का अनुरोध करें",
    viewReviewsBtn: "समीक्षाएं देखें",
    reviewsCountSuffix: "समीक्षाएं",
    responsePrefix: "पहुंचने का समय",
    
    // Smart Search Hints
    smartSearchMatchPrefix: "ऐसा लगता है कि आपको आवश्यकता है:",
    smartSearchNoMatch: "कोई मेल नहीं मिला, कृपया नीचे दी गई श्रेणियों में से चुनें",
    clearFilter: "हटाएं",
    
    // Empty State
    emptyTitle: "कोई प्रदाता नहीं मिला",
    emptyDesc: "वर्तमान फ़िल्टर के अनुसार कोई प्रदाता नहीं मिला। कृपया 'केवल सत्यापित' को हटाएं या कोई अन्य श्रेणी चुनें।",
    emptyResetBtn: "सभी फ़िल्टर रीसेट करें",
    
    // Callback Modal
    cbModalEyebrow: "ज़ेनसर्व कॉलबैक",
    cbModalTitle: "कॉलबैक का अनुरोध करें",
    cbModalFrom: "प्रदाता:",
    cbNameLabel: "आपका नाम",
    cbPhoneLabel: "फ़ोन नंबर",
    cbProblemLabel: "अपनी समस्या या सेवा का विवरण दें",
    cbNamePlaceholder: "उदा. राहुल शर्मा",
    cbPhonePlaceholder: "उदा. 9876543210 (10 अंक)",
    cbProblemPlaceholder: "उदा. किचन का नल टपक रहा है, आज ही मरम्मत चाहिए...",
    cbCancelBtn: "रद्द करें",
    cbSubmitBtn: "अनुरोध भेजें",
    cbSuccessTitle: "अनुरोध भेज दिया गया! प्रदाता जल्द ही आपसे संपर्क करेगा",
    cbSuccessDescPre: "आपके कॉलबैक का विवरण सफलतापूर्वक भेज दिया गया है:",
    cbSuccessDescPost: "आपको थोड़ी ही देर में सीधे फोन कॉल प्राप्त होगी।",
    cbDoneBtn: "ठीक है",
    
    // Validation Errors
    errNameRequired: "कृपया अपना पूरा नाम दर्ज करें।",
    errPhoneInvalid: "कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें।",
    errReviewComment: "कृपया अपनी समीक्षा टिप्पणी लिखें।",
    errDateRequired: "कृपया सेवा की तारीख चुनें।",
    errTimeRequired: "कृपया एक समय स्लॉट चुनें।",
    errAddressRequired: "कृपया अपना सेवा पता दर्ज करें।",

    // Booking Modal & Confirmation
    bookModalEyebrow: "सीधी अपॉइंटमेंट बुकिंग",
    bookModalTitle: "अभी सेवा बुक करें",
    bookModalWith: "प्रदाता:",
    bookDateLabel: "पसंदीदा तारीख",
    bookTimeLabel: "समय स्लॉट",
    bookNameLabel: "आपका पूरा नाम",
    bookPhoneLabel: "मोबाइल नंबर",
    bookAddressLabel: "सेवा का पता / स्थान",
    bookNotesLabel: "विशेष निर्देश (वैकल्पिक)",
    bookPayNote: "कोई अग्रिम शुल्क नहीं। काम पूरा होने के बाद नकद या यूपीआई द्वारा सीधे प्रदाता को भुगतान करें।",
    bookSubmitBtn: "बुकिंग की पुष्टि करें",
    confirmTitle: "बुकिंग कन्फर्म हो गई!",
    confirmSubtitle: "आपकी सेवा अपॉइंटमेंट सफलतापूर्वक निर्धारित कर दी गई है।",
    confirmIdLabel: "बुकिंग आईडी:",
    confirmLblProvider: "प्रदाता:",
    confirmLblCategory: "श्रेणी:",
    confirmLblDate: "तारीख और समय:",
    confirmLblAddress: "पता:",
    confirmLblCustomer: "ग्राहक:",
    confirmLblPrice: "अनुमानित शुल्क:",
    confirmPayAfter: "(काम के बाद भुगतान)",
    confirmInfoBanner: "✓ प्रदाता को आपकी बुकिंग की जानकारी मिल गई है और वे चयनित समय में आपके पते पर पहुंच जाएंगे।",
    optSlotDefault: "समय स्लॉट चुनें",
    optSlotMorning: "सुबह (09:00 AM - 12:00 PM)",
    optSlotAfternoon: "दोपहर (12:00 PM - 03:00 PM)",
    optSlotEvening: "शाम (03:00 PM - 06:00 PM)",
    optSlotLate: "देर शाम (06:00 PM - 09:00 PM)",
    
    // Reviews Modal
    revModalEyebrow: "सत्यापित ग्राहक प्रतिक्रिया",
    revModalTitle: "ग्राहक समीक्षाएं",
    revModalFor: "प्रदाता:",
    revSummaryBasedOn: "कुल",
    revSummaryReviews: "समीक्षाओं पर आधारित",
    revTrustBadge: "100% प्रामाणिक समीक्षाएं",
    revSummaryHint: "स्थानीय ग्राहकों की रेटिंग",
    revListTitle: "ग्राहक क्या कहते हैं",
    revWriteTitle: "समीक्षा लिखें",
    revWriteInstruction: "अपना अनुभव साझा करें ताकि पड़ोसियों को सही प्रदाता चुनने में मदद मिल सके।",
    revRatingLabel: "आपकी रेटिंग",
    revAuthorLabel: "आपका नाम",
    revCommentLabel: "आपकी समीक्षा और अनुभव",
    revAuthorPlaceholder: "उदा. प्रियांशु शर्मा",
    revCommentPlaceholder: "काम की गुणवत्ता, समय की पाबंदी और शुल्क के बारे में बताएं...",
    revSubmitBtn: "समीक्षा सबमिट करें",
    revSuccessMsg: "समीक्षा सबमिट हो गई! इसे ऊपर दी गई समीक्षा सूची में जोड़ दिया गया है।",
    
    // Star Rating Descriptions
    starRatingDescriptions: {
      1: "1 / 5 (खराब)",
      2: "2 / 5 (साधारण)",
      3: "3 / 5 (औसत)",
      4: "4 / 5 (अच्छा)",
      5: "5 / 5 (उत्कृष्ट)"
    },
    
    // Footer
    footerAbout: "ज़ेनसर्व एक समग्र डायरेक्टरी है जहाँ लोग कई अलग-अलग ऐप्स के बजाय एक ही स्थान पर विश्वसनीय स्थानीय सेवाएं पा सकते हैं। त्वरित कॉल, सीधे व्हाट्सएप बुकिंग, और 24x7 आपातकालीन हेल्पलाइन।",
    footerPill1: "✓ शून्य बिचौलिए",
    footerPill2: "✓ सीधा फोन व व्हाट्सएप",
    footerPill3: "✓ 100% ऑफलाइन सिंगल पेज",
    footerPill4: "✓ 24x7 आपातकालीन मदद",
    footerBottom: "© ज़ेनसर्व स्थानीय सेवा डायरेक्टरी • तेज़, मुफ़्त और समुदाय-सत्यापित।",

    // AI Chat Assistant
    chatBtnLabel: "AI सहायता",
    chatWidgetTitle: "ज़ेनसर्व AI सहायक",
    chatStatusText: "Gemini AI द्वारा संचालित • बहुभाषी",
    chatStatusFallback: "स्मार्ट कीवर्ड इंजन • ऑफलाइन सक्षम",
    chatWelcomeText: "नमस्ते! 👋 अपनी समस्या किसी भी भाषा (हिंदी, हिंग्लिश, अंग्रेज़ी आदि) में बताएं। मैं सही सेवा श्रेणी का सुझाव दूंगा और तकनीशियन के आने तक काम आने वाले उपयोगी टिप्स दूंगा!",
    chatSuggestionsTitle: "उदाहरण के लिए पूछें:",
    chatInputPlaceholder: "अपनी समस्या किसी भी भाषा में लिखें...",
    typingText: "आपकी समस्या का विश्लेषण कर रहे हैं...",
    recCategoryLabel: "सुझाई गई श्रेणी",
    recTipLabel: "प्रदाता के आने तक उपयोगी टिप",
    recViewProviders: "प्रदाता देखें",
    recBookNow: "शीर्ष प्रदाता बुक करें",
    recEmergencyAction: "आपातकालीन हेल्पलाइन खोलें",
    recBadgeAI: "Gemini AI",
    recBadgeFallback: "स्मार्ट फॉलबैक",
    chatKeySaved: "API कुंजी सफलतापूर्वक सहेजी गई!",
    chatFallbackNotice: "स्मार्ट कीवर्ड मिलान लागू किया गया।"
  }
};

// =============================================================================
// 2. SMART SEARCH NATURAL LANGUAGE DICTIONARY (English & Hinglish)
// =============================================================================
const smartSearchDictionary = {
  "Plumber": [
    // English keywords & phrases
    "tap leaking", "leaking tap", "leak", "leaking", "pipe", "pipeline", "plumber", "plumbing", 
    "drain", "drainage", "clogged", "clog", "blocked sink", "flush", "flush tank", "commode", 
    "water motor", "motor installation", "water tank", "tank cleaning", "faucet", "shower repair", 
    "bathroom leakage", "sink repair", "sanitary", "geyser pipe", "borewell",
    // Hinglish keywords & phrases
    "nal se paani tapak raha hai", "paani tapak raha hai", "nal tapak raha", "nal kharab", 
    "nal theek karna", "pipe phat gaya", "pipeline toot gayi", "nal leak kar raha hai", 
    "paani beh raha hai", "paani ki samasya", "ganda paani", "naali jaam hai", "pipe jaam", 
    "tanki ki safai", "tanki safai", "motor nahi chal rahi", "motor kharab"
  ],
  "Electrician": [
    // English keywords & phrases
    "fan not working", "ceiling fan", "fan repair", "short circuit", "light", "switch", "switchboard", 
    "fuse", "mcb trip", "mcb", "wiring", "electrician", "electrical", "electric", "socket", 
    "power cut", "sparking", "bulb", "tube light", "inverter repair", "inverter battery", 
    "ch行为elier", "geyser not heating", "current",
    // Hinglish keywords & phrases
    "bijli nahi aa rahi", "bijli chali gayi", "bijli kharab", "fan kharab", "pankha nahi chal raha", 
    "pankha kharab hai", "short circuit ho gaya", "spark ho raha hai", "switch kharab hai", 
    "current aa raha hai", "inverter theek karna", "fuse ud gaya", "line kharab hai", "taar toot gayi"
  ],
  "AC Repair": [
    // English keywords & phrases
    "ac not cooling", "ac not working", "ac cooling", "ac repair", "ac service", "ac installation", 
    "ac gas", "gas refill", "gas leakage", "air conditioner", "split ac", "window ac", "compressor", 
    "ac filter", "ac servicing", "cooling problem", "ac making noise", "ac dripping water",
    // Hinglish keywords & phrases
    "ac thanda nahi kar raha", "ac thanda nahi kar raha hai", "cooling nahi ho rahi", 
    "ac se paani tapak raha hai", "ac se pani gir raha hai", "ac awaz kar raha hai", 
    "ac gas khatam", "ac gas bharwana", "ac service karwana hai", "ac kharab hai", "ac chal nahi raha"
  ],
  "Home Cleaning": [
    // English keywords & phrases
    "deep cleaning", "house cleaning", "home cleaning", "bathroom cleaning", "kitchen cleaning", 
    "sofa cleaning", "carpet cleaning", "cleaning", "maid", "dusting", "mopping", "full house clean", 
    "pest control", "termites", "cockroach control", "floor scrubbing", "balcony cleaning",
    // Hinglish keywords & phrases
    "ghar ki safai", "safai karwani hai", "safai", "bathroom ki safai", "kitchen ki safai", 
    "sofa dholna", "kamra safai", "maid chahiye", "pest control karwana hai", "keede makode", 
    "deep clean karwana hai", "diwali safai"
  ],
  "Blood Test at Home": [
    // English keywords & phrases
    "blood test", "blood sample", "cbc", "thyroid", "sugar test", "diabetes test", "lipid profile", 
    "vitamin test", "lab test", "pathology", "home sample collection", "doctor test", "full body checkup", 
    "hba1c", "dengue test", "platelet test", "urine test",
    // Hinglish keywords & phrases
    "khoon ki janch", "khoon test", "blood checkup", "sugar check karwana hai", "lab test ghar par", 
    "khoon ka sample", "doctor ne test likha hai", "janch karwani hai", "sample lene ghar aao"
  ],
  "Emergency": [
    // English keywords & phrases
    "police", "ambulance", "fire", "fire brigade", "theft", "accident", "emergency", "sos", 
    "robbery", "women helpline", "urgent help", "hospital", "patient critical", "hazard",
    // Hinglish keywords & phrases
    "aag lag gayi", "aag lagi hai", "chori ho gayi", "accident ho gaya", "turant madad chahiye", 
    "hospital jana hai", "ambulance chahiye", "police ko bulao", "madad", "khatra"
  ]
};

// =============================================================================
// 3. APPLICATION STATE
// =============================================================================
const state = {
  // Read saved language from localStorage, default to 'en'
  currentLang: localStorage.getItem("zenserve_lang") || "en",
  
  // Active category filter (null means All Categories)
  activeCategory: null,
  
  // Verified Only filter toggle
  verifiedOnly: false,
  
  // Current sort selection ('rating-desc', 'distance-asc', 'rating-asc', 'reviews-desc', 'name-asc')
  sortBy: "rating-desc",
  
  // Location-based sort active state
  isLocationActive: false,
  
  // Active search query
  searchQuery: "",
  
  // Smart detected category from natural language search
  detectedCategory: null,
  
  // Provider currently being viewed in the Reviews modal
  currentReviewProvider: null,

  // Provider currently being booked
  activeBookingProvider: null,
  
  // Star rating selected in the "Write a Review" form (1 to 5)
  selectedStarRating: 5
};

// =============================================================================
// 4. DOM ELEMENTS CACHE
// =============================================================================
const dom = {
  // Language Buttons
  langEnBtn: document.getElementById("langEnBtn"),
  langHiBtn: document.getElementById("langHiBtn"),
  
  // Header
  headerEmergencyPill: document.getElementById("headerEmergencyPill"),
  
  // Hero Section
  heroTitle: document.getElementById("heroTitle"),
  heroTagline: document.getElementById("heroTagline"),
  searchInput: document.getElementById("searchInput"),
  searchBtn: document.getElementById("searchBtn"),
  searchSuggestionBanner: document.getElementById("searchSuggestionBanner"),
  searchSuggestionText: document.getElementById("searchSuggestionText"),
  clearSearchBtn: document.getElementById("clearSearchBtn"),
  useLocationBtn: document.getElementById("useLocationBtn"),
  useLocationBtnText: document.getElementById("useLocationBtnText"),
  
  // Category Section
  categoriesHeading: document.getElementById("categoriesHeading"),
  categoryCards: document.querySelectorAll(".category-card"),
  
  // Emergency Section
  emergencyHeading: document.getElementById("emergencyHeading"),
  emergencySubtitle: document.getElementById("emergencySubtitle"),
  policeBtnLabel: document.getElementById("policeBtnLabel"),
  ambulanceBtnLabel: document.getElementById("ambulanceBtnLabel"),
  fireBtnLabel: document.getElementById("fireBtnLabel"),
  womenBtnLabel: document.getElementById("womenBtnLabel"),
  
  // Location Status Banner
  locationBanner: document.getElementById("locationBanner"),
  locationBannerText: document.getElementById("locationBannerText"),
  locationSortedBadge: document.getElementById("locationSortedBadge"),
  clearLocationBtn: document.getElementById("clearLocationBtn"),

  // Providers & Filter Controls
  resultsCount: document.getElementById("resultsCount"),
  activeCategoryPill: document.getElementById("activeCategoryPill"),
  activeCategoryName: document.getElementById("activeCategoryName"),
  clearCategoryBtn: document.getElementById("clearCategoryBtn"),
  verifiedOnlyToggle: document.getElementById("verifiedOnlyToggle"),
  verifiedOnlyLabelText: document.getElementById("verifiedOnlyLabelText"),
  sortSelect: document.getElementById("sortSelect"),
  sortLabelText: document.getElementById("sortLabelText"),
  optSortRatingDesc: document.getElementById("optSortRatingDesc"),
  optSortDistanceAsc: document.getElementById("optSortDistanceAsc"),
  optSortRatingAsc: document.getElementById("optSortRatingAsc"),
  optSortReviewsDesc: document.getElementById("optSortReviewsDesc"),
  optSortNameAsc: document.getElementById("optSortNameAsc"),
  providersContainer: document.getElementById("providersContainer"),
  emptyState: document.getElementById("emptyState"),
  emptyTitle: document.getElementById("emptyTitle"),
  emptyDesc: document.getElementById("emptyDesc"),
  resetFiltersBtn: document.getElementById("resetFiltersBtn"),
  
  // Callback Popup Modal
  callbackModal: document.getElementById("callbackModal"),
  modalCloseBtn: document.getElementById("modalCloseBtn"),
  modalCancelBtn: document.getElementById("modalCancelBtn"),
  callbackForm: document.getElementById("callbackForm"),
  modalEyebrow: document.getElementById("modalEyebrow"),
  modalTitle: document.getElementById("modalTitle"),
  modalProviderSubtitle: document.getElementById("modalProviderSubtitle"),
  labelCbName: document.getElementById("labelCbName"),
  labelCbPhone: document.getElementById("labelCbPhone"),
  labelCbProblem: document.getElementById("labelCbProblem"),
  cbName: document.getElementById("cbName"),
  cbPhone: document.getElementById("cbPhone"),
  cbProblem: document.getElementById("cbProblem"),
  nameError: document.getElementById("nameError"),
  phoneError: document.getElementById("phoneError"),
  modalSubmitBtn: document.getElementById("modalSubmitBtn"),
  callbackSuccess: document.getElementById("callbackSuccess"),
  successTitleText: document.getElementById("successTitleText"),
  successDescPre: document.getElementById("successDescPre"),
  successProviderName: document.getElementById("successProviderName"),
  successDescPost: document.getElementById("successDescPost"),
  modalDoneBtn: document.getElementById("modalDoneBtn"),
  
  // Reviews Modal
  reviewsModal: document.getElementById("reviewsModal"),
  reviewsModalCloseBtn: document.getElementById("reviewsModalCloseBtn"),
  reviewsModalEyebrow: document.getElementById("reviewsModalEyebrow"),
  reviewsModalTitle: document.getElementById("reviewsModalTitle"),
  reviewsProviderSubtitle: document.getElementById("reviewsProviderSubtitle"),
  summaryRatingNum: document.getElementById("summaryRatingNum"),
  summaryStarsVisual: document.getElementById("summaryStarsVisual"),
  summaryReviewsCount: document.getElementById("summaryReviewsCount"),
  trustBadgeText: document.getElementById("trustBadgeText"),
  summaryHintText: document.getElementById("summaryHintText"),
  reviewsListTitle: document.getElementById("reviewsListTitle"),
  reviewsCounterPill: document.getElementById("reviewsCounterPill"),
  reviewsListContainer: document.getElementById("reviewsListContainer"),
  writeReviewTitle: document.getElementById("writeReviewTitle"),
  writeReviewInstruction: document.getElementById("writeReviewInstruction"),
  labelReviewStars: document.getElementById("labelReviewStars"),
  starRatingPicker: document.getElementById("starRatingPicker"),
  starScoreDisplay: document.getElementById("starScoreDisplay"),
  selectedStarInput: document.getElementById("selectedStarInput"),
  labelReviewAuthor: document.getElementById("labelReviewAuthor"),
  reviewAuthorInput: document.getElementById("reviewAuthorInput"),
  reviewAuthorError: document.getElementById("reviewAuthorError"),
  labelReviewComment: document.getElementById("labelReviewComment"),
  reviewCommentInput: document.getElementById("reviewCommentInput"),
  reviewCommentError: document.getElementById("reviewCommentError"),
  reviewSuccessBanner: document.getElementById("reviewSuccessBanner"),
  reviewSuccessText: document.getElementById("reviewSuccessText"),
  submitReviewBtnText: document.getElementById("submitReviewBtnText"),
  writeReviewForm: document.getElementById("writeReviewForm"),

  // Booking Modal
  bookingModal: document.getElementById("bookingModal"),
  bookingModalCloseBtn: document.getElementById("bookingModalCloseBtn"),
  bookingCancelBtn: document.getElementById("bookingCancelBtn"),
  bookingForm: document.getElementById("bookingForm"),
  bookingModalEyebrow: document.getElementById("bookingModalEyebrow"),
  bookingModalTitle: document.getElementById("bookingModalTitle"),
  bookingProviderSubtitle: document.getElementById("bookingProviderSubtitle"),
  bookingCatBadge: document.getElementById("bookingCatBadge"),
  bookingBarProviderName: document.getElementById("bookingBarProviderName"),
  bookingBarPrice: document.getElementById("bookingBarPrice"),
  bookDate: document.getElementById("bookDate"),
  bookTimeSlot: document.getElementById("bookTimeSlot"),
  bookName: document.getElementById("bookName"),
  bookPhone: document.getElementById("bookPhone"),
  bookAddress: document.getElementById("bookAddress"),
  bookNotes: document.getElementById("bookNotes"),
  bookDateError: document.getElementById("bookDateError"),
  bookTimeError: document.getElementById("bookTimeError"),
  bookNameError: document.getElementById("bookNameError"),
  bookPhoneError: document.getElementById("bookPhoneError"),
  bookAddressError: document.getElementById("bookAddressError"),
  labelBookDate: document.getElementById("labelBookDate"),
  labelBookTime: document.getElementById("labelBookTime"),
  labelBookName: document.getElementById("labelBookName"),
  labelBookPhone: document.getElementById("labelBookPhone"),
  labelBookAddress: document.getElementById("labelBookAddress"),
  labelBookNotes: document.getElementById("labelBookNotes"),
  optSlotDefault: document.getElementById("optSlotDefault"),
  optSlotMorning: document.getElementById("optSlotMorning"),
  optSlotAfternoon: document.getElementById("optSlotAfternoon"),
  optSlotEvening: document.getElementById("optSlotEvening"),
  optSlotLate: document.getElementById("optSlotLate"),
  bookingPayNote: document.getElementById("bookingPayNote"),
  bookingSubmitBtnText: document.getElementById("bookingSubmitBtnText"),
  bookingConfirmation: document.getElementById("bookingConfirmation"),
  confirmTitle: document.getElementById("confirmTitle"),
  confirmSubtitle: document.getElementById("confirmSubtitle"),
  confirmIdLabel: document.getElementById("confirmIdLabel"),
  confirmBookingId: document.getElementById("confirmBookingId"),
  confirmLblProvider: document.getElementById("confirmLblProvider"),
  confirmProviderName: document.getElementById("confirmProviderName"),
  confirmLblCategory: document.getElementById("confirmLblCategory"),
  confirmCategory: document.getElementById("confirmCategory"),
  confirmLblDate: document.getElementById("confirmLblDate"),
  confirmDateTime: document.getElementById("confirmDateTime"),
  confirmLblAddress: document.getElementById("confirmLblAddress"),
  confirmAddress: document.getElementById("confirmAddress"),
  confirmLblCustomer: document.getElementById("confirmLblCustomer"),
  confirmCustomer: document.getElementById("confirmCustomer"),
  confirmLblPrice: document.getElementById("confirmLblPrice"),
  confirmPrice: document.getElementById("confirmPrice"),
  confirmInfoBanner: document.getElementById("confirmInfoBanner"),
  bookingDoneBtn: document.getElementById("bookingDoneBtn"),
  
  // Footer
  footerAboutLine: document.getElementById("footerAboutLine"),
  footerPill1: document.getElementById("footerPill1"),
  footerPill2: document.getElementById("footerPill2"),
  footerPill3: document.getElementById("footerPill3"),
  footerPill4: document.getElementById("footerPill4"),
  footerBottomCopy: document.getElementById("footerBottomCopy"),
  
  // Floating SOS Button
  sosFloatingBtn: document.getElementById("sosFloatingBtn"),

  // Floating AI Chat Assistant & Widget
  chatFloatingBtn: document.getElementById("chatFloatingBtn"),
  chatOpenIcon: document.querySelector(".chat-open-icon"),
  chatCloseIcon: document.querySelector(".chat-close-icon"),
  chatBtnLabel: document.getElementById("chatBtnLabel"),
  chatWidget: document.getElementById("chatWidget"),
  chatWidgetTitle: document.getElementById("chatWidgetTitle"),
  chatStatusText: document.getElementById("chatStatusText"),
  chatSettingsBtn: document.getElementById("chatSettingsBtn"),
  chatCloseBtn: document.getElementById("chatCloseBtn"),
  chatKeyConfig: document.getElementById("chatKeyConfig"),
  customApiKeyInput: document.getElementById("customApiKeyInput"),
  saveApiKeyBtn: document.getElementById("saveApiKeyBtn"),
  chatMessages: document.getElementById("chatMessages"),
  chatWelcomeText: document.getElementById("chatWelcomeText"),
  chatSuggestionsTitle: document.getElementById("chatSuggestionsTitle"),
  chatTypingIndicator: document.getElementById("chatTypingIndicator"),
  typingText: document.getElementById("typingText"),
  chatForm: document.getElementById("chatForm"),
  chatInput: document.getElementById("chatInput"),
  chatSendBtn: document.getElementById("chatSendBtn"),

  // Demo Mode
  demoModeBtn: document.getElementById("demoModeBtn")
};

// =============================================================================
// 5. HELPER FUNCTIONS
// =============================================================================

/**
 * Returns translated string for category name
 */
function getCategoryTranslation(categoryKey) {
  const t = i18n[state.currentLang];
  switch (categoryKey) {
    case "Plumber": return t.catPlumber;
    case "Electrician": return t.catElectrician;
    case "AC Repair": return t.catACRepair;
    case "Home Cleaning": return t.catHomeCleaning;
    case "Blood Test at Home": return t.catBloodTest;
    case "Emergency": return t.catEmergency;
    default: return categoryKey;
  }
}

/**
 * Generates visual star rating string (e.g., "★★★★★" or "★★★★☆")
 */
function getStarString(rating) {
  const rounded = Math.round(rating);
  let stars = "";
  for (let i = 1; i <= 5; i++) {
    stars += i <= rounded ? "★" : "☆";
  }
  return stars;
}

/**
 * Escapes HTML characters to prevent XSS in user review inputs
 */
function escapeHTML(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// =============================================================================
// 6. LANGUAGE SWITCHER (EN / HI)
// =============================================================================

/**
 * Applies the selected language across all UI elements and saves to localStorage
 */
function setLanguage(lang) {
  if (!i18n[lang]) lang = "en";
  state.currentLang = lang;
  localStorage.setItem("zenserve_lang", lang);
  
  const t = i18n[lang];
  
  // Update Header active toggle styling
  if (dom.langEnBtn && dom.langHiBtn) {
    dom.langEnBtn.classList.toggle("active", lang === "en");
    dom.langHiBtn.classList.toggle("active", lang === "hi");
    dom.langEnBtn.setAttribute("aria-pressed", lang === "en");
    dom.langHiBtn.setAttribute("aria-pressed", lang === "hi");
  }
  
  // Header text
  if (dom.headerEmergencyPill) {
    dom.headerEmergencyPill.textContent = t.emergencyPill;
  }
  
  // Hero texts
  if (dom.heroTitle) dom.heroTitle.textContent = t.heroTitle;
  if (dom.heroTagline) dom.heroTagline.textContent = t.heroTagline;
  if (dom.searchInput) dom.searchInput.placeholder = t.searchPlaceholder;
  if (dom.searchBtn) {
    const btnSpan = dom.searchBtn.querySelector("span");
    if (btnSpan) btnSpan.textContent = t.searchBtn;
  }
  
  // Categories section title & category cards
  if (dom.categoriesHeading) dom.categoriesHeading.textContent = t.categoriesTitle;
  dom.categoryCards.forEach(card => {
    const cat = card.getAttribute("data-category");
    const nameEl = card.querySelector(".category-name");
    if (nameEl) nameEl.textContent = getCategoryTranslation(cat);
  });
  
  // Emergency hub texts
  if (dom.emergencyHeading) dom.emergencyHeading.textContent = t.emergencyHeading;
  if (dom.emergencySubtitle) dom.emergencySubtitle.textContent = t.emergencySubtitle;
  if (dom.policeBtnLabel) dom.policeBtnLabel.textContent = t.police;
  if (dom.ambulanceBtnLabel) dom.ambulanceBtnLabel.textContent = t.ambulance;
  if (dom.fireBtnLabel) dom.fireBtnLabel.textContent = t.fire;
  if (dom.womenBtnLabel) dom.womenBtnLabel.textContent = t.womenHelpline;
  
  // Location button & status texts
  if (dom.useLocationBtnText) {
    dom.useLocationBtnText.textContent = state.isLocationActive ? t.useLocationActive : t.useLocationBtn;
  }
  if (dom.locationBannerText) dom.locationBannerText.textContent = t.showingNearby;
  if (dom.locationSortedBadge) dom.locationSortedBadge.textContent = t.sortedByDistance;

  // Filter Toolbar texts
  if (dom.verifiedOnlyLabelText) dom.verifiedOnlyLabelText.textContent = t.verifiedOnly;
  if (dom.sortLabelText) dom.sortLabelText.textContent = t.sortBy;
  if (dom.optSortRatingDesc) dom.optSortRatingDesc.textContent = t.sortRatingDesc;
  if (dom.optSortDistanceAsc) dom.optSortDistanceAsc.textContent = t.sortDistanceAsc;
  if (dom.optSortRatingAsc) dom.optSortRatingAsc.textContent = t.sortRatingAsc;
  if (dom.optSortReviewsDesc) dom.optSortReviewsDesc.textContent = t.sortReviewsDesc;
  if (dom.optSortNameAsc) dom.optSortNameAsc.textContent = t.sortNameAsc;
  
  // Active category pill name
  if (state.activeCategory && dom.activeCategoryName) {
    dom.activeCategoryName.textContent = getCategoryTranslation(state.activeCategory);
  }
  
  // Empty State texts
  if (dom.emptyTitle) dom.emptyTitle.textContent = t.emptyTitle;
  if (dom.emptyDesc) dom.emptyDesc.textContent = t.emptyDesc;
  if (dom.resetFiltersBtn) dom.resetFiltersBtn.textContent = t.emptyResetBtn;
  
  // Callback Modal texts
  if (dom.modalEyebrow) dom.modalEyebrow.textContent = t.cbModalEyebrow;
  if (dom.modalTitle) dom.modalTitle.textContent = t.cbModalTitle;
  if (dom.labelCbName) dom.labelCbName.innerHTML = `${t.cbNameLabel} <span class="required">*</span>`;
  if (dom.labelCbPhone) dom.labelCbPhone.innerHTML = `${t.cbPhoneLabel} <span class="required">*</span>`;
  if (dom.labelCbProblem) dom.labelCbProblem.textContent = t.cbProblemLabel;
  if (dom.cbName) dom.cbName.placeholder = t.cbNamePlaceholder;
  if (dom.cbPhone) dom.cbPhone.placeholder = t.cbPhonePlaceholder;
  if (dom.cbProblem) dom.cbProblem.placeholder = t.cbProblemPlaceholder;
  if (dom.modalCancelBtn) dom.modalCancelBtn.textContent = t.cbCancelBtn;
  if (dom.modalSubmitBtn) {
    const s = dom.modalSubmitBtn.querySelector("span");
    if (s) s.textContent = t.cbSubmitBtn;
  }
  if (dom.successTitleText) dom.successTitleText.textContent = t.cbSuccessTitle;
  if (dom.successDescPre) dom.successDescPre.textContent = t.cbSuccessDescPre;
  if (dom.successDescPost) dom.successDescPost.textContent = t.cbSuccessDescPost;
  if (dom.modalDoneBtn) dom.modalDoneBtn.textContent = t.cbDoneBtn;
  
  // Reviews Modal texts
  if (dom.reviewsModalEyebrow) dom.reviewsModalEyebrow.textContent = t.revModalEyebrow;
  if (dom.reviewsModalTitle) dom.reviewsModalTitle.textContent = t.revModalTitle;
  if (dom.trustBadgeText) dom.trustBadgeText.textContent = t.revTrustBadge;
  if (dom.summaryHintText) dom.summaryHintText.textContent = t.revSummaryHint;
  if (dom.reviewsListTitle) dom.reviewsListTitle.textContent = t.revListTitle;
  if (dom.writeReviewTitle) dom.writeReviewTitle.textContent = t.revWriteTitle;
  if (dom.writeReviewInstruction) dom.writeReviewInstruction.textContent = t.revWriteInstruction;
  if (dom.labelReviewStars) dom.labelReviewStars.innerHTML = `${t.revRatingLabel} <span class="required">*</span>`;
  if (dom.labelReviewAuthor) dom.labelReviewAuthor.innerHTML = `${t.revAuthorLabel} <span class="required">*</span>`;
  if (dom.labelReviewComment) dom.labelReviewComment.innerHTML = `${t.revCommentLabel} <span class="required">*</span>`;
  if (dom.reviewAuthorInput) dom.reviewAuthorInput.placeholder = t.revAuthorPlaceholder;
  if (dom.reviewCommentInput) dom.reviewCommentInput.placeholder = t.revCommentPlaceholder;
  if (dom.submitReviewBtnText) dom.submitReviewBtnText.textContent = t.revSubmitBtn;
  if (dom.reviewSuccessText) dom.reviewSuccessText.textContent = t.revSuccessMsg;

  // Booking Modal & Confirmation texts
  if (dom.bookingModalEyebrow) dom.bookingModalEyebrow.textContent = t.bookModalEyebrow;
  if (dom.bookingModalTitle) dom.bookingModalTitle.textContent = t.bookModalTitle;
  if (dom.labelBookDate) dom.labelBookDate.innerHTML = `${t.bookDateLabel} <span class="required">*</span>`;
  if (dom.labelBookTime) dom.labelBookTime.innerHTML = `${t.bookTimeLabel} <span class="required">*</span>`;
  if (dom.labelBookName) dom.labelBookName.innerHTML = `${t.bookNameLabel} <span class="required">*</span>`;
  if (dom.labelBookPhone) dom.labelBookPhone.innerHTML = `${t.bookPhoneLabel} <span class="required">*</span>`;
  if (dom.labelBookAddress) dom.labelBookAddress.innerHTML = `${t.bookAddressLabel} <span class="required">*</span>`;
  if (dom.labelBookNotes) dom.labelBookNotes.textContent = t.bookNotesLabel;
  if (dom.optSlotDefault) dom.optSlotDefault.textContent = t.optSlotDefault;
  if (dom.optSlotMorning) dom.optSlotMorning.textContent = t.optSlotMorning;
  if (dom.optSlotAfternoon) dom.optSlotAfternoon.textContent = t.optSlotAfternoon;
  if (dom.optSlotEvening) dom.optSlotEvening.textContent = t.optSlotEvening;
  if (dom.optSlotLate) dom.optSlotLate.textContent = t.optSlotLate;
  if (dom.bookingPayNote) dom.bookingPayNote.textContent = t.bookPayNote;
  if (dom.bookingSubmitBtnText) dom.bookingSubmitBtnText.textContent = t.bookSubmitBtn;
  if (dom.confirmTitle) dom.confirmTitle.textContent = t.confirmTitle;
  if (dom.confirmSubtitle) dom.confirmSubtitle.textContent = t.confirmSubtitle;
  if (dom.confirmIdLabel) dom.confirmIdLabel.textContent = t.confirmIdLabel;
  if (dom.confirmLblProvider) dom.confirmLblProvider.textContent = t.confirmLblProvider;
  if (dom.confirmLblCategory) dom.confirmLblCategory.textContent = t.confirmLblCategory;
  if (dom.confirmLblDate) dom.confirmLblDate.textContent = t.confirmLblDate;
  if (dom.confirmLblAddress) dom.confirmLblAddress.textContent = t.confirmLblAddress;
  if (dom.confirmLblCustomer) dom.confirmLblCustomer.textContent = t.confirmLblCustomer;
  if (dom.confirmLblPrice) dom.confirmLblPrice.textContent = t.confirmLblPrice;
  if (dom.confirmInfoBanner) dom.confirmInfoBanner.textContent = t.confirmInfoBanner;
  
  // Update star rating text description
  updateStarPickerDisplay();
  
  // Footer texts
  if (dom.footerAboutLine) dom.footerAboutLine.textContent = t.footerAbout;
  if (dom.footerPill1) dom.footerPill1.textContent = t.footerPill1;
  if (dom.footerPill2) dom.footerPill2.textContent = t.footerPill2;
  if (dom.footerPill3) dom.footerPill3.textContent = t.footerPill3;
  if (dom.footerPill4) dom.footerPill4.textContent = t.footerPill4;
  if (dom.footerBottomCopy) dom.footerBottomCopy.textContent = t.footerBottom;
  
  // AI Chat Assistant UI Texts
  if (dom.chatBtnLabel) dom.chatBtnLabel.textContent = t.chatBtnLabel;
  if (dom.chatWidgetTitle) dom.chatWidgetTitle.textContent = t.chatWidgetTitle;
  if (dom.chatStatusText) {
    const isGeminiReady = chatState.apiKey && chatState.apiKey !== "YOUR_GEMINI_API_KEY_HERE";
    dom.chatStatusText.textContent = isGeminiReady ? t.chatStatusText : t.chatStatusFallback;
  }
  if (dom.chatWelcomeText) dom.chatWelcomeText.innerHTML = t.chatWelcomeText;
  if (dom.chatSuggestionsTitle) dom.chatSuggestionsTitle.textContent = t.chatSuggestionsTitle;
  if (dom.chatInput) dom.chatInput.placeholder = t.chatInputPlaceholder;
  if (dom.typingText) dom.typingText.textContent = t.typingText;
  
  // Update smart search banner if visible
  if (state.searchQuery) {
    handleSearchInput(state.searchQuery, false);
  }
  
  // Re-render the provider cards to translate button labels and tags (names stay intact!)
  renderProviders();
}

// =============================================================================
// 7. SKELETON LOADER (0.5s Loading Shimmer)
// =============================================================================

/**
 * Displays 6 loading skeleton shimmer cards while switching categories
 */
function renderSkeletonLoader() {
  if (!dom.providersContainer) return;
  
  let skeletonHTML = "";
  for (let i = 0; i < 6; i++) {
    skeletonHTML += `
      <div class="skeleton-card" aria-hidden="true">
        <div class="skeleton-header">
          <div class="skeleton-avatar"></div>
          <div class="skeleton-meta">
            <div class="skeleton-line" style="width: 75%;"></div>
            <div class="skeleton-line" style="width: 45%; height: 12px; margin-top: 6px;"></div>
          </div>
        </div>
        <div class="skeleton-body">
          <div class="skeleton-line" style="width: 90%;"></div>
          <div class="skeleton-line" style="width: 60%; margin-top: 8px;"></div>
          <div class="skeleton-line" style="width: 40%; margin-top: 8px;"></div>
        </div>
        <div class="skeleton-actions">
          <div class="skeleton-btn"></div>
          <div class="skeleton-btn"></div>
        </div>
      </div>
    `;
  }
  dom.providersContainer.innerHTML = skeletonHTML;
  if (dom.emptyState) dom.emptyState.style.display = "none";
}

// =============================================================================
// 8. NATURAL LANGUAGE SMART SEARCH ENGINE
// =============================================================================

/**
 * Matches user plain-text input against English & Hinglish keyword mappings
 */
function detectCategoryFromNLP(query) {
  if (!query || query.trim().length === 0) return null;
  const clean = query.trim().toLowerCase();
  
  // Check each category's phrases and keywords
  for (const [category, keywords] of Object.entries(smartSearchDictionary)) {
    for (const keyword of keywords) {
      const kw = keyword.toLowerCase();
      // Check multi-word phrase inclusion or single word regex match
      if (kw.includes(" ")) {
        if (clean.includes(kw)) return category;
      } else {
        const regex = new RegExp(`\\b${kw}\\b`, "i");
        if (regex.test(clean)) return category;
      }
    }
  }
  return null;
}

/**
 * Handles live search typing and updates suggestion banner
 */
function handleSearchInput(query, shouldScroll = false) {
  state.searchQuery = query;
  const clean = query.trim().toLowerCase();
  const t = i18n[state.currentLang];
  
  if (!clean) {
    // Hide search banner when input is blank
    if (dom.searchSuggestionBanner) dom.searchSuggestionBanner.style.display = "none";
    state.detectedCategory = null;
    renderProviders();
    return;
  }
  
  const detected = detectCategoryFromNLP(clean);
  state.detectedCategory = detected;
  
  if (detected) {
    // Show match banner with translated category
    const translatedCat = getCategoryTranslation(detected);
    if (dom.searchSuggestionBanner) {
      dom.searchSuggestionBanner.className = "search-suggestion-banner match-found";
      dom.searchSuggestionBanner.style.display = "flex";
    }
    if (dom.searchSuggestionText) {
      dom.searchSuggestionText.innerHTML = `
        <span class="match-icon">✓</span>
        <span>${t.smartSearchMatchPrefix} <strong>${translatedCat}</strong></span>
      `;
    }
  } else {
    // Check if the query matches any provider name or area directly
    const directMatches = providersData.filter(p => 
      p.name.toLowerCase().includes(clean) || 
      p.area.toLowerCase().includes(clean) ||
      p.tagline.toLowerCase().includes(clean)
    );
    
    if (directMatches.length > 0) {
      if (dom.searchSuggestionBanner) dom.searchSuggestionBanner.style.display = "none";
    } else {
      // Show "No match found, try browsing categories below" banner
      if (dom.searchSuggestionBanner) {
        dom.searchSuggestionBanner.className = "search-suggestion-banner no-match";
        dom.searchSuggestionBanner.style.display = "flex";
      }
      if (dom.searchSuggestionText) {
        dom.searchSuggestionText.innerHTML = `
          <span class="no-match-icon">ℹ</span>
          <span>${t.smartSearchNoMatch}</span>
        `;
      }
    }
  }
  
  renderProviders();
  
  if (shouldScroll && dom.providersContainer) {
    dom.providersContainer.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

/**
 * Executes Hackathon Demo Mode:
 * Auto-fills search bar with "my tap is leaking", triggers search, and highlights results.
 */
function runDemoMode() {
  if (!dom.searchInput) return;
  
  // Auto-fill search bar
  dom.searchInput.value = "my tap is leaking";
  
  // Trigger search with scroll
  handleSearchInput("my tap is leaking", true);
  
  // Highlight matching results for 3 seconds
  setTimeout(() => {
    const cards = dom.providersContainer ? dom.providersContainer.querySelectorAll(".provider-card") : [];
    cards.forEach(card => card.classList.add("highlight"));
    setTimeout(() => {
      cards.forEach(card => card.classList.remove("highlight"));
    }, 3000);
  }, 100);
}

// =============================================================================
// 9. FILTER & SORT LOGIC
// =============================================================================

/**
 * Filters and sorts the provider list based on active category, search, verified toggle, and sort dropdown
 */
function getFilteredProviders() {
  let list = [...providersData];
  const query = state.searchQuery.trim().toLowerCase();
  
  // 1. Filter by Smart Search / Query
  if (query) {
    if (state.detectedCategory) {
      // If smart search detected a specific category, show providers from that category
      list = list.filter(p => p.category === state.detectedCategory);
    } else {
      // Otherwise match against name, area, tagline, or category text
      list = list.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.area.toLowerCase().includes(query) ||
        p.tagline.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );
    }
  }
  
  // 2. Filter by Category Card Selection (if active)
  if (state.activeCategory) {
    list = list.filter(p => p.category === state.activeCategory);
  }
  
  // 3. Filter by Verified Only Toggle
  if (state.verifiedOnly) {
    list = list.filter(p => p.verified === true);
  }
  
  // 4. Sort the filtered list
  list.sort((a, b) => {
    switch (state.sortBy) {
      case "rating-desc":
        return b.rating - a.rating;
      case "distance-asc":
        return a.distanceKm - b.distanceKm;
      case "rating-asc":
        return a.rating - b.rating;
      case "reviews-desc":
        return b.reviewsCount - a.reviewsCount;
      case "name-asc":
        return a.name.localeCompare(b.name);
      default:
        return b.rating - a.rating;
    }
  });
  
  return list;
}

// =============================================================================
// 10. CARD RENDERING
// =============================================================================

/**
 * Renders provider cards into the container.
 * Strictly preserves provider names unchanged as required.
 */
function renderProviders() {
  if (!dom.providersContainer) return;
  
  const providers = getFilteredProviders();
  const t = i18n[state.currentLang];
  
  // Update Results Count text in toolbar
  if (dom.resultsCount) {
    dom.resultsCount.innerHTML = `${t.showingPrefix} <strong>${providers.length}</strong> ${t.showingSuffix}`;
  }
  
  // Check for empty state
  if (providers.length === 0) {
    dom.providersContainer.innerHTML = "";
    if (dom.emptyState) dom.emptyState.style.display = "block";
    return;
  }
  
  if (dom.emptyState) dom.emptyState.style.display = "none";
  
  // Generate Provider Cards HTML
  let cardsHTML = "";
  providers.forEach(p => {
    const initial = p.name.charAt(0);
    const translatedCat = getCategoryTranslation(p.category);
    const starStr = getStarString(p.rating);
    const waText = encodeURIComponent(`Hi ${p.name}, I found your contact on Zenserve and need assistance with ${p.category} services.`);
    
    cardsHTML += `
      <article class="provider-card" id="card-${p.id}" data-id="${p.id}" data-category="${p.category}">
        <!-- Top Info Header -->
        <div class="card-header">
          <div class="provider-info-top">
            <div class="provider-avatar" aria-hidden="true">${initial}</div>
            <div class="provider-name-box">
              <!-- Provider name is NEVER translated -->
              <h3 class="provider-name">${p.name}</h3>
              <span class="provider-cat-tag">${translatedCat}</span>
            </div>
          </div>
          ${p.verified ? `
            <span class="verified-badge" title="Verified Local Provider">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              <span>${t.verifiedBadge}</span>
            </span>
          ` : ""}
        </div>

        <!-- Rating, Price & Area Meta -->
        <div class="card-meta-row">
          <div class="rating-box" aria-label="Rating: ${p.rating} out of 5 stars">
            <span class="stars" aria-hidden="true">★</span>
            <span class="rating-val">${p.rating.toFixed(1)}</span>
            <span class="reviews-count">(${p.reviewsCount} ${t.reviewsCountSuffix})</span>
          </div>
          <span class="meta-divider">&bull;</span>
          <div class="price-box">${p.priceRange}</div>
        </div>

        <div class="area-box">
          <div class="area-address-text">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <span>${p.area}</span>
          </div>
          <span class="distance-pill ${state.isLocationActive ? 'highlight' : ''}" title="${p.distance} ${t.distanceAway}">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="3"/>
              <path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
            </svg>
            <span>${p.distance} ${t.distanceAway}</span>
          </span>
        </div>

        <!-- Tagline & Experience Details -->
        <div class="tagline-box">
          <p>${p.tagline}</p>
          <div class="provider-highlights">
            <span class="highlight-item">✓ ${p.experience}</span>
            <span class="highlight-item">✓ ${t.responsePrefix} ${p.responseTime.replace('Arrives in ', '')}</span>
          </div>
        </div>

        <!-- Actions: Call, WhatsApp, Request Callback, View Reviews -->
        <div class="card-actions">
          <a href="tel:${p.phone}" class="btn-action btn-call" aria-label="Call ${p.name}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            <span>${t.callBtn}</span>
          </a>

          <a href="https://wa.me/${p.whatsapp}?text=${waText}" target="_blank" rel="noopener noreferrer" class="btn-action btn-whatsapp" aria-label="Chat on WhatsApp with ${p.name}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
            </svg>
            <span>${t.whatsappBtn}</span>
          </a>

          <!-- Book Now Button (Direct Booking Modal) -->
          <button type="button" class="btn-action btn-book-now" data-provider-id="${p.id}" aria-label="Book Now with ${p.name}">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <span>${t.bookNowBtn}</span>
          </button>

          <!-- Request a Callback Button (Simulated Modal) -->
          <button type="button" class="btn-action btn-callback" data-provider-id="${p.id}" aria-label="Request a Callback from ${p.name}">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M15 10l5 5-5 5"/>
              <path d="M4 4v7a4 4 0 0 0 4 4h12"/>
            </svg>
            <span>${t.callbackBtn}</span>
          </button>

          <!-- View Reviews Button (Interactive Modal) -->
          <button type="button" class="btn-reviews" data-provider-id="${p.id}" aria-label="View reviews for ${p.name}">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <span>${t.viewReviewsBtn} (${p.reviews ? p.reviews.length : 3})</span>
          </button>
        </div>
      </article>
    `;
  });
  
  dom.providersContainer.innerHTML = cardsHTML;
  
  // Attach event listeners to newly rendered Book Now buttons
  dom.providersContainer.querySelectorAll(".btn-book-now").forEach(btn => {
    btn.addEventListener("click", () => {
      const pid = btn.getAttribute("data-provider-id");
      openBookingModal(pid);
    });
  });

  // Attach event listeners to newly rendered Callback buttons
  dom.providersContainer.querySelectorAll(".btn-callback").forEach(btn => {
    btn.addEventListener("click", () => {
      const pid = btn.getAttribute("data-provider-id");
      openCallbackModal(pid);
    });
  });
  
  // Attach event listeners to newly rendered View Reviews buttons
  dom.providersContainer.querySelectorAll(".btn-reviews").forEach(btn => {
    btn.addEventListener("click", () => {
      const pid = btn.getAttribute("data-provider-id");
      openReviewsModal(pid);
    });
  });
}

// =============================================================================
// 11. CALLBACK MODAL (Request a Callback)
// =============================================================================

let activeCallbackProvider = null;

function openCallbackModal(providerId) {
  const provider = providersData.find(p => p.id === providerId);
  if (!provider) return;
  activeCallbackProvider = provider;
  
  const t = i18n[state.currentLang];
  
  // Set subtitle with provider name
  if (dom.modalProviderSubtitle) {
    dom.modalProviderSubtitle.textContent = `${t.cbModalFrom} ${provider.name} (${getCategoryTranslation(provider.category)})`;
  }
  
  // Reset form inputs & errors
  if (dom.callbackForm) {
    dom.callbackForm.reset();
    dom.callbackForm.style.display = "block";
  }
  if (dom.nameError) dom.nameError.textContent = "";
  if (dom.phoneError) dom.phoneError.textContent = "";
  if (dom.callbackSuccess) dom.callbackSuccess.style.display = "none";
  
  // Open modal dialog
  if (dom.callbackModal) {
    dom.callbackModal.style.display = "flex";
    dom.callbackModal.classList.add("modal-open");
    if (dom.cbName) dom.cbName.focus();
  }
}

function closeCallbackModal() {
  if (dom.callbackModal) {
    dom.callbackModal.style.display = "none";
    dom.callbackModal.classList.remove("modal-open");
  }
  activeCallbackProvider = null;
}

function handleCallbackSubmit(e) {
  e.preventDefault();
  const t = i18n[state.currentLang];
  
  const nameVal = dom.cbName ? dom.cbName.value.trim() : "";
  const phoneVal = dom.cbPhone ? dom.cbPhone.value.trim() : "";
  
  let hasError = false;
  
  // Validate name
  if (!nameVal) {
    if (dom.nameError) dom.nameError.textContent = t.errNameRequired;
    hasError = true;
  } else if (dom.nameError) {
    dom.nameError.textContent = "";
  }
  
  // Validate phone (10-digit number)
  const phoneClean = phoneVal.replace(/[\s\-\(\)\+]/g, "");
  const phoneRegex = /^[6-9]\d{9}$/;
  if (!phoneRegex.test(phoneClean)) {
    if (dom.phoneError) dom.phoneError.textContent = t.errPhoneInvalid;
    hasError = true;
  } else if (dom.phoneError) {
    dom.phoneError.textContent = "";
  }
  
  if (hasError) return;
  
  // Simulation: Show Success Message with Provider Name
  if (dom.callbackForm) dom.callbackForm.style.display = "none";
  if (dom.successProviderName && activeCallbackProvider) {
    dom.successProviderName.textContent = activeCallbackProvider.name;
  }
  if (dom.callbackSuccess) {
    dom.callbackSuccess.style.display = "block";
  }
}

// =============================================================================
// 12. BOOKING MODAL ("Book Now" Form & Confirmation Screen)
// =============================================================================

function openBookingModal(providerId) {
  const provider = providersData.find(p => p.id === providerId);
  if (!provider) return;
  state.activeBookingProvider = provider;
  
  const t = i18n[state.currentLang];
  
  // Set subtitle with provider name
  if (dom.bookingProviderSubtitle) {
    dom.bookingProviderSubtitle.textContent = `${t.bookModalWith} ${provider.name}`;
  }
  
  // Update provider summary bar inside the modal
  if (dom.bookingCatBadge) {
    dom.bookingCatBadge.textContent = getCategoryTranslation(provider.category);
  }
  if (dom.bookingBarProviderName) {
    dom.bookingBarProviderName.textContent = provider.name;
  }
  if (dom.bookingBarPrice) {
    dom.bookingBarPrice.textContent = provider.priceRange;
  }
  
  // Set default date to tomorrow and min to today
  if (dom.bookDate) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todayStr = today.toISOString().split("T")[0];
    const tomorrowStr = tomorrow.toISOString().split("T")[0];
    
    dom.bookDate.min = todayStr;
    dom.bookDate.value = tomorrowStr;
  }
  
  // Reset form errors & views
  if (dom.bookingForm) {
    dom.bookingForm.reset();
    if (dom.bookDate) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      dom.bookDate.value = tomorrow.toISOString().split("T")[0];
    }
    dom.bookingForm.style.display = "flex";
  }
  
  if (dom.bookDateError) dom.bookDateError.textContent = "";
  if (dom.bookTimeError) dom.bookTimeError.textContent = "";
  if (dom.bookNameError) dom.bookNameError.textContent = "";
  if (dom.bookPhoneError) dom.bookPhoneError.textContent = "";
  if (dom.bookAddressError) dom.bookAddressError.textContent = "";
  if (dom.bookingConfirmation) dom.bookingConfirmation.style.display = "none";
  
  // Open modal dialog
  if (dom.bookingModal) {
    dom.bookingModal.style.display = "flex";
    dom.bookingModal.classList.add("modal-open");
    if (dom.bookName) dom.bookName.focus();
  }
}

function closeBookingModal() {
  if (dom.bookingModal) {
    dom.bookingModal.style.display = "none";
    dom.bookingModal.classList.remove("modal-open");
  }
  state.activeBookingProvider = null;
}

function handleBookingSubmit(e) {
  e.preventDefault();
  const provider = state.activeBookingProvider;
  if (!provider) return;
  
  const t = i18n[state.currentLang];
  
  const dateVal = dom.bookDate ? dom.bookDate.value : "";
  const timeVal = dom.bookTimeSlot ? dom.bookTimeSlot.value : "";
  const nameVal = dom.bookName ? dom.bookName.value.trim() : "";
  const phoneVal = dom.bookPhone ? dom.bookPhone.value.trim() : "";
  const addressVal = dom.bookAddress ? dom.bookAddress.value.trim() : "";
  
  let hasError = false;
  
  // Validate Date
  if (!dateVal) {
    if (dom.bookDateError) dom.bookDateError.textContent = t.errDateRequired;
    hasError = true;
  } else if (dom.bookDateError) {
    dom.bookDateError.textContent = "";
  }
  
  // Validate Time Slot
  if (!timeVal) {
    if (dom.bookTimeError) dom.bookTimeError.textContent = t.errTimeRequired;
    hasError = true;
  } else if (dom.bookTimeError) {
    dom.bookTimeError.textContent = "";
  }
  
  // Validate Name
  if (!nameVal) {
    if (dom.bookNameError) dom.bookNameError.textContent = t.errNameRequired;
    hasError = true;
  } else if (dom.bookNameError) {
    dom.bookNameError.textContent = "";
  }
  
  // Validate Phone
  const phoneClean = phoneVal.replace(/[\s\-\(\)\+]/g, "");
  const phoneRegex = /^[6-9]\d{9}$/;
  if (!phoneRegex.test(phoneClean)) {
    if (dom.bookPhoneError) dom.bookPhoneError.textContent = t.errPhoneInvalid;
    hasError = true;
  } else if (dom.bookPhoneError) {
    dom.bookPhoneError.textContent = "";
  }
  
  // Validate Address
  if (!addressVal) {
    if (dom.bookAddressError) dom.bookAddressError.textContent = t.errAddressRequired;
    hasError = true;
  } else if (dom.bookAddressError) {
    dom.bookAddressError.textContent = "";
  }
  
  if (hasError) return;
  
  // Generate random 5-digit simulated booking ID: e.g. #ZS-78429
  const randomIdNum = Math.floor(10000 + Math.random() * 90000);
  const bookingId = `#ZS-${randomIdNum}`;
  
  // Format Date for Summary Display
  let formattedDate = dateVal;
  try {
    const d = new Date(dateVal);
    const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    formattedDate = d.toLocaleDateString(state.currentLang === 'hi' ? 'hi-IN' : 'en-US', options);
  } catch (err) {}
  
  // Populate Confirmation View Details
  if (dom.confirmBookingId) dom.confirmBookingId.textContent = bookingId;
  if (dom.confirmProviderName) dom.confirmProviderName.textContent = provider.name;
  if (dom.confirmCategory) dom.confirmCategory.textContent = getCategoryTranslation(provider.category);
  if (dom.confirmDateTime) dom.confirmDateTime.textContent = `${formattedDate} • ${timeVal}`;
  if (dom.confirmAddress) dom.confirmAddress.textContent = addressVal;
  if (dom.confirmCustomer) dom.confirmCustomer.textContent = `${nameVal} (${phoneClean})`;
  if (dom.confirmPrice) dom.confirmPrice.textContent = `${provider.priceRange} ${t.confirmPayAfter}`;
  
  // Hide form and display confirmation screen
  if (dom.bookingForm) dom.bookingForm.style.display = "none";
  if (dom.bookingConfirmation) {
    dom.bookingConfirmation.style.display = "block";
  }
}

// =============================================================================
// 12. REVIEWS MODAL & "WRITE A REVIEW" FORM
// =============================================================================

/**
 * Opens reviews modal, renders sample reviews and overall rating summary
 */
function openReviewsModal(providerId) {
  const provider = providersData.find(p => p.id === providerId);
  if (!provider) return;
  state.currentReviewProvider = provider;
  
  const t = i18n[state.currentLang];
  
  // Update header subtitle
  if (dom.reviewsProviderSubtitle) {
    dom.reviewsProviderSubtitle.textContent = `${t.revModalFor} ${provider.name}`;
  }
  
  // Update summary score card
  if (dom.summaryRatingNum) {
    dom.summaryRatingNum.textContent = provider.rating.toFixed(1);
  }
  if (dom.summaryStarsVisual) {
    dom.summaryStarsVisual.textContent = getStarString(provider.rating);
  }
  if (dom.summaryReviewsCount) {
    dom.summaryReviewsCount.textContent = `${t.revSummaryBasedOn} ${provider.reviewsCount} ${t.revSummaryReviews}`;
  }
  
  // Reset Write Review form
  if (dom.writeReviewForm) dom.writeReviewForm.reset();
  if (dom.reviewAuthorError) dom.reviewAuthorError.textContent = "";
  if (dom.reviewCommentError) dom.reviewCommentError.textContent = "";
  if (dom.reviewSuccessBanner) dom.reviewSuccessBanner.style.display = "none";
  
  // Set default star rating to 5
  setStarRating(5);
  
  // Render provider's reviews list
  renderReviewsList(provider);
  
  // Display modal
  if (dom.reviewsModal) {
    dom.reviewsModal.style.display = "flex";
    dom.reviewsModal.classList.add("modal-open");
  }
}

function closeReviewsModal() {
  if (dom.reviewsModal) {
    dom.reviewsModal.style.display = "none";
    dom.reviewsModal.classList.remove("modal-open");
  }
  state.currentReviewProvider = null;
}

/**
 * Renders the reviews inside the modal body
 */
function renderReviewsList(provider) {
  if (!dom.reviewsListContainer) return;
  const t = i18n[state.currentLang];
  const reviews = provider.reviews || [];
  
  // Counter pill
  if (dom.reviewsCounterPill) {
    dom.reviewsCounterPill.textContent = `${reviews.length} ${t.reviewsCountSuffix}`;
  }
  
  if (reviews.length === 0) {
    dom.reviewsListContainer.innerHTML = `<p class="no-reviews-hint">No reviews yet. Be the first to share your experience!</p>`;
    return;
  }
  
  let listHTML = "";
  reviews.forEach(r => {
    const initial = r.author ? r.author.charAt(0) : "U";
    const starStr = getStarString(r.rating);
    
    listHTML += `
      <div class="review-item-card">
        <div class="review-card-top">
          <div class="review-author-meta">
            <div class="review-avatar" aria-hidden="true">${escapeHTML(initial)}</div>
            <div>
              <div class="review-author-name">${escapeHTML(r.author)}</div>
              <span class="review-badge-verified">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                <span>${t.verifiedBadge} User</span>
              </span>
            </div>
          </div>
          <div class="review-stars-date">
            <span class="review-stars" aria-label="${r.rating} stars">${starStr}</span>
            <span class="review-date">${r.date}</span>
          </div>
        </div>
        <p class="review-comment-body">${escapeHTML(r.comment)}</p>
      </div>
    `;
  });
  
  dom.reviewsListContainer.innerHTML = listHTML;
}

/**
 * Updates interactive 5-star rating picker
 */
function setStarRating(rating) {
  state.selectedStarRating = rating;
  if (dom.selectedStarInput) dom.selectedStarInput.value = rating;
  
  if (dom.starRatingPicker) {
    const buttons = dom.starRatingPicker.querySelectorAll(".star-pick-btn");
    buttons.forEach(btn => {
      const val = parseInt(btn.getAttribute("data-rating"), 10);
      btn.classList.toggle("active", val <= rating);
    });
  }
  
  updateStarPickerDisplay();
}

function updateStarPickerDisplay() {
  if (!dom.starScoreDisplay) return;
  const t = i18n[state.currentLang];
  const desc = t.starRatingDescriptions[state.selectedStarRating] || `${state.selectedStarRating} / 5`;
  dom.starScoreDisplay.textContent = desc;
}

/**
 * Handles "Write a Review" form submission:
 * Dynamically appends the review on screen and updates card count without page reload.
 */
function handleWriteReviewSubmit(e) {
  e.preventDefault();
  const provider = state.currentReviewProvider;
  if (!provider) return;
  
  const t = i18n[state.currentLang];
  const authorVal = dom.reviewAuthorInput ? dom.reviewAuthorInput.value.trim() : "";
  const commentVal = dom.reviewCommentInput ? dom.reviewCommentInput.value.trim() : "";
  const ratingVal = state.selectedStarRating || 5;
  
  let hasError = false;
  
  if (!authorVal) {
    if (dom.reviewAuthorError) dom.reviewAuthorError.textContent = t.errNameRequired;
    hasError = true;
  } else if (dom.reviewAuthorError) {
    dom.reviewAuthorError.textContent = "";
  }
  
  if (!commentVal) {
    if (dom.reviewCommentError) dom.reviewCommentError.textContent = t.errReviewComment;
    hasError = true;
  } else if (dom.reviewCommentError) {
    dom.reviewCommentError.textContent = "";
  }
  
  if (hasError) return;
  
  // Create new review object
  const newReview = {
    id: "rev-user-" + Date.now(),
    author: authorVal,
    rating: ratingVal,
    date: state.currentLang === "hi" ? "अभी-अभी" : "Just now",
    comment: commentVal
  };
  
  // In-memory prepend to provider's reviews array
  if (!provider.reviews) provider.reviews = [];
  provider.reviews.unshift(newReview);
  provider.reviewsCount += 1;
  
  // Recalculate average rating
  const totalStars = provider.reviews.reduce((acc, curr) => acc + curr.rating, 0);
  provider.rating = parseFloat((totalStars / provider.reviews.length).toFixed(1));
  
  // Re-render reviews list inside the open modal
  renderReviewsList(provider);
  
  // Update modal score summary
  if (dom.summaryRatingNum) dom.summaryRatingNum.textContent = provider.rating.toFixed(1);
  if (dom.summaryStarsVisual) dom.summaryStarsVisual.textContent = getStarString(provider.rating);
  if (dom.summaryReviewsCount) {
    dom.summaryReviewsCount.textContent = `${t.revSummaryBasedOn} ${provider.reviewsCount} ${t.revSummaryReviews}`;
  }
  
  // Show inline success message banner
  if (dom.reviewSuccessBanner) {
    dom.reviewSuccessBanner.style.display = "flex";
  }
  
  // Reset form inputs for next review
  if (dom.reviewAuthorInput) dom.reviewAuthorInput.value = "";
  if (dom.reviewCommentInput) dom.reviewCommentInput.value = "";
  setStarRating(5);
  
  // Re-render main provider cards to update review counts on screen
  renderProviders();
}

// =============================================================================
// LOCATION-BASED SORTING ("Use My Location")
// =============================================================================

/**
 * Activates nearby sorting by sample distance and displays location banner
 */
function enableLocationSort() {
  state.isLocationActive = true;
  state.sortBy = "distance-asc";
  if (dom.sortSelect) dom.sortSelect.value = "distance-asc";
  
  const t = i18n[state.currentLang];
  if (dom.useLocationBtn) {
    dom.useLocationBtn.classList.add("active");
    if (dom.useLocationBtnText) dom.useLocationBtnText.textContent = t.useLocationActive;
  }
  if (dom.locationBanner) {
    dom.locationBanner.style.display = "flex";
  }
  
  renderProviders();
  
  // Smooth scroll to providers container
  if (dom.locationBanner) {
    dom.locationBanner.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
}

/**
 * Deactivates location-based sorting and restores default or selected sorting
 */
function disableLocationSort(newSort = "rating-desc") {
  state.isLocationActive = false;
  state.sortBy = newSort;
  
  const t = i18n[state.currentLang];
  if (dom.useLocationBtn) {
    dom.useLocationBtn.classList.remove("active");
    if (dom.useLocationBtnText) dom.useLocationBtnText.textContent = t.useLocationBtn;
  }
  if (dom.locationBanner) {
    dom.locationBanner.style.display = "none";
  }
  if (dom.sortSelect) {
    dom.sortSelect.value = newSort;
  }
  
  renderProviders();
}

/**
 * Toggles location sorting state
 */
function toggleLocationSort() {
  if (state.isLocationActive) {
    disableLocationSort("rating-desc");
  } else {
    enableLocationSort();
  }
}

// =============================================================================
// 13. AI CHAT ASSISTANT (Gemini API with Smart Keyword Fallback)
// =============================================================================

const chatState = {
  isOpen: false,
  apiKey: localStorage.getItem("zenserve_gemini_key") || "",
  isTyping: false
};

const fallbackCategoryTips = {
  "Plumber": {
    en: "Turn off your main water valve (under the sink or near the water meter) immediately to prevent water damage. Keep buckets and towels ready near the leak.",
    hi: "पानी का फैलाव रोकने के लिए सिंक के नीचे या मीटर के पास स्थित मुख्य पानी का वाल्व (मेन वॉल्व) तुरंत बंद कर दें। रिसाव के पास बाल्टी और तौलिया रखें।"
  },
  "Electrician": {
    en: "Switch off the main MCB power breaker immediately. Do not touch bare wires, sparking switches, or appliances with wet hands.",
    hi: "मेन एमसीबी (MCB) स्विच तुरंत बंद कर दें। नंगे तारों, स्पार्क करते स्विच या पानी के संपर्क वाले बिजली के उपकरणों को न छुएं।"
  },
  "AC Repair": {
    en: "Turn off the AC from both the remote and the wall switch to protect the compressor. Check if the outdoor unit fan has good air clearance.",
    hi: "कंप्रेसर को सुरक्षित रखने के लिए रिमोट और दीवार के मुख्य स्विच दोनों से एसी बंद कर दें। बाहरी यूनिट के आसपास हवा का बहाव ठीक रखें।"
  },
  "Home Cleaning": {
    en: "Store delicate and valuable items in a locked cupboard. Open windows for airflow and identify high-priority cleaning zones.",
    hi: "कीमती और नाजुक सामान सुरक्षित अलमारी में रख लें। वेंटिलेशन के लिए खिड़कियां खुली रखें और मुख्य गंदगी वाले हिस्सों को नोट कर लें।"
  },
  "Blood Test at Home": {
    en: "Ensure you follow fasting guidelines (typically 8-12 hours water-only for fasting sugar and lipid profile). Keep previous prescriptions ready.",
    hi: "जांच के अनुसार उपवास (Fasting - सामान्यतः 8 से 12 घंटे केवल पानी) का पालन करें। डॉक्टर का पुराना पर्चा और पहचान पत्र तैयार रखें।"
  },
  "Emergency": {
    en: "Stay calm, alert neighbors, and get to a safe open area. For immediate life danger, tap the 112 emergency calling button below right now.",
    hi: "शांत रहें, पड़ोसियों को सचेत करें और सुरक्षित स्थान पर जाएं। गंभीर स्थिति में तुरंत 112 आपातकालीन बटन पर टैप करें।"
  }
};

/**
 * Automatically loads Gemini API key from .env file or localStorage
 */
async function loadGeminiApiKey() {
  // If user already saved a custom key in localStorage, use it
  if (chatState.apiKey && chatState.apiKey.trim().length > 10 && chatState.apiKey !== "YOUR_GEMINI_API_KEY_HERE") {
    if (dom.customApiKeyInput) dom.customApiKeyInput.value = chatState.apiKey;
    updateChatStatus(true);
    return;
  }

  // Attempt reading from .env file (works when served via HTTP server / localhost)
  try {
    const res = await fetch(".env");
    if (res.ok) {
      const text = await res.text();
      const match = text.match(/GEMINI_API_KEY\s*=\s*([^\r\n#]+)/);
      if (match && match[1]) {
        const key = match[1].trim();
        if (key && key !== "YOUR_GEMINI_API_KEY_HERE") {
          chatState.apiKey = key;
          if (dom.customApiKeyInput) dom.customApiKeyInput.value = key;
          updateChatStatus(true);
          return;
        }
      }
    }
  } catch (err) {
    // When running directly via file://, fetch might be restricted by CORS
    console.info("Zenserve: .env fetch skipped (running in local offline mode). Ready for direct input or offline fallback.");
  }

  updateChatStatus(Boolean(chatState.apiKey && chatState.apiKey !== "YOUR_GEMINI_API_KEY_HERE"));
}

/**
 * Updates chat status pill in widget header
 */
function updateChatStatus(hasGemini) {
  if (!dom.chatStatusText) return;
  const t = i18n[state.currentLang];
  dom.chatStatusText.textContent = hasGemini ? t.chatStatusText : t.chatStatusFallback;
}

/**
 * Filters the main view directly to a specific category
 */
function applyCategoryFilter(catName) {
  if (catName === "Emergency") {
    const emergencySection = document.getElementById("emergency");
    if (emergencySection) {
      emergencySection.scrollIntoView({ behavior: "smooth" });
      emergencySection.classList.add("sos-flash-active");
      setTimeout(() => emergencySection.classList.remove("sos-flash-active"), 1200);
    }
    return;
  }
  
  state.activeCategory = catName;
  dom.categoryCards.forEach(c => {
    if (c.getAttribute("data-category") === catName) {
      c.classList.add("active");
    } else {
      c.classList.remove("active");
    }
  });
  
  if (dom.activeCategoryPill && dom.activeCategoryName) {
    dom.activeCategoryName.textContent = getCategoryTranslation(catName);
    dom.activeCategoryPill.style.display = "inline-flex";
  }
  
  renderSkeletonLoader();
  setTimeout(() => {
    renderProviders();
    const targetSection = document.getElementById("directory") || dom.providersContainer;
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: "smooth" });
    }
  }, 400);
}

/**
 * Finds top-rated provider for a category and opens booking modal
 */
function bookTopProviderForCategory(category) {
  const matching = providersData
    .filter(p => p.category === category)
    .sort((a, b) => b.rating - a.rating);
  if (matching.length > 0) {
    openBookingModal(matching[0].id);
  }
}

/**
 * Calls Google Gemini API with the user's natural language problem
 */
async function callGeminiAPI(userPrompt) {
  if (!chatState.apiKey || chatState.apiKey === "YOUR_GEMINI_API_KEY_HERE") {
    return null;
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${chatState.apiKey}`;

  const promptText = `You are Zenserve AI, an emergency and local home services triage assistant for our community directory.
We provide 6 verified service categories:
1. Plumber (pipe leaks, tap leaking, bathroom clogs, water motors, tank cleaning, drainage)
2. Electrician (fan repair, power cuts, wiring, short circuit, switchboard, fuse, sparking)
3. AC Repair (AC cooling issues, gas refilling, noise, water dripping, servicing, compressor)
4. Home Cleaning (deep cleaning, kitchen, bathroom, sofa, carpet, maid, pest control)
5. Blood Test at Home (blood sample collection, sugar, lipid, thyroid, cbc, lab tests at home)
6. Emergency (police 112, fire brigade 101, ambulance 102, immediate life or property hazard)

The user is describing their problem in their own words in ANY language (English, Hindi, Hinglish, Bengali, Tamil, etc.):
"${userPrompt}"

Analyze their problem carefully and respond ONLY with a single valid JSON object (no markdown, no backticks, no code blocks):
{
  "category": "Plumber" | "Electrician" | "AC Repair" | "Home Cleaning" | "Blood Test at Home" | "Emergency",
  "explanation": "1-2 short friendly sentences acknowledging the issue in the user's language and explaining the recommended service.",
  "tip": "1 practical safety or preparation tip the user should do right now while waiting for the technician."
}`;

  const payload = {
    contents: [
      {
        parts: [
          { text: promptText }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 300
    }
  };

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      console.warn("Zenserve: Gemini API returned status", response.status);
      return null;
    }

    const data = await response.json();
    const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidate) return null;

    // Clean any markdown fences if present
    const cleaned = candidate.replace(/```json/gi, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    const validCategories = ["Plumber", "Electrician", "AC Repair", "Home Cleaning", "Blood Test at Home", "Emergency"];
    if (validCategories.includes(parsed.category)) {
      return {
        category: parsed.category,
        explanation: parsed.explanation || "",
        tip: parsed.tip || "",
        source: "gemini"
      };
    }
    return null;
  } catch (err) {
    console.warn("Zenserve: Gemini API request or parse failed, using fallback:", err);
    return null;
  }
}

/**
 * Processes user request using Gemini API, with automatic fallback to natural language keyword engine
 */
async function processAssistantQuery(userPrompt) {
  // 1. Try Gemini API first if key is present
  if (chatState.apiKey && chatState.apiKey !== "YOUR_GEMINI_API_KEY_HERE") {
    try {
      const geminiResult = await callGeminiAPI(userPrompt);
      if (geminiResult) return geminiResult;
    } catch (e) {
      console.warn("Gemini query failed, switching to offline fallback.", e);
    }
  }

  // 2. Offline NLP keyword fallback
  const detected = detectCategoryFromNLP(userPrompt);
  const isHindi = state.currentLang === "hi";

  if (detected) {
    const tip = fallbackCategoryTips[detected]?.[state.currentLang] || fallbackCategoryTips[detected]?.en;
    const catName = getCategoryTranslation(detected);

    let explanation = "";
    if (isHindi) {
      explanation = `आपकी समस्या के आधार पर, हम **${catName}** सेवा की सिफारिश करते हैं। हमारे पास आपके पड़ोस में सत्यापित पेशेवर उपलब्ध हैं।`;
    } else {
      explanation = `Based on your description, we recommend calling a **${catName}**. We have verified professionals ready in your area.`;
    }

    return {
      category: detected,
      explanation: explanation,
      tip: tip,
      source: "fallback"
    };
  }

  // 3. Fallback when no specific category matched
  let explanation = "";
  let tip = "";
  if (isHindi) {
    explanation = "हम आपकी आवश्यकता के अनुसार सेवा की पहचान नहीं कर सके। कृपया प्लंबर, इलेक्ट्रीशियन, एसी रिपेयर, होम क्लीनिंग, ब्लड टेस्ट या इमरजेंसी में से कोई श्रेणी चुनें।";
    tip = "आप ऊपर दिए गए सर्च बार में अपनी समस्या लिख सकते हैं या नीचे दिए गए सेवा कार्ड्स को सीधे देख सकते हैं।";
  } else {
    explanation = "I couldn't match your query to a specific service. You can browse our 6 categories: Plumber, Electrician, AC Repair, Home Cleaning, Blood Test at Home, or Emergency.";
    tip = "Try typing something like 'tap leaking', 'bijli nahi aa rahi', or choose a category directly from the list above.";
  }

  return {
    category: null,
    explanation: explanation,
    tip: tip,
    source: "fallback"
  };
}

/**
 * Appends a user or bot message bubble to the chat scroll container
 */
function appendChatMessage(role, content, recommendation = null) {
  if (!dom.chatMessages) return;

  const bubble = document.createElement("div");
  bubble.className = `chat-bubble ${role}-bubble`;

  if (role === "user") {
    bubble.textContent = content;
  } else {
    const t = i18n[state.currentLang];
    const badgeText = recommendation?.source === "gemini" ? t.recBadgeAI : t.recBadgeFallback;
    const badgeClass = recommendation?.source === "gemini" ? "badge-gemini" : "badge-fallback";

    let html = `
      <div class="bot-header-row">
        <span class="bot-badge-tag">Zenserve AI</span>
        <span class="source-tag ${badgeClass}">${badgeText}</span>
      </div>
      <p class="bot-text">${content}</p>
    `;

    if (recommendation && recommendation.category) {
      const cat = recommendation.category;
      const catName = getCategoryTranslation(cat);
      const isEmergency = cat === "Emergency";

      let icon = "🔧";
      if (cat === "Electrician") icon = "⚡";
      if (cat === "AC Repair") icon = "❄️";
      if (cat === "Home Cleaning") icon = "🧹";
      if (cat === "Blood Test at Home") icon = "🩸";
      if (cat === "Emergency") icon = "🚨";

      html += `
        <div class="bot-recommendation-card ${isEmergency ? 'rec-card-emergency' : ''}">
          <div class="rec-category-header">
            <span class="rec-icon">${icon}</span>
            <div>
              <span class="rec-lbl">${t.recCategoryLabel}</span>
              <strong class="rec-category-name">${catName}</strong>
            </div>
          </div>
          ${recommendation.tip ? `
            <div class="rec-tip-box">
              <span class="tip-badge">💡 ${t.recTipLabel}</span>
              <p class="tip-text">${recommendation.tip}</p>
            </div>
          ` : ""}
          <div class="rec-actions">
            ${isEmergency ? `
              <a href="#emergency" class="btn-rec-action btn-rec-emergency" data-chat-action="emergency">
                🚨 ${t.recEmergencyAction}
              </a>
            ` : `
              <button type="button" class="btn-rec-action btn-rec-view" data-chat-action="view" data-cat="${cat}">
                🔍 ${t.recViewProviders}
              </button>
              <button type="button" class="btn-rec-action btn-rec-book" data-chat-action="book" data-cat="${cat}">
                📅 ${t.recBookNow}
              </button>
            `}
          </div>
        </div>
      `;
    }

    bubble.innerHTML = html;
  }

  dom.chatMessages.appendChild(bubble);
  dom.chatMessages.scrollTop = dom.chatMessages.scrollHeight;

  // Bind recommendation card button actions
  if (role === "bot" && recommendation) {
    bubble.querySelectorAll("[data-chat-action]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const action = btn.getAttribute("data-chat-action");
        const cat = btn.getAttribute("data-cat");

        if (action === "emergency") {
          toggleChatWidget(false);
          const em = document.getElementById("emergency");
          if (em) {
            em.scrollIntoView({ behavior: "smooth" });
            em.classList.add("sos-flash-active");
            setTimeout(() => em.classList.remove("sos-flash-active"), 1200);
          }
        } else if (action === "view" && cat) {
          applyCategoryFilter(cat);
        } else if (action === "book" && cat) {
          bookTopProviderForCategory(cat);
        }
      });
    });
  }
}

/**
 * Toggles or explicitly sets chat widget visibility
 */
function toggleChatWidget(open = null) {
  if (open === null) {
    chatState.isOpen = !chatState.isOpen;
  } else {
    chatState.isOpen = open;
  }

  if (dom.chatWidget) {
    dom.chatWidget.style.display = chatState.isOpen ? "flex" : "none";
    dom.chatWidget.setAttribute("aria-hidden", !chatState.isOpen);
  }

  if (dom.chatFloatingBtn) {
    dom.chatFloatingBtn.setAttribute("aria-expanded", chatState.isOpen);
    dom.chatFloatingBtn.classList.toggle("chat-active", chatState.isOpen);
  }

  if (dom.chatOpenIcon && dom.chatCloseIcon) {
    dom.chatOpenIcon.style.display = chatState.isOpen ? "none" : "block";
    dom.chatCloseIcon.style.display = chatState.isOpen ? "block" : "none";
  }

  if (chatState.isOpen && dom.chatInput) {
    setTimeout(() => dom.chatInput.focus(), 150);
  }
}

/**
 * Handles chat form submission
 */
async function handleChatSubmit(e) {
  if (e) e.preventDefault();
  if (!dom.chatInput) return;

  const query = dom.chatInput.value.trim();
  if (!query || chatState.isTyping) return;

  // Clear input
  dom.chatInput.value = "";

  // Append user bubble
  appendChatMessage("user", query);

  // Show typing indicator
  chatState.isTyping = true;
  if (dom.chatTypingIndicator) dom.chatTypingIndicator.style.display = "flex";
  if (dom.chatMessages) dom.chatMessages.scrollTop = dom.chatMessages.scrollHeight;

  try {
    const result = await processAssistantQuery(query);
    appendChatMessage("bot", result.explanation, result);
  } catch (err) {
    console.error("Chat error:", err);
    const fallbackResult = {
      category: null,
      explanation: "Something went wrong while processing. Please browse categories directly.",
      tip: "Our verified providers are listed below.",
      source: "fallback"
    };
    appendChatMessage("bot", fallbackResult.explanation, fallbackResult);
  } finally {
    chatState.isTyping = false;
    if (dom.chatTypingIndicator) dom.chatTypingIndicator.style.display = "none";
    if (dom.chatMessages) dom.chatMessages.scrollTop = dom.chatMessages.scrollHeight;
  }
}

// =============================================================================
// 13. EVENT LISTENERS SETUP
// =============================================================================

function setupEventListeners() {
  // 1. Language Toggle Buttons
  if (dom.langEnBtn) {
    dom.langEnBtn.addEventListener("click", () => setLanguage("en"));
  }
  if (dom.langHiBtn) {
    dom.langHiBtn.addEventListener("click", () => setLanguage("hi"));
  }
  
  // 2. Search Bar Input & Clear Button
  if (dom.searchInput) {
    dom.searchInput.addEventListener("input", (e) => {
      handleSearchInput(e.target.value, false);
    });
    dom.searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSearchInput(dom.searchInput.value, true);
      }
    });
  }
  
  if (dom.searchBtn) {
    dom.searchBtn.addEventListener("click", () => {
      if (dom.searchInput) handleSearchInput(dom.searchInput.value, true);
    });
  }
  
  if (dom.clearSearchBtn) {
    dom.clearSearchBtn.addEventListener("click", () => {
      if (dom.searchInput) dom.searchInput.value = "";
      handleSearchInput("", false);
      if (dom.searchInput) dom.searchInput.focus();
    });
  }

  // 3. "Use My Location" Button & Clear Location
  if (dom.useLocationBtn) {
    dom.useLocationBtn.addEventListener("click", toggleLocationSort);
  }
  if (dom.clearLocationBtn) {
    dom.clearLocationBtn.addEventListener("click", () => disableLocationSort("rating-desc"));
  }
  
  // 4. Category Cards Selection (with 0.5s loading skeleton shimmer)
  dom.categoryCards.forEach(card => {
    card.addEventListener("click", () => {
      const selectedCat = card.getAttribute("data-category");
      
      // If clicking already active category, deselect it
      if (state.activeCategory === selectedCat) {
        state.activeCategory = null;
        card.classList.remove("active");
        if (dom.activeCategoryPill) dom.activeCategoryPill.style.display = "none";
      } else {
        // Remove active class from all cards
        dom.categoryCards.forEach(c => c.classList.remove("active"));
        card.classList.add("active");
        state.activeCategory = selectedCat;
        
        // Show active filter pill
        if (dom.activeCategoryPill && dom.activeCategoryName) {
          dom.activeCategoryName.textContent = getCategoryTranslation(selectedCat);
          dom.activeCategoryPill.style.display = "inline-flex";
        }
      }
      
      // Render 0.5s Loading Skeleton Shimmer
      renderSkeletonLoader();
      setTimeout(() => {
        renderProviders();
      }, 500);
    });
  });
  
  // 5. Clear Category Filter Pill Button
  if (dom.clearCategoryBtn) {
    dom.clearCategoryBtn.addEventListener("click", () => {
      state.activeCategory = null;
      dom.categoryCards.forEach(c => c.classList.remove("active"));
      if (dom.activeCategoryPill) dom.activeCategoryPill.style.display = "none";
      renderProviders();
    });
  }
  
  // 6. Verified Only Toggle
  if (dom.verifiedOnlyToggle) {
    dom.verifiedOnlyToggle.addEventListener("change", (e) => {
      state.verifiedOnly = e.target.checked;
      renderProviders();
    });
  }
  
  // 7. Sort Select Dropdown
  if (dom.sortSelect) {
    dom.sortSelect.addEventListener("change", (e) => {
      const val = e.target.value;
      state.sortBy = val;
      if (val === "distance-asc") {
        enableLocationSort();
      } else if (state.isLocationActive) {
        state.isLocationActive = false;
        const t = i18n[state.currentLang];
        if (dom.useLocationBtn) {
          dom.useLocationBtn.classList.remove("active");
          if (dom.useLocationBtnText) dom.useLocationBtnText.textContent = t.useLocationBtn;
        }
        if (dom.locationBanner) dom.locationBanner.style.display = "none";
        renderProviders();
      } else {
        renderProviders();
      }
    });
  }
  
  // 8. Reset All Filters Button in Empty State
  if (dom.resetFiltersBtn) {
    dom.resetFiltersBtn.addEventListener("click", () => {
      state.activeCategory = null;
      state.verifiedOnly = false;
      state.searchQuery = "";
      state.detectedCategory = null;
      disableLocationSort("rating-desc");
      
      if (dom.verifiedOnlyToggle) dom.verifiedOnlyToggle.checked = false;
      if (dom.searchInput) dom.searchInput.value = "";
      if (dom.searchSuggestionBanner) dom.searchSuggestionBanner.style.display = "none";
      if (dom.activeCategoryPill) dom.activeCategoryPill.style.display = "none";
      dom.categoryCards.forEach(c => c.classList.remove("active"));
      
      renderProviders();
    });
  }
  
  // 8. Callback Modal Events
  if (dom.modalCloseBtn) dom.modalCloseBtn.addEventListener("click", closeCallbackModal);
  if (dom.modalCancelBtn) dom.modalCancelBtn.addEventListener("click", closeCallbackModal);
  if (dom.modalDoneBtn) dom.modalDoneBtn.addEventListener("click", closeCallbackModal);
  if (dom.callbackForm) dom.callbackForm.addEventListener("submit", handleCallbackSubmit);
  
  // Close Callback Modal when clicking outer backdrop
  if (dom.callbackModal) {
    dom.callbackModal.addEventListener("click", (e) => {
      if (e.target === dom.callbackModal) closeCallbackModal();
    });
  }
  
  // 9. Booking Modal Events
  if (dom.bookingModalCloseBtn) dom.bookingModalCloseBtn.addEventListener("click", closeBookingModal);
  if (dom.bookingCancelBtn) dom.bookingCancelBtn.addEventListener("click", closeBookingModal);
  if (dom.bookingDoneBtn) dom.bookingDoneBtn.addEventListener("click", closeBookingModal);
  if (dom.bookingForm) dom.bookingForm.addEventListener("submit", handleBookingSubmit);

  // Close Booking Modal when clicking outer backdrop
  if (dom.bookingModal) {
    dom.bookingModal.addEventListener("click", (e) => {
      if (e.target === dom.bookingModal) closeBookingModal();
    });
  }

  // 10. Reviews Modal Events
  if (dom.reviewsModalCloseBtn) dom.reviewsModalCloseBtn.addEventListener("click", closeReviewsModal);
  if (dom.writeReviewForm) dom.writeReviewForm.addEventListener("submit", handleWriteReviewSubmit);
  
  // Star rating interactive picker buttons
  if (dom.starRatingPicker) {
    const starButtons = dom.starRatingPicker.querySelectorAll(".star-pick-btn");
    starButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const rating = parseInt(btn.getAttribute("data-rating"), 10);
        setStarRating(rating);
      });
      
      btn.addEventListener("mouseenter", () => {
        const rating = parseInt(btn.getAttribute("data-rating"), 10);
        starButtons.forEach(b => {
          const val = parseInt(b.getAttribute("data-rating"), 10);
          b.classList.toggle("active", val <= rating);
        });
      });
    });
    
    dom.starRatingPicker.addEventListener("mouseleave", () => {
      setStarRating(state.selectedStarRating);
    });
  }
  
  // Close Reviews Modal when clicking outer backdrop
  if (dom.reviewsModal) {
    dom.reviewsModal.addEventListener("click", (e) => {
      if (e.target === dom.reviewsModal) closeReviewsModal();
    });
  }
  
  // 11. Global Escape Key Listener to Close Modals
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeCallbackModal();
      closeBookingModal();
      closeReviewsModal();
      if (chatState.isOpen) toggleChatWidget(false);
    }
  });
  
  // 12. Floating SOS Button smooth scroll and emergency hub highlight
  if (dom.sosFloatingBtn) {
    dom.sosFloatingBtn.addEventListener("click", (e) => {
      const emergencySection = document.getElementById("emergency");
      if (emergencySection) {
        emergencySection.scrollIntoView({ behavior: "smooth" });
        emergencySection.classList.add("sos-flash-active");
        setTimeout(() => {
          emergencySection.classList.remove("sos-flash-active");
        }, 1200);
      }
    });
  }

  // 13. Floating AI Chat Assistant & Widget Controls
  if (dom.chatFloatingBtn) {
    dom.chatFloatingBtn.addEventListener("click", () => toggleChatWidget());
  }
  if (dom.chatCloseBtn) {
    dom.chatCloseBtn.addEventListener("click", () => toggleChatWidget(false));
  }
  if (dom.chatSettingsBtn && dom.chatKeyConfig) {
    dom.chatSettingsBtn.addEventListener("click", () => {
      const isHidden = dom.chatKeyConfig.style.display === "none";
      dom.chatKeyConfig.style.display = isHidden ? "block" : "none";
      if (isHidden && dom.customApiKeyInput) {
        dom.customApiKeyInput.focus();
      }
    });
  }
  if (dom.saveApiKeyBtn && dom.customApiKeyInput) {
    dom.saveApiKeyBtn.addEventListener("click", () => {
      const key = dom.customApiKeyInput.value.trim();
      chatState.apiKey = key;
      localStorage.setItem("zenserve_gemini_key", key);
      updateChatStatus(Boolean(key && key !== "YOUR_GEMINI_API_KEY_HERE"));
      if (dom.chatKeyConfig) dom.chatKeyConfig.style.display = "none";
      alert(i18n[state.currentLang].chatKeySaved || "API key saved successfully!");
    });
  }
  if (dom.chatForm) {
    dom.chatForm.addEventListener("submit", handleChatSubmit);
  }
  
  // Quick Prompt Chips inside chat welcome message
  document.querySelectorAll(".chat-chip-btn").forEach(chip => {
    chip.addEventListener("click", () => {
      const query = chip.getAttribute("data-query");
      if (query && dom.chatInput) {
        dom.chatInput.value = query;
        handleChatSubmit();
      }
    });
  });

  // 14. Demo Mode Button in Footer
  if (dom.demoModeBtn) {
    dom.demoModeBtn.addEventListener("click", runDemoMode);
  }
}

// =============================================================================
// 14. INITIALIZATION
// =============================================================================
document.addEventListener("DOMContentLoaded", () => {
  // Setup all event listeners
  setupEventListeners();
  
  // Load Gemini API Key from .env or localStorage
  loadGeminiApiKey();

  // Apply saved language from localStorage (or 'en')
  setLanguage(state.currentLang);
  
  // Initial provider render
  renderProviders();
  
  console.log("Zenserve single-page application initialized successfully!");
});
