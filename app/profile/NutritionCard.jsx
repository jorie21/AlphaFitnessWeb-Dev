"use client";

import React, { useState } from "react";
import { GiFruitBowl, GiPadlock } from "react-icons/gi";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function NutritionCard({ isUnlocked = true }) {
  const [open, setOpen] = useState(false);
  const [mealPlanOpen, setMealPlanOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [recommendation, setRecommendation] = useState(null);

  const [formData, setFormData] = useState({
    age: "",
    height: "",
    weight: "",
    activityLevel: "",
    fitnessGoal: "",
    workoutFrequency: "",
    dietaryRestrictions: "",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setApiError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/nutrition/recommendation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate plan");

      setRecommendation(data);
      setOpen(false);
    } catch (err) {
      console.error("Nutrition form error:", err);
      setApiError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className={`shadow-xl rounded-xl w-full p-8 flex flex-col justify-between relative transition-all duration-300 bg-gradient-to-br from-white to-green-50/30 border border-green-100 ${
        isUnlocked ? "opacity-100" : "opacity-50 grayscale pointer-events-none"
      }`}
    >
      {/* Locked Overlay */}
      {!isUnlocked && (
        <div className="absolute inset-0 bg-gray-300/80 backdrop-blur-[2px] flex flex-col items-center justify-center rounded-xl z-10">
          <GiPadlock size={60} className="text-gray-700 mb-3 drop-shadow-md" />
          <p className="font-russo text-xl text-gray-800 drop-shadow-sm">
            Locked Feature
          </p>
          <p className="text-gray-700 font-arone text-sm text-center max-w-xs mt-1">
            Unlock Gold status to access this feature.
          </p>
        </div>
      )}

      {/* Header (always visible) */}
      <div className="flex gap-3 items-center mb-4">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 shadow-sm border border-green-100">
          <GiFruitBowl size={32} className="text-green-600" />
        </div>
        <div>
          <h1 className="font-russo text-2xl text-gray-800">
            Nutrition Recommendations
          </h1>
          <span className="text-gray-600 font-arone text-sm">
            Personalized nutrition and workout plans
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col justify-center items-center gap-5">
        {/* Icon only BEFORE first result */}
        {!recommendation && (
          <div className="p-4 rounded-2xl bg-gradient-to-br from-green-500 via-emerald-400 to-green-400 shadow-lg">
            <GiFruitBowl size={48} color="white" />
          </div>
        )}

        {/* Title + description only BEFORE first result */}
        {!recommendation && (
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-russo text-gray-800">
              Get Your Nutrition Plan
            </h2>
            <p className="font-arone text-gray-600 text-sm max-w-md leading-relaxed">
              Complete a quick assessment to receive personalized calorie,
              protein, carb, and fat recommendations tailored to your goals.
            </p>
          </div>
        )}

        {/* Macro Result Cards (AFTER recommendation exists) */}
        {recommendation && (
          <div className="w-full max-w-xl mt-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Calories */}
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 flex flex-col">
                <span className="text-xs font-arone text-emerald-700 uppercase tracking-wide">
                  Daily Calories
                </span>
                <span className="font-russo text-3xl text-emerald-900">
                  {recommendation.calories.toLocaleString()}{" "}
                  <span className="text-base">kcal</span>
                </span>
                <span className="text-[11px] text-emerald-700">
                  Based on your goal &amp; activity
                </span>
              </div>

              {/* Protein */}
              <div className="rounded-2xl border border-purple-100 bg-purple-50 px-4 py-3 flex flex-col">
                <span className="text-xs font-arone text-purple-700 uppercase tracking-wide">
                  Protein Target
                </span>
                <span className="font-russo text-3xl text-purple-900">
                  {recommendation.protein}g
                </span>
                <span className="text-[11px] text-purple-700">
                  Support muscle &amp; recovery
                </span>
              </div>

              {/* Carbs */}
              <div className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 flex flex-col">
                <span className="text-xs font-arone text-sky-700 uppercase tracking-wide">
                  Carbs
                </span>
                <span className="font-russo text-3xl text-sky-900">
                  {recommendation.carbs}g
                </span>
                <span className="text-[11px] text-sky-700">
                  Main energy source
                </span>
              </div>

              {/* Fats */}
              <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 flex flex-col">
                <span className="text-xs font-arone text-rose-700 uppercase tracking-wide">
                  Fats
                </span>
                <span className="font-russo text-3xl text-rose-900">
                  {recommendation.fats}g
                </span>
                <span className="text-[11px] text-rose-700">
                  Hormones &amp; joint health
                </span>
              </div>
            </div>

            {/* Actions under macros */}
            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <Button
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-arone font-semibold"
                onClick={() => setMealPlanOpen(true)}
              >
                View Meal Plan
              </Button>
              <Button
                variant="outline"
                className="flex-1 font-arone text-gray-700 border-gray-300"
                disabled
              >
                View Workout Plan (soon)
              </Button>
            </div>
          </div>
        )}

        {/* Assessment Dialog */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              variant={"secondaryGreen"}
              className="mt-4 w-full text-white font-semibold py-3 px-8 rounded-xl max-w-xs shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              {recommendation ? "Retake Assessment" : "Start Assessment"}
            </Button>
          </DialogTrigger>

          {/* Modal Form */}
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-russo text-2xl">
                Nutrition Assessment Form
              </DialogTitle>
              <p className="font-arone text-gray-600 text-sm">
                Help us create personalized nutrition and workout
                recommendations.
              </p>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {/* Age */}
              <div className="space-y-2">
                <Label
                  htmlFor="age"
                  className="text-sm font-semibold text-gray-700"
                >
                  Age
                </Label>
                <Input
                  id="age"
                  placeholder="Enter Your Age"
                  value={formData.age}
                  onChange={(e) => handleInputChange("age", e.target.value)}
                  className="border-gray-300 focus:border-green-500"
                />
              </div>

              {/* Height */}
              <div className="space-y-2">
                <Label
                  htmlFor="height"
                  className="text-sm font-semibold text-gray-700"
                >
                  Height (cm)
                </Label>
                <Input
                  id="height"
                  placeholder="Enter Your Height"
                  value={formData.height}
                  onChange={(e) =>
                    handleInputChange("height", e.target.value)
                  }
                  className="border-gray-300 focus:border-green-500"
                />
              </div>

              {/* Weight */}
              <div className="space-y-2">
                <Label
                  htmlFor="weight"
                  className="text-sm font-semibold text-gray-700"
                >
                  Current Weight (kg)
                </Label>
                <Input
                  id="weight"
                  placeholder="Enter Your Weight"
                  value={formData.weight}
                  onChange={(e) =>
                    handleInputChange("weight", e.target.value)
                  }
                  className="border-gray-300 focus:border-green-500"
                />
              </div>

              {/* Activity Level */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">
                  Activity Level
                </Label>
                <Select
                  value={formData.activityLevel}
                  onValueChange={(value) =>
                    handleInputChange("activityLevel", value)
                  }
                >
                  <SelectTrigger className="border-gray-300 focus:border-green-500">
                    <SelectValue placeholder="Select Activity Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">Sedentary</SelectItem>
                    <SelectItem value="lightly-active">
                      Lightly Active
                    </SelectItem>
                    <SelectItem value="moderately-active">
                      Moderately Active
                    </SelectItem>
                    <SelectItem value="very-active">Very Active</SelectItem>
                    <SelectItem value="extremely-active">
                      Extremely Active
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Fitness Goal */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">
                  Primary Fitness Goal
                </Label>
                <Select
                  value={formData.fitnessGoal}
                  onValueChange={(value) =>
                    handleInputChange("fitnessGoal", value)
                  }
                >
                  <SelectTrigger className="border-gray-300 focus:border-green-500">
                    <SelectValue placeholder="Select Your Goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lose-weight">Lose Weight</SelectItem>
                    <SelectItem value="maintain-weight">
                      Maintain Weight
                    </SelectItem>
                    <SelectItem value="gain-weight">Gain Weight</SelectItem>
                    <SelectItem value="build-muscle">
                      Build Muscle
                    </SelectItem>
                    <SelectItem value="improve-endurance">
                      Improve Endurance
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Workout Frequency */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">
                  Preferred Workout Frequency
                </Label>
                <Select
                  value={formData.workoutFrequency}
                  onValueChange={(value) =>
                    handleInputChange("workoutFrequency", value)
                  }
                >
                  <SelectTrigger className="border-gray-300 focus:border-green-500">
                    <SelectValue placeholder="How Often?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-2-times">
                      1–2 times per week
                    </SelectItem>
                    <SelectItem value="3-4-times">
                      3–4 times per week
                    </SelectItem>
                    <SelectItem value="5-6-times">
                      5–6 times per week
                    </SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Dietary Restrictions */}
            <div className="space-y-2 mt-4">
              <Label
                htmlFor="dietary"
                className="text-sm font-semibold text-gray-700"
              >
                Dietary Restrictions or Preferences
              </Label>
              <Textarea
                id="dietary"
                placeholder="Any dietary restrictions, allergies, or preferences (vegetarian, vegan, keto, etc.)"
                value={formData.dietaryRestrictions}
                onChange={(e) =>
                  handleInputChange("dietaryRestrictions", e.target.value)
                }
                className="min-h-[80px] border-gray-300 focus:border-green-500"
              />
            </div>

            {apiError && (
              <p className="text-sm text-red-600 mt-2">{apiError}</p>
            )}

            {/* Buttons */}
            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                className="flex-1 border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-md hover:shadow-lg transition-all"
              >
                {loading ? "Generating..." : "Generate Recommendation"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Meal Plan Dialog */}
      <Dialog open={mealPlanOpen} onOpenChange={setMealPlanOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-russo text-2xl">
              Your Personalized Meal Plan
            </DialogTitle>
            {recommendation && (
              <p className="font-arone text-gray-600 text-sm">
                Based on your goal and{" "}
                {recommendation.calories.toLocaleString()} daily calories.
              </p>
            )}
          </DialogHeader>

          {recommendation?.mealPlan?.map((meal) => (
            <div
              key={meal.id}
              className="mt-4 rounded-2xl px-5 py-4 border bg-white shadow-sm"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-russo text-lg text-gray-800">
                  {meal.title} ({meal.calories} cal)
                </h3>
              </div>
              <div className="grid grid-cols-[1.5fr_auto] gap-y-1 font-arone text-sm text-gray-700">
                {meal.items.map((item, idx) => (
                  <React.Fragment key={idx}>
                    <span>{item.name}</span>
                    <span className="text-right text-gray-900 font-semibold">
                      {item.calories} cal
                    </span>
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}

          <div className="mt-6 flex justify-end">
            <Button className="bg-green-600 hover:bg-green-700 text-white font-arone font-semibold">
              Download Meal Plan
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
