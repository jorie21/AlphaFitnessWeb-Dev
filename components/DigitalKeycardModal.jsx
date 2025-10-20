"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Copy, Check, AlertCircle, Calendar, CreditCard, Star } from "lucide-react"; // Added Star for VIP badge
import Image from "next/image";
import { toast } from "sonner";
import AlphaFitness from "./Alphafitness";

export default function DigitalKeycardModal({ isOpen, onClose, keycards }) {
  const [copiedId, setCopiedId] = useState(null);
  
  // Get the first active keycard, or just the first one
  const activeKeycard = keycards?.find(kc => kc.status === "active") || keycards?.[0];

  const handleCopyId = (uniqueId) => {
    navigator.clipboard.writeText(uniqueId);
    setCopiedId(uniqueId);
    toast.success("Keycard ID copied to clipboard!");
    
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-300";
      case "expired":
        return "bg-red-100 text-red-800 border-red-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  // Helper to get keycard type label
  const getKeycardTypeLabel = (keycard) => {
    return keycard.is_vip ? "VIP Keycard" : "Basic Keycard";
  };

  // If no keycard exists
  if (!activeKeycard) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              No Active Keycard
            </DialogTitle>
            <DialogDescription>
              You don't have an active keycard yet. Purchase one to get started!
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
            <Button onClick={() => {
              onClose();
              window.location.href = "/services/keycards";
            }}>
              Get Keycard
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-russo flex items-center justify-between pr-8">
            <span>Your Digital Keycard</span>
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Show this QR code at the gym entrance for access
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6 mt-4">
          {/* Keycard Display */}
          <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl p-6 shadow-2xl border border-gray-700">
            {/* Status and VIP Badges */}
            <div className="absolute top-4 right-4 flex gap-2">
              <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${getStatusColor(activeKeycard.status)}`}>
                {activeKeycard.status}
              </div>
              {activeKeycard.is_vip && (
                <div className="px-3 py-1 rounded-full text-xs font-bold uppercase border bg-yellow-100 text-yellow-800 border-yellow-300 flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  VIP
                </div>
              )}
            </div>

            {/* Card Header */}
            <div className="text-white mb-6">
              <AlphaFitness/>
              <p className="text-sm text-gray-400">Member Keycard</p>
            </div>

            {/* QR Code Section */}
            <div className="flex flex-col md:flex-row gap-6 items-center">
              {/* QR Code */}
              <div className="bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl shadow-lg">
                <div className="relative w-32 h-32 sm:w-48 sm:h-48">
                  <Image
                    src={activeKeycard.qr_code_url || "/placeholder-qr.png"}
                    alt="Keycard QR Code"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Keycard Details */}
              <div className="flex-1 w-full space-y-3 sm:space-y-4 text-white">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-400 text-[10px] sm:text-xs">
                    <CreditCard className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>KEYCARD ID</span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <code className="text-xs sm:text-sm md:text-base font-mono bg-gray-700 px-2 sm:px-3 py-1.5 sm:py-2 rounded break-all">
                      {activeKeycard.unique_id}
                    </code>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCopyId(activeKeycard.unique_id)}
                      className="text-white hover:bg-gray-700 h-8 w-8 p-0"
                    >
                      {copiedId === activeKeycard.unique_id ? (
                        <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                      ) : (
                        <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-gray-400 text-[10px] sm:text-xs">
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>VALID UNTIL</span>
                  </div>
                  <p className="text-base sm:text-lg font-semibold">
                    {activeKeycard.is_vip ? "Lifetime Access" : formatDate(activeKeycard.expires_at)}
                  </p>
                </div>

                <div className="pt-2 border-t border-gray-700">
                  <p className="text-[10px] sm:text-xs text-gray-400">
                    Type: <span className="text-white font-semibold">{getKeycardTypeLabel(activeKeycard)}</span>
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-400 mt-1">
                    Issued: <span className="text-white">{formatDate(activeKeycard.created_at)}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 space-y-2 sm:space-y-3">
            <h4 className="font-bold text-blue-900 flex items-center gap-2 text-sm sm:text-base">
              <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5" />
              How to Use Your Keycard
            </h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <span className="font-bold">1.</span>
                <span>Show this QR code to the staff at the gym entrance</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">2.</span>
                <span>They will scan it to verify your membership</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">3.</span>
                <span>You can also provide your Keycard ID for manual entry</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">4.</span>
                <span>Keep your keycard valid by renewing before expiration (VIP keycards never expire)</span>
              </li>
            </ul>
          </div>

          {/* All Keycards */}
          {keycards && keycards.length > 1 && (
            <div className="space-y-2 sm:space-y-3">
              <h4 className="font-bold text-gray-900 text-sm sm:text-base">All Your Keycards</h4>
              <div className="space-y-2">
                {keycards.map((kc) => (
                  <div
                    key={kc.id}
                    className="p-2 sm:p-3 border rounded-lg bg-gray-50 flex justify-between items-center gap-2"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-mono text-xs sm:text-sm font-bold truncate">{kc.unique_id}</p>
                      <p className="text-[10px] sm:text-xs text-gray-600">
                        {getKeycardTypeLabel(kc)} • Expires: {kc.is_vip ? "Lifetime" : formatDate(kc.expires_at)}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs font-bold whitespace-nowrap ${getStatusColor(
                        kc.status
                      )}`}
                    >
                      {kc.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
            <Button onClick={onClose} variant="outline" className="flex-1 text-sm">
              Close
            </Button>
            <Button
              onClick={() => window.print()}
              variant="secondary"
              className="flex-1 text-sm"
            >
              Print Keycard
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
