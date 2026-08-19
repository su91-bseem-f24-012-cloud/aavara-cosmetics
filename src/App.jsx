import React, { useState, useEffect, useMemo, useRef, createContext, useContext } from "react";
import {
  Search, Heart, ShoppingBag, User, Menu, X, Star, ChevronDown, ChevronRight,
  ChevronLeft, Plus, Minus, Check, Truck, ShieldCheck, RotateCcw, MessageCircle,
  MapPin, Phone, Mail, Clock, Trash2, Pencil, Eye, SlidersHorizontal, ArrowRight,
  Leaf, Sparkle
} from "lucide-react";

/* ---------------------------------------------------------------------- */
/*  TOKENS                                                                 */
/* ---------------------------------------------------------------------- */
const COLORS = {
  ivory: "#FBF7F1",
  paper: "#F6F0E7",
  beige: "#EAE0CE",
  pink: "#E9D1CC",
  pinkDeep: "#D9AFA8",
  green: "#DCE6D5",
  greenDeep: "#93A886",
  gold: "#AD8A55",
  goldLight: "#C9AD7C",
  ink: "#2E2A24",
  inkSoft: "#6B6255",
};

const GROUP_TONE = {
  men: { bg: "linear-gradient(160deg,#EAE0CE,#DDD0B4)", accent: COLORS.gold },
  women: { bg: "linear-gradient(160deg,#F1DCD8,#E9C9C2)", accent: COLORS.pinkDeep },
  baby: { bg: "linear-gradient(160deg,#E4EEDD,#D3E3C9)", accent: COLORS.greenDeep },
  hair: { bg: "linear-gradient(160deg,#EFE6D2,#E3D5B4)", accent: COLORS.gold },
  skin: { bg: "linear-gradient(160deg,#F3ECE1,#E9DCC8)", accent: COLORS.goldLight },
};

function useFonts() {
  useEffect(() => {
    if (document.getElementById("cs-fonts")) return;
    const link = document.createElement("link");
    link.id = "cs-fonts";
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,450;0,9..144,600;1,9..144,450&family=Manrope:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
  }, []);
}

const fmt = (n) => "Rs " + Math.round(n).toLocaleString("en-PK");

/* ---------------------------------------------------------------------- */
/*  DATA                                                                   */
/* ---------------------------------------------------------------------- */
const CATEGORY_DEFS = [
  { key: "men", label: "Men's Care", desc: "Face wash, beard care & grooming essentials.", vessel: "bottle" },
  { key: "women", label: "Women's Care", desc: "Skincare, haircare & body essentials.", vessel: "jar" },
  { key: "baby", label: "Baby & Kids", desc: "Gentle formulas for delicate skin.", vessel: "tube" },
  { key: "hair", label: "Hair Care", desc: "Shampoo, oils, masks & treatments.", vessel: "bottle" },
  { key: "skin", label: "Skin Care", desc: "Cleansers, serums & moisturisers.", vessel: "jar" },
];

const BRANDS = ["Velin", "Órla Botanicals", "Cambric", "Nourella", "Petal & Oat", "Baby Bloom"];

// To use a real photo for a product, add an `image` field with a path or URL,
// e.g. { name: "...", image: "/images/charcoal-face-wash.jpg", ... }.
// Drop photo files into public/images/ — anything not given an `image` falls
// back to the illustrated placeholder automatically, so you can add photos
// gradually. See public/images/README.md for details.
const RAW_PRODUCTS = [
  // MEN
  { name: "Charcoal Deep-Clean Face Wash", brand: "Velin", groups: ["men", "skin"], sub: "Face Wash", vessel: "tube", tone: "men", size: "100ml", price: 950, sale: 760, rating: 4.5, reviews: 128, skinType: "Oily", ingredient: "Activated Charcoal", isBestSeller: true },
  { name: "Oil-Control Mattifying Moisturiser", brand: "Velin", groups: ["men", "skin"], sub: "Moisturizer", vessel: "jar", tone: "men", size: "50g", price: 1150, rating: 4.3, reviews: 76, skinType: "Oily", ingredient: "Niacinamide" },
  { name: "Clay Purifying Face Mask", brand: "Cambric", groups: ["men", "skin"], sub: "Face Mask", vessel: "jar", tone: "men", size: "75g", price: 1290, rating: 4.4, reviews: 54, skinType: "Combination", ingredient: "Kaolin Clay" },
  { name: "Coffee Energising Scrub", brand: "Cambric", groups: ["men", "skin"], sub: "Scrub", vessel: "tube", tone: "men", size: "100g", price: 890, sale: 710, rating: 4.2, reviews: 41, skinType: "Normal", ingredient: "Coffee Grounds", isNew: true },
  { name: "Daily Defence Sunscreen SPF 50", brand: "Velin", groups: ["men", "skin"], sub: "Sunscreen", vessel: "tube", tone: "men", size: "60ml", price: 1450, rating: 4.6, reviews: 203, skinType: "All", ingredient: "Zinc Oxide", isBestSeller: true },
  { name: "Anti-Dandruff Cool Mint Shampoo", brand: "Cambric", groups: ["men", "hair"], sub: "Shampoo", vessel: "bottle", tone: "men", size: "200ml", price: 780, rating: 4.1, reviews: 88, hairType: "Oily", ingredient: "Menthol" },
  { name: "Beard Softening Oil", brand: "Órla Botanicals", groups: ["men"], sub: "Beard Care", vessel: "bottle", tone: "men", size: "30ml", price: 1050, sale: 890, rating: 4.7, reviews: 66, ingredient: "Argan Oil", isNew: true },
  { name: "24H Fresh Deodorant Roll-On", brand: "Velin", groups: ["men"], sub: "Deodorant", vessel: "bottle", tone: "men", size: "50ml", price: 520, rating: 4.0, reviews: 39, ingredient: "Aloe Vera" },
  // WOMEN
  { name: "Rosewater Gentle Cleanser", brand: "Petal & Oat", groups: ["women", "skin"], sub: "Cleanser", vessel: "jar", tone: "women", size: "150ml", price: 1050, rating: 4.6, reviews: 152, skinType: "Sensitive", ingredient: "Rosewater", isBestSeller: true },
  { name: "Hyaluronic Hydration Serum", brand: "Nourella", groups: ["women", "skin"], sub: "Face Serum", vessel: "bottle", tone: "women", size: "30ml", price: 2150, sale: 1790, rating: 4.8, reviews: 231, skinType: "Dry", ingredient: "Hyaluronic Acid", isBestSeller: true },
  { name: "Vitamin C Brightening Moisturiser", brand: "Nourella", groups: ["women", "skin"], sub: "Moisturizer", vessel: "jar", tone: "women", size: "50g", price: 1690, rating: 4.5, reviews: 118, skinType: "Combination", ingredient: "Vitamin C" },
  { name: "Calming Oat Face Mask", brand: "Petal & Oat", groups: ["women", "skin"], sub: "Face Mask", vessel: "jar", tone: "women", size: "80g", price: 1190, rating: 4.4, reviews: 63, skinType: "Sensitive", ingredient: "Oat Extract", isNew: true },
  { name: "Rice Bran Gentle Toner", brand: "Petal & Oat", groups: ["women", "skin"], sub: "Toner", vessel: "bottle", tone: "women", size: "150ml", price: 980, rating: 4.3, reviews: 71, skinType: "Normal", ingredient: "Rice Bran" },
  { name: "Silk Under-Eye Cream", brand: "Nourella", groups: ["women", "skin"], sub: "Eye Care", vessel: "jar", tone: "women", size: "20g", price: 1590, rating: 4.5, reviews: 54, skinType: "All", ingredient: "Peptides" },
  { name: "Shea Body Lotion", brand: "Petal & Oat", groups: ["women"], sub: "Body Lotion", vessel: "bottle", tone: "women", size: "250ml", price: 1050, sale: 890, rating: 4.6, reviews: 96, ingredient: "Shea Butter" },
  { name: "Argan Repair Hair Mask", brand: "Órla Botanicals", groups: ["women", "hair"], sub: "Hair Mask", vessel: "jar", tone: "women", size: "200g", price: 1350, rating: 4.7, reviews: 84, hairType: "Damaged", ingredient: "Argan Oil", isBestSeller: true },
  { name: "Smoothing Shine Hair Oil", brand: "Órla Botanicals", groups: ["women", "hair"], sub: "Hair Oil", vessel: "bottle", tone: "women", size: "100ml", price: 1150, rating: 4.5, reviews: 77, hairType: "Dry", ingredient: "Argan Oil" },
  { name: "Tinted Lip Balm — Rosé", brand: "Nourella", groups: ["women"], sub: "Lip Care", vessel: "tube", tone: "women", size: "10g", price: 590, rating: 4.4, reviews: 48, ingredient: "Shea Butter", isNew: true },
  // BABY
  { name: "Tear-Free Baby Shampoo", brand: "Baby Bloom", groups: ["baby", "hair"], sub: "Baby Shampoo", vessel: "bottle", tone: "baby", size: "200ml", price: 680, rating: 4.8, reviews: 176, ageGroup: "0-3 yrs", ingredient: "Chamomile", isBestSeller: true },
  { name: "Soothing Baby Lotion", brand: "Baby Bloom", groups: ["baby"], sub: "Baby Lotion", vessel: "bottle", tone: "baby", size: "200ml", price: 720, rating: 4.7, reviews: 141, ageGroup: "0+ months", ingredient: "Calendula", isBestSeller: true },
  { name: "Pure Baby Oil", brand: "Baby Bloom", groups: ["baby"], sub: "Baby Oil", vessel: "bottle", tone: "baby", size: "150ml", price: 650, rating: 4.6, reviews: 99, ageGroup: "0+ months", ingredient: "Almond Oil" },
  { name: "Gentle Baby Wash", brand: "Baby Bloom", groups: ["baby"], sub: "Baby Wash", vessel: "bottle", tone: "baby", size: "250ml", price: 690, rating: 4.7, reviews: 108, ageGroup: "0+ months", ingredient: "Oat Extract" },
  { name: "Nourishing Baby Cream", brand: "Baby Bloom", groups: ["baby", "skin"], sub: "Baby Cream", vessel: "jar", tone: "baby", size: "100g", price: 750, rating: 4.8, reviews: 132, ageGroup: "0+ months", ingredient: "Shea Butter" },
  { name: "Soft Touch Baby Powder", brand: "Baby Bloom", groups: ["baby"], sub: "Baby Powder", vessel: "tube", tone: "baby", size: "200g", price: 480, rating: 4.4, reviews: 58, ageGroup: "0+ months", ingredient: "Cornstarch" },
  { name: "Diaper Rash Care Cream", brand: "Baby Bloom", groups: ["baby"], sub: "Rash Care", vessel: "tube", tone: "baby", size: "75g", price: 620, rating: 4.6, reviews: 87, ageGroup: "0+ months", ingredient: "Zinc Oxide", isNew: true },
  { name: "Gentle Baby Wipes (80 pcs)", brand: "Baby Bloom", groups: ["baby"], sub: "Baby Wipes", vessel: "tube", tone: "baby", size: "80 pcs", price: 380, rating: 4.5, reviews: 112, ageGroup: "0+ months", ingredient: "Aloe Vera" },
  { name: "Kids Fruity Body Wash", brand: "Baby Bloom", groups: ["baby"], sub: "Kids Body Wash", vessel: "bottle", tone: "baby", size: "250ml", price: 590, rating: 4.3, reviews: 46, ageGroup: "3+ yrs", ingredient: "Vitamin E", isNew: true },
  { name: "Kids Mild Sunscreen SPF 30", brand: "Baby Bloom", groups: ["baby", "skin"], sub: "Kids Sunscreen", vessel: "tube", tone: "baby", size: "50ml", price: 950, rating: 4.5, reviews: 39, ageGroup: "3+ yrs", ingredient: "Zinc Oxide" },
  // HAIR (general)
  { name: "Keratin Smooth Shampoo", brand: "Cambric", groups: ["hair"], sub: "Shampoo", vessel: "bottle", tone: "hair", size: "250ml", price: 890, sale: 720, rating: 4.4, reviews: 121, hairType: "Damaged", ingredient: "Keratin" },
  { name: "Volumising Conditioner", brand: "Cambric", groups: ["hair"], sub: "Conditioner", vessel: "bottle", tone: "hair", size: "250ml", price: 890, rating: 4.3, reviews: 94, hairType: "Normal", ingredient: "Biotin" },
  { name: "Onion Hair Growth Oil", brand: "Órla Botanicals", groups: ["hair"], sub: "Hair Oil", vessel: "bottle", tone: "hair", size: "120ml", price: 990, rating: 4.6, reviews: 143, hairType: "Oily", ingredient: "Onion Extract", isBestSeller: true },
  { name: "Anti-Frizz Hair Serum", brand: "Órla Botanicals", groups: ["hair"], sub: "Hair Serum", vessel: "bottle", tone: "hair", size: "50ml", price: 1090, rating: 4.5, reviews: 61, hairType: "Curly", ingredient: "Silk Protein", isNew: true },
  // SKIN (general)
  { name: "Green Tea Purifying Face Wash", brand: "Nourella", groups: ["skin"], sub: "Face Wash", vessel: "tube", tone: "skin", size: "100ml", price: 850, rating: 4.4, reviews: 102, skinType: "Oily", ingredient: "Green Tea" },
  { name: "Ceramide Barrier Repair Cream", brand: "Nourella", groups: ["skin"], sub: "Moisturizer", vessel: "jar", tone: "skin", size: "50g", price: 1890, sale: 1590, rating: 4.7, reviews: 88, skinType: "Sensitive", ingredient: "Ceramides", isBestSeller: true },
  { name: "Niacinamide 10% Serum", brand: "Nourella", groups: ["skin"], sub: "Face Serum", vessel: "bottle", tone: "skin", size: "30ml", price: 1750, rating: 4.6, reviews: 167, skinType: "Combination", ingredient: "Niacinamide", isNew: true },
  { name: "Tea Tree Acne Spot Gel", brand: "Cambric", groups: ["skin"], sub: "Acne Care", vessel: "tube", tone: "skin", size: "20g", price: 690, rating: 4.2, reviews: 57, skinType: "Oily", ingredient: "Tea Tree Oil" },
];

const PRODUCTS = RAW_PRODUCTS.map((p, i) => {
  const discount = p.sale ? Math.round(((p.price - p.sale) / p.price) * 100) : 0;
  return {
    id: "P" + (i + 1).toString().padStart(3, "0"),
    ...p,
    discount,
    description: `${p.name} is thoughtfully formulated with ${p.ingredient.toLowerCase()} to care for your ${p.skinType ? p.skinType.toLowerCase() + " skin" : p.hairType ? p.hairType.toLowerCase() + " hair" : "daily routine"}. Lightweight, non-greasy and made for everyday use.`,
    benefits: [
      `Enriched with ${p.ingredient}`,
      "Dermatologically tested formula",
      "Free from harsh sulphates",
      "Suitable for daily use",
    ],
    howToUse: "Apply a small amount to clean skin or hair. Massage gently and rinse or leave on as directed. Use morning and/or evening for best results.",
    suitableFor: p.skinType || p.hairType || p.ageGroup || "All types",
    warnings: p.groups.includes("baby")
      ? "For external use only. Discontinue use if irritation occurs. Always check the product label and age suitability before use."
      : "For external use only. Discontinue use if irritation occurs. Keep out of reach of children.",
  };
});

const PROVINCES = ["Punjab", "Sindh", "Khyber Pakhtunkhwa", "Balochistan", "Islamabad Capital Territory", "Gilgit-Baltistan", "Azad Kashmir"];
const CITIES = ["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Quetta", "Sialkot", "Hyderabad"];

const NAV_LINKS = [
  { key: "home", label: "Home" },
  { key: "shop", params: { group: "men" }, label: "Men's Care" },
  { key: "shop", params: { group: "women" }, label: "Women's Care" },
  { key: "shop", params: { group: "baby" }, label: "Baby & Kids" },
  { key: "shop", params: { group: "hair" }, label: "Hair Care" },
  { key: "shop", params: { group: "skin" }, label: "Skin Care" },
  { key: "shop", params: { group: "new" }, label: "New Arrivals" },
  { key: "shop", params: { group: "bestseller" }, label: "Best Sellers" },
  { key: "shop", params: { group: "offer" }, label: "Offers" },
  { key: "about", label: "About Us" },
  { key: "contact", label: "Contact Us" },
];

/* ---------------------------------------------------------------------- */
/*  CONTEXT                                                                 */
/* ---------------------------------------------------------------------- */
const AppCtx = createContext(null);
const useApp = () => useContext(AppCtx);

/* ---------------------------------------------------------------------- */
/*  SMALL PIECES                                                           */
/* ---------------------------------------------------------------------- */
function LeafDivider({ tone = COLORS.gold }) {
  return (
    <div className="flex items-center justify-center gap-3 my-2 select-none" aria-hidden="true">
      <span style={{ width: 28, height: 1, background: tone, opacity: 0.5 }} />
      <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
        <path d="M1 13C1 13 2 4 9 1C16 4 17 13 17 13C10 11 8 11 1 13Z" stroke={tone} strokeWidth="1" />
        <path d="M9 1V13" stroke={tone} strokeWidth="1" />
      </svg>
      <span style={{ width: 28, height: 1, background: tone, opacity: 0.5 }} />
    </div>
  );
}

function Reveal({ children, className = "" }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={`${shown ? "animate-fadeInUp" : "opacity-0"} ${className}`}>
      {children}
    </div>
  );
}
function ProductArt({ tone = "skin", vessel = "jar", badge, size = "full", image }) {
  const t = GROUP_TONE[tone] || GROUP_TONE.skin;
  if (image) {
    return (
      <div className="relative w-full aspect-square rounded-xl overflow-hidden" style={{ background: t.bg }}>
        <img
          src={image}
          alt=""
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        {badge && (
          <span
            className="absolute top-2 left-2 text-[10px] tracking-wide font-semibold px-2 py-1 rounded-full text-white shadow-sm animate-pulseSoft"
            style={{ background: badge === "SALE" ? COLORS.pinkDeep : badge === "NEW" ? COLORS.greenDeep : COLORS.gold }}
          >
            {badge}
          </span>
        )}
      </div>
    );
  }
  return (
    <div
      className="relative w-full aspect-square rounded-xl overflow-hidden flex items-center justify-center"
      style={{ background: t.bg }}
    >
      <svg width="46%" height="60%" viewBox="0 0 100 140" fill="none" className="animate-floatY">
        {vessel === "jar" && (
          <>
            <rect x="15" y="35" width="70" height="90" rx="14" fill="#FFFFFF" fillOpacity="0.75" />
            <rect x="15" y="35" width="70" height="16" rx="8" fill={t.accent} fillOpacity="0.55" />
            <rect x="30" y="10" width="40" height="26" rx="6" fill={t.accent} fillOpacity="0.85" />
          </>
        )}
        {vessel === "bottle" && (
          <>
            <rect x="25" y="45" width="50" height="80" rx="10" fill="#FFFFFF" fillOpacity="0.75" />
            <rect x="38" y="18" width="24" height="30" rx="4" fill={t.accent} fillOpacity="0.85" />
            <rect x="34" y="10" width="32" height="10" rx="3" fill={t.accent} />
            <rect x="25" y="70" width="50" height="10" fill={t.accent} fillOpacity="0.5" />
          </>
        )}
        {vessel === "tube" && (
          <>
            <path d="M30 20 L70 20 L64 100 Q50 130 36 100 Z" fill="#FFFFFF" fillOpacity="0.75" />
            <rect x="28" y="12" width="44" height="14" rx="4" fill={t.accent} />
            <rect x="30" y="55" width="40" height="8" fill={t.accent} fillOpacity="0.55" />
          </>
        )}
      </svg>
      {badge && (
        <span
          className="absolute top-2 left-2 text-[10px] tracking-wide font-semibold px-2 py-1 rounded-full text-white shadow-sm animate-pulseSoft"
          style={{ background: badge === "SALE" ? COLORS.pinkDeep : badge === "NEW" ? COLORS.greenDeep : COLORS.gold }}
        >
          {badge}
        </span>
      )}
    </div>
  );
}

function Stars({ rating, size = 13 }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          fill={rating >= i ? COLORS.gold : rating >= i - 0.5 ? COLORS.goldLight : "none"}
          stroke={COLORS.gold}
          strokeWidth={1.3}
        />
      ))}
    </div>
  );
}

function PriceTag({ price, sale }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="font-semibold" style={{ color: COLORS.ink }}>{fmt(sale || price)}</span>
      {sale && <span className="text-xs line-through" style={{ color: COLORS.inkSoft }}>{fmt(price)}</span>}
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/*  PRODUCT CARD                                                           */
/* ---------------------------------------------------------------------- */
function ProductCard({ p }) {
  const { addToCart, wishlist, toggleWishlist, navigate, openQuickView } = useApp();
  const inWishlist = wishlist.some((w) => w.id === p.id);
  const badge = p.discount ? "SALE" : p.isNew ? "NEW" : p.isBestSeller ? "BEST" : null;
  return (
    <div className="group flex flex-col rounded-2xl bg-white/70 border border-black/5 hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="relative p-2 cursor-pointer" onClick={() => navigate("product", { id: p.id })}>
        <ProductArt tone={p.tone} vessel={p.vessel} badge={badge} image={p.image} />
        <button
          onClick={(e) => { e.stopPropagation(); toggleWishlist(p); }}
          aria-label="Toggle wishlist"
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-sm"
        >
          <Heart size={15} fill={inWishlist ? COLORS.pinkDeep : "none"} stroke={COLORS.pinkDeep} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); openQuickView(p); }}
          className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/95 text-xs font-medium py-1.5 rounded-full flex items-center justify-center gap-1"
          style={{ color: COLORS.ink }}
        >
          <Eye size={13} /> Quick View
        </button>
      </div>
      <div className="px-3 pb-3 pt-1 flex flex-col gap-1 flex-1">
        <span className="text-[11px] uppercase tracking-wide" style={{ color: COLORS.inkSoft }}>{p.brand}</span>
        <button className="text-left text-sm font-medium leading-snug line-clamp-2" style={{ color: COLORS.ink }} onClick={() => navigate("product", { id: p.id })}>
          {p.name}
        </button>
        <span className="text-[11px]" style={{ color: COLORS.inkSoft }}>{p.size}</span>
        <div className="flex items-center gap-1.5 mt-0.5">
          <Stars rating={p.rating} />
          <span className="text-[11px]" style={{ color: COLORS.inkSoft }}>({p.reviews})</span>
        </div>
        <div className="flex items-center justify-between mt-1.5">
          <PriceTag price={p.price} sale={p.sale} />
          {p.discount > 0 && <span className="text-[11px] font-semibold" style={{ color: COLORS.pinkDeep }}>-{p.discount}%</span>}
        </div>
        <button
          onClick={() => addToCart(p, 1)}
          className="mt-2 w-full text-xs font-semibold py-2 rounded-full transition-colors"
          style={{ background: COLORS.ink, color: COLORS.ivory }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/*  NAV                                                                     */
/* ---------------------------------------------------------------------- */
function ProductArt({ tone = "skin", vessel = "jar", badge, size = "full", image }) {
  function Nav() {
  const { navigate, cart, wishlist, currentUser, view, products } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");
  const cartCount = cart.reduce((s, c) => s + c.qty, 0);

  const suggestions = useMemo(() => {
    if (!q.trim()) return [];
    const query = q.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query) ||
        p.sub.toLowerCase().includes(query) ||
        p.ingredient.toLowerCase().includes(query)
    ).slice(0, 6);
  }, [q, products]);

  const doSearch = () => {
    if (!q.trim()) return;
    navigate("shop", { query: q });
    setSearchOpen(false);
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md" style={{ background: "rgba(251,247,241,0.92)", borderBottom: "1px solid rgba(46,42,36,0.08)" }}>
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
          <button className="md:hidden p-2 -ml-2" onClick={() => setMenuOpen(true)} aria-label="Open menu">
            <Menu size={22} color={COLORS.ink} />
          </button>
          <button onClick={() => navigate("home")} className="flex items-center gap-2 shrink-0">
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
              <circle cx="13" cy="13" r="12" stroke={COLORS.gold} />
              <path d="M13 6C13 6 8 10 8 15C8 18 10 20 13 20C16 20 18 18 18 15C18 10 13 6 13 6Z" fill={COLORS.gold} fillOpacity="0.25" stroke={COLORS.gold} />
            </svg>
            <span style={{ fontFamily: "Fraunces, serif" }} className="text-xl tracking-wide" >Aavara</span>
          </button>

          <nav className="hidden lg:flex items-center gap-5 text-[13px] font-medium" style={{ color: COLORS.ink }}>
            {NAV_LINKS.map((l, i) => (
              <button
                key={i}
                onClick={() => navigate(l.key, l.params)}
                className="hover:opacity-60 transition-opacity whitespace-nowrap"
              >
                {l.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <button className="p-2 hidden sm:block" onClick={() => setSearchOpen(true)} aria-label="Search">
              <Search size={19} color={COLORS.ink} />
            </button>
            <button className="p-2" onClick={() => navigate("account")} aria-label="Account">
              <User size={19} color={COLORS.ink} />
            </button>
            <button className="p-2 relative" onClick={() => navigate("wishlist")} aria-label="Wishlist">
              <Heart size={19} color={COLORS.ink} />
              {wishlist.length > 0 && <CountDot n={wishlist.length} />}
            </button>
            <button className="p-2 relative" onClick={() => navigate("cart")} aria-label="Cart">
              <ShoppingBag size={19} color={COLORS.ink} />
              {cartCount > 0 && <CountDot n={cartCount} />}
            </button>
          </div>
        </div>
      </div>

      {/* mobile search bar always visible under header on small screens */}
      <div className="sm:hidden px-4 pb-3">
        <button onClick={() => setSearchOpen(true)} className="w-full flex items-center gap-2 rounded-full px-4 py-2 text-sm" style={{ background: COLORS.paper, color: COLORS.inkSoft }}>
          <Search size={15} /> Search products, brands, ingredients…
        </button>
      </div>

      {/* Mobile hamburger menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="w-[82%] max-w-xs h-full overflow-y-auto p-5" style={{ background: COLORS.ivory }}>
            <div className="flex items-center justify-between mb-6">
              <span style={{ fontFamily: "Fraunces, serif" }} className="text-xl">Aavara</span>
              <button onClick={() => setMenuOpen(false)}><X size={22} /></button>
            </div>
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((l, i) => (
                <button
                  key={i}
                  onClick={() => { navigate(l.key, l.params); setMenuOpen(false); }}
                  className="text-left py-3 border-b text-sm font-medium"
                  style={{ borderColor: "rgba(46,42,36,0.07)", color: COLORS.ink }}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 bg-black/30" onClick={() => setMenuOpen(false)} />
        </div>
      )}

      {/* Search overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4" style={{ background: "rgba(46,42,36,0.4)" }} onClick={() => setSearchOpen(false)}>
          <div className="w-full max-w-xl rounded-2xl p-4" style={{ background: COLORS.ivory }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2 border-b pb-3" style={{ borderColor: "rgba(46,42,36,0.12)" }}>
              <Search size={18} color={COLORS.inkSoft} />
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && doSearch()}
                placeholder="Search face wash, baby, shampoo…"
                className="flex-1 bg-transparent outline-none text-sm"
              />
              <button onClick={() => setSearchOpen(false)}><X size={18} /></button>
            </div>
            <div className="mt-2 max-h-80 overflow-y-auto">
              {suggestions.map((p) => (
                <button
                  key={p.id}
                  onClick={() => { navigate("product", { id: p.id }); setSearchOpen(false); }}
                  className="w-full flex items-center gap-3 py-2 px-1 hover:bg-black/[0.03] rounded-lg text-left"
                >
                  <div className="w-10 h-10 shrink-0"><ProductArt tone={p.tone} vessel={p.vessel} image={p.image} /></div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm truncate" style={{ color: COLORS.ink }}>{p.name}</div>
                    <div className="text-[11px]" style={{ color: COLORS.inkSoft }}>{p.brand} · {p.sub}</div>
                  </div>
                  <span className="text-xs font-medium">{fmt(p.sale || p.price)}</span>
                </button>
              ))}
              {q && suggestions.length === 0 && <p className="text-sm py-4 text-center" style={{ color: COLORS.inkSoft }}>No products found for "{q}".</p>}
            </div>
            {q && (
              <button onClick={doSearch} className="mt-2 w-full text-xs font-semibold py-2 rounded-full" style={{ background: COLORS.ink, color: COLORS.ivory }}>
                See all results for "{q}"
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

function CountDot({ n }) {
  return (
    <span
      className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full text-[9px] font-bold flex items-center justify-center text-white"
      style={{ background: COLORS.pinkDeep }}
    >
      {n}
    </span>
  );
}

/* ---------------------------------------------------------------------- */
/*  HOME                                                                    */
/* ---------------------------------------------------------------------- */
function Hero() {
  const { navigate } = useApp();
  const [i, setI] = useState(0);
  const scenes = [GROUP_TONE.women, GROUP_TONE.skin, GROUP_TONE.baby];
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % scenes.length), 4000);
    return () => clearInterval(t);
  }, []);
  return (
    <section className="relative overflow-hidden" style={{ background: scenes[i].bg, transition: "background 1.2s ease" }}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24 grid md:grid-cols-2 items-center gap-10">
        <div className="animate-fadeInUp">
          <span className="inline-flex items-center gap-1.5 text-[11px] tracking-[0.15em] uppercase font-semibold mb-4" style={{ color: COLORS.gold }}>
            <Leaf size={13} /> Family Wellness &amp; Beauty
          </span>
          <h1 style={{ fontFamily: "Fraunces, serif", color: COLORS.ink }} className="text-4xl md:text-6xl leading-[1.05] font-medium mb-5">
            Healthy Skin.<br />Beautiful You.
          </h1>
          <p className="text-base md:text-lg mb-8 max-w-md" style={{ color: COLORS.inkSoft }}>
            Discover skincare and personal-care products for the whole family.
          </p>
          <div className="flex flex-wrap gap-3">
            <HeroBtn onClick={() => navigate("shop", { group: "men" })} label="Shop Men's Care" />
            <HeroBtn onClick={() => navigate("shop", { group: "women" })} label="Shop Women's Care" />
            <HeroBtn onClick={() => navigate("shop", { group: "baby" })} label="Shop Baby Care" ghost />
          </div>
        </div>
        <div className="hidden md:flex justify-center">
          <div className="grid grid-cols-2 gap-4 w-72">
            <div className="col-span-2"><ProductArt tone={i === 0 ? "women" : i === 1 ? "skin" : "baby"} vessel="jar" /></div>
            <ProductArt tone="men" vessel="bottle" />
            <ProductArt tone="hair" vessel="bottle" />
          </div>
        </div>
      </div>
    </section>
  );
}
function HeroBtn({ onClick, label, ghost }) {
  return (
    <button
      onClick={onClick}
      className="text-xs font-semibold tracking-wide uppercase px-5 py-3 rounded-full transition-transform hover:-translate-y-0.5"
      style={ghost ? { border: `1px solid ${COLORS.ink}`, color: COLORS.ink } : { background: COLORS.ink, color: COLORS.ivory }}
    >
      {label}
    </button>
  );
}

function CategoryCards() {
  const { navigate } = useApp();
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-14">
      <SectionHeading eyebrow="Shop by Category" title="Care, curated for everyone" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-8">
        {CATEGORY_DEFS.map((c) => (
          <div key={c.key} className="rounded-2xl p-4 flex flex-col gap-3" style={{ background: GROUP_TONE[c.key].bg }}>
            <ProductArt tone={c.key} vessel={c.vessel} />
            <div>
              <h3 style={{ fontFamily: "Fraunces, serif" }} className="text-lg" >{c.label}</h3>
              <p className="text-xs mt-1" style={{ color: COLORS.inkSoft }}>{c.desc}</p>
            </div>
            <button onClick={() => navigate("shop", { group: c.key })} className="mt-auto self-start text-xs font-semibold flex items-center gap-1" style={{ color: COLORS.ink }}>
              Shop Now <ArrowRight size={13} />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

function SectionHeading({ eyebrow, title, center }) {
  return (
    <div className={center ? "text-center" : ""}>
      <span className="text-[11px] tracking-[0.18em] uppercase font-semibold" style={{ color: COLORS.gold }}>{eyebrow}</span>
      <h2 style={{ fontFamily: "Fraunces, serif", color: COLORS.ink }} className="text-2xl md:text-3xl mt-1">{title}</h2>
    </div>
  );
}

function BestSellersStrip() {
  const { navigate, products } = useApp();
  const items = products.filter((p) => p.isBestSeller).slice(0, 8);
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-14">
      <div className="flex items-end justify-between">
        <SectionHeading eyebrow="Loved by Customers" title="Best Sellers" />
        <button onClick={() => navigate("shop", { group: "bestseller" })} className="text-xs font-semibold hidden sm:flex items-center gap-1" style={{ color: COLORS.ink }}>
          View all <ArrowRight size={13} />
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        {items.map((p) => <ProductCard key={p.id} p={p} />)}
      </div>
    </section>
  );
}

function BabyBanner() {
  const { navigate } = useApp();
  return (
    <section className="py-14" style={{ background: GROUP_TONE.baby.bg }}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid md:grid-cols-2 items-center gap-8">
        <div className="flex justify-center order-2 md:order-1">
          <div className="grid grid-cols-3 gap-3 w-64">
            <ProductArt tone="baby" vessel="bottle" />
            <ProductArt tone="baby" vessel="jar" />
            <ProductArt tone="baby" vessel="tube" />
          </div>
        </div>
        <div className="order-1 md:order-2">
          <span className="inline-flex items-center gap-1.5 text-[11px] tracking-[0.15em] uppercase font-semibold mb-3" style={{ color: COLORS.greenDeep }}>
            <ShieldCheck size={13} /> Safe · Gentle · Trusted
          </span>
          <h2 style={{ fontFamily: "Fraunces, serif", color: COLORS.ink }} className="text-3xl md:text-4xl mb-3">Gentle Care for Your Little Ones</h2>
          <p className="text-sm md:text-base mb-2" style={{ color: COLORS.inkSoft }}>Thoughtfully selected baby-care products for delicate skin.</p>
          <p className="text-xs mb-6 italic" style={{ color: COLORS.inkSoft }}>Always check the product label and age suitability before use.</p>
          <HeroBtn onClick={() => navigate("shop", { group: "baby" })} label="Shop Baby & Kids" />
        </div>
      </div>
    </section>
  );
}

function TrustSection() {
  const items = [
    { icon: ShieldCheck, title: "Authentic Products", body: "Quality products from trusted brands." },
    { icon: Check, title: "Secure Shopping", body: "Your information is protected." },
    { icon: Truck, title: "Fast Delivery", body: "Reliable delivery to your doorstep." },
    { icon: RotateCcw, title: "Easy Returns", body: "Simple and customer-friendly return policy." },
    { icon: MessageCircle, title: "Customer Support", body: "We are here to help, every day." },
  ];
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-14">
      <LeafDivider />
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mt-6 text-center">
        {items.map((it, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: COLORS.paper }}>
              <it.icon size={18} color={COLORS.gold} />
            </div>
            <h4 className="text-xs font-semibold" style={{ color: COLORS.ink }}>{it.title}</h4>
            <p className="text-[11px]" style={{ color: COLORS.inkSoft }}>{it.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
  function Footer() {
  const { navigate } = useApp();
  return (
    <footer className="border-t" style={{ borderColor: "rgba(46,42,36,0.08)", background: COLORS.paper }}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 grid sm:grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        <div>
          <span style={{ fontFamily: "Fraunces, serif" }} className="text-xl">Aavara</span>
          <p className="text-xs mt-3" style={{ color: COLORS.inkSoft }}>Premium skincare, haircare, personal-care and baby-care — for the whole family.</p>
        </div>
        <div>
          <h5 className="text-xs font-semibold uppercase tracking-wide mb-3">Shop</h5>
          <ul className="flex flex-col gap-2 text-xs" style={{ color: COLORS.inkSoft }}>
            {["men", "women", "baby", "hair", "skin"].map((g) => (
              <li key={g}><button onClick={() => navigate("shop", { group: g })} className="hover:underline">{CATEGORY_DEFS.find((c) => c.key === g).label}</button></li>
            ))}
          </ul>
        </div>
        <div>
          <h5 className="text-xs font-semibold uppercase tracking-wide mb-3">Company</h5>
          <ul className="flex flex-col gap-2 text-xs" style={{ color: COLORS.inkSoft }}>
            <li><button onClick={() => navigate("about")} className="hover:underline">About Us</button></li>
            <li><button onClick={() => navigate("contact")} className="hover:underline">Contact Us</button></li>
            <li><button onClick={() => navigate("tracking")} className="hover:underline">Track Order</button></li>
            <li><button onClick={() => navigate("admin")} className="hover:underline">Admin</button></li>
          </ul>
        </div>
        <div>
          <h5 className="text-xs font-semibold uppercase tracking-wide mb-3">Get in touch</h5>
          <ul className="flex flex-col gap-2 text-xs" style={{ color: COLORS.inkSoft }}>
            <li className="flex items-center gap-2"><Phone size={13} /> 0300 1234567</li>
            <li className="flex items-center gap-2"><Mail size={13} /> hello@aavara.pk</li>
            <li className="flex items-center gap-2"><MapPin size={13} /> Lahore, Pakistan</li>
          </ul>
        </div>
      </div>
      <div className="text-center text-[11px] py-4 border-t" style={{ borderColor: "rgba(46,42,36,0.08)", color: COLORS.inkSoft }}>
        © 2026 Aavara Cosmetics. All rights reserved.
      </div>
    </footer>
  );
}

function HomePage() {
  return (
    <>
      <Hero />
      <Reveal><CategoryCards /></Reveal>
      <Reveal><BestSellersStrip /></Reveal>
      <Reveal><BabyBanner /></Reveal>
      <Reveal><TrustSection /></Reveal>
    </>
  );
}

/* ---------------------------------------------------------------------- */
/*  SHOP PAGE (categories, new, bestseller, offers, search)                */
/* ---------------------------------------------------------------------- */
function ShopPage({ params }) {
  const { products } = useApp();
  const group = params.group;
  const query = params.query;
  const def = CATEGORY_DEFS.find((c) => c.key === group);

  const [brand, setBrand] = useState([]);
  const [skinType, setSkinType] = useState([]);
  const [hairType, setHairType] = useState([]);
  const [priceMax, setPriceMax] = useState(3000);
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState("featured");
  const [filtersOpen, setFiltersOpen] = useState(false);

  let base = products;
  if (query) {
    const q = query.toLowerCase();
    base = base.filter((p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.sub.toLowerCase().includes(q) || p.ingredient.toLowerCase().includes(q));
  } else if (group === "new") base = base.filter((p) => p.isNew);
  else if (group === "bestseller") base = base.filter((p) => p.isBestSeller);
  else if (group === "offer") base = base.filter((p) => p.discount > 0);
  else if (group) base = base.filter((p) => p.groups.includes(group));

  const brandOptions = [...new Set(base.map((p) => p.brand))];
  const skinOptions = [...new Set(base.map((p) => p.skinType).filter(Boolean))];
  const hairOptions = [...new Set(base.map((p) => p.hairType).filter(Boolean))];

  let filtered = base.filter((p) => {
    if (brand.length && !brand.includes(p.brand)) return false;
    if (skinType.length && !skinType.includes(p.skinType)) return false;
    if (hairType.length && !hairType.includes(p.hairType)) return false;
    if ((p.sale || p.price) > priceMax) return false;
    if (p.rating < minRating) return false;
    return true;
  });

  filtered = [...filtered].sort((a, b) => {
    const ap = a.sale || a.price, bp = b.sale || b.price;
    if (sort === "priceLow") return ap - bp;
    if (sort === "priceHigh") return bp - ap;
    if (sort === "rating") return b.rating - a.rating;
    if (sort === "newest") return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
    if (sort === "bestselling") return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
    return 0;
  });

  const title = query ? `Results for "${query}"` : group === "new" ? "New Arrivals" : group === "bestseller" ? "Best Sellers" : group === "offer" ? "Special Offers" : def ? def.label : "Shop All";

  const toggle = (arr, setArr, val) => setArr(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
      <div className="mb-6">
        <h1 style={{ fontFamily: "Fraunces, serif", color: COLORS.ink }} className="text-3xl">{title}</h1>
        {def && <p className="text-sm mt-1" style={{ color: COLORS.inkSoft }}>{def.desc}</p>}
        {group === "offer" && <p className="text-sm mt-1" style={{ color: COLORS.inkSoft }}>Limited-time discounts across skincare, haircare and baby care.</p>}
        <p className="text-xs mt-1" style={{ color: COLORS.inkSoft }}>{filtered.length} products</p>
      </div>

      <div className="flex items-center justify-between mb-4 lg:hidden">
        <button onClick={() => setFiltersOpen(true)} className="flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-full" style={{ background: COLORS.paper }}>
          <SlidersHorizontal size={14} /> Filters
        </button>
        <SortSelect sort={sort} setSort={setSort} />
      </div>

      <div className="grid lg:grid-cols-[220px_1fr] gap-8">
        <aside className={`lg:block ${filtersOpen ? "fixed inset-0 z-50 bg-white p-5 overflow-y-auto" : "hidden"}`}>
          {filtersOpen && (
            <div className="flex justify-between items-center mb-4 lg:hidden">
              <span className="font-semibold text-sm">Filters</span>
              <button onClick={() => setFiltersOpen(false)}><X size={20} /></button>
            </div>
          )}
          <FilterBlock title="Brand">
            {brandOptions.map((b) => (
              <CheckRow key={b} label={b} checked={brand.includes(b)} onChange={() => toggle(brand, setBrand, b)} />
            ))}
          </FilterBlock>
          {skinOptions.length > 0 && (
            <FilterBlock title="Skin Type">
              {skinOptions.map((s) => (
                <CheckRow key={s} label={s} checked={skinType.includes(s)} onChange={() => toggle(skinType, setSkinType, s)} />
              ))}
            </FilterBlock>
          )}
          {hairOptions.length > 0 && (
            <FilterBlock title="Hair Type">
              {hairOptions.map((s) => (
                <CheckRow key={s} label={s} checked={hairType.includes(s)} onChange={() => toggle(hairType, setHairType, s)} />
              ))}
            </FilterBlock>
          )}
          <FilterBlock title="Max Price">
            <input type="range" min="300" max="3000" step="50" value={priceMax} onChange={(e) => setPriceMax(Number(e.target.value))} className="w-full accent-current" style={{ accentColor: COLORS.gold }} />
            <span className="text-xs" style={{ color: COLORS.inkSoft }}>Up to {fmt(priceMax)}</span>
          </FilterBlock>
          <FilterBlock title="Minimum Rating">
            <div className="flex gap-1.5 flex-wrap">
              {[0, 3, 4, 4.5].map((r) => (
                <button key={r} onClick={() => setMinRating(r)} className="text-[11px] px-2.5 py-1 rounded-full border" style={{ borderColor: minRating === r ? COLORS.gold : "rgba(46,42,36,0.15)", background: minRating === r ? COLORS.paper : "transparent" }}>
                  {r === 0 ? "Any" : `${r}+`}
                </button>
              ))}
            </div>
          </FilterBlock>
          {filtersOpen && (
            <button onClick={() => setFiltersOpen(false)} className="w-full mt-4 text-xs font-semibold py-2.5 rounded-full" style={{ background: COLORS.ink, color: COLORS.ivory }}>
              Show {filtered.length} results
            </button>
          )}
        </aside>

        <div>
          <div className="hidden lg:flex justify-end mb-4">
            <SortSelect sort={sort} setSort={setSort} />
          </div>
          {filtered.length === 0 ? (
            <p className="text-sm py-16 text-center" style={{ color: COLORS.inkSoft }}>No products match your filters. Try adjusting them.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {filtered.map((p) => <ProductCard key={p.id} p={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SortSelect({ sort, setSort }) {
  return (
    <select value={sort} onChange={(e) => setSort(e.target.value)} className="text-xs font-medium border rounded-full px-3 py-2 bg-transparent" style={{ borderColor: "rgba(46,42,36,0.15)" }}>
      <option value="featured">Sort: Featured</option>
      <option value="newest">Newest</option>
      <option value="bestselling">Best Selling</option>
      <option value="priceLow">Price: Low to High</option>
      <option value="priceHigh">Price: High to Low</option>
      <option value="rating">Highest Rated</option>
    </select>
  );
}
function FilterBlock({ title, children }) {
  return (
    <div className="mb-6">
      <h5 className="text-xs font-semibold uppercase tracking-wide mb-2.5" style={{ color: COLORS.ink }}>{title}</h5>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}
function CheckRow({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 text-xs cursor-pointer" style={{ color: COLORS.inkSoft }}>
      <input type="checkbox" checked={checked} onChange={onChange} className="accent-current" style={{ accentColor: COLORS.gold }} />
      {label}
    </label>
  );
}

/* ---------------------------------------------------------------------- */
/*  PRODUCT DETAIL                                                          */
/* ---------------------------------------------------------------------- */
function AccordionItem({ title, children, defaultOpen }) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div className="border-b" style={{ borderColor: "rgba(46,42,36,0.1)" }}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-3.5 text-left text-sm font-medium" style={{ color: COLORS.ink }}>
        {title}
        <ChevronDown size={16} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="pb-4 text-xs leading-relaxed" style={{ color: COLORS.inkSoft }}>{children}</div>}
    </div>
  );
}
  function ProductDetail({ params }) {
  const { products, addToCart, wishlist, toggleWishlist, navigate } = useApp();
  const p = products.find((x) => x.id === params.id);
  const [qty, setQty] = useState(1);
  const [img, setImg] = useState(0);
  const [reviewFilter, setReviewFilter] = useState(0);

  if (!p) return <div className="max-w-3xl mx-auto px-4 py-20 text-center">Product not found.</div>;

  const reviews = [
    { name: "Ayesha K.", rating: 5, date: "2 weeks ago", text: "Absorbs quickly and my skin feels so much softer. Will repurchase.", verified: true },
    { name: "Hassan R.", rating: 4, date: "1 month ago", text: "Good quality, packaging could be better but the product itself works well.", verified: true },
    { name: "Sana M.", rating: 5, date: "1 month ago", text: "Gentle on sensitive skin, no irritation at all.", verified: false },
  ].filter((r) => reviewFilter === 0 || r.rating === reviewFilter);

  const related = products.filter((x) => x.id !== p.id && x.groups.some((g) => p.groups.includes(g))).slice(0, 4);
  const inWishlist = wishlist.some((w) => w.id === p.id);

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-10">
      <div className="grid md:grid-cols-2 gap-10">
        <div>
          <ProductArt tone={p.tone} vessel={p.vessel} image={p.image} badge={p.discount ? "SALE" : p.isNew ? "NEW" : p.isBestSeller ? "BEST" : null} />
          <div className="grid grid-cols-4 gap-2 mt-3">
            {[0, 1, 2, 3].map((i) => (
              <button key={i} onClick={() => setImg(i)} className="rounded-lg overflow-hidden border-2" style={{ borderColor: img === i ? COLORS.gold : "transparent" }}>
                <ProductArt tone={p.tone} vessel={p.vessel} image={p.image} />
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="text-xs uppercase tracking-wide" style={{ color: COLORS.inkSoft }}>{p.brand}</span>
          <h1 style={{ fontFamily: "Fraunces, serif", color: COLORS.ink }} className="text-2xl md:text-3xl mt-1 mb-2">{p.name}</h1>
          <div className="flex items-center gap-2 mb-3">
            <Stars rating={p.rating} size={15} />
            <span className="text-xs" style={{ color: COLORS.inkSoft }}>{p.rating} ({p.reviews} reviews)</span>
          </div>
          <div className="flex items-center gap-3 mb-1">
            <span className="text-2xl font-semibold" style={{ color: COLORS.ink }}>{fmt(p.sale || p.price)}</span>
            {p.sale && <span className="text-sm line-through" style={{ color: COLORS.inkSoft }}>{fmt(p.price)}</span>}
            {p.discount > 0 && <span className="text-xs font-semibold px-2 py-1 rounded-full text-white" style={{ background: COLORS.pinkDeep }}>-{p.discount}%</span>}
          </div>
          <p className="text-xs mb-5" style={{ color: COLORS.inkSoft }}>Size: {p.size}</p>
          <p className="text-sm leading-relaxed mb-6" style={{ color: COLORS.inkSoft }}>{p.description}</p>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border rounded-full" style={{ borderColor: "rgba(46,42,36,0.15)" }}>
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-2.5"><Minus size={14} /></button>
              <span className="w-6 text-center text-sm">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="p-2.5"><Plus size={14} /></button>
            </div>
            <button onClick={() => toggleWishlist(p)} className="p-3 rounded-full border" style={{ borderColor: "rgba(46,42,36,0.15)" }}>
              <Heart size={16} fill={inWishlist ? COLORS.pinkDeep : "none"} stroke={COLORS.pinkDeep} />
            </button>
          </div>
          <div className="flex gap-3 mb-8">
            <button onClick={() => addToCart(p, qty)} className="flex-1 text-sm font-semibold py-3 rounded-full border" style={{ borderColor: COLORS.ink, color: COLORS.ink }}>Add to Cart</button>
            <button onClick={() => { addToCart(p, qty); navigate("checkout"); }} className="flex-1 text-sm font-semibold py-3 rounded-full" style={{ background: COLORS.ink, color: COLORS.ivory }}>Buy Now</button>
          </div>

          <div>
            <AccordionItem title="Product Description" defaultOpen>{p.description}</AccordionItem>
            <AccordionItem title="Key Ingredients">Formulated around {p.ingredient}, chosen for its gentle, effective care.</AccordionItem>
            <AccordionItem title="Benefits"><ul className="list-disc pl-4 space-y-1">{p.benefits.map((b, i) => <li key={i}>{b}</li>)}</ul></AccordionItem>
            <AccordionItem title="How to Use">{p.howToUse}</AccordionItem>
            <AccordionItem title="Suitable For">{p.suitableFor}</AccordionItem>
            <AccordionItem title="Warnings / Precautions">{p.warnings}</AccordionItem>
            <AccordionItem title="Delivery Information">Delivered across Pakistan in 2–5 business days. Free delivery on orders above Rs 3,000.</AccordionItem>
            <AccordionItem title="Return Policy">Easy 7-day return on unopened products. Contact support to start a return.</AccordionItem>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-14 max-w-2xl">
        <SectionHeading eyebrow="Customer Voices" title="Reviews & Ratings" />
        <div className="flex gap-1.5 mt-4 mb-5 flex-wrap">
          {[0, 5, 4, 3, 2, 1].map((r) => (
            <button key={r} onClick={() => setReviewFilter(r)} className="text-[11px] px-2.5 py-1 rounded-full border" style={{ borderColor: reviewFilter === r ? COLORS.gold : "rgba(46,42,36,0.15)", background: reviewFilter === r ? COLORS.paper : "transparent" }}>
              {r === 0 ? "All" : `${r} star`}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-4">
          {reviews.map((r, i) => (
            <div key={i} className="border-b pb-4" style={{ borderColor: "rgba(46,42,36,0.08)" }}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">{r.name}</span>
                <span className="text-[11px]" style={{ color: COLORS.inkSoft }}>{r.date}</span>
              </div>
              <div className="flex items-center gap-2 mb-1.5">
                <Stars rating={r.rating} />
                {r.verified && <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: COLORS.green, color: COLORS.greenDeep }}>Verified Purchase</span>}
              </div>
              <p className="text-xs" style={{ color: COLORS.inkSoft }}>{r.text}</p>
            </div>
          ))}
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-14">
          <SectionHeading eyebrow="You may also like" title="Related Products" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {related.map((r) => <ProductCard key={r.id} p={r} />)}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/*  QUICK VIEW MODAL                                                        */
/* ---------------------------------------------------------------------- */
function QuickViewModal() {
  const { quickView, closeQuickView, addToCart, navigate } = useApp();
  if (!quickView) return null;
  const p = quickView;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(46,42,36,0.45)" }} onClick={closeQuickView}>
      <div className="bg-white rounded-2xl max-w-lg w-full p-5 grid grid-cols-2 gap-4 relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={closeQuickView} className="absolute top-3 right-3"><X size={18} /></button>
        <ProductArt tone={p.tone} vessel={p.vessel} image={p.image} />
        <div className="flex flex-col">
          <span className="text-[11px] uppercase tracking-wide" style={{ color: COLORS.inkSoft }}>{p.brand}</span>
          <h3 className="text-sm font-medium mb-1">{p.name}</h3>
          <Stars rating={p.rating} />
          <div className="mt-2"><PriceTag price={p.price} sale={p.sale} /></div>
          <p className="text-[11px] mt-2 line-clamp-3" style={{ color: COLORS.inkSoft }}>{p.description}</p>
          <button onClick={() => { addToCart(p, 1); closeQuickView(); }} className="mt-3 text-xs font-semibold py-2 rounded-full" style={{ background: COLORS.ink, color: COLORS.ivory }}>Add to Cart</button>
          <button onClick={() => { closeQuickView(); navigate("product", { id: p.id }); }} className="mt-2 text-xs font-semibold py-2 rounded-full border" style={{ borderColor: COLORS.ink }}>View Full Details</button>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/*  CART                                                                    */
/* ---------------------------------------------------------------------- */
function CartPage() {
  const { cart, updateQty, removeFromCart, navigate } = useApp();
  const subtotal = cart.reduce((s, c) => s + (c.sale || c.price) * c.qty, 0);
  const discount = cart.reduce((s, c) => s + (c.sale ? (c.price - c.sale) * c.qty : 0), 0);
  const delivery = subtotal === 0 || subtotal >= 3000 ? 0 : 200;
  const total = subtotal + delivery;

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <ShoppingBag size={40} className="mx-auto mb-4" color={COLORS.gold} />
        <h2 style={{ fontFamily: "Fraunces, serif" }} className="text-2xl mb-2">Your cart is empty</h2>
        <p className="text-sm mb-6" style={{ color: COLORS.inkSoft }}>Browse our collection and find something you'll love.</p>
        <button onClick={() => navigate("home")} className="text-xs font-semibold px-5 py-3 rounded-full" style={{ background: COLORS.ink, color: COLORS.ivory }}>Continue Shopping</button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-10">
      <h1 style={{ fontFamily: "Fraunces, serif" }} className="text-3xl mb-8">Shopping Cart</h1>
      <div className="grid md:grid-cols-[1fr_320px] gap-8">
        <div className="flex flex-col gap-4">
          {cart.map((c) => (
            <div key={c.id} className="flex gap-4 items-center border-b pb-4" style={{ borderColor: "rgba(46,42,36,0.08)" }}>
              <div className="w-20 h-20 shrink-0"><ProductArt tone={c.tone} vessel={c.vessel} image={c.image} /></div>
              <div className="flex-1 min-w-0">
                <span className="text-[11px] uppercase" style={{ color: COLORS.inkSoft }}>{c.brand}</span>
                <p className="text-sm font-medium truncate">{c.name}</p>
                <p className="text-[11px]" style={{ color: COLORS.inkSoft }}>{c.size}</p>
                <div className="flex items-center border rounded-full w-fit mt-2" style={{ borderColor: "rgba(46,42,36,0.15)" }}>
                  <button onClick={() => updateQty(c.id, Math.max(1, c.qty - 1))} className="p-1.5"><Minus size={12} /></button>
                  <span className="w-5 text-center text-xs">{c.qty}</span>
                  <button onClick={() => updateQty(c.id, c.qty + 1)} className="p-1.5"><Plus size={12} /></button>
                </div>
              </div>
              <div className="text-right flex flex-col items-end gap-2">
                <PriceTag price={c.price * c.qty} sale={c.sale ? c.sale * c.qty : null} />
                <button onClick={() => removeFromCart(c.id)} aria-label="Remove"><Trash2 size={15} color={COLORS.pinkDeep} /></button>
              </div>
            </div>
          ))}
          <button onClick={() => navigate("home")} className="text-xs font-semibold flex items-center gap-1 mt-2" style={{ color: COLORS.ink }}><ChevronLeft size={14} /> Continue Shopping</button>
        </div>

        <div className="rounded-2xl p-5 h-fit" style={{ background: COLORS.paper }}>
          <h3 className="text-sm font-semibold mb-4">Order Summary</h3>
          <SummaryRow label="Subtotal" value={fmt(subtotal + discount)} />
          {discount > 0 && <SummaryRow label="Discount" value={"-" + fmt(discount)} highlight />}
          <SummaryRow label="Delivery" value={delivery === 0 ? "Free" : fmt(delivery)} />
          <div className="border-t my-3" style={{ borderColor: "rgba(46,42,36,0.12)" }} />
          <SummaryRow label="Total" value={fmt(total)} bold />
          <button onClick={() => navigate("checkout")} className="w-full mt-4 text-xs font-semibold py-3 rounded-full" style={{ background: COLORS.ink, color: COLORS.ivory }}>Proceed to Checkout</button>
        </div>
      </div>
    </div>
  );
}
function SummaryRow({ label, value, bold, highlight }) {
  return (
    <div className="flex justify-between text-xs py-1" style={{ color: highlight ? COLORS.greenDeep : COLORS.inkSoft }}>
      <span className={bold ? "font-semibold text-sm" : ""} style={bold ? { color: COLORS.ink } : {}}>{label}</span>
      <span className={bold ? "font-semibold text-sm" : ""} style={bold ? { color: COLORS.ink } : {}}>{value}</span>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/*  CHECKOUT                                                                */
/* ---------------------------------------------------------------------- */
function CheckoutPage() {
  const { cart, navigate, placeOrder } = useApp();
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "", city: "", province: "", postal: "", notes: "" });
  const [payment, setPayment] = useState("cod");
  const [errors, setErrors] = useState({});

  const subtotal = cart.reduce((s, c) => s + (c.sale || c.price) * c.qty, 0);
  const delivery = subtotal >= 3000 ? 0 : 200;
  const total = subtotal + delivery;

  if (cart.length === 0) {
    return <div className="max-w-xl mx-auto px-4 py-24 text-center text-sm" style={{ color: COLORS.inkSoft }}>Your cart is empty. <button className="underline" onClick={() => navigate("home")}>Go shopping</button></div>;
  }

  const set = (k, v) => setForm({ ...form, [k]: v });

  const submit = (e) => {
    e.preventDefault();
    const req = ["name", "phone", "address", "city", "province"];
    const errs = {};
    req.forEach((k) => { if (!form[k].trim()) errs[k] = true; });
    if (Object.keys(errs).length) { setErrors(errs); return; }
    placeOrder({ form, payment, total, items: cart });
    navigate("confirmation");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-10">
      <h1 style={{ fontFamily: "Fraunces, serif" }} className="text-3xl mb-8">Checkout</h1>
      <form onSubmit={submit} className="grid md:grid-cols-[1fr_320px] gap-8">
        <div className="flex flex-col gap-5">
          <h3 className="text-sm font-semibold">Customer Information</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Full Name" value={form.name} onChange={(v) => set("name", v)} error={errors.name} />
            <Field label="Mobile Number" placeholder="03XXXXXXXXX" value={form.phone} onChange={(v) => set("phone", v)} error={errors.phone} />
          </div>
          <Field label="Email (optional)" type="email" value={form.email} onChange={(v) => set("email", v)} />
          <Field label="Complete Address" value={form.address} onChange={(v) => set("address", v)} error={errors.address} />
          <div className="grid sm:grid-cols-3 gap-4">
            <SelectField label="City" value={form.city} onChange={(v) => set("city", v)} options={CITIES} error={errors.city} />
            <SelectField label="Province" value={form.province} onChange={(v) => set("province", v)} options={PROVINCES} error={errors.province} />
            <Field label="Postal Code" value={form.postal} onChange={(v) => set("postal", v)} />
          </div>
          <Field label="Order Notes (optional)" value={form.notes} onChange={(v) => set("notes", v)} textarea />

          <h3 className="text-sm font-semibold mt-2">Payment Method</h3>
          <div className="flex flex-col gap-2">
            {[
              { id: "cod", label: "Cash on Delivery", note: "Pay when your order arrives." },
              { id: "bank", label: "Bank Transfer", note: "Transfer to our bank account, share receipt on WhatsApp." },
              { id: "online", label: "Online Payment", note: "Pay securely via debit/credit card." },
            ].map((opt) => (
              <label key={opt.id} className="flex items-start gap-3 p-3 rounded-xl border cursor-pointer" style={{ borderColor: payment === opt.id ? COLORS.gold : "rgba(46,42,36,0.12)", background: payment === opt.id ? COLORS.paper : "transparent" }}>
                <input type="radio" checked={payment === opt.id} onChange={() => setPayment(opt.id)} className="mt-0.5" style={{ accentColor: COLORS.gold }} />
                <div>
                  <p className="text-sm font-medium">{opt.label}</p>
                  <p className="text-[11px]" style={{ color: COLORS.inkSoft }}>{opt.note}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="rounded-2xl p-5 h-fit" style={{ background: COLORS.paper }}>
          <h3 className="text-sm font-semibold mb-4">Order Summary</h3>
          <div className="flex flex-col gap-3 mb-4 max-h-52 overflow-y-auto">
            {cart.map((c) => (
              <div key={c.id} className="flex justify-between text-xs">
                <span className="flex-1 pr-2" style={{ color: COLORS.inkSoft }}>{c.name} × {c.qty}</span>
                <span>{fmt((c.sale || c.price) * c.qty)}</span>
              </div>
            ))}
          </div>
          <SummaryRow label="Subtotal" value={fmt(subtotal)} />
          <SummaryRow label="Delivery" value={delivery === 0 ? "Free" : fmt(delivery)} />
          <div className="border-t my-3" style={{ borderColor: "rgba(46,42,36,0.12)" }} />
          <SummaryRow label="Total" value={fmt(total)} bold />
          <button type="submit" className="w-full mt-4 text-xs font-semibold py-3 rounded-full" style={{ background: COLORS.ink, color: COLORS.ivory }}>Place Order</button>
        </div>
      </form>
    </div>
  );
}
function Field({ label, value, onChange, type = "text", error, textarea, placeholder }) {
  return (
    <label className="flex flex-col gap-1.5 text-xs">
      <span style={{ color: COLORS.inkSoft }}>{label}</span>
      {textarea ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={2} className="rounded-lg px-3 py-2 text-sm border outline-none" style={{ borderColor: error ? COLORS.pinkDeep : "rgba(46,42,36,0.15)" }} />
      ) : (
        <input type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className="rounded-lg px-3 py-2 text-sm border outline-none" style={{ borderColor: error ? COLORS.pinkDeep : "rgba(46,42,36,0.15)" }} />
      )}
      {error && <span style={{ color: COLORS.pinkDeep }}>Required</span>}
    </label>
  );
}
function SelectField({ label, value, onChange, options, error }) {
  return (
    <label className="flex flex-col gap-1.5 text-xs">
      <span style={{ color: COLORS.inkSoft }}>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="rounded-lg px-3 py-2 text-sm border outline-none bg-white" style={{ borderColor: error ? COLORS.pinkDeep : "rgba(46,42,36,0.15)" }}>
        <option value="">Select</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      {error && <span style={{ color: COLORS.pinkDeep }}>Required</span>}
    </label>
  );
}

/* ---------------------------------------------------------------------- */
/*  CONFIRMATION / TRACKING                                                 */
/* ---------------------------------------------------------------------- */
function ConfirmationPage() {
  const { lastOrder, navigate } = useApp();
  if (!lastOrder) return <div className="max-w-xl mx-auto px-4 py-24 text-center text-sm">No recent order found. <button className="underline" onClick={() => navigate("home")}>Go home</button></div>;
  return (
    <div className="max-w-xl mx-auto px-4 py-16 text-center">
      <div className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center" style={{ background: COLORS.green }}>
        <Check size={28} color={COLORS.greenDeep} />
      </div>
      <h1 style={{ fontFamily: "Fraunces, serif" }} className="text-3xl mb-2">Thank You for Your Order!</h1>
      <p className="text-sm mb-8" style={{ color: COLORS.inkSoft }}>A confirmation has been recorded for order <strong>{lastOrder.id}</strong>.</p>
      <div className="text-left rounded-2xl p-5 mb-8" style={{ background: COLORS.paper }}>
        <SummaryRow label="Order Number" value={lastOrder.id} />
        <SummaryRow label="Customer" value={lastOrder.form.name} />
        <SummaryRow label="Items" value={`${lastOrder.items.length} product(s)`} />
        <SummaryRow label="Total Amount" value={fmt(lastOrder.total)} bold />
        <SummaryRow label="Delivery Address" value={`${lastOrder.form.address}, ${lastOrder.form.city}`} />
        <SummaryRow label="Payment Method" value={lastOrder.payment === "cod" ? "Cash on Delivery" : lastOrder.payment === "bank" ? "Bank Transfer" : "Online Payment"} />
        <SummaryRow label="Estimated Delivery" value="2–5 business days" />
      </div>
      <div className="flex gap-3 justify-center">
        <button onClick={() => navigate("home")} className="text-xs font-semibold px-5 py-3 rounded-full border" style={{ borderColor: COLORS.ink }}>Continue Shopping</button>
        <button onClick={() => navigate("tracking", { id: lastOrder.id })} className="text-xs font-semibold px-5 py-3 rounded-full" style={{ background: COLORS.ink, color: COLORS.ivory }}>Track Order</button>
      </div>
    </div>
  );
}
  function TrackingPage({ params }) {
  const { orders } = useApp();
  const order = orders.find((o) => o.id === params?.id) || orders[orders.length - 1];
  const steps = ["Order Placed", "Order Confirmed", "Processing", "Shipped", "Out for Delivery", "Delivered"];
  const currentIndex = order ? steps.indexOf(order.status) : 0;

  return (
    <div className="max-w-xl mx-auto px-4 py-16">
      <h1 style={{ fontFamily: "Fraunces, serif" }} className="text-3xl mb-2 text-center">Track Your Order</h1>
      {!order ? (
        <p className="text-sm text-center mt-8" style={{ color: COLORS.inkSoft }}>No orders found yet. Place an order to track it here.</p>
      ) : (
        <>
          <p className="text-sm text-center mb-10" style={{ color: COLORS.inkSoft }}>Order {order.id}</p>
          <div className="flex flex-col gap-0">
            {steps.map((s, i) => (
              <div key={s} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: i <= currentIndex ? COLORS.gold : COLORS.paper }}>
                    {i <= currentIndex ? <Check size={13} color="#fff" /> : <span className="text-[10px]" style={{ color: COLORS.inkSoft }}>{i + 1}</span>}
                  </div>
                  {i < steps.length - 1 && <div className="w-px flex-1 min-h-[28px]" style={{ background: i < currentIndex ? COLORS.gold : "rgba(46,42,36,0.15)" }} />}
                </div>
                <div className="pb-7">
                  <p className="text-sm font-medium" style={{ color: i <= currentIndex ? COLORS.ink : COLORS.inkSoft }}>{s}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/*  WISHLIST                                                                */
/* ---------------------------------------------------------------------- */
function WishlistPage() {
  const { wishlist } = useApp();
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-10">
      <h1 style={{ fontFamily: "Fraunces, serif" }} className="text-3xl mb-8">My Wishlist</h1>
      {wishlist.length === 0 ? (
        <p className="text-sm" style={{ color: COLORS.inkSoft }}>You haven't saved any products yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {wishlist.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/*  ACCOUNT                                                                  */
/* ---------------------------------------------------------------------- */
function AccountPage() {
  const { currentUser, login, logout, orders } = useApp();
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [tab, setTab] = useState("profile");

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <h1 style={{ fontFamily: "Fraunces, serif" }} className="text-3xl mb-6 text-center">{mode === "login" ? "Welcome Back" : "Create Account"}</h1>
        <div className="flex gap-2 mb-6 justify-center text-xs font-semibold">
          <button onClick={() => setMode("login")} className="px-3 py-1.5 rounded-full" style={{ background: mode === "login" ? COLORS.ink : COLORS.paper, color: mode === "login" ? COLORS.ivory : COLORS.ink }}>Login</button>
          <button onClick={() => setMode("register")} className="px-3 py-1.5 rounded-full" style={{ background: mode === "register" ? COLORS.ink : COLORS.paper, color: mode === "register" ? COLORS.ivory : COLORS.ink }}>Register</button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); login({ name: name || "Guest User", email }); }} className="flex flex-col gap-4">
          {mode === "register" && <Field label="Full Name" value={name} onChange={setName} />}
          <Field label="Email" type="email" value={email} onChange={setEmail} />
          <Field label="Password" type="password" value="" onChange={() => {}} />
          {mode === "login" && <button type="button" className="text-[11px] text-left -mt-2" style={{ color: COLORS.gold }}>Forgot Password?</button>}
          <button type="submit" className="text-xs font-semibold py-3 rounded-full mt-2" style={{ background: COLORS.ink, color: COLORS.ivory }}>{mode === "login" ? "Login" : "Create Account"}</button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-10 grid md:grid-cols-[180px_1fr] gap-8">
      <div className="flex md:flex-col gap-2 overflow-x-auto">
        {["profile", "orders", "addresses", "settings"].map((t) => (
          <button key={t} onClick={() => setTab(t)} className="text-left text-xs font-medium px-3 py-2 rounded-lg capitalize whitespace-nowrap" style={{ background: tab === t ? COLORS.paper : "transparent", color: COLORS.ink }}>
            {t === "profile" ? "My Profile" : t === "orders" ? "My Orders" : t === "addresses" ? "Saved Addresses" : "Account Settings"}
          </button>
        ))}
        <button onClick={logout} className="text-left text-xs font-medium px-3 py-2 rounded-lg" style={{ color: COLORS.pinkDeep }}>Logout</button>
      </div>
      <div>
        {tab === "profile" && (
          <div>
            <h2 className="text-lg font-medium mb-4" style={{ fontFamily: "Fraunces, serif" }}>My Profile</h2>
            <p className="text-sm"><strong>Name:</strong> {currentUser.name}</p>
            <p className="text-sm mt-1"><strong>Email:</strong> {currentUser.email || "—"}</p>
          </div>
        )}
        {tab === "orders" && (
          <div>
            <h2 className="text-lg font-medium mb-4" style={{ fontFamily: "Fraunces, serif" }}>My Orders</h2>
            {orders.length === 0 ? <p className="text-sm" style={{ color: COLORS.inkSoft }}>No orders placed yet.</p> :
              orders.map((o) => (
                <div key={o.id} className="border-b py-3 flex justify-between text-xs" style={{ borderColor: "rgba(46,42,36,0.08)" }}>
                  <span>{o.id}</span><span>{o.status}</span><span>{fmt(o.total)}</span>
                </div>
              ))
            }
          </div>
        )}
        {tab === "addresses" && <p className="text-sm" style={{ color: COLORS.inkSoft }}>Addresses you save at checkout will appear here.</p>}
        {tab === "settings" && <p className="text-sm" style={{ color: COLORS.inkSoft }}>Manage your notification and privacy preferences here.</p>}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/*  ABOUT / CONTACT                                                         */
/* ---------------------------------------------------------------------- */
function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-14">
      <SectionHeading eyebrow="Our Story" title="Care that feels personal" center />
      <div className="grid md:grid-cols-2 gap-4 my-8">
        <ProductArt tone="women" vessel="jar" />
        <ProductArt tone="baby" vessel="bottle" />
      </div>
      <div className="max-w-2xl mx-auto flex flex-col gap-6 text-sm leading-relaxed" style={{ color: COLORS.inkSoft }}>
        <p>Aavara began with a simple idea: every member of the family, from newborns to grandparents, deserves skincare that is gentle, effective and honestly made. We started as a small online shelf of carefully chosen essentials, and we've grown into a home for skincare, haircare, personal-care and baby-care products that people trust.</p>
        <div>
          <h3 className="text-sm font-semibold mb-1" style={{ color: COLORS.ink }}>Our Mission</h3>
          <p>To make trustworthy, quality personal-care accessible to every household in Pakistan.</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold mb-1" style={{ color: COLORS.ink }}>Our Vision</h3>
          <p>A world where choosing skincare feels simple, safe and joyful — never overwhelming.</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold mb-1" style={{ color: COLORS.ink }}>Product Quality Philosophy</h3>
          <p>We work with brands that share our standards for ingredients, testing and transparency, and we display clear information on every product page.</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold mb-1" style={{ color: COLORS.ink }}>Our Commitment to You</h3>
          <p>From browsing to delivery, we aim to make every step easy, honest and worth coming back for.</p>
        </div>
      </div>
    </div>
  );
}
  function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-14 grid md:grid-cols-2 gap-10">
      <div>
        <SectionHeading eyebrow="We'd love to hear from you" title="Contact Us" />
        <div className="flex flex-col gap-4 mt-6 text-sm" style={{ color: COLORS.inkSoft }}>
          <div className="flex items-start gap-3"><MapPin size={16} className="mt-0.5" color={COLORS.gold} /> 12-B Gulberg III, Lahore, Pakistan</div>
          <div className="flex items-center gap-3"><Phone size={16} color={COLORS.gold} /> 0300 1234567</div>
          <div className="flex items-center gap-3"><MessageCircle size={16} color={COLORS.gold} /> WhatsApp: 0300 1234567</div>
          <div className="flex items-center gap-3"><Mail size={16} color={COLORS.gold} /> hello@aavara.pk</div>
          <div className="flex items-center gap-3"><Clock size={16} color={COLORS.gold} /> Mon–Sat, 10:00 AM – 8:00 PM</div>
        </div>
        <div className="mt-6 rounded-2xl overflow-hidden h-56">
          <iframe title="map" className="w-full h-full border-0" loading="lazy" src="https://maps.google.com/maps?q=Gulberg%20Lahore%20Pakistan&t=&z=13&ie=UTF8&iwloc=&output=embed" />
        </div>
        <div className="flex gap-3 mt-5 text-xs font-semibold" style={{ color: COLORS.ink }}>
          <span>Facebook</span><span>Instagram</span><span>TikTok</span>
        </div>
      </div>
      <div>
        {sent ? (
          <div className="rounded-2xl p-6 text-sm" style={{ background: COLORS.paper }}>
            <Check className="mb-2" color={COLORS.greenDeep} /> Thank you — your message has been recorded. We'll get back to you soon.
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="flex flex-col gap-4">
            <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
            <Field label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
            <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
            <Field label="Message" value={form.message} onChange={(v) => setForm({ ...form, message: v })} textarea />
            <button type="submit" className="text-xs font-semibold py-3 rounded-full mt-1" style={{ background: COLORS.ink, color: COLORS.ivory }}>Send Message</button>
          </form>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/*  ADMIN                                                                    */
/* ---------------------------------------------------------------------- */
function AdminPage() {
  const { products, setProducts, orders, setOrders, whatsappNumber, setWhatsappNumber } = useApp();
  const [tab, setTab] = useState("products");
  const [editing, setEditing] = useState(null);

  const deleteProduct = (id) => setProducts(products.filter((p) => p.id !== id));
  const saveProduct = (p) => {
    if (products.some((x) => x.id === p.id)) setProducts(products.map((x) => (x.id === p.id ? p : x)));
    else setProducts([{ ...p, id: "P" + Math.random().toString(36).slice(2, 7) }, ...products]);
    setEditing(null);
  };
  const cycleStatus = (id) => {
    const steps = ["Order Placed", "Order Confirmed", "Processing", "Shipped", "Out for Delivery", "Delivered"];
    setOrders(orders.map((o) => o.id === id ? { ...o, status: steps[Math.min(steps.indexOf(o.status) + 1, steps.length - 1)] } : o));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-10">
      <h1 style={{ fontFamily: "Fraunces, serif" }} className="text-3xl mb-6">Admin Dashboard</h1>
      <div className="flex gap-2 mb-8 flex-wrap text-xs font-semibold">
        {["products", "categories", "orders", "customers", "promotions", "settings"].map((t) => (
          <button key={t} onClick={() => setTab(t)} className="px-3 py-1.5 rounded-full capitalize" style={{ background: tab === t ? COLORS.ink : COLORS.paper, color: tab === t ? COLORS.ivory : COLORS.ink }}>{t}</button>
        ))}
      </div>

      {tab === "products" && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <p className="text-xs" style={{ color: COLORS.inkSoft }}>{products.length} products</p>
            <button onClick={() => setEditing({ id: null, name: "", brand: BRANDS[0], groups: ["skin"], sub: "", vessel: "jar", tone: "skin", size: "", price: 0, sale: "", rating: 4.5, reviews: 0, ingredient: "", skinType: "", hairType: "" })} className="text-xs font-semibold px-3 py-2 rounded-full flex items-center gap-1" style={{ background: COLORS.ink, color: COLORS.ivory }}>
              <Plus size={13} /> Add Product
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-left border-b" style={{ borderColor: "rgba(46,42,36,0.15)", color: COLORS.inkSoft }}>
                  <th className="py-2 pr-3">Product</th><th className="py-2 pr-3">Brand</th><th className="py-2 pr-3">Price</th><th className="py-2 pr-3">Rating</th><th className="py-2 pr-3"></th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b" style={{ borderColor: "rgba(46,42,36,0.08)" }}>
                    <td className="py-2 pr-3">{p.name}</td>
                    <td className="py-2 pr-3">{p.brand}</td>
                    <td className="py-2 pr-3">{fmt(p.sale || p.price)}</td>
                    <td className="py-2 pr-3">{p.rating}</td>
                    <td className="py-2 pr-3 flex gap-2">
                      <button onClick={() => setEditing(p)}><Pencil size={13} color={COLORS.gold} /></button>
                      <button onClick={() => deleteProduct(p.id)}><Trash2 size={13} color={COLORS.pinkDeep} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {editing && <ProductEditModal product={editing} onClose={() => setEditing(null)} onSave={saveProduct} />}
        </div>
      )}

      {tab === "categories" && (
        <div className="grid sm:grid-cols-2 gap-3">
          {CATEGORY_DEFS.map((c) => (
            <div key={c.key} className="rounded-xl p-3 flex items-center justify-between" style={{ background: COLORS.paper }}>
              <div><p className="text-sm font-medium">{c.label}</p><p className="text-[11px]" style={{ color: COLORS.inkSoft }}>{c.desc}</p></div>
              <Pencil size={14} color={COLORS.gold} />
            </div>
          ))}
        </div>
      )}

      {tab === "orders" && (
        <div className="flex flex-col gap-3">
          {orders.length === 0 && <p className="text-sm" style={{ color: COLORS.inkSoft }}>No orders yet.</p>}
          {orders.map((o) => (
            <div key={o.id} className="rounded-xl p-4" style={{ background: COLORS.paper }}>
              <div className="flex justify-between text-xs mb-1"><strong>{o.id}</strong><span>{fmt(o.total)}</span></div>
              <p className="text-xs" style={{ color: COLORS.inkSoft }}>{o.form.name} · {o.form.city} · {o.payment.toUpperCase()}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-[11px] font-semibold px-2 py-1 rounded-full" style={{ background: COLORS.green, color: COLORS.greenDeep }}>{o.status}</span>
                <button onClick={() => cycleStatus(o.id)} className="text-[11px] font-semibold underline">Advance Status</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "customers" && <p className="text-sm" style={{ color: COLORS.inkSoft }}>Customer accounts and order history will be listed here as they register.</p>}
      {tab === "promotions" && <p className="text-sm" style={{ color: COLORS.inkSoft }}>Create discount codes, sale prices and promotional banners from here. Mark products with a sale price in the Products tab to feature them under Offers.</p>}
      {tab === "settings" && (
        <div className="max-w-sm">
          <Field label="WhatsApp Number" value={whatsappNumber} onChange={setWhatsappNumber} />
          <p className="text-[11px] mt-2" style={{ color: COLORS.inkSoft }}>Used for the floating WhatsApp button across the site.</p>
        </div>
      )}
    </div>
  );
}
  function ProductEditModal({ product, onClose, onSave }) {
  const [p, setP] = useState(product);
  const set = (k, v) => setP({ ...p, [k]: v });
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(46,42,36,0.45)" }} onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-md w-full p-5 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-sm font-semibold mb-4">{product.id ? "Edit Product" : "Add Product"}</h3>
        <div className="flex flex-col gap-3">
          <Field label="Name" value={p.name} onChange={(v) => set("name", v)} />
          <Field label="Brand" value={p.brand} onChange={(v) => set("brand", v)} />
          <Field label="Size" value={p.size} onChange={(v) => set("size", v)} />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Price" type="number" value={p.price} onChange={(v) => set("price", Number(v))} />
            <Field label="Sale Price" type="number" value={p.sale || ""} onChange={(v) => set("sale", v ? Number(v) : "")} />
          </div>
          <Field label="Key Ingredient" value={p.ingredient} onChange={(v) => set("ingredient", v)} />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Skin Type" value={p.skinType || ""} onChange={(v) => set("skinType", v)} />
            <Field label="Hair Type" value={p.hairType || ""} onChange={(v) => set("hairType", v)} />
          </div>
        </div>
        <div className="flex gap-3 mt-5">
          <button onClick={onClose} className="flex-1 text-xs font-semibold py-2.5 rounded-full border" style={{ borderColor: COLORS.ink }}>Cancel</button>
          <button
            onClick={() => onSave({
              ...p,
              groups: p.groups && p.groups.length ? p.groups : ["skin"],
              discount: p.sale ? Math.round(((p.price - p.sale) / p.price) * 100) : 0,
              description: p.description || `${p.name} formulated with ${p.ingredient || "quality ingredients"}.`,
              benefits: p.benefits || [`Enriched with ${p.ingredient || "care"}`, "Dermatologically tested formula"],
              howToUse: p.howToUse || "Apply as directed.",
              suitableFor: p.suitableFor || p.skinType || p.hairType || "All types",
              warnings: p.warnings || "For external use only.",
              reviews: p.reviews || 0,
              rating: p.rating || 4.5,
            })}
            className="flex-1 text-xs font-semibold py-2.5 rounded-full"
            style={{ background: COLORS.ink, color: COLORS.ivory }}
          >
            Save Product
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/*  WHATSAPP FLOAT                                                          */
/* ---------------------------------------------------------------------- */
function WhatsAppFloat() {
  const { whatsappNumber } = useApp();
  const num = (whatsappNumber || "").replace(/\D/g, "");
  const href = `https://wa.me/${num}?text=${encodeURIComponent("Hello, I would like to know more about a product.")}`;
  return (
    
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-40 w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
      style={{ background: "#25D366" }}
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={24} color="#fff" fill="#fff" />
    </a>
  );
}

/* ---------------------------------------------------------------------- */
/*  APP SHELL                                                               */
/* ---------------------------------------------------------------------- */
export default function CosmeticStore() {
  useFonts();
  const [view, setView] = useState({ name: "home", params: {} });
  const [products, setProducts] = useState(PRODUCTS);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [quickView, setQuickView] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [lastOrder, setLastOrder] = useState(null);
  const [whatsappNumber, setWhatsappNumber] = useState("+92 3015944965");

  const navigate = (name, params = {}) => {
    setView({ name, params });
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  };

  const addToCart = (p, qty) => {
    setCart((prev) => {
      const found = prev.find((c) => c.id === p.id);
      if (found) return prev.map((c) => (c.id === p.id ? { ...c, qty: c.qty + qty } : c));
      return [...prev, { ...p, qty }];
    });
  };
  const updateQty = (id, qty) => setCart((prev) => prev.map((c) => (c.id === id ? { ...c, qty } : c)));
  const removeFromCart = (id) => setCart((prev) => prev.filter((c) => c.id !== id));

  const toggleWishlist = (p) => {
    setWishlist((prev) => (prev.some((w) => w.id === p.id) ? prev.filter((w) => w.id !== p.id) : [...prev, p]));
  };

  const login = (u) => setCurrentUser(u);
  const logout = () => setCurrentUser(null);

  const placeOrder = ({ form, payment, total, items }) => {
    const order = { id: "AAV" + Math.floor(10000 + Math.random() * 89999), form, payment, total, items, status: "Order Placed" };
    setOrders((prev) => [...prev, order]);
    setLastOrder(order);
    setCart([]);
  };

  const ctx = {
    view, navigate, products, setProducts,
    cart, addToCart, updateQty, removeFromCart,
    wishlist, toggleWishlist,
    quickView, openQuickView: setQuickView, closeQuickView: () => setQuickView(null),
    currentUser, login, logout,
    orders, setOrders, lastOrder, placeOrder,
    whatsappNumber, setWhatsappNumber,
  };

  let Page;
  switch (view.name) {
    case "shop": Page = <ShopPage params={view.params} />; break;
    case "product": Page = <ProductDetail params={view.params} />; break;
    case "cart": Page = <CartPage />; break;
    case "checkout": Page = <CheckoutPage />; break;
    case "confirmation": Page = <ConfirmationPage />; break;
    case "tracking": Page = <TrackingPage params={view.params} />; break;
    case "wishlist": Page = <WishlistPage />; break;
    case "account": Page = <AccountPage />; break;
    case "about": Page = <AboutPage />; break;
    case "contact": Page = <ContactPage />; break;
    case "admin": Page = <AdminPage />; break;
    default: Page = <HomePage />;
  }

  return (
    <AppCtx.Provider value={ctx}>
      <div style={{ background: COLORS.ivory, color: COLORS.ink, fontFamily: "Manrope, sans-serif", minHeight: "100vh" }} className="text-[15px]">
        <Nav />
        {Page}
        <Footer />
        <WhatsAppFloat />
        <QuickViewModal />
      </div>
    </AppCtx.Provider>
  );
}
