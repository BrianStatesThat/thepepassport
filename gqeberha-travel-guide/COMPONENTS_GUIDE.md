# Component Structure & Usage Guide

## 🏗️ Refactored Architecture

Your homepage has been refactored into clean, reusable components for maximum maintainability and scalability. Here's the new structure:

### Component Hierarchy

```
HomePage (app/page.tsx)
├── Header
│   └── Logo + Navigation
├── Hero
│   ├── Title
│   ├── Subtitle
│   └── SearchBar
├── Main Content Area
│   ├── DiscoverSection
│   │   └── Multiple ListingCards
│   ├── CategoryNavigation
│   │   └── Multiple CategoryCards
│   └── BlogSection
│       └── Multiple BlogCards
└── Footer
    ├── Brand Info
    ├── Quick Links
    ├── Social Links
    └── Newsletter Signup
```

## 📦 Available Components

### 1. **Header** (`app/components/Header.tsx`)
Sticky navigation bar with logo and menu.

```tsx
import { Header } from "@/app/components/Header";

<Header />
```

**Customization:**
- Nav links are hard-coded in the component
- Update the `Link` hrefs to point to your routes

---

### 2. **Hero** (`app/components/Hero.tsx`)
Full-width hero section with gradient background and optional search bar.

```tsx
import { Hero } from "@/app/components/Hero";

<Hero 
  title="Custom Title"
  subtitle="Custom subtitle"
  showSearch={true}
/>
```

**Props:**
- `title` (string) - Hero heading
- `subtitle` (string) - Hero description
- `showSearch` (boolean) - Show/hide search bar

---

### 3. **DiscoverSection** (`app/components/DiscoverSection.tsx`)
Grid of featured listings with images and metadata.

```tsx
import { DiscoverSection } from "@/app/components/DiscoverSection";

<DiscoverSection 
  title="Featured Places"
  subtitle="Check these out"
  listings={customListingsArray}
/>
```

**Props:**
- `title` (string) - Section title
- `subtitle` (string) - Section description
- `listings` (array) - Array of listing objects (uses defaults if not provided)

**Listing Object Shape:**
```typescript
{
  id: number;
  title: string;
  category: string;
  image?: string;
  description: string;
  localTip?: boolean;
}
```

---

### 4. **CategoryNavigation** (`app/components/CategoryNavigation.tsx`)
Grid of category cards for quick navigation.

```tsx
import { CategoryNavigation } from "@/app/components/CategoryNavigation";

<CategoryNavigation 
  title="Browse by Category"
  categories={customCategories}
  onCategoryClick={(category) => navigate(`/category/${category}`)}
/>
```

**Props:**
- `title` (string) - Section title
- `categories` (array) - Array of category objects
- `onCategoryClick` (function) - Callback when category is clicked

**Category Object Shape:**
```typescript
{
  name: string;
  icon: React.ReactNode;
  color: string;  // Tailwind class like "bg-blue-500"
  count?: number; // Optional item count
}
```

---

### 5. **BlogSection** (`app/components/BlogSection.tsx`)
Grid of blog post preview cards with metadata.

```tsx
import { BlogSection } from "@/app/components/BlogSection";

<BlogSection 
  title="Latest Articles"
  subtitle="Read our guides"
  posts={customPosts}
  onPostClick={(postId) => navigate(`/blog/${postId}`)}
/>
```

**Props:**
- `title` (string) - Section title
- `subtitle` (string) - Section description
- `posts` (array) - Array of blog post objects
- `onPostClick` (function) - Callback when post is clicked

**Blog Post Object Shape:**
```typescript
{
  id: number;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  featured_image?: string;
}
```

---

### 6. **Footer** (`app/components/Footer.tsx`)
Multi-section footer with CTA, links, and newsletter signup.

```tsx
import { Footer } from "@/app/components/Footer";

<Footer 
  brandName="My Travel Site"
  brandTagline="Explore the world"
  quickLinks={customLinks}
  showNewsletter={true}
  copyrightYear={2025}
  companyName="Travel Co"
/>
```

**Props:**
- `brandName` (string) - Brand name to display
- `brandTagline` (string) - Tagline under brand name
- `quickLinks` (array) - Array of link objects
- `showNewsletter` (boolean) - Show/hide newsletter section
- `copyrightYear` (number) - Copyright year
- `companyName` (string) - Company name for copyright

**Link Object Shape:**
```typescript
{
  label: string;
  href: string;
}
```

---

## 🎨 Nested Components (Used by Above)

### **ListingCard** (`app/components/ListingCard.tsx`)
Individual listing display card. Used by `DiscoverSection`.

```tsx
import { ListingCard } from "@/app/components/ListingCard";

<ListingCard listing={listingObject} />
```

### **CategoryCard** (`app/components/CategoryCard.tsx`)
Individual category navigation card. Used by `CategoryNavigation`.

```tsx
import { CategoryCard } from "@/app/components/CategoryCard";

<CategoryCard 
  name="Beaches"
  icon={<Compass />}
  color="bg-blue-500"
  onClick={() => {}}
/>
```

### **BlogCard** (`app/components/BlogCard.tsx`)
Individual blog post card. Used by `BlogSection`.

```tsx
import { BlogCard } from "@/app/components/BlogCard";

<BlogCard post={blogPostObject} onClick={() => {}} />
```

### **SearchBar** (`app/components/SearchBar.tsx`)
Search input component. Used by `Hero`.

```tsx
import { SearchBar } from "@/app/components/SearchBar";

<SearchBar 
  placeholder="Custom placeholder"
  onSearch={(query) => console.log(query)}
  onSubmit={(query) => handleSearch(query)}
/>
```

---

## 🚀 How to Use Components in Other Pages

### Example: Create a category listing page

```tsx
// app/categories/[category]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/app/components/Header';
import { MobileMenu } from '@/app/components/MobileMenu';
import { DiscoverSection } from '@/app/components/DiscoverSection';
import { Footer } from '@/app/components/Footer';
import { listingsAPI } from '@/lib/supabase';

export default function CategoryPage({ params }) {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    // Fetch listings from Supabase
    listingsAPI.getListings(params.category).then(setListings);
  }, [params.category]);

  return (
    <div>
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-12">
        <DiscoverSection 
          title={`${params.category} in Gqeberha`}
          listings={listings} 
        />
      </main>
      <Footer />
    </div>
  );
}
```

### Example: Create a blog page

```tsx
// app/blog/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/app/components/Header';
import { BlogSection } from '@/app/components/BlogSection';
import { Footer } from '@/app/components/Footer';
import { blogAPI } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    blogAPI.getPosts(12).then(setPosts);
  }, []);

  return (
    <div>
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-12">
        <BlogSection 
          posts={posts}
          onPostClick={(postId) => router.push(`/blog/${postId}`)}
        />
      </main>
      <Footer />
    </div>
  );
}
```

---

## ✅ Best Practices

1. **Data Props**: Pass data through props, not hard-code it
   ```tsx
   // ✅ Good
   <DiscoverSection listings={data} />

   // ❌ Avoid
   <DiscoverSection listings={[{...}, {...}]} />
   ```

2. **Callbacks**: Use callback functions for actions
   ```tsx
   // ✅ Good
   <BlogSection onPostClick={(id) => handleClick(id)} />

   // ❌ Avoid - Navigate directly inside component
   ```

3. **Default Data**: Components have sensible defaults
   ```tsx
   // ✅ Works - uses defaults
   <Hero />

   // ✅ Also works - overrides defaults
   <Hero title="Custom" />
   ```

4. **Optional Props**: Check if prop exists before using
   ```tsx
   // Components handle undefined props gracefully
   <BlogCard post={post} onClick={onPostClick} />
   ```

5. **Composition**: Combine components for complex layouts
   ```tsx
   <>
     <Header />
     <Hero />
     <DiscoverSection />
     <CategoryNavigation />
     <BlogSection />
     <Footer />
   </>
   ```

---

## 🔧 Extending Components

### Add a new section variant

```tsx
// Create a new component in app/components/
import { Hero } from '@/app/components/Hero';

export function ThinHero(props) {
  return <Hero {...props} />;
  // Customize as needed
}
```

### Add interactivity

```tsx
<DiscoverSection 
  onListingClick={(listing) => {
    openModal(listing);
  }}
/>
```

---

## 📝 Current Status

- ✅ **Homepage**: Uses all 6 main components
- ✅ **Modular**: Each component can be used individually
- ✅ **Props-based**: Configuration through props
- ✅ **Dark Mode**: Built-in dark mode support
- ✅ **Responsive**: Mobile-first responsive design
- ✅ **Type Safe**: Full TypeScript support (when needed)

---

## 🎯 Next Steps

1. **Connect Supabase** - Replace mock data with real data
2. **Add Callbacks** - Make components interactive
3. **Create Pages** - Use components on category/blog pages
4. **Add Animations** - Enhance with transitions
5. **A/B Testing** - Create component variants

Enjoy your modular, maintainable frontend! 🚀
