"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createUserProfile } from "@/app/onboarding/onboarding-1-input/actions";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  username: z
    .string()
    .min(2, "Username must be at least 2 characters")
    .optional()
    .or(z.literal("")),
  profileUrl: z.string().url("Please enter a valid URL (include https://)"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

type UserFormData = z.infer<typeof formSchema>;

export default function UserProfileForm() {
  const router = useRouter();
  const [userExists, setUserExists] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UserFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      username: "",
      profileUrl: "",
      password: "",
    },
  });

  const profileUrlValue = watch("profileUrl");
  const emailValue = watch("email");

  // Load saved Instagram URL and email from localStorage on mount
  useEffect(() => {
    const savedInstagramUrl = localStorage.getItem("instagramUrl");
    const savedEmail = localStorage.getItem("userEmail");

    if (savedInstagramUrl) {
      setValue("profileUrl", savedInstagramUrl, {
        shouldValidate: true,
      });
    }

    if (savedEmail) {
      setValue("email", savedEmail, {
        shouldValidate: true,
      });
    }
  }, [setValue]);

  // Save email to localStorage
  useEffect(() => {
    if (emailValue) {
      localStorage.setItem("userEmail", emailValue);
    }
  }, [emailValue]);

  // Extract username from Instagram URL and save to localStorage
  useEffect(() => {
    if (!profileUrlValue) return;

    localStorage.setItem("instagramUrl", profileUrlValue);

    const match = profileUrlValue.match(/instagram\.com\/([^/?#&]+)/);

    if (match && match[1]) {
      const extractedUsername = match[1];

      setValue("username", extractedUsername, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [profileUrlValue, setValue]);

  const onSubmit = async (data: UserFormData) => {
    try {
      const result = await createUserProfile(data);

      if (result.userExists) {
        setUserExists(true);
        toast.info("User account already exists. Proceeding to next step.");

        // Redirect to onboarding-2-select after 1 second
        setTimeout(() => {
          const instagramUrl = localStorage.getItem("instagramUrl") || "";
          router.push(
            `/onboarding/onboarding-2-select?userId=${
              result.userId
            }&instagramUrl=${encodeURIComponent(instagramUrl)}`
          );
        }, 1000);
      } else if (result.success && result.user) {
        toast.success(result.message);
        console.log("User created successfully:", result.user);
        reset();

        // Redirect to onboarding-2-select after success
        setTimeout(() => {
          const instagramUrl = localStorage.getItem("instagramUrl") || "";
          router.push(
            `/onboarding/onboarding-2-select?userId=${
              result.user.id
            }&instagramUrl=${encodeURIComponent(instagramUrl)}`
          );
        }, 500);
      } else {
        toast.error(result.message);
        console.error("Error creating user:", result.error);
      }
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "An unexpected error occurred";
      toast.error(errorMsg);
      console.error("Error:", error);
    }
  };

  return (
    <div className="w-full max-w-md relative z-10">
      {/* Header Section */}
      <div className="text-center mb-8 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-rose-600 dark:text-rose-400 text-sm font-medium mb-4 transition-colors">
          <Sparkles className="w-4 h-4" />
          <span>Join InkSesh</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tighter text-neutral-900 dark:text-white transition-colors">
          Create Your Profile
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 transition-colors">
          Enter your details to start organizing your portfolio
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-xl dark:shadow-none transition-all duration-300">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email Field */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-neutral-700 dark:text-neutral-300 transition-colors"
            >
              Email <span className="text-rose-500">*</span>
            </label>
            <input
              {...register("email")}
              type="email"
              id="email"
              placeholder="your.email@example.com"
              className={`w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border rounded-lg outline-none transition-all duration-200 
                ${
                  errors.email
                    ? "border-red-500 focus:ring-red-500/50"
                    : "border-neutral-200 dark:border-neutral-800 focus:ring-rose-500/50 focus:border-rose-500"
                } text-neutral-900 dark:text-white`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-neutral-700 dark:text-neutral-300 transition-colors"
            >
              Password <span className="text-rose-500">*</span>
            </label>
            <input
              {...register("password")}
              type="password"
              id="password"
              placeholder="At least 8 characters with uppercase and numbers"
              className={`w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border rounded-lg outline-none transition-all duration-200 
                ${
                  errors.password
                    ? "border-red-500 focus:ring-red-500/50"
                    : "border-neutral-200 dark:border-neutral-800 focus:ring-rose-500/50 focus:border-rose-500"
                } text-neutral-900 dark:text-white`}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="profileUrl"
              className="text-sm font-medium text-neutral-700 dark:text-neutral-300 transition-colors"
            >
              Instagram URL <span className="text-rose-500">*</span>
            </label>
            <input
              {...register("profileUrl")}
              type="url"
              id="profileUrl"
              placeholder="https://instagram.com/your_profile"
              className={`w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border rounded-lg outline-none transition-all duration-200 
                ${
                  errors.profileUrl
                    ? "border-red-500 focus:ring-red-500/50"
                    : "border-neutral-200 dark:border-neutral-800 focus:ring-rose-500/50 focus:border-rose-500"
                } text-neutral-900 dark:text-white`}
            />
            {errors.profileUrl && (
              <p className="text-red-500 text-xs mt-1">
                {errors.profileUrl.message}
              </p>
            )}
          </div>

          {/* Username Field */}
          <div className="space-y-2">
            <label
              htmlFor="username"
              className="text-sm font-medium text-neutral-700 dark:text-neutral-300 transition-colors"
            >
              Username{" "}
              <span className="text-neutral-500">
                (Auto-filled, but editable)
              </span>
            </label>
            <input
              {...register("username")}
              type="text"
              id="username"
              placeholder="e.g. orange_santra"
              className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-white focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 outline-none transition-all duration-200"
            />
            {errors.username && (
              <p className="text-red-500 text-xs mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center bg-rose-600 hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-md shadow-rose-600/20 dark:shadow-[0_0_20px_rgba(225,29,72,0.3)] mt-4"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {userExists ? "Proceeding..." : "Creating..."}
              </>
            ) : userExists ? (
              "Next"
            ) : (
              "Create Profile"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
