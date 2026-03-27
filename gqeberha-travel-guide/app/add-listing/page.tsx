'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { submitListingAction } from '@/app/actions/add-listing';
import { Header } from '@/app/components/Header';
import { Footer } from '@/app/components/Footer';
import type { AddListingInput } from '@/lib/types';

export default function AddListingPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState<AddListingInput>({
    title: '',
    description: '',
    long_description: '',
    categories: [],
    location: {
      address: '',
      lat: 0,
      lng: 0,
      area: ''
    },
    contact: {
      phone: '',
      email: '',
      website: ''
    },
    price_range: '$',
    opening_hours: '',
    features: [],
    submitter_name: '',
    submitter_email: '',
    submitter_phone: ''
  });

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof AddListingInput] as object),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 10) {
      alert('Maximum 10 images allowed');
      return;
    }

    setImages(prev => [...prev, ...files]);

    // Create previews
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImagePreviews(prev => [...prev, e.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      // Validate required fields
      if (!formData.title.trim()) {
        throw new Error('Business name is required');
      }
      if (!formData.description.trim()) {
        throw new Error('Short description is required');
      }
      if (!formData.location.address.trim()) {
        throw new Error('Address is required');
      }
      if (!formData.submitter_name.trim()) {
        throw new Error('Your name is required');
      }
      if (!formData.submitter_email.trim()) {
        throw new Error('Your email is required');
      }

      // Create FormData for the server action
      const formDataToSubmit = new FormData();

      // Add basic fields
      formDataToSubmit.append('title', formData.title.trim());
      formDataToSubmit.append('description', formData.description.trim());
      formDataToSubmit.append('long_description', formData.long_description?.trim() || '');
      formDataToSubmit.append('categories', JSON.stringify(formData.categories));
      formDataToSubmit.append('location', JSON.stringify(formData.location));
      formDataToSubmit.append('contact', JSON.stringify(formData.contact));
      formDataToSubmit.append('price_range', formData.price_range || '$');
      formDataToSubmit.append('opening_hours', formData.opening_hours?.trim() || '');
      formDataToSubmit.append('features', JSON.stringify(formData.features));
      formDataToSubmit.append('submitter_name', formData.submitter_name.trim());
      formDataToSubmit.append('submitter_email', formData.submitter_email.trim());
      formDataToSubmit.append('submitter_phone', formData.submitter_phone?.trim() || '');

      // Add images
      if (images.length > 0) {
        images.forEach((image, index) => {
          formDataToSubmit.append(`image_${index}`, image);
        });
      }

      const result = await submitListingAction(formDataToSubmit);

      if (result.success) {
        setSubmitMessage({
          type: 'success',
          text: 'Your listing has been submitted for review! We will contact you once it has been approved.'
        });

        // Reset form
        setFormData({
          title: '',
          description: '',
          long_description: '',
          categories: [],
          location: {
            address: '',
            lat: 0,
            lng: 0,
            area: ''
          },
          contact: {
            phone: '',
            email: '',
            website: ''
          },
          price_range: '$',
          opening_hours: '',
          features: [],
          submitter_name: '',
          submitter_email: '',
          submitter_phone: ''
        });
        setImages([]);
        setImagePreviews([]);
      } else {
        setSubmitMessage({
          type: 'error',
          text: result.error || 'Failed to submit listing'
        });
      }
    } catch (error: any) {
      console.error('Form submission error:', error);
      setSubmitMessage({
        type: 'error',
        text: error?.message || 'An unexpected error occurred. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-dark-gray dark:text-white mb-2">Add Your Business Listing</h1>
          <p className="text-gray-600 dark:text-slate-300">
            Fill out the form below to submit your business for inclusion in our directory.
            All submissions are reviewed before being published.
          </p>
        </div>

        {submitMessage && (
          <div className={`mb-6 p-4 rounded-xl ${
            submitMessage.type === 'success'
              ? 'bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300'
              : 'bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300'
          }`}>
            {submitMessage.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="bg-gray-50 dark:bg-slate-900/40 border border-gray-200 dark:border-slate-800 p-6 rounded-xl">
              <h2 className="text-xl font-semibold text-dark-gray dark:text-white mb-4">Basic Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-dark-gray dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    placeholder="Enter your business name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Category *
                  </label>
                  <select
                    required
                    value={formData.categories[0] || ''}
                    onChange={(e) => handleInputChange('categories', [e.target.value])}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-dark-gray dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  >
                    <option value="">Select a category</option>
                    <option value="Restaurants">Restaurants</option>
                    <option value="Hotels">Hotels</option>
                    <option value="Attractions">Attractions</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Services">Services</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Short Description *
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-dark-gray dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  placeholder="Brief description of your business (max 200 characters)"
                  maxLength={200}
                />
                <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                  {formData.description.length}/200 characters
                </p>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Detailed Description
                </label>
                <textarea
                  value={formData.long_description}
                  onChange={(e) => handleInputChange('long_description', e.target.value)}
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-dark-gray dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  placeholder="Detailed description of your business, services, and what makes you special"
                />
              </div>
            </div>

            {/* Location */}
            <div className="bg-gray-50 dark:bg-slate-900/40 border border-gray-200 dark:border-slate-800 p-6 rounded-xl">
              <h2 className="text-xl font-semibold text-dark-gray dark:text-white mb-4">Location</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location.address}
                    onChange={(e) => handleInputChange('location.address', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-dark-gray dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    placeholder="Full address"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                      Area/Region
                    </label>
                    <input
                      type="text"
                      value={formData.location.area}
                      onChange={(e) => handleInputChange('location.area', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-dark-gray dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                      placeholder="e.g., Gqeberha Central"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                      Latitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={formData.location.lat || ''}
                      onChange={(e) => handleInputChange('location.lat', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-dark-gray dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                      placeholder="-33.9586"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                      Longitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={formData.location.lng || ''}
                      onChange={(e) => handleInputChange('location.lng', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-dark-gray dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                      placeholder="25.6022"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-gray-50 dark:bg-slate-900/40 border border-gray-200 dark:border-slate-800 p-6 rounded-xl">
              <h2 className="text-xl font-semibold text-dark-gray dark:text-white mb-4">Contact Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.contact?.phone || ''}
                    onChange={(e) => handleInputChange('contact.phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-dark-gray dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    placeholder="+27 XX XXX XXXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.contact?.email || ''}
                    onChange={(e) => handleInputChange('contact.email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-dark-gray dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    placeholder="contact@business.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    value={formData.contact?.website || ''}
                    onChange={(e) => handleInputChange('contact.website', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-dark-gray dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    placeholder="https://www.business.com"
                  />
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div className="bg-gray-50 dark:bg-slate-900/40 border border-gray-200 dark:border-slate-800 p-6 rounded-xl">
              <h2 className="text-xl font-semibold text-dark-gray dark:text-white mb-4">Additional Details</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Price Range
                  </label>
                  <select
                    value={formData.price_range}
                    onChange={(e) => handleInputChange('price_range', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-dark-gray dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  >
                    <option value="$">$ - Budget friendly</option>
                    <option value="$$">$$ - Moderate</option>
                    <option value="$$$">$$$ - Expensive</option>
                    <option value="$$$$">$$$$ - Very expensive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Opening Hours
                  </label>
                  <input
                    type="text"
                    value={formData.opening_hours}
                    onChange={(e) => handleInputChange('opening_hours', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-dark-gray dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    placeholder="e.g., Mon-Fri 9AM-6PM, Sat 9AM-4PM"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Features/Amenities
                </label>
                <input
                  type="text"
                  value={formData.features?.join(', ') || ''}
                  onChange={(e) => handleInputChange('features', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-dark-gray dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  placeholder="WiFi, Parking, Takeout, Delivery (comma separated)"
                />
              </div>
            </div>

            {/* Images */}
            <div className="bg-gray-50 dark:bg-slate-900/40 border border-gray-200 dark:border-slate-800 p-6 rounded-xl">
              <h2 className="text-xl font-semibold text-dark-gray dark:text-white mb-4">Images</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Upload Images (Max 10, JPG/PNG)
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-dark-gray dark:text-white file:bg-blue-600 file:text-white file:border-0 file:rounded file:px-3 file:py-1 file:cursor-pointer hover:file:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                />
                <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                  Upload high-quality images of your business. First image will be the main image.
                </p>
              </div>

              {imagePreviews.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm transition"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submitter Information */}
            <div className="bg-gray-50 dark:bg-slate-900/40 border border-gray-200 dark:border-slate-800 p-6 rounded-xl">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Your Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.submitter_name}
                    onChange={(e) => handleInputChange('submitter_name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Your Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.submitter_email}
                    onChange={(e) => handleInputChange('submitter_email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Your Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.submitter_phone}
                    onChange={(e) => handleInputChange('submitter_phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+27 XX XXX XXXX"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Listing'}
              </button>
            </div>
            </form>
      </main>
      <Footer />
    </div>
  );
}