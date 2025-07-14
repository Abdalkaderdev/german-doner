# 🥙 Berlin Doner - QR Multilingual Menu Project

## ✅ Project Overview

**Berlin Doner** is a modern, multilingual QR menu system built for a German-Turkish restaurant. The application provides:

- **Multi-language support**: English, German, and Arabic (with RTL support)
- **QR Code ready**: Customers scan QR codes to access the menu
- **Interactive menu**: Browse categories, view items with images and descriptions
- **Shopping cart**: Add/remove items with quantity tracking
- **Responsive design**: Works on mobile, tablet, and desktop
- **Smooth animations**: Framer Motion powered transitions and interactions
- **Professional UI**: Built with shadcn/ui components and Tailwind CSS

### How it works:
1. Customer scans QR code → lands on language selection page
2. Selects preferred language → navigates to `/menu/{language}`
3. Browses menu categories and items
4. Can add items to cart (cart functionality implemented but not connected to ordering system)

---

## 🏗️ File & Folder Structure

```
src/
├── pages/
│   ├── Index.tsx          # Landing page with language selection
│   ├── Menu.tsx           # Main menu display with cart functionality
│   └── NotFound.tsx       # 404 error page
├── components/ui/         # shadcn/ui components (Button, Card, etc.)
├── assets/
│   └── doner-hero.jpg     # Hero background image
├── hooks/
│   ├── use-mobile.tsx     # Mobile detection hook
│   └── use-toast.ts       # Toast notifications
├── lib/
│   └── utils.ts           # Utility functions (cn, etc.)
├── App.tsx                # Main app with routing
├── main.tsx               # React entry point
├── index.css              # Global styles with design system
└── vite-env.d.ts          # TypeScript definitions

public/
├── menu_en.json           # English menu data
├── menu_de.json           # German menu data
├── menu_ar.json           # Arabic menu data
└── robots.txt             # SEO robots file

Config Files:
├── tailwind.config.ts     # Tailwind configuration with design tokens
├── vite.config.ts         # Vite build configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Dependencies and scripts
```

### 🔑 Key Files:

- **`src/pages/Index.tsx`**: Language selection landing page with animated hero section
- **`src/pages/Menu.tsx`**: Complete menu display with categories, items, cart, and animations
- **`public/menu_{lang}.json`**: Menu data files for each language
- **`src/index.css`**: Design system with CSS variables and animations
- **`tailwind.config.ts`**: Extended Tailwind config with custom colors and animations

---

## 📦 Packages & Dependencies

### Core Framework:
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server

### Routing & State:
- **react-router-dom** - Client-side routing
- **@tanstack/react-query** - Data fetching and caching

### UI & Styling:
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components
- **Lucide React** - Icon library
- **next-themes** - Dark/light theme support

### Animations:
- **Framer Motion** - Animation and gesture library
- **tailwindcss-animate** - CSS animation utilities

### Forms & Validation:
- **react-hook-form** - Form handling
- **zod** - Schema validation
- **@hookform/resolvers** - Form validation resolvers

### Additional:
- **class-variance-authority** - Component variant styling
- **clsx** & **tailwind-merge** - Conditional classes
- **sonner** - Toast notifications

---

## 🔀 Language Selection & Menu Loading

### Language Selection Flow:
1. **Landing Page** (`/`): Shows language selection with animated cards
2. **Language Storage**: Selected language saved to `localStorage`
3. **Navigation**: Redirects to `/menu/{langCode}` (e.g., `/menu/en`, `/menu/de`, `/menu/ar`)
4. **Menu Loading**: Fetches corresponding JSON file from `public/menu_{lang}.json`

### Language Implementation:
```typescript
// Language selection handler in Index.tsx
const handleLanguageSelect = (langCode: string) => {
  localStorage.setItem('selectedLanguage', langCode);
  navigate(`/menu/${langCode}`);
};

// Menu data fetching in Menu.tsx
useEffect(() => {
  const fetchMenu = async () => {
    try {
      const response = await fetch(`/menu_${lang}.json`);
      const data = await response.json();
      setMenuData(data);
    } catch (error) {
      console.error('Failed to load menu:', error);
    }
  };
  fetchMenu();
}, [lang]);
```

### RTL Support:
- Arabic language automatically enables RTL layout
- CSS classes and animations adjusted for right-to-left reading
- Navigation and UI elements properly mirrored

---

## 🧩 Animations with Framer Motion

### Animation Structure:
All animations use **spring physics** for natural, bouncy feel:

```typescript
// Container animations with staggered children
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

// Item animations with spring physics
const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 120,
      damping: 12
    }
  },
  hover: {
    scale: 1.02, y: -4,
    transition: { type: "spring" as const, stiffness: 400 }
  }
};
```

### Animation Locations:
- **Landing Page**: Hero section with logo bounce, staggered language cards
- **Menu Page**: Header slide-in, category reveals, item cards with hover effects
- **Interactive Elements**: Button hover/tap effects, cart badge animations
- **Loading States**: Spinning loader with rotation animation

### Key Animation Types:
- **Entrance**: Fade + scale + slide combinations
- **Hover**: Scale up + lift (translate Y)
- **Stagger**: Sequential reveals for lists
- **Spring**: Natural bouncy transitions
- **Loading**: Continuous rotation

---

## 🧠 How to Edit & Add Content

### Adding New Menu Items:
Edit the appropriate `public/menu_{lang}.json` file:

```json
{
  "id": "new-item-id",
  "name": "Item Name",
  "description": "Item description",
  "price": 8.50,
  "popular": true,        // Optional: shows "Popular" badge
  "vegetarian": true,     // Optional: shows "Vegetarian" badge  
  "spicy": true,          // Optional: shows "Spicy" badge
  "image": "https://images.unsplash.com/photo-xxx"
}
```

### Adding New Categories:
Add to the `categories` array in menu JSON:

```json
{
  "id": "new-category",
  "name": "Category Name",
  "items": [
    // ... items array
  ]
}
```

### Adding Translations:
1. **Menu Content**: Update all three menu JSON files (`menu_en.json`, `menu_de.json`, `menu_ar.json`)
2. **UI Text**: Currently hardcoded in components - would need internationalization system
3. **Ensure Consistency**: Keep same item/category IDs across all language files

### Adding Images:
- **Recommended**: Use Unsplash URLs with specific dimensions: `?w=400&h=300&fit=crop`
- **Local Images**: Place in `src/assets/` and import as ES6 modules
- **Format**: JPG/PNG, optimized for web (under 200KB recommended)

---

## 📲 Development & Build Instructions

### Local Development:
```bash
# Install dependencies
npm install

# Start development server
npm run dev
# Opens at http://localhost:5173

# Type checking
npm run build
```

### Build for Production:
```bash
# Build optimized bundle
npm run build

# Preview production build locally
npm run preview
```

### Project Structure Commands:
```bash
# Add new shadcn/ui component
npx shadcn@latest add [component-name]

# Add new dependency
npm install [package-name]

# Update dependencies
npm update
```

### Environment Setup:
- **Node.js**: v16+ required
- **Package Manager**: npm or yarn
- **TypeScript**: Configured for strict mode
- **ESLint**: Configured for React best practices

---

## 💡 Suggested Next Steps

### Immediate Improvements:
1. **🔄 Real-time Updates**: Connect to a CMS or database for dynamic menu updates
2. **🛒 Order System**: Connect cart to actual ordering/payment system
3. **📱 PWA**: Add service worker for offline functionality and app-like experience
4. **🎨 Admin Panel**: Create dashboard for restaurant staff to update menu items
5. **📊 Analytics**: Track popular items and customer behavior

### Technical Enhancements:
1. **🌐 i18n System**: Replace hardcoded text with proper internationalization
2. **⚡ Performance**: Add image optimization and lazy loading
3. **🔍 SEO**: Add meta tags, structured data, and sitemap
4. **🔒 Security**: Add rate limiting and input validation
5. **📱 Native App**: Consider React Native version for app stores

### Business Features:
1. **⏰ Hours & Availability**: Show opening hours and item availability
2. **🏷️ Pricing Tiers**: Support for different pricing (dine-in vs delivery)
3. **👥 Staff Mode**: Special interface for restaurant staff
4. **📞 Contact Integration**: Add click-to-call and location features
5. **🎯 Promotions**: Banner system for daily specials and offers

### Database Integration Options:
- **Firebase**: Easy setup, real-time updates, authentication
- **Supabase**: Open-source alternative with PostgreSQL
- **Headless CMS**: Contentful, Strapi, or Sanity for content management
- **Simple Backend**: Node.js + Express + MongoDB/PostgreSQL

---

## 🚀 Quick Start Commands

```bash
# Clone and setup
git clone [repository-url]
cd berlin-doner-menu
npm install

# Start development
npm run dev

# Add new menu item (edit JSON files)
# Add new component
npx shadcn@latest add [component]

# Build for production
npm run build
```

---

*Last updated: January 2025*  
*Built with ❤️ using React, TypeScript, Tailwind CSS, and Framer Motion*