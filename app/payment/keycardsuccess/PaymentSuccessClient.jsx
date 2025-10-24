"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Loader2, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PaymentSuccessClient({ sessionId }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!sessionId) {
      setError("Invalid payment session");
      setLoading(false);
      return;
    }

    // (Optional) Verify the session on your backend here.
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
            <p className="text-lg font-medium text-gray-700">
              Processing your payment...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100 px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-600">
              Payment Error
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-gray-700">{error}</p>
            <Button
              onClick={() => router.push("/services/keycards")}
              className="w-full"
              variant="destructive"
            >
              Return to Keycards
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100 px-4">
      <Card className="w-full max-w-lg shadow-2xl">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <CardTitle className="text-3xl font-russo text-gray-900">
            Payment Successful!
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          <div className="text-center space-y-2">
            <p className="text-lg font-medium text-gray-700">
              Your Alpha Fitness keycard has been created!
            </p>
            <p className="text-sm text-gray-600">
              Check your profile to view your digital keycard with QR code.
            </p>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border-2 border-blue-200 space-y-3">
            <div className="flex items-center gap-3">
              <CreditCard className="h-6 w-6 text-blue-600" />
              <h3 className="font-bold text-lg text-gray-800">What's Next?</h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>Your keycard is now active and ready to use</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>Access your digital keycard from your profile</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>Show your QR code at the gym for entry</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>Valid for 1 year from today</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={() => router.push("/profile")} className="flex-1">
              View Digital Keycard
            </Button>
            <Button
              onClick={() => router.push("/")}
              variant="outline"
              className="flex-1"
            >
              Go to Dashboard
            </Button>
          </div>

          <p className="text-xs text-center text-gray-500">
            A confirmation email has been sent to your registered email address.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
