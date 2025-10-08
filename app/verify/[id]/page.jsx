"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function VerifyPage() {
  const { id } = useParams(); // unique_id from QR
  const [userInfo, setUserInfo] = useState(null);
  const [services, setServices] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(`/api/keycards/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uniqueId: id }),
      });

      const data = await res.json();
      setUserInfo(data.user);
      setServices(data.services || []);
    }

    fetchData();
  }, [id]);

  if (!userInfo) return <p>Loading...</p>;

  return (
    <section className="flex flex-col items-center justify-center p-10">
      <h1 className="font-russo text-3xl mb-5">Alpha Fitness Verification</h1>

      <div className="text-center mb-10">
        <p className="text-xl font-bold">{userInfo.username}</p>
        <p className="text-gray-500">{userInfo.email}</p>
      </div>

      <div className="w-full max-w-md">
        <h2 className="font-semibold text-lg mb-3">Services Availed:</h2>
        <ul className="space-y-2">
          {services.map((s, i) => (
            <li
              key={i}
              className="border p-3 rounded-lg shadow-sm flex justify-between"
            >
              <span>{s.service_name}</span>
              <span>₱{s.price}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
