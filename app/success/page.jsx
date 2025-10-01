"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function SuccessPage() {
  const [keycard, setKeycard] = useState(null);

 useEffect(() => {
  async function insertDebugKeycard() {
    try {
      const res = await fetch("/api/keycards/insert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: "DEBUG_USER_1",
          type: "basic",
          status: "active",
        }),
      });
      const data = await res.json();
      console.log("Inserted keycard:", data);
      if (data.data && data.data.length > 0) {
        setKeycard(data.data[0]);
      }
    } catch (err) {
      console.error("Failed to insert debug keycard:", err);
    }
  }

  insertDebugKeycard();
}, []);


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md w-full">
        <CheckCircle className="mx-auto mb-4 w-16 h-16 text-green-500" />
        <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
        <p className="text-gray-700 mb-6">
          Your keycard purchase has been processed successfully.
          <br />
          ✅ Your keycard information has been securely stored in our system.
        </p>

        {keycard && (
          <div className="p-4 mb-4 border border-green-300 rounded-lg bg-green-100 text-left">
            <h2 className="font-bold mb-2">Debug Keycard Info:</h2>
            <p><strong>Type:</strong> {keycard.type}</p>
            <p><strong>Status:</strong> {keycard.status}</p>
            <p><strong>Purchased At:</strong> {new Date(keycard.purchased_at).toLocaleString()}</p>
            {keycard.expires_at && (
              <p><strong>Expires At:</strong> {new Date(keycard.expires_at).toLocaleDateString()}</p>
            )}
          </div>
        )}

        <Link href="/">
          <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg shadow">
            Go to Dashboard
          </button>
        </Link>
      </div>
    </div>
  );
}
