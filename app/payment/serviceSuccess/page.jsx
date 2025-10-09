"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, QrCode } from "lucide-react";
import { motion } from "framer-motion";

export default function ServiceSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const keyId = searchParams.get("id"); // optional param if you want to pass the uniqueId

  return (
    <section className="min-h-screen flex justify-center items-center px-4 bg-gradient-to-b from-white to-gray-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full"
      >
        <Card className="shadow-lg border-2 border-gray-200 rounded-2xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-3">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <CardTitle className="font-russo text-2xl">
              Keycard Request Successful!
            </CardTitle>
            <p className="text-gray-500 text-sm mt-1">
              Your request has been received and is pending confirmation.
            </p>
          </CardHeader>

          <CardContent className="space-y-5 text-center">
            <div className="bg-gray-100 p-4 rounded-xl">
              <h2 className="font-semibold text-lg">Payment Summary</h2>
              <p className="text-sm text-gray-600">Alpha Fitness Keycard (OTC)</p>
              <div className="text-2xl font-bold text-gray-800 mt-2">₱150</div>
            </div>

            <div className="p-4 rounded-xl bg-yellow-50 border border-yellow-200">
              <Clock className="inline-block mr-2 text-yellow-600" />
              <span className="text-sm text-yellow-800 font-medium">
                Please pay at the front desk to activate your keycard.
              </span>
            </div>

            {keyId && (
              <div className="bg-white border rounded-xl p-4 flex flex-col items-center gap-3">
                <QrCode className="text-gray-700 h-6 w-6" />
                <p className="text-xs text-gray-500">Keycard ID</p>
                <p className="font-mono text-gray-900 text-sm">{keyId}</p>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            <Button
              onClick={() => router.push("/")}
              className="w-full bg-[#054721] hover:bg-[#043d1d]"
            >
              Back to Home
            </Button>

            <Button
              variant="outline"
              onClick={() => router.push("/profile")}
              className="w-full"
            >
              View My Keycard Status
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </section>
  );
}
