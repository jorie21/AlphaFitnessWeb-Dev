import { Suspense } from "react";
import PaymentSuccessContent from "./PaymentSuccessContent";

export default function Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <svg className="animate-spin h-10 w-10 text-blue-600" viewBox="0 0 24 24" />
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
