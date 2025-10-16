//app/payment/serviceSuccess/page.jsx
"use client";

import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";
import { CheckCircle2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

export default function ServiceSuccessPage() {
  const searchParams = useSearchParams();
  const referenceId = searchParams.get("reference_id") || "N/A";

  const [showConfetti, setShowConfetti] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Trigger confetti only after mount to avoid hydration issues
    setShowConfetti(true);
    setDimensions({ width: window.innerWidth, height: window.innerHeight });

    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-100 via-white to-green-50 px-4 relative overflow-hidden">
      {/* ✅ Confetti only on client */}
      {showConfetti && (
        <Confetti
          width={dimensions.width}
          height={dimensions.height}
          recycle={false}
          numberOfPieces={250}
        />
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/70 backdrop-blur-lg border border-green-100 shadow-2xl rounded-3xl p-10 max-w-md w-full text-center relative z-10"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 120 }}
        >
          <CheckCircle2 className="text-green-600 w-20 h-20 mx-auto mb-5 drop-shadow-lg" />
        </motion.div>

        <h1 className="text-3xl font-russo text-Green mb-2">
          Payment Successful!
        </h1>
        <p className="text-gray-700 mb-6">
          Your service purchase has been confirmed
        </p>

        <div className="bg-green-50 border border-green-200 rounded-xl py-3 px-5 mb-6">
          <p className="text-gray-600 text-sm">Reference ID</p>
          <p className="text-green-700 font-semibold text-lg tracking-wider">
            {referenceId}
          </p>
        </div>

        <motion.a
          href="/profile"
          whileHover={{ scale: 1.05 }}
          className="inline-block bg-green-600 text-white px-6 py-3 rounded-full font-semibold shadow hover:bg-green-700 transition-all duration-200"
        >
          Go to Dashboard
        </motion.a>
      </motion.div>

      <p className="mt-6 text-gray-500 text-sm">
        Thank you for trusting our service 
      </p>
    </div>
  );
}
