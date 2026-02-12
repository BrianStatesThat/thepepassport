# The PE Passport - Gqeberha Travel Guide

A modern, beautifully designed travel guide for Gqeberha (Port Elizabeth), South Africa. Built with Next.js, Tailwind CSS, and Supabase.

## 🎯 Features

- **Homepage** - Hero section with search, featured listings, categories, and blog section
- **Listings Database** - Curated collection of attractions, restaurants, accommodations, and more
- **Blog Section** - Travel tips, local insights, and itineraries
- **Responsive Design** - Mobile-first approach with beautiful desktop experience
- **Search Functionality** - Find places by name, description, or category
- **Dark Mode** - Beautiful dark theme support

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- A Supabase account (free tier available)

### Installation

1. **Install dependencies**

```bash
npm install
```

2. **Set up Supabase**

   - Create a free account at [supabase.com](https://supabase.com)
   - Create a new project
   - Copy your project URL and anon key

3. **Configure environment variables**

```bash
# Copy the example file
cp .env.example .env.local

# Edit .env.local and add your Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

4. **Set up Supabase database**

   Run the SQL migrations in your Supabase dashboard. See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for the complete database schema.

5. **Start development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

## 📁 Project Structure

```
gqeberha-travel-guide/
├── app/
│   ├── components/           # Reusable React components
│   │   ├── ListingCard.tsx   # Listing display card
│   │   ├── BlogCard.tsx      # Blog post card
│   │   ├── CategoryCard.tsx  # Category navigation card
│   │   └── SearchBar.tsx     # Search input component
│   ├── globals.css          # Global styles and Tailwind imports
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Homepage
├── lib/
│   ├── supabase.ts          # Supabase client and API functions
│   └── types.ts             # TypeScript type definitions
├── public/                  # Static files (images, icons)
├── .env.example             # Environment variables template
├── package.json             # Dependencies
├── tailwind.config.ts       # Tailwind CSS configuration
└── tsconfig.json            # TypeScript configuration
```

## 🎨 Design System

### Colors

- **Primary Blue**: `#1e88e5` - Main brand color for CTAs and highlights
- **Ocean Blue**: `#0d7bb8` - Darker shade for hover states
- **Sunset Orange**: `#fb8c00` - Accent color for featured items
- **Beach Sand**: `#f5f5f0` - Light background accent
- **Dark Gray**: `#333333` - Primary text color

### Typography

- **Headings**: Poppins (Bold, 600-800 weight)
- **Body**: Inter (Regular, 400 weight)

## 🚨 Troubleshooting

### Supabase Connection Issues

1. Verify credentials in `.env.local`
2. Check Supabase project settings
3. Ensure tables exist in database
4. Check browser console for CORS errors

### Build Errors

1. Clear Node modules: `rm -rf node_modules && npm install`
2. Clear Next.js cache: `rm -rf .next`

## 📄 License

This project is proprietary. All rights reserved.

---

**Built with ❤️ for Gqeberha** 🌊

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
