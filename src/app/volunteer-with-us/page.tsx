"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { BackButton } from "@/components/ui/back-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

const schema = z.object({
  fullName: z.string().min(2, "Name is required"),
  email: z.string().email("Valid professional email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  specializations: z.string().min(1, "Enter at least one specialization"),
  languages: z.string().min(1, "Enter at least one language"),
  experience: z.string().min(1, "Experience or Bar Enrollment is required"),
  bio: z.string().optional(),
  agreedToConduct: z.boolean().refine(val => val === true, {
    message: "You must agree to the confidentiality code of conduct"
  }),
});

export default function VolunteerRegistrationPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [file, setFile] = useState<File | null>(null);
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      agreedToConduct: false,
    }
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    if (!file) {
      setError("Credential proof file is required");
      return;
    }

    try {
      setError("");

      // 1. Upload the file first
      const formData = new FormData();
      formData.append("file", file);
      const uploadRes = await fetch("/api/upload-credential", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) throw new Error("File upload failed");
      const { filename } = await uploadRes.json();

      // 2. Submit the registration
      const registerRes = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: data.fullName,
          email: data.email,
          password: data.password,
          role: "LEGAL_ADVISOR",
          advisorProfile: {
            specialization: data.specializations.split(",").map(s => s.trim()),
            languages: data.languages.split(",").map(s => s.trim()),
            barEnrollment: data.experience,
            credentialProofUrl: filename,
            bio: data.bio || "",
          }
        }),
      });

      if (!registerRes.ok) {
        const err = await registerRes.json();
        throw new Error(err.error || "Registration failed");
      }

      router.push("/dashboard/advisor"); // They will see the pending banner
    } catch (err: any) {
      setError(err.message || "Failed to submit application.");
    }
  };

  return (
    <div className="min-h-[calc(100vh-16rem)] bg-muted/20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <BackButton />
        <Card className="shadow-lg border-border">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold font-serif text-foreground">Volunteer With Us</CardTitle>
            <p className="text-sm text-muted-foreground mt-2 max-w-xl mx-auto">
              Join our network of verified legal professionals providing free guidance to those in need. 
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <Input {...register("fullName")} placeholder="Jane Doe, Esq." />
                  {errors.fullName && <p className="text-destructive text-xs">{errors.fullName.message}</p>}
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Professional Email</label>
                  <Input type="email" {...register("email")} placeholder="jane.doe@lawfirm.com" />
                  <p className="text-xs text-muted-foreground italic">No phone number needed — we never collect it.</p>
                  {errors.email && <p className="text-destructive text-xs">{errors.email.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Account Password</label>
                <Input type="password" {...register("password")} placeholder="********" />
                {errors.password && <p className="text-destructive text-xs">{errors.password.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Specializations (comma separated)</label>
                  <Input {...register("specializations")} placeholder="Housing, Family Law, Immigration" />
                  {errors.specializations && <p className="text-destructive text-xs">{errors.specializations.message}</p>}
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Languages (comma separated)</label>
                  <Input {...register("languages")} placeholder="English, Spanish" />
                  {errors.languages && <p className="text-destructive text-xs">{errors.languages.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Years of Experience / Bar Enrollment #</label>
                <Input {...register("experience")} placeholder="NY Bar #12345 or 5 Years Practice" />
                {errors.experience && <p className="text-destructive text-xs">{errors.experience.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Credential Proof (PDF/Image)</label>
                <div className="mt-1">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="block w-full text-sm text-muted-foreground
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-primary/10 file:text-primary
                      hover:file:bg-primary/20"
                  />
                  <p className="text-xs text-muted-foreground mt-1">This is stored in a private bucket and ONLY accessible by admins for verification.</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Short Bio (Optional)</label>
                <textarea 
                  {...register("bio")}
                  rows={3}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="Tell us a bit about your background..."
                />
              </div>

              <div className="flex items-start space-x-3 bg-muted/30 p-4 rounded-md border border-border">
                <div className="flex items-center h-5">
                  <input
                    id="agreedToConduct"
                    type="checkbox"
                    {...register("agreedToConduct")}
                    className="w-4 h-4 text-primary bg-background border-input rounded"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="agreedToConduct" className="text-sm font-bold text-foreground cursor-pointer">
                    I agree to the Confidentiality Code of Conduct
                  </label>
                  <p className="text-xs text-muted-foreground mt-1">
                    I confirm I am a licensed legal professional and agree to keep all consultation details strictly confidential.
                  </p>
                  {errors.agreedToConduct && <p className="text-destructive text-xs mt-1">{errors.agreedToConduct.message}</p>}
                </div>
              </div>

              {error && <div className="text-destructive text-sm bg-destructive/10 p-3 rounded">{error}</div>}

              <div className="flex justify-end pt-4">
                <Button type="submit" isLoading={isSubmitting} className="w-full sm:w-auto">
                  {isSubmitting ? "Submitting Application..." : "Submit Application"}
                </Button>
              </div>

            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
