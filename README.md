# Beauty Land — Luxury Salon Website

A modern, high-fashion salon website built with **Next.js**, **Framer Motion**, **Firebase**, and **Cloudinary**. Features a responsive design with real-time gallery management and automated service descriptions

---

## 🎨 Design Language

- **Primary Dark**: `#1a0005` (deep maroon background)
- **Accent Gold**: `#C9A96E` (elegant highlights)
- **Call-to-Action Green**: `#25D366` (WhatsApp integration)
- **Cream/Beige**: `#faf6f0` (light overlays and cards)
- **Typography**: Cinzel font for headings (serif, elegant); sans-serif for body
- **Aesthetic**: Vintage, editorial, high-end lookbook vibe with film-grain textures

---

## 🚀 Project Structure

```
beauty-land/
├── app/
│   ├── layout.tsx              # Root layout with global styles
│   ├── page.tsx                # Homepage
│   ├── gallery/
│   │   └── page.tsx            # Full gallery page (masonry + lightbox)
│   ├── services/
│   │   └── [id]/page.tsx       # Individual service detail page
│   └── admin/
│       ├── upload/page.tsx     # Gallery photo upload (admin)
│       └── login/page.tsx      # Admin authentication
├── components/
│   ├── Navbar.tsx              # Navigation with mobile menu
│   ├── GallerySection.tsx       # Homepage gallery (Framer Motion curtain-reveal)
│   ├── BookingModal.tsx         # Booking/contact modal
│   ├── Footer.tsx              # Footer with links and info
│   └── BookServiceButton.tsx   # [DEPRECATED — use BookingModal instead]
├── lib/
│   ├── firebase.ts             # Firebase client config
│   └── firebase-admin.ts       # Firebase Admin SDK (server-side)
└── public/
    └── gallery-bg.jpg          # Floral background image
```

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend Framework** | Next.js 14+ (App Router) |
| **Styling** | Tailwind CSS |
| **Animation** | Framer Motion |
| **Image Hosting** | Cloudinary |
| **Backend/Database** | Firebase (Firestore + Auth) |
| **Image Optimization** | Next.js `<Image>` component |
| **Icons** | lucide-react |
| **AI Integration** | Google Gemini API |

---

## 🔧 Setup & Installation

### Prerequisites
- Node.js 18+
- npm or yarn
- Firebase project
- Cloudinary account
- Google Gemini API key

### Environment Variables

Create a `.env.local` file:

```env
# Firebase (client-side)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin (server-side)
FIREBASE_ADMIN_SDK_KEY=your_admin_key_json

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Google Gemini
GOOGLE_GEMINI_API_KEY=your_gemini_key

# Salon Info
NEXT_PUBLIC_SALON_NAME=Beauty Land
NEXT_PUBLIC_SALON_PHONE=+918240488414
NEXT_PUBLIC_SALON_ADDRESS=Your salon address
```

### Install & Run

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

---

## 📱 Key Components & Features

### **Navbar** (`components/Navbar.tsx`)
- Desktop navigation with smooth fade-in animation
- Mobile hamburger menu with animated icon
- Smooth scroll anchors: `/#services`, `/#gallery`, `/#contact`
- **Note**: Make sure homepage sections have matching `id` attributes (e.g., `<section id="gallery">`)

### **Homepage Gallery Section** (`components/GallerySection.tsx`)
- **Animation**: Framer Motion curtain-reveal using scroll-driven pinning
- **Why Framer Motion?** Avoids GSAP ScrollTrigger's "pin-spacer" bug that causes white-gap artifacts in production
- **Tech**: `useScroll` + `sticky` positioning (native browser pinning, no library calculation desync)
- Real-time Firestore sync; displays first 8 photos
- Cream overlay with subtle floral background (`gallery-bg.jpg`)
- CTA button fades in at end of scroll sequence

### **Full Gallery Page** (`app/gallery/page.tsx`)
- Masonry grid layout (responsive columns)
- Click-to-lightbox with keyboard navigation (arrow keys, Escape)
- Previous/Next navigation with chevron buttons
- Thumbnail strip for quick jumping
- Photo captions from Firestore
- Counter display (e.g., "03 / 24")

### **Booking Modal** (`components/BookingModal.tsx`)
- Floating call-to-action button
- Modal contains:
  - Salon name & phone number
  - WhatsApp direct chat link (green CTA)
  - Email contact
  - Tap-to-call on mobile
- Hardcoded owner info: **Mistu Ghosh**, **+918240488414**
- Easily customizable for future dynamic data

### **Admin Gallery Upload** (`app/admin/upload/page.tsx`)
- Upload photos via Cloudinary
- Auto-generates service descriptions using Gemini AI
- Stores metadata (publicId, url, caption, createdAt) in Firestore
- Protected route (requires Firebase auth)

### **Footer** (`components/Footer.tsx`)
- Links: Home, Gallery, Services, Admin (subtle text link)
- Placeholders for:
  - Salon address
  - Instagram/Facebook URLs
- Subtle gold accent text on dark background

---

## 🎬 Animation Details

### Homepage Gallery (Curtain Reveal)
**Tech Stack**: Framer Motion (`useScroll` + `useTransform` + `useSpring`)

**Sequence** (scroll-driven, 0–1 progress):
1. **0.0–0.22**: Heading fades out, moves up
2. **0.15–0.55**: Left & right curtains slide out (xPercent: 0 → ±100)
3. **0.45–0.70**: Photo cards fade in and scale up with stagger
4. **0.80–1.0**: "Explore Full Gallery" button appears

**Why this approach?**
- **No GSAP pin-spacer**: Sticky positioning is handled by the browser natively; no separate library calculating and reserving scroll distance
- **No dead-scroll-gap**: The animation and scroll distance are driven by the exact same value, eliminating the sync bug that plagued the original GSAP version
- **Smooth spring easing**: Gives the reveals a subtle bounce and weight without feeling jarring

---

## 🗄 Firebase Setup

### Firestore Collections

**`gallery`**
```json
{
  "id": "auto-generated",
  "publicId": "cloudinary-public-id",
  "url": "https://res.cloudinary.com/...",
  "caption": "Optional style name or description",
  "createdAt": "Timestamp"
}
```

**`services`** (if used for dynamic service pages)
```json
{
  "id": "auto-generated",
  "name": "Service name",
  "description": "AI-generated or manual description",
  "price": "Price range",
  "duration": "Duration in minutes"
}
```

### Authentication
- Firebase Auth (Google/Email sign-up available)
- Admin routes protected via `getAuth()` client-side checks (consider server-side security rules for production)

---

## 📸 Image Optimization

- **Cloudinary**: Hosts all salon photos, handles resizing and lazy-loading
- **Next.js `<Image>`**: All photos use `<Image fill>` with `object-cover` for responsive scaling
- **Lazy Loading**: Images load on-demand, improving initial page load
- **Production**: Ensure `/public/gallery-bg.jpg` exists (exact filename/case required on case-sensitive hosts like Vercel)

---

## 🚨 Known Issues & TODOs

### Fixed ✅
- ~~Curtain reveal white-gap bug (GSAP pin-spacer desync)~~ → Migrated to Framer Motion sticky pinning
- ~~Full gallery lightbox invisible image bug~~ → Fixed
- ~~Fade transition broken in lightbox~~ → Fixed

### Open 🔄
- **Footer placeholders**: Add real salon address and social media URLs (Instagram, Facebook)
- **Admin route security**: Current auth checks are client-side; should use Firebase security rules for production
- **BookServiceButton cleanup**: Component is deprecated; migrate `app/services/[id]/page.tsx` to use `BookingModal` instead
- **Stylist names/notes**: Homepage gallery cards could pull real stylist names/notes from Firestore captions (currently uses placeholder names like "The Shag", "The Pompadour")
- **Mobile Safari**: Test sticky positioning and 3D transforms on iOS Safari to ensure no rendering quirks

---

## 🧪 Testing Checklist

- [ ] Navbar links scroll to correct sections (ensure `id` attributes match)
- [ ] Gallery animation plays smoothly on desktop (Chrome, Firefox, Safari)
- [ ] No white gaps or lag during gallery scroll reveal
- [ ] Mobile menu opens/closes cleanly
- [ ] Gallery lightbox works on mobile (swipe/tap navigation)
- [ ] Booking modal appears and WhatsApp link works
- [ ] Admin upload page loads and stores photos in Firestore
- [ ] Production build deploys without errors (`npm run build && npm start`)
- [ ] Mobile Safari doesn't have sticky positioning glitches
- [ ] Background image (`gallery-bg.jpg`) displays correctly in production

---

## 📝 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect repo to Vercel
3. Add environment variables in Vercel dashboard (Settings → Environment Variables)
4. Deploy automatically on push

### Manual Deployment

```bash
npm run build
npm start
```

**Important**: Ensure `public/gallery-bg.jpg` is included in the build output and case matches exactly (Vercel is case-sensitive).

---

## 📞 Contact & Owner Info

- **Salon Name**: Beauty Land
- **Owner**: Mistu Ghosh
- **Phone**: +918240488414
- **Booking**: WhatsApp direct chat or modal in website

---

## 🤝 Contributing

- Keep animation timings consistent with Framer Motion's spring physics
- Use Tailwind utility classes for styling (avoid arbitrary values like `h-[600px]`)
- Test on mobile Safari before merging
- Update Firestore security rules before going live

---

## 📄 License

Private project for Beauty Land salon.
