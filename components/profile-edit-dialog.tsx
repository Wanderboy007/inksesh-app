"use client";

import { useState, useEffect } from "react";
import { X, Camera, Loader2 } from "lucide-react";
import { UpdateProfile } from "@/app/profile/_edit-actions/edit-profile";

interface ProfileEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  initialData?: {
    username: string;
    instagramUrl: string;
  };
}

export function ProfileEditDialog({
  isOpen,
  onClose,
  userId,
  initialData,
}: ProfileEditDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    instagramUrl: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        username: initialData.username || "",
        instagramUrl: initialData.instagramUrl || "",
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const data = new FormData();
    data.append("userId", userId);
    data.append("username", formData.username);
    data.append("instagramUrl", formData.instagramUrl);

    try {
      const result = await UpdateProfile(data);
      if (result.success) {
        onClose();
        window.location.reload();
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />
      <div className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-900/50">
          <h2 className="text-lg font-semibold text-white">Edit Profile</h2>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="flex flex-col items-center gap-3">
            <div className="relative group cursor-pointer">
              <div className="w-24 h-24 rounded-full bg-neutral-800 border-2 border-dashed border-neutral-700 flex items-center justify-center overflow-hidden group-hover:border-rose-500 transition-colors">
                <span className="text-2xl font-bold text-neutral-500 group-hover:text-rose-500">
                  {formData.username?.[0]?.toUpperCase() || "U"}
                </span>
              </div>
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 rounded-full transition-opacity">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-xs text-neutral-500">Tap to change photo</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 transition-all placeholder:text-neutral-600"
                placeholder="Ex. InkMaster"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
                Instagram / Profile URL
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="instagramUrl"
                  value={formData.instagramUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, instagramUrl: e.target.value })
                  }
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 transition-all placeholder:text-neutral-600"
                  placeholder="https://instagram.com/username"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg border border-neutral-800 text-neutral-300 font-medium hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 rounded-lg bg-rose-600 text-white font-medium hover:bg-rose-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
