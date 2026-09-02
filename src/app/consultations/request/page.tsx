"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/ui/back-button";
import { useAlertModal } from "@/components/ui/alert-modal";
import { createConsultationRequest } from "../actions";

const formSchema = z.object({
  preferredName: z.string().min(1, "Name is required"),
  contactEmail: z.string().email("Invalid email address"),
  contactPhone: z.string().optional(),
  cityState: z.string().min(1, "City/State is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  languages: z.string().min(1, "Please enter at least one language"),
  requestedLengthMinutes: z.number(),
  slot1: z.string().min(1, "Required"),
  slot2: z.string().min(1, "Required"),
  slot3: z.string().min(1, "Required"),
  urgencyFlag: z.boolean(),
});

export default function RequestConsultationPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showAlert } = useAlertModal();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      preferredName: "",
      contactEmail: "",
      contactPhone: "",
      cityState: "",
      category: "",
      description: "",
      languages: "",
      requestedLengthMinutes: 30,
      slot1: "",
      slot2: "",
      slot3: "",
      urgencyFlag: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      let attachmentUrl = "";
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        
        const res = await fetch("/api/upload-attachment", {
          method: "POST",
          body: formData,
        });
        
        if (res.ok) {
          const data = await res.json();
          attachmentUrl = `/api/attachments/${data.filename}`;
        } else {
          showAlert("Upload Failed", "Failed to upload attachment", "error");
          setIsSubmitting(false);
          return;
        }
      }

      await createConsultationRequest({
        preferredName: values.preferredName,
        contactEmail: values.contactEmail,
        contactPhone: values.contactPhone,
        cityState: values.cityState,
        category: values.category,
        description: values.description,
        languages: values.languages.split(",").map((l) => l.trim()),
        requestedLengthMinutes: values.requestedLengthMinutes,
        preferredSlots: [values.slot1, values.slot2, values.slot3],
        urgencyFlag: values.urgencyFlag,
        attachmentUrl: attachmentUrl || undefined,
      });

      showAlert("Request Submitted!", "Your consultation request has been successfully placed.", "success");
      router.push("/dashboard/client");
    } catch (error) {
      console.error(error);
      showAlert("Error", "Something went wrong while submitting your request.", "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container max-w-2xl mx-auto py-10">
      <BackButton />
      <Card>
        <CardHeader>
          <CardTitle>Request a Consultation</CardTitle>
          <p className="text-sm text-muted-foreground">Fill out the form below to connect with a legal advisor.</p>
        </CardHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Preferred Name</label>
              <Input {...form.register("preferredName")} placeholder="Your Name" />
              {form.formState.errors.preferredName && <p className="text-sm text-red-500">{form.formState.errors.preferredName.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Contact Email</label>
                <Input type="email" {...form.register("contactEmail")} placeholder="email@example.com" />
                {form.formState.errors.contactEmail && <p className="text-sm text-red-500">{form.formState.errors.contactEmail.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Contact Phone (Optional)</label>
                <Input {...form.register("contactPhone")} placeholder="(123) 456-7890" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">City/State</label>
                <Input {...form.register("cityState")} placeholder="New York, NY" />
                {form.formState.errors.cityState && <p className="text-sm text-red-500">{form.formState.errors.cityState.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Input {...form.register("category")} placeholder="e.g. Housing, Immigration" />
                {form.formState.errors.category && <p className="text-sm text-red-500">{form.formState.errors.category.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description of your situation</label>
              <textarea 
                className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                {...form.register("description")} 
                placeholder="Please describe your legal issue..."
              />
              {form.formState.errors.description && <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Languages (comma separated)</label>
              <Input {...form.register("languages")} placeholder="English, Spanish" />
              {form.formState.errors.languages && <p className="text-sm text-red-500">{form.formState.errors.languages.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Requested Length (minutes)</label>
              <div className="flex gap-2">
                {[15, 30, 45, 60].map((length) => (
                  <Button
                    key={length}
                    type="button"
                    variant={form.watch("requestedLengthMinutes") === length ? "default" : "outline"}
                    onClick={() => form.setValue("requestedLengthMinutes", length)}
                  >
                    {length} min
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Preferred Slots (Provide 3)</label>
              <div className="grid gap-2">
                <Input type="datetime-local" {...form.register("slot1")} />
                {form.formState.errors.slot1 && <p className="text-sm text-red-500">{form.formState.errors.slot1.message}</p>}
                
                <Input type="datetime-local" {...form.register("slot2")} />
                {form.formState.errors.slot2 && <p className="text-sm text-red-500">{form.formState.errors.slot2.message}</p>}
                
                <Input type="datetime-local" {...form.register("slot3")} />
                {form.formState.errors.slot3 && <p className="text-sm text-red-500">{form.formState.errors.slot3.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <input type="checkbox" {...form.register("urgencyFlag")} className="rounded border-gray-300" />
                Flag as urgent?
              </label>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Attachment (Optional)</label>
              <Input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            </div>

            <div className="pt-4 flex items-center p-6 bg-transparent">
              <Button type="submit" isLoading={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </Button>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
