"use server";

import { addListingAPI } from "@/lib/supabase";
import type { AddListingInput, ListingSubmission } from "@/lib/types";

export async function submitListingAction(
  formData: FormData
): Promise<{ success: boolean; submission_id?: string; error?: string }> {
  try {
    // Extract form data - all fields are strings except files
    const title = String(formData.get("title") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const long_description = String(formData.get("long_description") || "").trim();
    
    let categories: string[] = [];
    try {
      categories = JSON.parse(String(formData.get("categories") || "[]"));
    } catch {
      categories = [];
    }

    let location: any = {
      address: "",
      lat: 0,
      lng: 0,
      area: ""
    };
    try {
      location = JSON.parse(String(formData.get("location") || "{}"));
    } catch {
      location = { address: "", lat: 0, lng: 0, area: "" };
    }

    let contact: any = {};
    try {
      contact = JSON.parse(String(formData.get("contact") || "{}"));
    } catch {
      contact = {};
    }

    const price_range = (String(formData.get("price_range") || "$")) as "$" | "$$" | "$$$" | "$$$$";
    const opening_hours = String(formData.get("opening_hours") || "").trim();

    let features: string[] = [];
    try {
      features = JSON.parse(String(formData.get("features") || "[]"));
    } catch {
      features = [];
    }

    const submitter_name = String(formData.get("submitter_name") || "").trim();
    const submitter_email = String(formData.get("submitter_email") || "").trim();
    const submitter_phone = String(formData.get("submitter_phone") || "").trim();

    // Handle images
    const images: File[] = [];
    try {
      for (let i = 0; i < 100; i++) {
        const imageKey = `image_${i}`;
        if (!formData.has(imageKey)) continue;

        const image = formData.get(imageKey);
        if (image instanceof File && image.size > 0) {
          images.push(image);
        }
      }
    } catch (err) {
      console.error("Error processing images:", err);
    }

    const input: AddListingInput = {
      title,
      description,
      long_description,
      categories,
      location,
      contact,
      price_range,
      opening_hours,
      features,
      submitter_name,
      submitter_email,
      submitter_phone,
      images: images.length > 0 ? images : undefined
    };

    const result = await addListingAPI.submitListing(input);

    if (result.success) {
      return { success: true, submission_id: result.submission_id };
    } else {
      return { success: false, error: result.error || "Submission failed" };
    }
  } catch (err: any) {
    console.error("Submit listing error:", err);
    return { success: false, error: String(err?.message || "An unexpected error occurred") };
  }
}

export async function getPendingSubmissionsAction(): Promise<ListingSubmission[]> {
  try {
    const data = await addListingAPI.getPendingSubmissions();
    return data;
  } catch (err: any) {
    console.error("Get pending submissions error:", err);
    throw new Error(err.message || "Failed to load submissions");
  }
}

export async function approveSubmissionAction(submissionId: string) {
  try {
    const result = await addListingAPI.approveSubmission(submissionId);
    if (result.success) {
      return { success: true };
    } else {
      return { success: false, error: result.error || "Failed to approve submission" };
    }
  } catch (err: any) {
    console.error("Approve submission error:", err);
    return { success: false, error: err.message || "An unexpected error occurred" };
  }
}

export async function rejectSubmissionAction(submissionId: string, reason: string) {
  try {
    const result = await addListingAPI.rejectSubmission(submissionId, reason);
    if (result.success) {
      return { success: true };
    } else {
      return { success: false, error: result.error || "Failed to reject submission" };
    }
  } catch (err: any) {
    console.error("Reject submission error:", err);
    return { success: false, error: err.message || "An unexpected error occurred" };
  }
}