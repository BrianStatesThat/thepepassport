# Supabase Setup Guide

This document contains the SQL schema and setup instructions for the PE Passport database.

## Overview

The database consists of the following main tables:

1. **listings** - Places, attractions, restaurants, hotels
2. **blog_posts** - Travel guides and blog articles
3. **categories** - Content categories (Things to Do, Eat, etc.)
4. **enquiries** - Contact form submissions
5. **listing_suggestions** - User-submitted place suggestions

## Database Schema

### 1. Categories Table

```sql
CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(100) NOT NULL UNIQUE,
  slug varchar(100) NOT NULL UNIQUE,
  description text,
  icon varchar(50),
  color varchar(20),
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);
```

### 2. Listings Table

```sql
CREATE TABLE listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug varchar(255) NOT NULL UNIQUE,
  title varchar(255) NOT NULL,
  description text NOT NULL,
  long_description text,
  categories text[] NOT NULL,
  images text[] NOT NULL,
  featured_image text NOT NULL,
  
  -- Location
  location jsonb NOT NULL, -- {address, lat, lng, area}
  
  -- Contact
  contact jsonb, -- {phone, email, website}
  
  -- Additional info
  price_range varchar(10),
  opening_hours text,
  features text[],
  
  -- Metadata
  verified boolean DEFAULT false,
  featured boolean DEFAULT false,
  status varchar(20) DEFAULT 'published',
  rating numeric(3, 2),
  review_count integer DEFAULT 0,
  
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX idx_listings_status ON listings(status);
CREATE INDEX idx_listings_categories ON listings USING GIN(categories);
CREATE INDEX idx_listings_featured ON listings(featured) WHERE status = 'published';
```

### 3. Blog Posts Table

```sql
CREATE TABLE blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug varchar(255) NOT NULL UNIQUE,
  title varchar(255) NOT NULL,
  excerpt text NOT NULL,
  content text NOT NULL,
  featured_image text,
  
  published_at timestamp DEFAULT now(),
  published boolean DEFAULT false,
  author varchar(255),
  reading_time integer,
  
  tags text[],
  related_listings uuid[],
  
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

CREATE INDEX idx_blog_posts_published ON blog_posts(published);
CREATE INDEX idx_blog_posts_published_at ON blog_posts(published_at);
```

### 4. Enquiries Table

```sql
CREATE TABLE enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(255) NOT NULL,
  email varchar(255) NOT NULL,
  phone varchar(20),
  message text NOT NULL,
  listing_id uuid REFERENCES listings(id) ON DELETE SET NULL,
  
  status varchar(20) DEFAULT 'new',
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

CREATE INDEX idx_enquiries_status ON enquiries(status);
CREATE INDEX idx_enquiries_listing_id ON enquiries(listing_id);
```

### 5. Listing Suggestions Table

```sql
CREATE TABLE listing_suggestions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(255) NOT NULL,
  email varchar(255) NOT NULL,
  place_name varchar(255) NOT NULL,
  place_description text NOT NULL,
  category varchar(100) NOT NULL,
  address text,
  
  status varchar(20) DEFAULT 'pending',
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

CREATE INDEX idx_suggestions_status ON listing_suggestions(status);
```

## Setup Steps

1. **Create Database Tables**

   Copy and run all SQL schema above in your Supabase SQL editor

2. **Enable Row Level Security (Optional)**

   For a public travel guide, you can keep RLS disabled. But if you add admin features later:

   ```sql
   ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
   ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
   
   -- Allow public read-only access to published content
   CREATE POLICY "Public can read published listings"
   ON listings FOR SELECT
   USING (status = 'published');
   ```

3. **Insert Sample Data**

   ```sql
   -- Add categories
   INSERT INTO categories (name, slug, description, color) VALUES
   ('Things to Do', 'things-to-do', 'Activities and attractions', 'bg-blue-500'),
   ('Restaurants', 'restaurants', 'Dining and cuisine', 'bg-orange-500'),
   ('Accommodation', 'accommodation', 'Hotels and stays', 'bg-teal-500'),
   ('Beaches', 'beaches', 'Beach spots', 'bg-cyan-500'),
   ('Shopping', 'shopping', 'Retail and markets', 'bg-purple-500'),
   ('Cultural', 'cultural', 'Arts and culture', 'bg-pink-500');
   
   -- Add a sample listing
   INSERT INTO listings (
     slug,
     title,
     description,
     categories,
     images,
     featured_image,
     location,
     status,
     featured,
     contact
   ) VALUES (
     'sardinia-bay-beach',
     'Sardinia Bay Beach',
     'A pristine, wide sandy beach perfect for sunset walks and swimming.',
     ARRAY['Beaches'],
     ARRAY['https://example.com/image1.jpg'],
     'https://example.com/image1.jpg',
     jsonb_build_object(
       'address', '123 Beach Road, Gqeberha',
       'lat', -34.0356,
       'lng', 25.6528,
       'area', 'Sardinia Bay'
     ),
     'published',
     true,
     jsonb_build_object(
       'phone', '+27 41 583 2111',
       'website', 'https://example.com'
     )
   );
   ```

4. **Add Storage for Images (Optional)**

   Create a storage bucket for listing images:

   ```sql
   -- In Supabase Dashboard: Storage > Create new bucket
   -- Bucket name: listings
   -- Make it public
   ```

## PostGIS Setup (Advanced)

For location-based queries, enable PostGIS extension:

```sql
-- Enable the PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Add geography column to listings
ALTER TABLE listings 
ADD COLUMN geography geography(POINT, 4326) 
GENERATED ALWAYS AS (
  ST_AsText(ST_GeogFromText('SRID=4326;POINT(' || 
    (location->>'lng')::float || ' ' || 
    (location->>'lat')::float || ')'))
) STORED;

-- Create function for nearby listings
CREATE OR REPLACE FUNCTION nearby_listings(
  lat float8,
  lng float8,
  radius_km float8 DEFAULT 5
)
RETURNS TABLE (
  id uuid,
  title varchar,
  description text,
  distance_km float8
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    l.id,
    l.title,
    l.description,
    ST_DistanceSphere(
      ST_GeomFromText('POINT(' || lng || ' ' || lat || ')', 4326),
      ST_GeomFromText('POINT(' || (l.location->>'lng')::float || ' ' || (l.location->>'lat')::float || ')', 4326)
    ) / 1000 AS distance_km
  FROM listings l
  WHERE l.status = 'published'
  AND ST_DWithin(
    geography(ST_GeomFromText('POINT(' || lng || ' ' || lat || ')', 4326)),
    st_geogfromtext('SRID=4326;POINT(' || (l.location->>'lng')::float || ' ' || (l.location->>'lat')::float || ')'),
    radius_km * 1000
  )
  ORDER BY distance_km;
END;
$$ LANGUAGE plpgsql;
```

## Data Seeding

For quick setup, you can seed the database with Gqeberha attractions using the [data/seed.sql](./data/seed.sql) file.

## Backup & Recovery

Regular backups are automatically created by Supabase. Access them in:
Dashboard > Database > Backups

To restore:
1. Go to Backups
2. Select a backup point
3. Click "Restore"

## Security Notes

1. **Row Level Security**: Enable for admin features
2. **API Keys**: Keep `anon` key safe. Service role key is secret-only
3. **CORS**: Configure allowed origins in Supabase settings
4. **Rate Limiting**: Implement on backend for production (see Vercel docs)

---

Need help? Check Supabase docs: https://supabase.com/docs
