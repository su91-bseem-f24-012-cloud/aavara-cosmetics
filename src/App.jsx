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
