# Add Listing Feature

This document explains the new add listing feature that allows users to submit business listings for review before publication.

## Overview

The add listing feature consists of:
1. **Public submission form** (`/add-listing`) - Allows users to submit listings
2. **Admin review system** (`/admin`) - Allows administrators to approve/reject submissions
3. **Database integration** - Stores submissions and creates approved listings with images

## Database Schema

### listing_submissions table
```sql
create table public.listing_submissions (
  id uuid not null default gen_random_uuid (),
  listing_data jsonb not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  submitted_by jsonb not null,
  reviewed_by text null,
  reviewed_at timestamp with time zone null,
  rejection_reason text null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint listing_submissions_pkey primary key (id)
) tablespace pg_default;
```

### listing_images table (already exists)
```sql
create table public.listing_images (
  id uuid not null default gen_random_uuid (),
  listing_id uuid null,
  storage_path text not null,
  public_url text not null,
  caption text null,
  mime_type text null,
  width integer null,
  height integer null,
  is_primary boolean null default false,
  created_at timestamp with time zone null default now(),
  constraint listing_images_pkey primary key (id),
  constraint listing_images_listing_id_fkey foreign KEY (listing_id) references listings (id) on delete CASCADE
) TABLESPACE pg_default;
```

## Setup Instructions

1. **Run the database migration**:
   ```sql
   -- Execute the contents of LISTING_SUBMISSIONS_SCHEMA.sql in your Supabase SQL editor
   ```

2. **Configure Supabase Storage**:
   - Ensure the `travelimages` bucket exists and is public
   - Set up proper RLS policies for the bucket

3. **Environment Variables**:
   - Ensure `NEXT_PUBLIC_SUPABASE_LISTINGS_BUCKET` is set to your bucket name (default: `travelimages`)

## Usage

### For Users
1. Navigate to `/add-listing`
2. Fill out the comprehensive form with business details
3. Upload up to 10 images
4. Submit for review
5. Wait for admin approval

### For Administrators
1. Navigate to `/admin`
2. Review pending submissions
3. Approve or reject listings
4. Approved listings are automatically published with images moved to permanent storage

## API Functions

### Submit Listing
```typescript
await addListingAPI.submitListing(input: AddListingInput)
```

### Get Pending Submissions (Admin)
```typescript
await addListingAPI.getPendingSubmissions(): Promise<ListingSubmission[]>
```

### Approve Submission (Admin)
```typescript
await addListingAPI.approveSubmission(submissionId: string, adminId?: string)
```

### Reject Submission (Admin)
```typescript
await addListingAPI.rejectSubmission(submissionId: string, reason: string, adminId?: string)
```

## Image Upload Process

1. **Temporary Upload**: Images are uploaded to `temp/` folder during submission
2. **Approval Process**: Upon approval, images are moved to `listings/{listingId}/` folder
3. **Database Records**: `listing_images` records are created with proper relationships
4. **Cleanup**: Rejected submissions have their images deleted

## Security Considerations

- **Row Level Security (RLS)**: Implemented on `listing_submissions` table
- **Admin Access**: Admin routes should be protected with authentication
- **File Validation**: Images are validated for type and size
- **Input Sanitization**: All user inputs are sanitized

## Future Enhancements

- Email notifications for submission status
- Bulk approval/rejection
- Advanced image editing (crop, resize)
- Duplicate detection
- Integration with Google Maps for address validation
- Featured listing requests