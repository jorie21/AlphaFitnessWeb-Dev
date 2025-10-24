"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Check, Clock, Copy, Printer, Ticket, Wallet } from "lucide-react";
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

// -------- UI helpers ----------------------------------------------------
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
  if (value == null || value === "") return null;
  return (
    <div className="grid grid-cols-12 gap-3 py-1 text-sm">
      <div className="col-span-5 text-slate-500">{label}</div>
      <div className="col-span-7 font-medium text-slate-900 break-words">
        {value}
      </div>
    </div>
  );
}

// -------- Data fetchers -------------------------------------------------
async function fetchMembership(referenceId) {
  const { data, error } = await supabase
    .from("memberships")
    .select(
      "reference_id, price, status, payment_method, created_at, plan_title, start_date, end_date, total_months, days_left, keycard_id"
    )
    .eq("reference_id", referenceId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data || null;
}

async function fetchGroupClass(referenceId) {
  const { data, error } = await supabase
    .from("group_classes")
    .select(
      "reference_id, price, status, payment_method, created_at, class_name, start_date, end_date, total_days, keycard_id"
    )
    .eq("reference_id", referenceId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data || null;
}

async function fetchPersonal(referenceId) {
  const { data, error } = await supabase
    .from("personal_training")
    .select(
      "reference_id, price, status, payment_method, created_at, training_type, title"
    )
    .eq("reference_id", referenceId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data || null;
}

// -------- Page ----------------------------------------------------------
export default function ReceiptPage() {
  const router = useRouter();
  const params = useSearchParams();
  const refId = params.get("reference_id") || params.get("referenceId") || "";
  const serviceParam = (params.get("service") || "").toLowerCase();

  const [serviceType, setServiceType] = useState(serviceParam || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [membership, setMembership] = useState(null);
  const [groupClass, setGroupClass] = useState(null);
  const [personal, setPersonal] = useState(null);

  const title = useMemo(() => {
    if (serviceType === "membership") return "Membership Receipt";
    if (serviceType === "group_class") return "Group Class Receipt";
    if (serviceType === "personal_training")
      return "Personal Training Receipt";
    return "Service Receipt";
  }, [serviceType]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!refId) {
        setError("Missing reference_id in URL.");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        if (serviceParam === "membership") {
          const m = await fetchMembership(refId);
          if (m) {
            setMembership(m);
            setServiceType("membership");
          }
        } else if (serviceParam === "group_class") {
          const g = await fetchGroupClass(refId);
          if (g) {
            setGroupClass(g);
            setServiceType("group_class");
          }
        } else if (serviceParam === "personal_training") {
          const p = await fetchPersonal(refId);
          if (p) {
            setPersonal(p);
            setServiceType("personal_training");
          }
        } else {
          const [m, g, p] = await Promise.all([
            fetchMembership(refId).catch(() => null),
            fetchGroupClass(refId).catch(() => null),
            fetchPersonal(refId).catch(() => null),
          ]);
          if (m) {
            setMembership(m);
            setServiceType("membership");
          } else if (g) {
            setGroupClass(g);
            setServiceType("group_class");
          } else if (p) {
            setPersonal(p);
            setServiceType("personal_training");
          } else {
            setError("No matching receipt found. Check your reference code.");
          }
        }
      } catch (e) {
        setError(e?.message || "Failed to load receipt.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [refId]);

  const copyRef = async () => {
    if (!refId) return;
    try {
      await navigator.clipboard.writeText(refId);
    } catch {}
  };

  const printReceipt = () => window.print();

  const amountRaw =
    membership?.price ?? groupClass?.price ?? personal?.price ?? 0;
  const amount =
    typeof amountRaw === "number"
      ? amountRaw
      : parseFloat(String(amountRaw));
  const status = (
    membership?.status ??
    groupClass?.status ??
    personal?.status ??
    "pending"
  ).toString();
  const paymentMethod = (
    membership?.payment_method ??
    groupClass?.payment_method ??
    personal?.payment_method ??
    "counter"
  ).toString();

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
          {/* Left column */}
          <div className="md:col-span-5 space-y-4">
            {/* Reference + Amount */}
            <div className="rounded-2xl border border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-500">Reference ID</div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1"
                    onClick={copyRef}
                  >
                    <Copy className="h-4 w-4" /> Copy
                  </Button>
                </div>
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

            {/* Details section */}
            <div className="rounded-2xl border border-slate-200 p-4">
              <div className="text-sm font-semibold text-slate-700 mb-2">
                Order Details
              </div>
              {loading && (
                <div className="text-slate-500 text-sm">Loading receipt…</div>
              )}
              {error && <div className="text-red-600 text-sm">{error}</div>}
              {!loading && !error && (
                <div className="space-y-1">
                  {membership && (
                    <>
                      <LabelValue
                        label="Service"
                        value={membership.plan_title || "Membership"}
                      />
                      <LabelValue
                        label="Start date"
                        value={
                          membership.start_date
                            ? new Date(
                                membership.start_date
                              ).toLocaleString()
                            : "—"
                        }
                      />
                      <LabelValue
                        label="End date"
                        value={
                          membership.end_date
                            ? new Date(membership.end_date).toLocaleString()
                            : "—"
                        }
                      />
                      <LabelValue
                        label="Months"
                        value={String(membership.total_months)}
                      />
                      <LabelValue
                        label="Days left"
                        value={String(membership.days_left)}
                      />
                      <LabelValue
                        label="Keycard"
                        value={membership.keycard_id || "—"}
                      />
                    </>
                  )}

                  {groupClass && (
                    <>
                      <LabelValue
                        label="Class"
                        value={groupClass.class_name}
                      />
                      <LabelValue
                        label="Start date"
                        value={
                          groupClass.start_date
                            ? new Date(
                                groupClass.start_date
                              ).toLocaleString()
                            : "—"
                        }
                      />
                      <LabelValue
                        label="End date"
                        value={
                          groupClass.end_date
                            ? new Date(groupClass.end_date).toLocaleString()
                            : "—"
                        }
                      />
                      <LabelValue
                        label="Total days"
                        value={String(groupClass.total_days)}
                      />
                      <LabelValue
                        label="Keycard"
                        value={groupClass.keycard_id || "—"}
                      />
                    </>
                  )}

                  {personal && (
                    <>
                      <LabelValue
                        label="Training"
                        value={`${personal.title} (${personal.training_type})`}
                      />
                    </>
                  )}

                  <LabelValue
                    label="Created at"
                    value={
                      membership?.created_at ||
                      groupClass?.created_at ||
                      personal?.created_at
                        ? new Date(
                            membership?.created_at ||
                              groupClass?.created_at ||
                              personal?.created_at
                          ).toLocaleString()
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
            <Button variant="outline" className="gap-2" onClick={printReceipt}>
              <Printer className="h-4 w-4" /> Print
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
