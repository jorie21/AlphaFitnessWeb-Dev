// app/payment/serviceSuccess/page.jsx
import ServiceSuccessClient from "./ServiceSuccessClient";

export default function Page({ searchParams }) {
  const referenceId = searchParams?.reference_id ?? "N/A";
  return <ServiceSuccessClient referenceId={referenceId} />;
}
