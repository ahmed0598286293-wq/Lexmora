/* ==========================================================================
   Lexmora – Frontend only (HTML + CSS + vanilla JS)
   Replaces: Laravel routes, Livewire components, session (locale/theme/favorites)
   - Language / theme / favorites are saved in localStorage
   - Data comes from js/data.js
   ========================================================================== */
(function () {
  "use strict";

  /* ---------- storage helpers ---------- */
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v === null ? d : v; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  var state = {
    lang: store.get("lex_lang", "ar") === "en" ? "en" : "ar",
    theme: store.get("lex_theme", "light") === "dark" ? "dark" : "light"
  };

  function getFavs() {
    try { return JSON.parse(store.get("lex_favs", "[]")).map(Number); } catch (e) { return []; }
  }
  function toggleFav(id) {
    var f = getFavs(), i = f.indexOf(id);
    if (i > -1) f.splice(i, 1); else f.push(id);
    store.set("lex_favs", JSON.stringify(f));
    return i === -1;
  }

  /* ---------- small utils ---------- */
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function money(n) { return "$" + Number(n).toLocaleString("en-US"); }
  function qs() { return new URLSearchParams(location.search); }
  function L(obj) { return obj[state.lang] || obj.ar; }

  /* ---------- UI strings ---------- */
  var T = {
    ar: {
      home: "الرئيسية", properties: "العقارات", about: "من نحن", contact: "اتصل بنا",
      listCta: "أضف عقارك +", langBtn: "EN", themeAria: "تبديل المظهر", favAria: "المفضلة", menu: "القائمة",
      // hero
      h_eyebrow: "حياة فاخرة، بتعريف جديد", h_l1: "اعثر على", h_l2: "عقارك", h_l3: "المميّز.",
      h_lead: "تجربة عقارية سينمائية للمنازل الاستثنائية والشقق والاستثمارات.",
      h_explore: "استكشف العقارات ←", h_scroll: "مرّر للاستكشاف",
      // search
      s_type: "نوع العقار", s_all_types: "كل الأنواع", s_loc: "الموقع", s_loc_ph: "المدينة أو اسم العقار",
      s_purp: "الغرض", s_all_purp: "بيع أو إيجار", sale: "للبيع", rent: "للإيجار", s_search: "بحث",
      stats: [["10K+", "عقار مميز"], ["12+", "سوق عالمي"], ["98%", "رضا العملاء"], ["24/7", "دعم على مدار الساعة"]],
      // featured
      f_eyebrow: "مجموعة مختارة", f_t1: "عقارات", f_t2: "مميزة", f_all: "عرض الكل ←",
      month: "/ شهر", beds: "غرف", baths: "حمامات", area: "م²", fav: "أضف إلى المفضلة", empty: "لا توجد عقارات مطابقة حالياً.",
      // experience
      e_eyebrow: "تجربة غامرة", e_l1: "شاهد العقار", e_l2: "قبل أن تزوره.",
      e_lead: "حوّل كل عقار إلى تجربة بحركة سينمائية ومشاهد ثلاثية الأبعاد تفاعلية وسرد غني للعقار.",
      e_cta: "اكتشف المجموعة ←",
      // ads
      why: "لماذا نختار Lexmora؟",
      benefits: ["أمان وشفافية<br>في كل معاملة", "دعم احترافي<br>على مدار الساعة", "خيارات واسعة<br>من العقارات", "تجربة سهلة<br>وسريعة"],
      // cta
      c_eyebrow: "معيار ليكسمورا", c_l1: "ليس مجرد منزل.", c_l2: "فصلك القادم.", c_cta: "تحدث مع ليكسمورا ←",
      // footer
      copy: "© 2026 ليكسمورا. قالب عقاري فاخر.", instagram: "إنستغرام", dribbble: "دريبل", behance: "بيهانس",
      // about
      a_eyebrow: "قصة ليكسمورا", a_t1: "العقارات،", a_t2: "بنظرة جديدة.",
      a_l1: "ليكسمورا مفهوم رقمي راقٍ صُمّم انطلاقًا من فكرة أن العثور على عقار يجب أن يكون تجربة استثنائية كامتلاكه.",
      a_l2: "كل تفصيلة تجمع بين مشاهد سينمائية، وخطوط واثقة، ومعلومات عقارية واضحة، وتفاعلات غامرة.",
      a_alt: "منزل عصري بجدران زجاجية كبيرة عند الغروب",
      a_stats: ["عقارات", "أسواق", "رضا العملاء"],
      // contact
      k_eyebrow: "تواصل معنا", k_t1: "يسعدنا", k_t2: "سماعك",
      k_lead: "هل لديك استفسار؟ تواصل معنا وسنكون سعداء بمساعدتك.",
      k_name: "الاسم الكامل", k_email: "البريد الإلكتروني", k_property: "العقار أو الموقع", k_message: "رسالتك",
      k_send: "إرسال الرسالة", k_sending: "جارٍ الإرسال...",
      k_success: "تم إرسال رسالتك بنجاح، شكرًا لتواصلك معنا.",
      k_error: "حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.",
      v_required: "هذا الحقل مطلوب.", v_name: "الاسم يجب ألا يقل عن حرفين.", v_email: "أدخل بريدًا إلكترونيًا صحيحًا.",
      v_message: "الرسالة يجب ألا تقل عن 10 أحرف.",
      // properties page
      p_eyebrow: "اكتشف منزلك القادم", p_title: "العقارات المتاحة", p_lead: "تصفح العقارات المتاحة للبيع والإيجار.",
      p_all: "الكل", p_reset: "إعادة ضبط", p_view: "عرض العقار", p_favs: "المفضلة", p_count: "عقار",
      // detail
      d_notfound: "العقار غير موجود.", d_back: "العودة إلى العقارات", d_share: "مشاركة", d_details: "التفاصيل",
      d_photos: "صور", d_specs: "مواصفات العقار", d_info: "معلومات العقار", d_name: "اسم العقار", d_addr: "العنوان",
      d_adtype: "نوع الإعلان", d_type: "نوع العقار", d_area: "المساحة", d_beds: "غرف النوم", d_baths: "الحمامات",
      d_sale: "بيع", d_rent: "إيجار", d_price_sale: "السعر المطلوب", d_price_rent: "قيمة الإيجار الشهري",
      d_summary: "ملخص العقار", d_overview: "نبذة", d_allphotos: "جميع الصور", d_share_btn: "مشاركة العقار",
      d_inquire: "استفسر عن هذا العقار", d_copied: "تم نسخ رابط العقار بنجاح", d_share_text: "شاهد تفاصيل هذا العقار",
      meta: {
        home: "الرئيسية | Lexmora", about: "من نحن | Lexmora", contact: "اتصل بنا | Lexmora",
        properties: "العقارات | Lexmora", property: "تفاصيل العقار | Lexmora"
      }
    },
    en: {
      home: "Home", properties: "Properties", about: "About", contact: "Contact",
      listCta: "List Property +", langBtn: "عربي", themeAria: "Toggle theme", favAria: "Favorites", menu: "Menu",
      h_eyebrow: "LUXURY LIVING, REDEFINED", h_l1: "Find Your", h_l2: "Signature", h_l3: "Property.",
      h_lead: "A cinematic real estate experience for extraordinary homes, apartments and investments.",
      h_explore: "Explore Properties →", h_scroll: "SCROLL TO EXPLORE",
      s_type: "Property Type", s_all_types: "All Types", s_loc: "Location", s_loc_ph: "City or property name",
      s_purp: "Purpose", s_all_purp: "Buy or Rent", sale: "For Sale", rent: "For Rent", s_search: "Search",
      stats: [["10K+", "Premium Properties"], ["12+", "Global Markets"], ["98%", "Client Satisfaction"], ["24/7", "Concierge Support"]],
      f_eyebrow: "CURATED COLLECTION", f_t1: "Featured", f_t2: "Properties", f_all: "View All →",
      month: "/ month", beds: "Beds", baths: "Baths", area: "m²", fav: "Add to favorites", empty: "No matching properties right now.",
      e_eyebrow: "IMMERSIVE EXPERIENCE", e_l1: "See the property", e_l2: "before you visit.",
      e_lead: "Turn every listing into an experience with cinematic motion, interactive 3D scenes and rich property storytelling.",
      e_cta: "Discover the Collection →",
      why: "Why Choose Lexmora?",
      benefits: ["Security & Transparency<br>in Every Transaction", "Professional Support<br>Around the Clock", "Wide Range<br>of Properties", "Easy and Fast<br>Experience"],
      c_eyebrow: "THE LEXMORA STANDARD", c_l1: "Not just a home.", c_l2: "Your next chapter.", c_cta: "Talk to Lexmora →",
      copy: "© 2026 Lexmora. Premium real estate template.", instagram: "Instagram", dribbble: "Dribbble", behance: "Behance",
      a_eyebrow: "The Lexmora story", a_t1: "Real estate,", a_t2: "reimagined.",
      a_l1: "Lexmora is a premium digital concept designed around the idea that finding a property should feel as extraordinary as owning one.",
      a_l2: "Every detail combines cinematic visuals, confident typography, clear property information and immersive interactions.",
      a_alt: "Modern house with large glass walls at dusk",
      a_stats: ["Listings", "Markets", "Satisfaction"],
      k_eyebrow: "GET IN TOUCH", k_t1: "We Would Love", k_t2: "To Hear From You",
      k_lead: "Have a question? Contact us and we will be happy to assist you.",
      k_name: "Full Name", k_email: "Email Address", k_property: "Property or Location", k_message: "Your Message",
      k_send: "Send Message", k_sending: "Sending...",
      k_success: "Your message has been sent successfully. Thank you!",
      k_error: "Something went wrong while sending your message. Please try again.",
      v_required: "This field is required.", v_name: "Name must be at least 2 characters.", v_email: "Enter a valid email address.",
      v_message: "Message must be at least 10 characters.",
      p_eyebrow: "FIND YOUR NEXT HOME", p_title: "Available Properties", p_lead: "Browse properties for sale and rent.",
      p_all: "All", p_reset: "Reset", p_view: "View property", p_favs: "Favorites", p_count: "properties",
      d_notfound: "Property not found.", d_back: "Back to properties", d_share: "Share", d_details: "Details",
      d_photos: "photos", d_specs: "Property specs", d_info: "Property information", d_name: "Name", d_addr: "Address",
      d_adtype: "Listing type", d_type: "Property type", d_area: "Area", d_beds: "Bedrooms", d_baths: "Bathrooms",
      d_sale: "Sale", d_rent: "Rent", d_price_sale: "Asking price", d_price_rent: "Monthly rent",
      d_summary: "Summary", d_overview: "Overview", d_allphotos: "All photos", d_share_btn: "Share property",
      d_inquire: "Ask about this property", d_copied: "Property link copied", d_share_text: "Check out this property",
      meta: {
        home: "Home | Lexmora", about: "About Us | Lexmora", contact: "Contact Us | Lexmora",
        properties: "Properties | Lexmora", property: "Property Details | Lexmora"
      }
    }
  };
  function t() { return T[state.lang]; }

  /* ---------- icons ---------- */
  var ICON = {
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-6-5.2-6-10a6 6 0 1 1 12 0c0 4.8-6 10-6 10z"/><circle cx="12" cy="11" r="2"/></svg>',
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-7 9 7M5 10v10h14V10M10 20v-6h4v6"/></svg>',
    heart: function (on) {
      return '<svg viewBox="0 0 24 24" fill="' + (on ? "currentColor" : "none") + '" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 20.5s-7.5-4.6-9.2-9.4C1.7 7.9 3.6 5 6.7 5c2 0 3.7 1.1 5.3 3 1.6-1.9 3.3-3 5.3-3 3.1 0 5 2.9 3.9 6.1-1.7 4.8-9.2 9.4-9.2 9.4z"/></svg>';
    },
    sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21"/></svg>',
    // detail-page icons
    bed: '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18V7M3 14h18v4M21 14v-2a3 3 0 0 0-3-3h-7v5"/><circle cx="7" cy="11" r="1.5"/></svg>',
    bath: '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h16v2a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5v-2zM6 12V6a2 2 0 0 1 3.5-1.3M7 19l-1 2M17 19l1 2"/></svg>',
    ruler: '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h5M3 15h5M9 3v5M15 3v3M15 21v-3"/></svg>',
    building: '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18M5 21V8l7-5 7 5v13M9 10h1M14 10h1M9 14h1M14 14h1M10 21v-4h4v4"/></svg>',
    tag: '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12l-8 8-9-9V3h8l9 9z"/><circle cx="7.5" cy="7.5" r="1.2"/></svg>',
    share: '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 10.5l6.8-4M8.6 13.5l6.8 4"/></svg>',
    info: '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>',
    images: '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="1.5"/><path d="M21 16l-5-5-8 8"/></svg>',
    mail: '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>'
  };

  /* ---------- property helpers ---------- */
  var PROPS = window.LEX_PROPERTIES || [];
  function img(name) { return "assets/properties/" + name + ".jpg"; }
  function typeLabel(p) { return L(window.LEX_TYPES[p.type] || { ar: p.type, en: p.type }); }
  function findProp(id) { return PROPS.filter(function (p) { return p.id === Number(id); })[0]; }

  /* ---------- shared sections ---------- */
  function navbar(page) {
    var s = t();
    var links = [
      [s.home, "index.html", page === "home"],
      [s.properties, "properties.html", page === "properties" || page === "property"],
      [s.about, "about.html", page === "about"],
      [s.contact, "contact.html", page === "contact"]
    ].map(function (l) {
      return '<a href="' + l[1] + '"' + (l[2] ? ' class="is-active"' : "") + ">" + l[0] + "</a>";
    }).join("");

    return '<header class="nb"><div class="nb-in">' +
      '<a href="index.html" class="nb-logo" aria-label="Lexmora"><span class="nb-mark">L</span>' +
      '<span class="nb-name"><b>Lexmora</b><small>REAL ESTATE</small></span></a>' +
      '<nav class="nb-links" id="nbLinks">' + links +
      '<div class="nb-m-actions"><a href="contact.html" class="nb-cta">' + s.listCta + "</a></div></nav>" +
      '<div class="nb-actions">' +
      '<button type="button" class="nb-btn nb-lang" data-act="lang" aria-label="' + (state.lang === "ar" ? "English" : "العربية") + '">' + s.langBtn + "</button>" +
      '<button type="button" class="nb-btn" data-act="theme" aria-label="' + s.themeAria + '">' + (state.theme === "dark" ? ICON.sun : ICON.moon) + "</button>" +
      '<a href="properties.html?fav=1" class="nb-btn nb-heart" aria-label="' + s.favAria + '"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-7.5-4.6-9.2-9.4C1.7 8.4 3.6 5.5 6.7 5.5c2 0 3.7 1.1 5.3 3 1.6-1.9 3.3-3 5.3-3 3.1 0 5 2.9 3.9 6.1C19.5 16.4 12 21 12 21z"/></svg></a>' +
      '<a href="contact.html" class="nb-cta nb-desk">' + s.listCta + "</a>" +
      '<button type="button" class="nb-btn nb-burger" data-act="burger" aria-expanded="false" aria-label="' + s.menu + '">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>' +
      "</div></div></header>";
  }

  function footer() {
    var s = t();
    return '<footer class="lex-footer"><div class="lex-footer-inner">' +
      '<a href="index.html" class="lex-brand" aria-label="Lexmora Home"><span class="lex-brand-mark">L</span>' +
      '<span class="lex-brand-info"><strong>Lexmora</strong><small>REAL ESTATE</small></span></a>' +
      '<p class="lex-copyright">' + s.copy + "</p>" +
      '<nav class="lex-socials" aria-label="Social media">' +
      '<a href="https://instagram.com" target="_blank" rel="noopener noreferrer">' + s.instagram + "</a>" +
      '<a href="https://dribbble.com" target="_blank" rel="noopener noreferrer">' + s.dribbble + "</a>" +
      '<a href="https://behance.net" target="_blank" rel="noopener noreferrer">' + s.behance + "</a>" +
      "</nav></div></footer>";
  }

  function hero() {
    var s = t();
    return '<section class="hr backgroundImage"><div class="hr-fade"></div><div class="hr-copy">' +
      '<span class="hr-eyebrow">✦ ' + s.h_eyebrow + "</span>" +
      '<h1 class="hr-title"><span>' + s.h_l1 + '</span><span class="hr-gold">' + s.h_l2 + "</span><span>" + s.h_l3 + "</span></h1>" +
      '<p class="hr-lead">' + s.h_lead + "</p>" +
      '<div class="hr-actions"><a href="#properties" class="hr-cta h-padding">' + s.h_explore + "</a></div></div>" +
      '<div class="hr-scroll">' + s.h_scroll + " <span>↓</span></div></section>";
  }

  function searchStats() {
    var s = t();
    var types = Object.keys(window.LEX_TYPES).map(function (k) {
      return '<option value="' + k + '">' + L(window.LEX_TYPES[k]) + "</option>";
    }).join("");
    var stats = s.stats.map(function (x) {
      return '<div class="ss-stat"><b>' + x[0] + "</b><span>" + x[1] + "</span></div>";
    }).join("");
    return '<section class="ss"><form class="ss-card" id="searchForm">' +
      '<label class="ss-field"><span>' + s.s_type + '</span><select name="type"><option value="all">' + s.s_all_types + "</option>" + types + "</select></label>" +
      '<label class="ss-field"><span>' + s.s_loc + '</span><input name="location" type="text" class="form-control form-control-sm" placeholder="' + s.s_loc_ph + '"></label>' +
      '<label class="ss-field"><span>' + s.s_purp + '</span><select name="purpose"><option value="all">' + s.s_all_purp + '</option><option value="sale">' + s.sale + '</option><option value="rent">' + s.rent + "</option></select></label>" +
      '<div class="ss-go"><button type="submit" class="ss-btn">' + ICON.search + " " + s.s_search + "</button></div></form>" +
      '<div class="ss-stats">' + stats + "</div></section>";
  }

  function featuredCard(p) {
    var s = t(), isRent = p.purpose === "rent", on = getFavs().indexOf(p.id) > -1;
    return '<article class="fp-card"><div class="fp-img">' +
      '<img src="' + img(p.images[0]) + '" alt="' + esc(L(p.name)) + '" loading="lazy" decoding="async">' +
      '<span class="fp-badge ' + (isRent ? "is-rent" : "is-sale") + '">' + (isRent ? s.rent : s.sale) + "</span>" +
      '<button type="button" class="fp-heart' + (on ? " is-on" : "") + '" data-fav="' + p.id + '" aria-label="' + s.fav + '" aria-pressed="' + on + '">' + ICON.heart(on) + "</button></div>" +
      '<div class="fp-body"><div class="fp-price">' + money(p.price) + (isRent ? "<small>" + s.month + "</small>" : "") + "</div>" +
      '<h3 class="fp-name"><a href="property.html?id=' + p.id + '">' + esc(L(p.name)) + "</a></h3>" +
      '<p class="fp-meta">' + p.beds + " " + s.beds + " · " + p.baths + " " + s.baths + " · " + p.area + " " + s.area + "</p>" +
      '<p class="fp-loc">' + ICON.pin + " " + esc(L(p.address)) + "</p></div></article>";
  }

  function featured() {
    var s = t();
    var list = PROPS.filter(function (p) { return p.featured; }).slice(0, 4);
    if (!list.length) list = PROPS.slice(0, 4);
    return '<section class="fp" id="properties"><div class="fp-head"><div><span class="fp-eyebrow">' + s.f_eyebrow + "</span>" +
      '<h2 class="fp-title">' + s.f_t1 + ' <span class="fp-gold">' + s.f_t2 + "</span></h2></div>" +
      '<a href="properties.html" class="fp-all">' + s.f_all + "</a></div>" +
      (list.length ? '<div class="fp-grid">' + list.map(featuredCard).join("") + "</div>" : '<p class="fp-empty">' + s.empty + "</p>") +
      "</section>";
  }

  function experience() {
    var s = t();
    return '<section class="ex"><div class="ex-in"><div class="ex-copy" dir="' + (state.lang === "ar" ? "rtl" : "ltr") + '">' +
      '<span class="ex-eyebrow">' + s.e_eyebrow + "</span>" +
      '<h2 class="ex-title"><span>' + s.e_l1 + '</span><span class="ex-gold">' + s.e_l2 + "</span></h2>" +
      '<p class="ex-lead">' + s.e_lead + '</p><a href="properties.html" class="ex-cta">' + s.e_cta + "</a></div>" +
      '<div class="ex-art" aria-hidden="true"><div class="ex-image"></div>' +
      '<svg viewBox="0 0 500 400" fill="none"><g transform="rotate(-15 250 200)"><ellipse class="ex-orbit" cx="250" cy="200" rx="220" ry="85"/>' +
      '<circle class="ex-dot" r="4"><animateMotion dur="16s" repeatCount="indefinite" path="M 470 200 A 220 85 0 1 1 30 200 A 220 85 0 1 1 470 200"/></circle></g></svg>' +
      '<div class="ex-360"><span>360°</span></div></div></div></section>';
  }

  var BEN_ICONS = [
    '<svg viewBox="0 0 24 24" fill="none"><path d="M12 2L20 5V11C20 16 16.5 20 12 22C7.5 20 4 16 4 11V5L12 2Z"/><path d="M8.5 12L11 14.5L16 9"/></svg>',
    '<svg viewBox="0 0 24 24" fill="none"><path d="M3 13V11C3 6 7 2 12 2C17 2 21 6 21 11V13"/><path d="M3 12H6V19H5C3.9 19 3 18.1 3 17V12Z"/><path d="M21 12H18V19H19C20.1 19 21 18.1 21 17V12Z"/><path d="M18 19C17 21 15 22 12 22"/></svg>',
    '<svg viewBox="0 0 24 24" fill="none"><path d="M3 21H21"/><path d="M5 21V8L12 3L19 8V21"/><path d="M9 10H10M14 10H15M9 14H10M14 14H15M10 21V17H14V21"/></svg>',
    '<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="16" rx="3"/><circle cx="12" cy="13" r="4"/><path d="M8 5L9 3H15L16 5"/><path d="M18 8H18.01"/></svg>'
  ];
  function ads() {
    var s = t(), ar = state.lang === "ar";
    return '<div class="p-5 m-5"><h1 class="text-center">' + s.why + "</h1>" +
      '<div class="lex-benefits-wrapper container" style="padding:10px;padding-top:20px">' +
      '<section class="lex-benefits border" dir="' + (ar ? "rtl" : "ltr") + '"><div class="lex-benefits-grid">' +
      s.benefits.map(function (b, i) { return '<div class="lex-benefit-card">' + BEN_ICONS[i] + "<h3>" + b + "</h3></div>"; }).join("") +
      "</div></section></div></div>";
  }

  function cta() {
    var s = t();
    return '<section class="ct" dir="' + (state.lang === "ar" ? "rtl" : "ltr") + '"><div class="ct-card background-image"><div class="ct-copy">' +
      '<span class="ct-eyebrow">' + s.c_eyebrow + '</span><h2 class="ct-title"><span class="text-white">' + s.c_l1 + '</span> <span class="ct-gold">' + s.c_l2 + "</span></h2></div>" +
      '<a href="contact.html" class="ct-btn">' + s.c_cta + "</a></div></section>";
  }

  /* ---------- pages ---------- */
  function pageHome() {
    return hero() + searchStats() + featured() + experience() + ads() + cta();
  }

  function propCard(p) {
    var s = t(), isRent = p.purpose === "rent", on = getFavs().indexOf(p.id) > -1;
    return '<div class="col"><article class="card prop-card h-100 shadow-sm position-relative overflow-hidden">' +
      '<div class="position-relative"><div class="ratio ratio-4x3 bg-body-secondary">' +
      '<img src="' + img(p.images[0]) + '" alt="' + esc(L(p.name)) + '" class="object-fit-cover" loading="lazy" decoding="async"></div>' +
      '<span class="badge position-absolute top-0 start-0 m-3 ' + (isRent ? "text-bg-info" : "text-bg-warning") + '">' + (isRent ? s.rent : s.sale) + "</span>" +
      '<button type="button" class="btn btn-light btn-sm rounded-circle prop-fav position-absolute top-0 end-0 m-3 ' + (on ? "is-on text-danger" : "text-secondary") + '" style="z-index:3" data-fav="' + p.id + '" aria-label="' + s.fav + '" aria-pressed="' + on + '">' +
      ICON.heart(on).replace("<svg", '<svg width="18" height="18"') + "</button></div>" +
      '<div class="card-body"><div class="fs-4 fw-bold">' + money(p.price) + (isRent ? ' <small class="fs-6 fw-normal text-body-secondary">' + s.month + "</small>" : "") + "</div>" +
      '<h3 class="h5 card-title mt-1"><a href="property.html?id=' + p.id + '" class="text-decoration-none text-reset stretched-link">' + esc(L(p.name)) + "</a></h3>" +
      '<p class="card-text text-body-secondary mb-2">' + p.beds + " " + s.beds + " · " + p.baths + " " + s.baths + " · " + p.area + " " + s.area + "</p>" +
      '<p class="card-text small text-body-secondary d-flex align-items-center gap-1 mb-0"><span style="width:14px;height:14px;display:inline-flex">' + ICON.pin + "</span>" + esc(L(p.address)) + "</p></div>" +
      '<div class="row justify-content-center p-2"><a class="btn btn-gold rounded w-50 fw-medium" style="position:relative;z-index:2" href="property.html?id=' + p.id + '">' + s.p_view + "</a></div>" +
      "</article></div>";
  }

  function filterProps(f) {
    var favs = getFavs();
    var words = (f.location || "").toLowerCase().split(/\s+/).filter(Boolean);
    return PROPS.filter(function (p) {
      if (f.fav && favs.indexOf(p.id) === -1) return false;
      if (f.purpose && f.purpose !== "all" && p.purpose !== f.purpose) return false;
      if (f.type && f.type !== "all" && p.type !== f.type) return false;
      var hay = (p.name.ar + " " + p.name.en + " " + p.address.ar + " " + p.address.en).toLowerCase();
      return words.every(function (w) { return hay.indexOf(w) > -1; });
    });
  }

  function pageProperties() {
    var s = t(), q = qs();
    var f = { purpose: q.get("purpose") || "all", type: q.get("type") || "all", location: q.get("location") || "", fav: q.get("fav") === "1" };
    var types = Object.keys(window.LEX_TYPES).map(function (k) {
      return '<option value="' + k + '"' + (f.type === k ? " selected" : "") + ">" + L(window.LEX_TYPES[k]) + "</option>";
    }).join("");
    return navbar("properties") + '<main><div class="container"><section class="page-head"><p class="eyebrow">' + s.p_eyebrow + "</p>" +
      '<h1 class="display-5 mb-2">' + (f.fav ? s.p_favs : s.p_title) + '</h1><p class="text-muted">' + s.p_lead + "</p></section></div>" +
      '<div class="container py-4"><form class="prop-filters" id="propFilters">' +
      '<div><label class="form-label small text-muted">' + s.s_type + '</label><select name="type" class="form-select"><option value="all">' + s.p_all + "</option>" + types + "</select></div>" +
      '<div><label class="form-label small text-muted">' + s.s_purp + '</label><select name="purpose" class="form-select"><option value="all"' + (f.purpose === "all" ? " selected" : "") + ">" + s.p_all + '</option><option value="sale"' + (f.purpose === "sale" ? " selected" : "") + ">" + s.sale + '</option><option value="rent"' + (f.purpose === "rent" ? " selected" : "") + ">" + s.rent + "</option></select></div>" +
      '<div><label class="form-label small text-muted">' + s.s_loc + '</label><input name="location" class="form-control" value="' + esc(f.location) + '" placeholder="' + s.s_loc_ph + '"></div>' +
      '<div class="d-flex gap-2"><button type="button" class="btn btn-outline-secondary" id="resetFilters">' + s.p_reset + "</button>" +
      '<label class="btn btn-outline-warning mb-0"><input type="checkbox" name="fav" class="d-none"' + (f.fav ? " checked" : "") + ' id="favOnly"> ♥ ' + s.p_favs + "</label></div></form>" +
      '<p class="text-muted small" id="propCount"></p><div id="propList"></div></div></main>' + footer();
  }

  function renderPropList() {
    var s = t(), form = document.getElementById("propFilters");
    if (!form) return;
    var f = {
      type: form.type.value, purpose: form.purpose.value, location: form.location.value.trim(), fav: form.fav.checked
    };
    // keep the URL in sync (so results can be shared / bookmarked)
    var p = new URLSearchParams();
    if (f.type !== "all") p.set("type", f.type);
    if (f.purpose !== "all") p.set("purpose", f.purpose);
    if (f.location) p.set("location", f.location);
    if (f.fav) p.set("fav", "1");
    try { history.replaceState(null, "", location.pathname + (p.toString() ? "?" + p : "")); } catch (e) {}
    var list = filterProps(f);
    document.getElementById("propCount").textContent = list.length + " " + s.p_count;
    document.getElementById("propList").innerHTML = list.length
      ? '<div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">' + list.map(propCard).join("") + "</div>"
      : '<div class="alert alert-info text-center mb-0">' + s.empty + "</div>";
  }

  function pageProperty() {
    var s = t(), p = findProp(qs().get("id"));
    if (!p) {
      return navbar("property") + '<main class="container py-5 text-center"><p class="lead">' + s.d_notfound + '</p><a class="btn btn-gold" href="properties.html">' + s.d_back + "</a></main>" + footer();
    }
    var isRent = p.purpose === "rent", name = L(p.name), addr = L(p.address);
    var priceLabel = isRent ? s.d_price_rent : s.d_price_sale;
    var priceTxt = money(p.price) + (isRent ? " " + s.month : "");
    var thumbs = p.images.slice(0, 4).map(function (im, i) {
      return '<button type="button" class="gallery-thumb' + (i === 0 ? " active" : "") + '" data-gallery-image="' + img(im) + '" aria-label="' + (i + 1) + '">' +
        '<img src="' + img(im) + '" alt="' + esc(name) + " " + (i + 1) + '" loading="lazy">' +
        (i === 3 && p.images.length > 4 ? '<span class="more-images" dir="ltr">+' + (p.images.length - 4) + "</span>" : "") + "</button>";
    }).join("");
    var all = p.images.length > 4 ? '<section class="property-card mb-4"><h5 class="fw-bold mb-4">' + ICON.images + " " + s.d_allphotos + '</h5><div class="row g-3">' +
      p.images.map(function (im) {
        return '<div class="col-6 col-md-4"><button type="button" class="all-gallery-image" data-gallery-image="' + img(im) + '"><img src="' + img(im) + '" alt="' + esc(name) + '" loading="lazy"></button></div>';
      }).join("") + "</div></section>" : "";
    function row(k, v) { return '<div class="property-info-row"><span>' + k + "</span><strong>" + v + "</strong></div>"; }
    function side(ic, k, v) { return '<div class="sidebar-info"><span>' + ic + " " + k + "</span><strong>" + v + "</strong></div>"; }
    function feat(ic, v, k) { return '<div class="col-6 col-md-3"><div class="property-feature">' + ic + "<strong>" + v + "</strong><span>" + k + "</span></div></div>"; }

    return navbar("property") + '<div class="property-page"><div class="container py-4">' +
      '<div class="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4"><div>' +
      '<div class="text-secondary crumbs mb-2"><a href="index.html">' + s.home + '</a> / <a href="properties.html">' + s.properties + "</a> / " + esc(name) + "</div>" +
      '<h2 class="fw-bold mb-1">' + esc(name) + '</h2><div class="text-secondary">' + addr + "</div></div>" +
      '<div class="d-flex gap-2"><button type="button" class="btn property-action-btn" data-act="share">' + ICON.share + " " + s.d_share + "</button>" +
      '<a href="#property-details" class="btn btn-gold property-primary-btn">' + ICON.info + " " + s.d_details + "</a></div></div>" +
      '<section class="property-gallery mb-5"><div class="row g-3"><div class="col-lg-8"><div class="main-image-wrapper">' +
      '<img id="mainPropertyImage" src="' + img(p.images[0]) + '" alt="' + esc(name) + '" class="main-property-image">' +
      '<div class="gallery-overlay"><span class="gallery-counter">' + ICON.images + " " + p.images.length + " " + s.d_photos + "</span></div></div></div>" +
      '<div class="col-lg-4"><div class="gallery-thumbnails">' + thumbs + "</div></div></div></section>" +
      '<div class="row g-4"><div class="col-lg-8">' +
      '<section class="property-card mb-4" id="property-details"><div class="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4"><div>' +
      '<span class="property-type-badge">' + (isRent ? s.rent : s.sale) + "</span>" +
      '<h3 class="fw-bold mt-3 mb-2">' + esc(name) + '</h3><p class="text-secondary mb-0">' + addr + "</p></div>" +
      '<div class="text-lg-end"><div class="property-price">' + priceTxt + '</div><span class="text-secondary small">' + priceLabel + "</span></div></div>" +
      "<p class=\"text-secondary\">" + esc(L(p.desc)) + "</p><hr>" +
      '<h5 class="fw-bold mb-4">' + ICON.building + " " + s.d_specs + '</h5><div class="row g-3">' +
      feat(ICON.bed, p.beds, s.d_beds) + feat(ICON.bath, p.baths, s.d_baths) + feat(ICON.ruler, p.area + " " + s.area, s.d_area) + feat(ICON.building, typeLabel(p), s.d_type) +
      "</div></section>" +
      '<section class="property-card mb-4"><h5 class="fw-bold mb-3">' + ICON.info + " " + s.d_info + "</h5>" +
      row(s.d_name, esc(name)) + row(s.d_addr, esc(addr)) + row(s.d_adtype, isRent ? s.d_rent : s.d_sale) + row(s.d_type, typeLabel(p)) + row(s.d_area, p.area + " " + s.area) +
      "</section>" + all + "</div>" +
      '<div class="col-lg-4"><div class="property-card property-sidebar"><div class="mb-4"><span class="text-secondary small">' + priceLabel + "</span>" +
      '<h2 class="property-price mt-2 mb-0">' + priceTxt + "</h2></div><hr>" +
      '<h5 class="fw-bold mb-3">' + s.d_summary + "</h5>" +
      side(ICON.tag, s.d_adtype, isRent ? s.d_rent : s.d_sale) + side(ICON.bed, s.d_beds, p.beds) + side(ICON.bath, s.d_baths, p.baths) + side(ICON.ruler, s.d_area, p.area + " " + s.area) +
      '<hr><a href="contact.html?property=' + encodeURIComponent(name) + '" class="btn btn-gold w-100 property-primary-btn mb-2">' + ICON.mail + " " + s.d_inquire + "</a>" +
      '<button type="button" class="btn property-action-btn w-100" data-act="share">' + ICON.share + " " + s.d_share_btn + "</button>" +
      "</div></div></div></div></div>" + footer();
  }

  function pageAbout() {
    var s = t(), ar = state.lang === "ar";
    var vals = [10, 12, 98], suf = ["K+", "+", "%"];
    var stats = vals.map(function (v, i) {
      return '<li><strong><span data-count="' + v + '">' + v + "</span>" + suf[i] + '</strong><span class="stat-label">' + s.a_stats[i] + "</span></li>";
    }).join("");
    return navbar("about") + '<div><main class="wrap about container" style="margin-top:50px;margin-bottom:60px">' +
      '<section class="about-media"><img class="image" src="assets/img/about.jpg" alt="' + s.a_alt + '" loading="lazy"></section>' +
      '<section class="about-copy" dir="' + (ar ? "rtl" : "ltr") + '"><p class="eyebrow">' + s.a_eyebrow + "</p>" +
      "<h1>" + s.a_t1 + " <em>" + s.a_t2 + "</em></h1>" +
      '<p class="lead">' + s.a_l1 + '</p><p class="lead">' + s.a_l2 + '</p><ul class="stats">' + stats + "</ul></section></main></div>" + footer();
  }

  function pageContact() {
    var s = t(), ar = state.lang === "ar";
    var pre = qs().get("property") || "";
    function field(id, label, extra, tag) {
      var input = tag === "textarea"
        ? '<textarea id="' + id + '" name="' + id + '" class="form-control enquiry-input rounded-3" rows="5" placeholder="' + label + '"></textarea>'
        : '<input id="' + id + '" name="' + id + '" class="form-control form-control-lg enquiry-input rounded-3" placeholder="' + label + '" ' + (extra || "") + (id === "property" ? ' value="' + esc(pre) + '"' : "") + ">";
      return '<div class="mb-4"><label for="' + id + '" class="form-label fw-semibold">' + label + "</label>" + input + '<div class="invalid-feedback"></div></div>';
    }
    return navbar("contact") + '<div class="enquiry-page min-vh-100"><main class="container py-5">' +
      '<section class="text-center mb-5"><p class="eyebrow fw-semibold text-uppercase mb-3" style="color:var(--gold)">' + s.k_eyebrow + "</p>" +
      '<h1 class="display-5 fw-bold mb-3">' + s.k_t1 + ' <em style="color:var(--gold)">' + s.k_t2 + "</em></h1>" +
      '<p class="lead enquiry-muted mx-auto">' + s.k_lead + "</p></section>" +
      '<section class="row justify-content-center"><div class="col-lg-7 col-md-9"><div class="card enquiry-card border-0 rounded-4 shadow-sm">' +
      '<div class="card-body p-4 p-md-5" dir="' + (ar ? "rtl" : "ltr") + '"><form id="contactForm" novalidate>' +
      '<div id="formAlert"></div>' +
      field("name", s.k_name, 'type="text" autocomplete="name"') + field("email", s.k_email, 'type="email" autocomplete="email" dir="ltr"') +
      field("property", s.k_property, 'type="text"') + field("message", s.k_message, "", "textarea") +
      '<button type="submit" class="btn btn-gold btn-lg w-100 rounded-3 py-3 fw-semibold">' + s.k_send + "</button>" +
      "</form></div></div></div></section></main></div>" + footer();
  }

  /* ---------- render engine ---------- */
  var PAGES = { home: pageHome, properties: pageProperties, property: pageProperty, about: pageAbout, contact: pageContact };
  var page = document.body.getAttribute("data-page") || "home";

  function applyDoc() {
    var h = document.documentElement;
    h.lang = state.lang;
    h.dir = state.lang === "ar" ? "rtl" : "ltr";
    h.setAttribute("data-theme", state.theme);
    h.setAttribute("data-bs-theme", state.theme);
    var title = t().meta[page];
    if (page === "property") {
      var p = findProp(qs().get("id"));
      if (p) title = L(p.name) + " | Lexmora";
    }
    document.title = title;
  }

  function render() {
    applyDoc();
    var app = document.getElementById("app");
    var html = PAGES[page]();
    // pages that don't include their own navbar get it here (home/about/contact/property include theirs)
    if (page === "home") html = navbar("home") + html + footer();
    app.innerHTML = html;
    afterRender();
  }

  function afterRender() {
    // properties page list
    if (page === "properties") renderPropList();
    // reveal on scroll
    if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      var io = new IntersectionObserver(function (en) {
        en.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); } });
      }, { threshold: 0.12 });
      document.querySelectorAll(".fp-card,.lex-benefit-card,.ex-in,.ct-card,.about-copy,.about-media,.prop-card,.property-card").forEach(function (el) {
        el.classList.add("reveal"); io.observe(el);
      });
    }
    // about counters
    var counters = document.querySelectorAll("[data-count]");
    if (counters.length) {
      var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      var run = function (el) {
        var target = Number(el.getAttribute("data-count"));
        if (reduce) { el.textContent = target; return; }
        var start = performance.now();
        (function tick(now) {
          var p = Math.min((now - start) / 1200, 1);
          el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(tick);
        })(start);
      };
      if ("IntersectionObserver" in window) {
        var co = new IntersectionObserver(function (en) {
          en.forEach(function (e) { if (e.isIntersecting) { run(e.target); co.unobserve(e.target); } });
        }, { threshold: 0.4 });
        counters.forEach(function (c) { co.observe(c); });
      } else { counters.forEach(run); }
    }
  }

  /* ---------- toast + share ---------- */
  function toast(msg) {
    var el = document.createElement("div");
    el.className = "toast-lex"; el.textContent = msg; document.body.appendChild(el);
    setTimeout(function () { el.remove(); }, 2400);
  }
  function shareProperty() {
    var data = { title: document.title, text: t().d_share_text, url: location.href };
    if (navigator.share) { navigator.share(data).catch(function () {}); }
    else if (navigator.clipboard) { navigator.clipboard.writeText(location.href).then(function () { toast(t().d_copied); }); }
    else { window.prompt("URL", location.href); }
  }

  /* ---------- contact form (no backend) ---------- */
  function setErr(input, msg) {
    input.classList.toggle("is-invalid", !!msg);
    var fb = input.parentNode.querySelector(".invalid-feedback");
    if (fb) fb.textContent = msg || "";
  }
  function validate(form) {
    var s = t(), ok = true;
    var v = { name: form.name.value.trim(), email: form.email.value.trim(), property: form.property.value.trim(), message: form.message.value.trim() };
    if (v.name.length < 2) { setErr(form.name, v.name ? s.v_name : s.v_required); ok = false; } else setErr(form.name, "");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) { setErr(form.email, v.email ? s.v_email : s.v_required); ok = false; } else setErr(form.email, "");
    if (!v.property) { setErr(form.property, s.v_required); ok = false; } else setErr(form.property, "");
    if (v.message.length < 10) { setErr(form.message, v.message ? s.v_message : s.v_required); ok = false; } else setErr(form.message, "");
    return ok ? v : null;
  }
  function submitContact(form) {
    var s = t(), v = validate(form), box = document.getElementById("formAlert");
    if (!v) return;
    var cfg = window.LEX_CONFIG || {};
    var body = "Name: " + v.name + "\nEmail: " + v.email + "\nProperty/Location: " + v.property + "\n\n" + v.message;
    var done = function () {
      box.innerHTML = '<div class="alert alert-success rounded-3 mb-4" role="status">' + s.k_success + "</div>";
      form.reset();
    };
    if (cfg.formEndpoint) {
      fetch(cfg.formEndpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(v) })
        .then(function (r) { if (!r.ok) throw new Error("bad"); done(); })
        .catch(function () { box.innerHTML = '<div class="alert alert-danger rounded-3 mb-4" role="alert">' + s.k_error + "</div>"; });
    } else {
      var subject = (state.lang === "ar" ? "استفسار جديد من " : "New enquiry from ") + v.name;
      location.href = "mailto:" + (cfg.contactEmail || "") + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
      done();
    }
  }

  /* ---------- global events (delegation, survives re-render) ---------- */
  document.addEventListener("click", function (e) {
    var el = e.target.closest("[data-act],[data-fav],[data-gallery-image]");
    var links = document.getElementById("nbLinks");
    if (!el) { if (links && !e.target.closest(".nb")) links.classList.remove("is-open"); return; }

    if (el.hasAttribute("data-gallery-image")) {
      var main = document.getElementById("mainPropertyImage");
      if (main) {
        main.src = el.getAttribute("data-gallery-image");
        document.querySelectorAll(".gallery-thumb").forEach(function (b) { b.classList.remove("active"); });
        if (el.classList.contains("gallery-thumb")) el.classList.add("active");
        if (el.classList.contains("all-gallery-image")) main.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }
    if (el.hasAttribute("data-fav")) {
      e.preventDefault(); e.stopPropagation();
      var on = toggleFav(Number(el.getAttribute("data-fav")));
      el.classList.toggle("is-on", on);
      if (el.classList.contains("prop-fav")) { el.classList.toggle("text-danger", on); el.classList.toggle("text-secondary", !on); }
      el.setAttribute("aria-pressed", on);
      var svg = el.querySelector("svg"); if (svg) svg.setAttribute("fill", on ? "currentColor" : "none");
      // viewing favorites only: re-filter so removed items disappear
      if (page === "properties" && document.getElementById("favOnly") && document.getElementById("favOnly").checked) renderPropList();
      return;
    }
    var act = el.getAttribute("data-act");
    if (act === "lang") { state.lang = state.lang === "ar" ? "en" : "ar"; store.set("lex_lang", state.lang); render(); }
    else if (act === "theme") { state.theme = state.theme === "dark" ? "light" : "dark"; store.set("lex_theme", state.theme); render(); }
    else if (act === "burger") {
      var open = links.classList.toggle("is-open");
      el.setAttribute("aria-expanded", open);
    } else if (act === "share") shareProperty();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { var l = document.getElementById("nbLinks"); if (l) l.classList.remove("is-open"); }
  });

  document.addEventListener("submit", function (e) {
    var f = e.target;
    if (f.id === "searchForm") {
      e.preventDefault();
      var p = new URLSearchParams();
      ["purpose", "type", "location"].forEach(function (k) {
        var val = (f.elements[k].value || "").trim();
        if (val && val !== "all") p.set(k, val);
      });
      location.href = "properties.html" + (p.toString() ? "?" + p : "");
    } else if (f.id === "contactForm") { e.preventDefault(); submitContact(f); }
    else if (f.id === "propFilters") { e.preventDefault(); renderPropList(); }
  });

  document.addEventListener("input", function (e) {
    if (e.target.closest && e.target.closest("#propFilters")) renderPropList();
    if (e.target.closest && e.target.closest("#contactForm") && e.target.classList.contains("is-invalid")) setErr(e.target, "");
  });
  document.addEventListener("change", function (e) {
    if (e.target.closest && e.target.closest("#propFilters")) renderPropList();
  });
  document.addEventListener("click", function (e) {
    if (e.target && e.target.id === "resetFilters") {
      var f = document.getElementById("propFilters");
      f.type.value = "all"; f.purpose.value = "all"; f.location.value = ""; f.fav.checked = false; renderPropList();
    }
  });

  // scroll progress bar
  var bar = document.createElement("div"); bar.className = "scroll-progress"; document.body.prepend(bar);
  window.addEventListener("scroll", function () {
    var h = document.documentElement.scrollHeight - innerHeight;
    bar.style.width = (h > 0 ? (scrollY / h) * 100 : 0) + "%";
  }, { passive: true });

  render();
})();
