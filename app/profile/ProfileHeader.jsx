"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { SquarePen, KeyRound, ShoppingCart, CalendarDays } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/authContext";
import DigitalKeycardModal from "@/components/DigitalKeycardModal";
import useServiceStats from "@/hooks/useServiceStats";
import { supabase } from "@/lib/supabaseClient";

export default function ProfileHeader() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [keycards, setKeycards] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();

  // 🔢 service stats via hook
  const { stats, loading: loadingStats } = useServiceStats(user?.id);

  // Load avatar from DB
  useEffect(() => {
    let cancelled = false;

    const loadAvatar = async () => {
      if (!user) {
        setSelectedImage(null);
        return;
      }
      const { data, error } = await supabase
        .from("users")
        .select("profile_picture")
        .eq("id", user.id)
        .single();

      if (!cancelled && !error && data?.profile_picture) {
        setSelectedImage(data.profile_picture);
      }
    };

    loadAvatar();
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file || !user) return toast.error("Please login first.");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", user.id);

    try {
      const res = await fetch("/api/users/upload-profile", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      setSelectedImage(data.imageUrl);
      toast.success("Profile image updated!");

      await supabase.auth.updateUser({
        data: { avatar_url: data.imageUrl },
      });
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to update profile image");
    }
  };

  const handleFetchKeycards = async () => {
    if (!user) {
      toast.error("Please login to view your keycards");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/keycards/get", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, type: "check" }), // ✅ neutral check
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch keycards");

      if (data.keycards?.length) {
        setKeycards(data.keycards);
        setIsModalOpen(true);
      } else {
        toast.error("No keycards found. Purchase one to get started!");
      }
    } catch (err) {
      console.error("Fetch keycards error:", err);
      toast.error(err.message || "Failed to fetch keycards");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="relative w-full bg-gradient-to-tl from-[#0F2027] via-[#2C5364] to-[#4E1B1B]">
        <div className="flex screen flex-col md:flex-row md:justify-between md:items-center gap-6 md:gap-0">
          {/* left Profile */}
          <div className="flex flex-col md:flex-row gap-4 justify-center md:justify-start items-center md:items-center">
            {/* profile */}
            <div className="flex flex-col items-center">
              <input
                type="file"
                accept="image/*"
                id="avatarUpload"
                className="hidden"
                onChange={handleImageChange}
              />
              <label
                htmlFor="avatarUpload"
                className="cursor-pointer relative group"
              >
                <div className="w-28 h-28 md:w-35 md:h-35 rounded-full overflow-hidden border-2 gradient-border shadow-lg flex items-center justify-center bg-gray-100">
                  {selectedImage ? (
                    <Image
                      src={selectedImage}
                      alt="Profile"
                      width={128}
                      height={128}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <span className="text-gray-500 text-sm text-center px-2">
                      Profile
                    </span>
                  )}
                </div>
                <div className="absolute inset-0 rounded-full bg-black/40 backdrop-blur-sm flex text-center items-center justify-center text-white opacity-0 group-hover:opacity-100 transition">
                  Change Profile
                </div>
              </label>
            </div>

            {/* right of profile */}
            <div className="flex flex-col gap-3 text-center md:text-left">
              <h1 className="font-russo text-white text-2xl md:text-3xl">
                Welcome Back, {user?.user_metadata?.username || "Jhon"}!
              </h1>
              <span className="font-arone text-white/70 text-sm md:text-base">
                Ready to crush your fitness goals today? Let&apos;s make it
                happen!
              </span>

              {/* stats cards */}
              <div className="flex flex-wrap md:flex-nowrap justify-center md:justify-start gap-2 w-full">
                {/* Services Purchase */}
                <div className="border-2 border-white/30 rounded-[10px] bg-black/30 backdrop-blur-md flex-1 min-w-[120px] md:flex-none">
                  <div className="flex flex-col gap-2 justify-center items-center p-3 md:p-4">
                    <span className="font-russo text-xl md:text-2xl text-red-400">
                      {loadingStats ? "…" : stats.total_purchases}
                    </span>
                    <h1 className="flex items-center gap-2 font-arone font-medium text-sm md:text-[16px] text-white/70">
                      Services Purchase <ShoppingCart className="w-4 h-4" />
                    </h1>
                  </div>
                </div>

                {/* Months Member */}
                <div className="border-2 border-white/30 rounded-[10px] bg-black/30 backdrop-blur-md flex-1 min-w-[120px] md:flex-none">
                  <div className="flex flex-col gap-2 justify-center items-center p-3 md:p-4">
                    <span className="font-russo text-xl md:text-2xl text-blue-400">
                      {loadingStats ? "…" : stats.months_member}
                    </span>
                    <h1 className="flex items-center gap-2 font-arone font-medium text-sm md:text-[16px] text-white/70">
                      Months Member <CalendarDays className="w-4 h-4" />
                    </h1>
                  </div>
                </div>
              </div>

              {/* Digital Keycard Button */}
              <Button
                onClick={handleFetchKeycards}
                disabled={loading || !user}
                className="mt-3 font-arone font-bold text-sm text-white flex items-center gap-2 bg-green-700 hover:bg-green-800 disabled:opacity-50"
              >
                <KeyRound className="w-4 h-4" />
                {loading ? "Loading..." : "Your Digital Keycard"}
              </Button>
            </div>
          </div>

          {/* right Profile */}
          <div className="flex justify-center md:justify-end">
            <Button
              variant="secondary"
              className="font-arone font-bold text-sm text-white flex items-center gap-2"
            >
              <SquarePen className="w-4 h-4" />
              Edit Profile
            </Button>
          </div>
        </div>
      </section>

      <DigitalKeycardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        keycards={keycards}
      />
    </>
  );
}
