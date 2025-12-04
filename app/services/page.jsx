"use client";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Check, RefreshCcw, Star } from "lucide-react"; // Added Star for VIP icon
import { keycardFeature, keycardRenew, vipFeature } from "@/constant/features";
import { toast } from "sonner";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";

export default function KeycardsPage() {
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [keycardStatus, setKeycardStatus] = useState(null);
  const [hasNonVipKeycard, setHasNonVipKeycard] = useState(false);
  const router = useRouter();

  // Fetch user keycard info
  useEffect(() => {
    const fetchKeycards = async () => {
      if (!user) return;

      const res = await fetch("/api/keycards/get", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, type: "check" }), // ✅ add type
      });
      const { keycards } = await res.json();

      if (keycards?.length) {
        const latest = keycards[0];
        setKeycardStatus(latest.status);
        // Check if user has any non-VIP keycard
        const hasNonVip = keycards.some((k) => !k.is_vip); // Use new column
        setHasNonVipKeycard(hasNonVip);
      } else {
        setHasNonVipKeycard(false);
      }
    };
    fetchKeycards();
  }, [user]);

  const handlePurchase = async (type) => {
    if (!user) {
      toast.error("You must be logged in to checkout.");
      return;
    }

    try {
      setLoading(true);

      // Call the API to validate
      const res = await fetch("/api/keycards/get", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, type }),
      });

      const data = await res.json();

      if (res.status !== 200) {
        toast.error(data.error || "Error checking your keycard status.");
        return;
      }

      // If validation passes, proceed to payment
      const paymentRes = await fetch("/api/keycards/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          email: user.email,
          type,
          services: ["Gym Access"],
        }),
      });

      const paymentData = await paymentRes.json();

      if (paymentData.url) {
        window.location.href = paymentData.url;
      } else {
        toast.error(paymentData.error || "Payment failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleOTCPurchase = async (type) => {
    if (!user) {
      toast.error("You must be logged in to request OTC payment.");
      return;
    }

    try {
      setLoading(true);

      // Call the API to validate
      const res = await fetch("/api/keycards/get", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, type }),
      });

      const data = await res.json();

      if (res.status !== 200) {
        toast.error(data.error || "Error checking your keycard status.");
        return;
      }

      // If valid, proceed to OTC
      const otcRes = await fetch("/api/keycards/otc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, type }),
      });

      const otcData = await otcRes.json();

      if (otcData.error) {
        toast.error(otcData.error);
      } else {
        toast.success("Your keycard is pending. Please pay over the counter.");
        router.push(`/payment/otcSuccess?id=${otcData.uniqueId}`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while processing OTC request.");
    } finally {
      setLoading(false);
    }
  };

  const isRenewDisabled =
    authLoading || loading || !user || keycardStatus !== "expired";
  const isVipDisabled = authLoading || loading || !user || !hasNonVipKeycard;

  return (
    <section className="screen flex flex-col justify-center items-center gap-8 px-4 sm:px-8">
      <div className="text-center space-y-2 max-w-xl">
        <h1 className="font-russo text-3xl sm:text-4xl leading-tight">
          Get Your Alpha Fitness KeyCard
        </h1>
        <p className="text-base sm:text-lg font-arone opacity-70">
          Required for all services. Choose your keycard option below.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6  max-w-5xl w-full">
        
        <Card className="border-2 border-gray-700 hover:shadow-xl transition-all rounded-xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-gray-100 rounded-xl w-fit shadow-sm">
              <CreditCard className="h-8 w-8 text-gray-600" />
            </div>
            <CardTitle className="text-2xl font-russo">Basic Keycard</CardTitle>
            <CardDescription className="text-sm opacity-70 px-2">
              Get your Alpha Fitness keycard for access to facilities (expires
              after 1 year)
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="text-4xl font-bold text-gray-900">₱150</div>
            <p className="text-sm text-gray-500">One-time fee</p>
            {keycardFeature.map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" /> {f}
              </div>
            ))}
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button
              disabled={loading || !user || authLoading}
              onClick={() => handlePurchase("basic")}
              className="w-full"
            >
              {loading
                ? "Processing..."
                : !user
                ? "Login to Purchase"
                : "Pay Online (₱150)"}

            </Button>
            <Button
              disabled={loading || !user || authLoading}
              onClick={() => handleOTCPurchase("basic")}
              variant="outline"
              className="w-full"
            >
              Pay Over the Counter (₱150)
            </Button>
          </CardFooter>
        </Card>

        {/* <Card className="border-2 border-secondary hover:shadow-xl transition-all rounded-xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-red-100 rounded-full w-fit shadow-sm">
              <RefreshCcw className="h-8 w-8 text-secondary" />
            </div>
            <CardTitle className="text-2xl font-russo">Renew Keycard</CardTitle>
            <CardDescription className="text-sm opacity-70 px-2">
              Renew your expired basic keycard for another year.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="text-4xl font-bold text-gray-900">₱100</div>
            <p className="text-sm text-gray-500">One-time fee</p>
            {keycardRenew.map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" /> {f}
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button
              disabled={isRenewDisabled}
              onClick={() => handlePurchase("renew")}
              variant="secondary"
              className="w-full"
            >
              {isRenewDisabled
                ? "Available When Expired"
                : loading
                ? "Processing..."
                : "Renew Now"}
            </Button>
          </CardFooter>
        </Card> */}

        <Card className="border-2 border-yellow-500 hover:shadow-xl transition-all rounded-xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-yellow-100 rounded-xl w-fit shadow-sm">
              <Star className="h-8 w-8 text-yellow-600" />
            </div>
            <CardTitle className="text-2xl font-russo">VIP Keycard</CardTitle>
            <CardDescription className="text-sm opacity-70 px-2">
              Upgrade to VIP for lifetime premium access. Requires an existing
              non-VIP keycard.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="text-4xl font-bold text-gray-900">₱799</div>
            <p className="text-sm text-gray-500">One-time upgrade fee</p>
            {vipFeature.map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" /> {f}
              </div>
            ))}
            <div className="flex items-center gap-3">
              <Check className="h-5 w-5 text-green-500" /> Lifetime access (no
              expiration)
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button
        
              onClick={() => handlePurchase("vip")}
              className="w-full"
            >
              {isVipDisabled
                ? "Requires Existing Keycard"
                : loading
                ? "Processing..."
                : "Pay Online (₱799)"}

            </Button>
            <Button
              disabled={isVipDisabled}
              onClick={() => handleOTCPurchase("vip")}
              variant="outline"
              className="w-full"
            >
              Pay Over the Counter (₱799)
            </Button>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}
