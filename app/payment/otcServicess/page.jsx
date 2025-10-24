import { Suspense } from "react";
import ReceiptPageClient from "./ReceiptPageClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6 text-slate-500 text-sm">Loading…</div>}>
      <ReceiptPageClient />
    </Suspense>
  );
}
