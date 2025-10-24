import { Suspense } from "react";
import ServiceSuccessClient from "./ServiceSuccessClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6 text-slate-500 text-sm">Loading…</div>}>
      <ServiceSuccessClient />
    </Suspense>
  );
}
