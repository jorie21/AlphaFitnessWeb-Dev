//app/services/group-classes/page.jsx
"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, UsersRound } from "lucide-react";
import { GroupClasses, timeSlots } from "@/constant/services";
import { useAuth } from "@/context/authContext";
import { toast } from "sonner";

export default function GroupClassesPage() {
  const { user } = useAuth();

  const handleCheckout = async () => {
    if (!user) {
      toast.error("Please log in first.");
      return;
    }
    
    try {
      const res = await fetch("/api/services/group-classes/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          className: "Group Classes", // Default to the overall package name
          price: 2599, // Matches the displayed price (₱2,599)
          // paymentMethod: "online",  // Optional: Remove if not needed
        }),
      });

      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url; // ✅ redirect to Stripe checkout
      } else {
        toast.error(data.error || "Something went wrong.");
      }
    } catch (error) {
      console.error("Checkout Error:", error);
      toast.error("Failed to start checkout.");
    }
  };

  return (
    <section className="screen px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col justify-center items-center gap-6 sm:gap-8 lg:gap-12">
      <div className="space-y-6 sm:space-y-8 w-full sm:w-auto">
        {/* Header */}
        <div className="text-center place-items-center w-full space-y-2 px-2">
          <h1 className="font-russo text-[20px] sm:text-[24px] lg:text-3xl leading-snug">
            Group Classes
          </h1>
          <p className="text-sm sm:text-base leading-relaxed max-w-prose font-arone opacity-70">
            Join our expert-led group training sessions.
          </p>
        </div>

        {/* Card */}
        <div className="place-content-center w-full">
          <Card className="relative justify-between w-full sm:w-auto p-4 sm:p-5 overflow-hidden gradient-border">
            {/* Card Icon */}
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 rounded-lg w-fit">
                <UsersRound className="h-8 w-8 text-secondary" />
              </div>
              <CardTitle className="text-xl sm:text-2xl font-russo">
                Group Classes
              </CardTitle>
            </CardHeader>

            <CardContent className="text-center space-y-6">
              <div className="space-y-1 font-arone">
                <div className="text-3xl sm:text-4xl font-russo text-secondary">
                  ₱2,599
                </div>
                <p className="text-xs sm:text-sm text-gray-500">
                  1 Month Unlimited
                </p>
                <p className="text-sm sm:text-base font-bold text-black">
                  Available Classes:
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
                {GroupClasses.map((className) => (
                  <Button
                    key={className}
                    variant="outline"
                    className="bg-white gradient-border px-3 py-1 text-xs sm:text-sm"
                  >
                    {className}
                  </Button>
                ))}
              </div>
            </CardContent>

            {/* Footer */}
            <CardFooter className="pt-4 flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
              <div className="w-full flex justify-center items-center lg:flex lg:justify-start">
                <div className="flex gap-3 sm:gap-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex gap-2 items-center">
                      <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="font-arone font-bold text-sm sm:text-base">
                        Monday - Saturday:
                      </span>
                    </div>
                    <ul className="pl-6 sm:pl-0">
                      {timeSlots.map((time, index) => (
                        <li
                          key={index}
                          className="text-arone opacity-70 text-xs sm:text-sm"
                        >
                          {time}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="w-full sm:flex-1">
                <Button
                  onClick={handleCheckout}
                  variant="secondary"
                  className="text-white w-full text-sm sm:text-base"
                  disabled={!user}
                >
                  {!user? "Please Login First" : "Join Group Classes"}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
}
