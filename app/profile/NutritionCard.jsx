"use client";

import React, { useState } from "react";
import { GiMeal, GiFruitBowl, GiPadlock } from "react-icons/gi";
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

  const handleSubmit = () => {
    console.log("Form data:", formData);
    setOpen(false);
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

      {/* Header */}
      <div className="flex gap-3 items-center mb-4">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 shadow-sm border border-green-100">
          <GiFruitBowl size={32} className="text-green-600" />
        </div>
        <div>
          <h1 className="font-russo text-2xl text-gray-800">Nutrition Recommendations</h1>
          <span className="text-gray-600 font-aron text-sm">
            Personalized nutrition and workout plans
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col justify-center items-center gap-5">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-green-500 via-emerald-400 to-green-400 shadow-lg">
          <GiFruitBowl size={48} color="white" />
        </div>

        <div className="text-center space-y-2">
          <h2 className="text-2xl font-russo text-gray-800">Get Your Nutrition Plan</h2>
          <p className="font-arone text-gray-600 text-sm max-w-md leading-relaxed">
            Complete a quick assessment to receive personalized calorie,
            protein, and workout recommendations tailored to your goals.
          </p>
        </div>

        {/* Start Assessment Button */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              variant={"secondaryGreen"}
              className="w-full text-white font-semibold py-3 px-8 rounded-xl max-w-xs shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              Start Assessment
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
                recommendations
              </p>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {/* Age */}
              <div className="space-y-2">
                <Label htmlFor="age" className="text-sm font-semibold text-gray-700">
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
                <Label htmlFor="height" className="text-sm font-semibold text-gray-700">
                  Height (cm)
                </Label>
                <Input
                  id="height"
                  placeholder="Enter Your Height"
                  value={formData.height}
                  onChange={(e) => handleInputChange("height", e.target.value)}
                  className="border-gray-300 focus:border-green-500"
                />
              </div>

              {/* Current Weight */}
              <div className="space-y-2">
                <Label htmlFor="weight" className="text-sm font-semibold text-gray-700">
                  Current Weight (kg)
                </Label>
                <Input
                  id="weight"
                  placeholder="Enter Your Weight"
                  value={formData.weight}
                  onChange={(e) => handleInputChange("weight", e.target.value)}
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

              {/* Primary Fitness Goal */}
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
                    <SelectItem value="build-muscle">Build Muscle</SelectItem>
                    <SelectItem value="improve-endurance">
                      Improve Endurance
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Preferred Workout Frequency */}
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
                      1-2 times per week
                    </SelectItem>
                    <SelectItem value="3-4-times">
                      3-4 times per week
                    </SelectItem>
                    <SelectItem value="5-6-times">
                      5-6 times per week
                    </SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Dietary Restrictions */}
            <div className="space-y-2 mt-4">
              <Label htmlFor="dietary" className="text-sm font-semibold text-gray-700">
                Dietary Restrictions or Preferences
              </Label>
              <Textarea
                id="dietary"
                placeholder="Any dietary restrictions, allergies, or preferences (Vegetarian, keto, etc.)"
                value={formData.dietaryRestrictions}
                onChange={(e) =>
                  handleInputChange("dietaryRestrictions", e.target.value)
                }
                className="min-h-[80px] border-gray-300 focus:border-green-500"
              />
            </div>

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
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-md hover:shadow-lg transition-all"
              >
                Generate Recommendation
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}