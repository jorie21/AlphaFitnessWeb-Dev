'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const [keyData, setKeyData] = useState(null);
  
  const uid = searchParams.get('uid');
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (uid && sessionId) {
      // You can fetch keycard details here if needed
      setKeyData({ uid, sessionId });
      console.log('Payment successful:', { uid, sessionId });
    }
  }, [uid, sessionId]);

  if (!uid || !sessionId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Invalid Access</h1>
          <p>Missing required parameters</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
        <div className="text-green-500 text-6xl mb-4">✅</div>
        <h1 className="text-3xl font-bold text-green-600 mb-4">Payment Successful!</h1>
        <p className="text-gray-600 mb-4">
          Your keycard has been created successfully.
        </p>
        <div className="bg-gray-100 p-4 rounded-lg mb-4">
          <p className="font-semibold">Keycard ID:</p>
          <p className="text-lg font-mono">{uid}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <p className="font-semibold">Session ID:</p>
          <p className="text-sm font-mono break-all">{sessionId}</p>
        </div>
        <button 
          onClick={() => window.location.href = '/services'}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
        >
          View My Keycards
        </button>
      </div>
    </div>
  );
}