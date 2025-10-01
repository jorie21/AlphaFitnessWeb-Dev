"use client";
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { SquarePen, KeyRound, X } from "lucide-react";
import { totalValue } from "@/constant/profile";
import { toast } from "sonner";

export default function ProfileHeader() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [keycards, setKeycards] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setSelectedImage(imageURL);
    }
  };

  const handleFetchKeycards = async () => {
    try {
      const res = await fetch("/api/keycards/get", {
        method: "POST",
        body: JSON.stringify({ userId: "USER_ID_HERE" }), // Replace with AuthContext user id
      });
      const data = await res.json();
      if (data.keycards) {
        setKeycards(data.keycards);
        setShowModal(true);
        toast.success("Keycards loaded!");
      } else {
        toast.error("No keycards found");
      }
    } catch (err) {
      toast.error("Failed to fetch keycards: " + err.message);
    }
  };

  return (
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
            <label htmlFor="avatarUpload" className="cursor-pointer relative group">
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
              Welcome Back, Jhon!
            </h1>
            <span className="font-arone text-white/70 text-sm md:text-base">
              Ready to crush your fitness goals today? Let&apos;s make it happen!
            </span>

            {/* stats cards */}
            <div className="flex flex-wrap md:flex-nowrap justify-center md:justify-start gap-2 w-full">
              {totalValue.map((item, index) => (
                <div
                  key={index}
                  className="border-2 border-white/30 rounded-[10px] bg-black/30 backdrop-blur-md flex-1 min-w-[100px] md:min-w-[120px] md:flex-none"
                >
                  <div className="flex flex-col gap-2 justify-center items-center p-3 md:p-4">
                    <span className={`font-russo text-xl md:text-2xl ${item.color}`}>
                      {item.total}
                    </span>
                    <h1 className="flex items-center gap-2 font-arone font-medium text-sm md:text-[16px] text-white/70">
                      {item.title}
                      <item.icon className="w-4 h-4" />
                    </h1>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* right Profile */}
        <div className="flex flex-col items-center md:items-end gap-3">
          <Button
            variant="secondary"
            className="font-arone font-bold text-sm text-white flex items-center gap-2"
          >
            <SquarePen className="w-4 h-4" />
            Edit Profile
          </Button>

          {/* Digital Keycard Button */}
          <Button
            onClick={handleFetchKeycards}
            className="mt-3 font-arone font-bold text-sm text-white flex items-center gap-2 bg-green-700 hover:bg-green-800"
          >
            <KeyRound className="w-4 h-4" />
            YOUR DIGITAL KEYCARD
          </Button>
        </div>
      </div>

      {/* Keycard Modal */}
      {showModal && (
        <div className="fixed top-0 right-0 h-full w-80 bg-black/90 backdrop-blur-md shadow-xl z-50 p-6 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-white font-russo text-xl">Your Keycards</h2>
            <button onClick={() => setShowModal(false)} className="text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto space-y-3">
            {keycards.length > 0 ? (
              keycards.map((kc) => (
                <div
                  key={kc.id}
                  className="p-3 border border-white/30 rounded-lg bg-black/40"
                >
                  <p><strong>Type:</strong> {kc.type}</p>
                  <p><strong>Status:</strong> {kc.status}</p>
                  <p><strong>Purchased At:</strong> {new Date(kc.purchased_at).toLocaleDateString()}</p>
                  {kc.expires_at && (
                    <p><strong>Expires:</strong> {new Date(kc.expires_at).toLocaleDateString()}</p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-white">No keycards found.</p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
