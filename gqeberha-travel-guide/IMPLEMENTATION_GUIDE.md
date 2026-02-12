# Next Steps - Implementation Guide

Now that you have the frontend structure set up, here's what to do next:

## 1. Set Up Supabase Database

1. Go to [supabase.com](https://supabase.com) and create a project
2. Copy your project URL and anon key
3. Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key-here
```

4. In Supabase, go to SQL Editor and run the schema from `SUPABASE_SETUP.md`

## 2. Update Component Usage

Replace mock data with real Supabase calls:

### Example: Homepage with Real Data

```typescript
// app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { listingsAPI, blogAPI } from '@/lib/supabase';
import { Listing, BlogPost } from '@/lib/types';

export default function HomePage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [listingsData, postsData] = await Promise.all([
          listingsAPI.getFeaturedListings(5),
          blogAPI.getPosts(3),
        ]);
        setListings(listingsData);
        setPosts(postsData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    // Your JSX here with real data
  );
}
```

## 3. Create Individual Listing Pages

Create a route for individual listings: `app/listings/[slug]/page.tsx`

```typescript
// app/listings/[slug]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { listingsAPI } from '@/lib/supabase';
import { Listing } from '@/lib/types';

export default function ListingPage() {
  const params = useParams();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.slug) {
      listingsAPI.getListingBySlug(params.slug as string)
        .then(setListing)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [params.slug]);

  if (loading) return <div>Loading...</div>;
  if (!listing) return <div>Listing not found</div>;

  return (
    <main>
      <img src={listing.featured_image} alt={listing.title} />
      <h1>{listing.title}</h1>
      <p>{listing.description}</p>
      {/* Add more details here */}
    </main>
  );
}
```

## 4. Create Category Pages

Create `app/categories/[category]/page.tsx` to show listings by category

```typescript
// app/categories/[category]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { listingsAPI } from '@/lib/supabase';
import { ListingCard } from '@/app/components/ListingCard';

export default function CategoryPage() {
  const params = useParams();
  const [listings, setListings] = useState([]);

  useEffect(() => {
    if (params.category) {
      const categoryName = (params.category as string)
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      listingsAPI.getListings(categoryName).then(setListings);
    }
  }, [params.category]);

  return (
    <div>
      <h1>Listings in {params.category}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {listings.map(listing => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </div>
  );
}
```

## 5. Create Blog Pages

Create `app/blog/[slug]/page.tsx` for individual blog posts

```typescript
// app/blog/[slug]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { blogAPI } from '@/lib/supabase';

export default function BlogPostPage() {
  const params = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    if (params.slug) {
      blogAPI.getPostBySlug(params.slug as string).then(setPost);
    }
  }, [params.slug]);

  if (!post) return <div>Loading...</div>;

  return (
    <article className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <p className="text-gray-600">{post.author} • {post.reading_time} min read</p>
      <img src={post.featured_image} alt={post.title} className="my-8" />
      <div className="prose max-w-none">{post.content}</div>
    </article>
  );
}
```

## 6. Add Search Functionality

Create `app/search/page.tsx`

```typescript
// app/search/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { listingsAPI } from '@/lib/supabase';
import { ListingCard } from '@/app/components/ListingCard';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q');
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (q) {
      listingsAPI.searchListings(q).then(setResults);
    }
  }, [q]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">
        Search results for "{q}"
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {results.map(listing => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </div>
  );
}
```

## 7. Add Image Storage

Create a folder structure in Supabase Storage:

1. Go to Supabase Dashboard → Storage
2. Create a bucket called "listings"
3. Make it public
4. Update `lib/supabase.ts` with upload function:

```typescript
export const storageAPI = {
  async uploadImage(file: File, bucket: string = 'listings') {
    const fileName = `${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);

    if (error) throw error;
    
    const { data: publicURL } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);
    
    return publicURL;
  },
};
```

## 8. Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Or push to GitHub and connect to Vercel dashboard
```

## 📝 Current Features Implemented

✅ Modern responsive homepage
✅ Hero section with search
✅ Featured listings grid
✅ Category navigation
✅ Blog section
✅ Beautiful footer
✅ Tailwind CSS styling
✅ Dark mode support
✅ TypeScript types
✅ Supabase integration ready
✅ Reusable components

## 🎯 To-Do Priority List

1. **Connect Supabase** - Set up database and update components
2. **Create listing detail pages** - `app/listings/[slug]/page.tsx`
3. **Create category pages** - `app/categories/[category]/page.tsx`
4. **Create blog pages** - `app/blog/[slug]/page.tsx`
5. **Add search page** - `app/search/page.tsx`
6. **Add image upload** - For admin/content management
7. **Add contact forms** - Enquiry submissions
8. **Add map view** - Interactive map feature (later phase)

## 🚀 Running Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see your site!

---

Need help? Check the component files in `app/components/` and the API functions in `lib/supabase.ts`
