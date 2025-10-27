"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import {
  Check,
  Clock,
  Copy,
  Printer,
  Ticket,
  Wallet,
  CreditCard,
  Star,
  LogIn,
  ShieldAlert,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

function StatusBadge({ status }) {
  const normalized = (status || "pending").toLowerCase();
  const style =
    normalized === "active"
      ? "bg-green-600/10 text-green-700 border-green-600/20"
      : normalized === "pending"
      ? "bg-amber-500/10 text-amber-700 border-amber-500/20"
      : normalized === "expired" || normalized === "cancelled"
      ? "bg-red-600/10 text-red-700 border-red-600/20"
      : "bg-slate-500/10 text-slate-700 border-slate-500/20";
  return (
    <Badge variant="outline" className={`rounded-full px-2.5 py-1 ${style}`}>
      <Clock className="mr-1 h-3.5 w-3.5" /> {normalized}
    </Badge>
  );
}

function LabelValue({ label, value }) {
  if (!value) return null;
  return (
    <div className="grid grid-cols-12 gap-3 py-1 text-sm">
      <div className="col-span-5 text-slate-500">{label}</div>
      <div className="col-span-7 font-medium text-slate-900 break-words">
        {value}
      </div>
    </div>
  );
}

export default function KeycardReceiptPage() {
  const router = useRouter();
  const params = useSearchParams();
  const refId = params.get("reference_id") || params.get("referenceId") || "";
  const keyId = params.get("id") || params.get("unique_id") || "";

  const [sessionUser, setSessionUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [card, setCard] = useState(null);

  // 🔐 Get current user session
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setCheckingAuth(true);
      const { data } = await supabase.auth.getSession();
      if (!cancelled) {
        setSessionUser(data?.session?.user || null);
        setCheckingAuth(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // 📦 Fetch keycard from API (server route with service role key)
  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!keyId) {
        setError("Missing keycard id in URL.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/keycards/receipt", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uniqueId: keyId }),
        });

        const json = await res.json();
        if (!res.ok) throw new Error(json?.error || "Failed to load receipt");
        if (!cancelled) setCard(json.keycard);
      } catch (e) {
        if (!cancelled) setError(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [keyId]);

  const isVIP = !!(
    card?.is_vip || String(card?.type || "").toLowerCase() === "vip"
  );
  const status = (card?.status || "pending").toString();
  const amount = isVIP ? 799 : 150;
  const paymentMethod = "otc";
  const title = "Keycard Receipt";
  const validUntil = useMemo(() => {
    if (!card) return isVIP ? "1 year from activation" : "No Expiration";
    if (isVIP)
      return card.expires_at
        ? new Date(card.expires_at).toLocaleString()
        : "1 year from activation";
    return "No Expiration";
  }, [card, isVIP]);

  const copyRef = async () => {
    if (!refId) return;
    try {
      await navigator.clipboard.writeText(refId);
    } catch {}
  };
  const printReceipt = () => window.print();

  return (
    <div className="mx-auto max-w-3xl p-4 md:p-8">
      <Card className="shadow-lg border-slate-200 print:shadow-none">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl md:text-3xl font-semibold tracking-tight flex items-center gap-2">
              <Ticket className="h-6 w-6" /> {title}
            </CardTitle>
            <StatusBadge status={status} />
          </div>
          <CardDescription>
            Thank you! Your pay-on-counter order has been recorded and is
            currently pending payment at the front desk.
          </CardDescription>
        </CardHeader>

        <Separator />

        <CardContent className="grid gap-6 md:grid-cols-5 print:grid-cols-5">
          <div className="md:col-span-5 space-y-4">
            {!sessionUser && !checkingAuth && (
              <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-amber-900 flex items-center justify-between">
                <div className="flex items-center gap-2 font-medium">
                  <LogIn className="h-4 w-4" /> Please sign in to view your
                  receipt.
                </div>
                <Button size="sm" onClick={() => router.push("/auth")}>
                  Sign in
                </Button>
              </div>
            )}
            {error && (
              <div className="rounded-2xl border border-red-300 bg-red-50 p-4 text-red-800 flex items-center gap-2">
                <ShieldAlert className="h-4 w-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Reference + Amount + Method */}
            <div className="rounded-2xl border border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-500">Reference ID</div>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1"
                  onClick={copyRef}
                  disabled={!refId}
                >
                  <Copy className="h-4 w-4" /> Copy
                </Button>
              </div>
              <div className="mt-1 text-xl font-mono font-semibold tracking-wider break-all">
                {refId || "—"}
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
                  <div className="text-xs text-slate-500">Amount Due</div>
                  <div className="text-lg md:text-xl font-semibold">
                    ₱
                    {Number(amount || 0).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                </div>
                <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
                  <div className="text-xs text-slate-500">Payment Method</div>
                  <div className="flex items-center gap-2 text-base font-medium">
                    <Wallet className="h-4 w-4" />
                    {paymentMethod === "counter" || paymentMethod === "otc"
                      ? "Pay on the Counter"
                      : paymentMethod}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div className="rounded-2xl border border-slate-200 p-4">
              <div className="text-sm font-semibold text-slate-700 mb-2">
                Order Details
              </div>
              {loading || checkingAuth ? (
                <div className="text-slate-500 text-sm">Loading receipt…</div>
              ) : !card ? (
                <div className="text-slate-500 text-sm">No keycard found.</div>
              ) : (
                <div className="space-y-1">
                  <LabelValue
                    label="Item"
                    value={isVIP ? "VIP Keycard (OTC)" : "Basic Keycard (OTC)"}
                  />
                  <div className="grid grid-cols-12 gap-3 py-1 text-sm">
                    <div className="col-span-5 text-slate-500">
                      Keycard Type
                    </div>
                    <div className="col-span-7 font-medium text-slate-900 break-words flex items-center gap-2">
                      {isVIP ? (
                        <Star className="h-4 w-4 text-yellow-600" />
                      ) : (
                        <CreditCard className="h-4 w-4 text-slate-700" />
                      )}
                      <span>{isVIP ? "VIP" : "Basic"}</span>
                    </div>
                  </div>
                  <LabelValue label="Keycard ID" value={keyId || "—"} />
                  <LabelValue label="Valid Until" value={validUntil} />
                  <LabelValue
                    label="Created at"
                    value={
                      card?.created_at
                        ? new Date(card.created_at).toLocaleString()
                        : undefined
                    }
                  />
                </div>
              )}
            </div>
          </div>
        </CardContent>

        <Separator />
        <CardFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Check className="h-4 w-4" /> Reference:{" "}
            <span className="font-mono">{refId || "—"}</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push("/services")}>
              Back to Services
            </Button>
            <Button
              variant="outline"
              className="gap-2"
              onClick={printReceipt}
              disabled={!card}
            >
              <Printer className="h-4 w-4" /> Print
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
