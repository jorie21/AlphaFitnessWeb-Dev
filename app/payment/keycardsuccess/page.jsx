import PaymentSuccessClient from "./PaymentSuccessClient";

export default function Page({ searchParams }) {
  const sessionId = searchParams?.session_id ?? null;
  return <PaymentSuccessClient sessionId={sessionId} />;
}
