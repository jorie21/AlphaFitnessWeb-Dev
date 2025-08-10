import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import Image from "next/image";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { personalTraining } from "@/constant/services";
import { fitnessCoach } from "@/constant/services";
import coach from "@/public/icons/coach.png";
import PackageDeals from "./PackageDeals";
import PerSessionRates from "./PerSessionRates";
import FitnessTrainingCoach from "./FitnessTrainingCoach";

export default function PersonalTrainingPage() {
  return (
    <section className="flex flex-col justify-center items-center lg:gap-8 space-y-5">
      <div className="text-center space-y-2">
        <h1 className="font-russo text-4xl">Personal Training</h1>
        <p className="text-base leading-relaxed max-w-prose font-arone opacity-70">
          Get personalized attention with our expert trainers
        </p>
      </div>

      <PackageDeals />
      <PerSessionRates />
      <FitnessTrainingCoach />
    </section>
  );
}
