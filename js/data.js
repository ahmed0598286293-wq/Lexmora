/* ==========================================================================
   Lexmora – static data (replaces the old database / Eloquent models)
   Edit this file to add, remove or change properties. No backend needed.
   ========================================================================== */

window.LEX_CONFIG = {
  // Contact form: if you set a Formspree (or similar) endpoint here the form will POST to it.
  // Example: "https://formspree.io/f/xxxxxxx". When empty, the form opens the visitor's mail app.
  formEndpoint: "",
  contactEmail: "info@lexmora.example"
};

window.LEX_TYPES = {
  villa:   { ar: "فيلا", en: "Villa" },
  mansion: { ar: "قصر",  en: "Mansion" },
  house:   { ar: "منزل", en: "House" }
};

/* purpose: "sale" | "rent"   (rent price is per month) */
window.LEX_PROPERTIES = [
  { id: 1, type: "villa", purpose: "sale", price: 1250000, beds: 5, baths: 4, area: 550, featured: true,
    name:    { ar: "فيلا الأفق", en: "Skyline Villa" },
    address: { ar: "دبي، الإمارات", en: "Dubai, UAE" },
    desc:    { ar: "فيلا عصرية بواجهات زجاجية واسعة وإطلالة مفتوحة وحديقة بنخيل وإضاءة مسائية فاخرة.",
               en: "A modern villa with wide glass façades, open views, a palm garden and refined evening lighting." },
    images: ["v1", "v3", "v5", "v6", "v7"] },

  { id: 2, type: "mansion", purpose: "sale", price: 3400000, beds: 8, baths: 9, area: 1100, featured: true,
    name:    { ar: "قصر اللؤلؤة البيضاء", en: "White Pearl Mansion" },
    address: { ar: "الدوحة، قطر", en: "Doha, Qatar" },
    desc:    { ar: "قصر كلاسيكي بواجهة بيضاء مضيئة وأعمدة فخمة ومدخل واسع يتسع لعدة سيارات.",
               en: "A classic mansion with a glowing white façade, grand columns and a wide forecourt." },
    images: ["v2", "v1", "v4", "v8", "v3"] },

  { id: 3, type: "house", purpose: "sale", price: 980000, beds: 4, baths: 3, area: 420, featured: true,
    name:    { ar: "منزل الحديقة", en: "Garden Residence" },
    address: { ar: "إسطنبول، تركيا", en: "Istanbul, Türkiye" },
    desc:    { ar: "منزل أنيق بتصميم دافئ وحديقة خلفية ومساحات معيشة مفتوحة مناسبة للعائلات.",
               en: "An elegant family home with warm design, a rear garden and open living spaces." },
    images: ["v3", "v6", "v7", "v1", "v5"] },

  { id: 4, type: "villa", purpose: "rent", price: 6800, beds: 6, baths: 5, area: 620, featured: true,
    name:    { ar: "إطلالة النخيل", en: "Palm View Estate" },
    address: { ar: "دبي، الإمارات", en: "Dubai, UAE" },
    desc:    { ar: "فيلا للإيجار بمسبح خاص وإطلالة على النخيل وتشطيبات داخلية راقية.",
               en: "A villa for rent with a private pool, palm views and premium interior finishes." },
    images: ["v4", "v5", "v2", "v7", "v8"] },

  { id: 5, type: "villa", purpose: "sale", price: 1780000, beds: 5, baths: 5, area: 640,
    name:    { ar: "فيلا الواحة العصرية", en: "Modern Oasis Villa" },
    address: { ar: "الرياض، السعودية", en: "Riyadh, Saudi Arabia" },
    desc:    { ar: "تصميم معماري حديث بخطوط نظيفة وإضاءة دافئة وتفاصيل حجرية فاخرة.",
               en: "Contemporary architecture with clean lines, warm lighting and refined stone details." },
    images: ["v5", "v1", "v6", "v3", "v2"] },

  { id: 6, type: "house", purpose: "rent", price: 2900, beds: 4, baths: 3, area: 380,
    name:    { ar: "بيت الغروب", en: "Sunset Courtyard House" },
    address: { ar: "عمّان، الأردن", en: "Amman, Jordan" },
    desc:    { ar: "بيت مريح بفناء واسع ومواقف سيارات وإطلالة رائعة وقت الغروب.",
               en: "A comfortable house with a wide courtyard, parking and beautiful sunset views." },
    images: ["v6", "v7", "v3", "v5", "v4"] },

  { id: 7, type: "villa", purpose: "sale", price: 2150000, beds: 6, baths: 6, area: 720,
    name:    { ar: "فيلا المارينا", en: "Marina Signature Villa" },
    address: { ar: "أبوظبي، الإمارات", en: "Abu Dhabi, UAE" },
    desc:    { ar: "فيلا بتوقيع معماري مميز، مدخل مهيب، وحدائق مصممة بعناية قرب المارينا.",
               en: "A signature villa with an impressive entrance and carefully designed gardens near the marina." },
    images: ["v7", "v6", "v1", "v8", "v5"] },

  { id: 8, type: "villa", purpose: "rent", price: 9500, beds: 7, baths: 7, area: 880,
    name:    { ar: "فيلا الليل البنفسجي", en: "Violet Night Villa" },
    address: { ar: "دبي، الإمارات", en: "Dubai, UAE" },
    desc:    { ar: "فيلا للإيجار بإضاءة ليلية بنفسجية مميزة وتصميم جريء ومساحات استقبال ضخمة.",
               en: "A rental villa with signature violet night lighting, bold design and huge reception areas." },
    images: ["v8", "v2", "v4", "v1", "v7"] }
];
