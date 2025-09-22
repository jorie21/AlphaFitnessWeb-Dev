"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Check, RefreshCcw } from "lucide-react";
import { keycardFeature, keycardRenew } from "@/constant/features";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/authContext"; // ✅ use your context

export default function KeycardsPage() {
  const [loading, setLoading] = useState(false);
  const { user, loading: authLoading } = useAuth(); // ✅ get user directly

  const handlePurchase = async (type) => {
    if (!user) {
      toast.error("You must be logged in to checkout.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/keycards/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id, // ✅ use real supabase user id
          type,
          keycardId: type === "renew" ? "EXISTING_KEYCARD_ID" : null,
          services: type === "renew" ? ["Gym Access", "Pool Access"] : null,
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error("Payment failed");
      }
    } catch (err) {
      toast.error("Something went wrong");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="screen flex flex-col justify-center items-center gap-8 px-4 sm:px-8">
      {/* Heading */}
      <div className="text-center space-y-2 max-w-xl">
        <h1 className="font-russo text-3xl sm:text-4xl leading-tight">
          Get Your Alpha Fitness KeyCard
        </h1>
        <p className="text-base sm:text-lg leading-relaxed font-arone opacity-70">
          Required for all services. Choose your keycard option below.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 w-full gap-6 sm:gap-8 max-w-5xl">
        {/* Basic Keycard */}
        <Card className="relative flex flex-col justify-between border-2 border-gray-700 hover:shadow-xl hover:scale-[1.02] transition-all rounded-xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-gray-100 rounded-xl w-fit shadow-sm">
              <CreditCard className="h-8 w-8 text-gray-600" />
            </div>
            <CardTitle className="text-2xl font-russo">Basic Keycard</CardTitle>
            <CardDescription className="text-sm opacity-70 px-2">
              Get your Alpha Fitness keycard without any services loaded
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="space-y-1">
              <div className="text-4xl font-bold text-gray-900">₱150</div>
              <p className="text-sm text-gray-500">One-time fee</p>
            </div>
            <div className="space-y-3">
              {keycardFeature.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 text-left">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              disabled={loading || !user || authLoading}
              onClick={() => handlePurchase("basic")}
              className="w-full"
            >
              {loading ? "Processing..." : !user ? "Login to Purchase" : "Get Basic Keycard"}
            </Button>
          </CardFooter>
        </Card>

        {/* Renew Keycard */}
        <Card className="relative flex flex-col justify-between border-2 border-secondary hover:shadow-xl hover:scale-[1.02] transition-all rounded-xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-red-100 rounded-full w-fit shadow-sm">
              <RefreshCcw className="h-8 w-8 text-secondary" />
            </div>
            <CardTitle className="text-2xl font-russo">Renew Keycard</CardTitle>
            <CardDescription className="text-sm opacity-70 px-2">
              Renew your existing Alpha Fitness keycard
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <p className="text-sm text-gray-500">One-time fee</p>
            <div className="space-y-3">
              {keycardRenew.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 text-left">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              disabled={loading || !user || authLoading}
              onClick={() => handlePurchase("renew")}
              variant="secondary"
              className="w-full"
            >
              {loading ? "Processing..." : !user ? "Login to Renew" : "Renew Now"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}
