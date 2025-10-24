"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, QrCode, Printer } from "lucide-react";
import { motion } from "framer-motion";

export default function ServiceSuccessClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const keyId = searchParams.get("id");

  const handlePrint = () => {
    const receiptEl = document.getElementById("receipt-section");
    if (!receiptEl) return;
    const receipt = receiptEl.innerHTML;
    const w = window.open("", "_blank");
    if (!w) return; // popup blocked
    w.document.write(`
      <!doctype html>
      <html>
        <head>
          <meta charSet="utf-8" />
          <title>Alpha Fitness Receipt</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; background: #fff; }
            .receipt { border: 2px dashed #054721; border-radius: 10px; padding: 20px; max-width: 400px; margin: auto; }
            .divider { border-bottom: 1px dashed #ccc; margin: 10px 0; }
            .amount { text-align: center; font-size: 1.5rem; font-weight: bold; color: #222; margin: 10px 0; }
            .footer { text-align: center; font-size: 0.8rem; color: #555; margin-top: 15px; }
          </style>
        </head>
        <body>${receipt}</body>
      </html>
    `);
    w.document.close();
    w.focus();
    // ensure styles apply before printing
    setTimeout(() => w.print(), 0);
  };

  return (
    <section className="min-h-screen flex justify-center items-center px-4 bg-gradient-to-b from-white to-gray-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full"
      >
        <Card className="shadow-lg border-2 border-gray-200 rounded-2xl overflow-hidden">
          <CardHeader className="text-center bg-[#054721] text-white">
            <div className="flex justify-center mb-3">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
            <CardTitle className="font-russo text-2xl">Request Successful!</CardTitle>
            <p className="text-sm mt-1 text-gray-100">
              Your request has been received and is pending confirmation.
            </p>
          </CardHeader>

          <CardContent className="space-y-5 text-center p-6">
            <div className="p-4 rounded-xl bg-yellow-50 border border-yellow-200">
              <Clock className="inline-block mr-2 text-yellow-700" />
              <span className="text-sm text-yellow-800 font-medium">
                Please pay at the <b>Alpha Fitness front desk</b> to activate your keycard.
              </span>
            </div>

            <div id="receipt-section" className="bg-white border rounded-xl p-5 text-left receipt">
              <h2 className="text-center font-semibold text-lg text-[#054721]">ALPHA FITNESS RECEIPT</h2>
              <div className="border-b border-dashed border-gray-300 my-3"></div>
              <p className="text-sm text-gray-600">Item: Alpha Fitness Keycard (OTC)</p>
              <p className="text-sm text-gray-600">Status: Pending Payment</p>
              <div className="amount">₱150</div>
              {keyId && (
                <>
                  <div className="divider"></div>
                  <div className="flex flex-col items-center mt-2">
                    <QrCode className="text-gray-700 h-6 w-6" />
                    <p className="text-xs text-gray-500 mt-1">Keycard ID</p>
                    <p className="font-mono text-gray-900 text-sm">{keyId}</p>
                  </div>
                </>
              )}
              <p className="footer mt-4">Please present this receipt at the counter.</p>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 px-6 pb-6">
            <Button onClick={handlePrint} className="w-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center gap-2">
              <Printer className="h-4 w-4" /> Print Receipt
            </Button>
            <Button onClick={() => router.push("/")} className="w-full bg-[#054721] hover:bg-[#043d1d]">
              Back to Home
            </Button>
            <Button variant="outline" onClick={() => router.push("/profile")} className="w-full">
              View My Keycard Status
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </section>
  );
}
