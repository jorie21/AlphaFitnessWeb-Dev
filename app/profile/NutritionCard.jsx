"use client";

import React, { useState } from "react";
import { GiMeal, GiFruitBowl } from "react-icons/gi";
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

export default function NutritionCard() {
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
    // Handle form submission
    console.log("Form data:", formData);
    setOpen(false);
  };

  return (
    <section className="shadow-xl rounded-lg w-full p-8 flex flex-col justify-between ">
      <div className="flex gap-2 items-center">
        <GiFruitBowl size={40} color="#4CAF50" />
        <div>
          <h1 className="font-russo text-2xl">Nutrition Recommendations</h1>
          <span className="text-black/70 font-aron text-sm">
            Get personalized nutrition and workout plans based on your profile
          </span>
        </div>
      </div>

      <div className="flex flex-col justify-center items-center gap-6 ">
        <div className="p-3 rounded-full bg-gradient-to-r from-green-500 via-lime-400 to-green-300">
          <GiFruitBowl size={40} color="white" />
        </div>

        <div className="text-center space-y-2">
          <h2 className="text-2xl font-russo">Get Your Nutrition Plan</h2>
          <p className="font-arone opacity-70 text-sm max-w-md">
            Complete a quick assessment to receive personalized calorie,
            protein, and workout recommendations.
          </p>
        </div>

        {/* Start Assessment Button with Modal */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              variant={"secondaryGreen"}
              className="w-full text-white font-semibold py-3 px-6 rounded-lg max-w-xs"
            >
              Start Assessment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-russo">
                Nutrition Assessment Form
              </DialogTitle>
              <p className="font-arone opacity-70 text-sm">
                Help us create personalized nutrition and workout
                recommendations
              </p>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {/* Age */}
              <div className="space-y-2">
                <Label htmlFor="age" className="text-sm font-arone/bold">
                  Age
                </Label>
                <Input
                  id="age"
                  placeholder="Enter Your Age"
                  value={formData.age}
                  onChange={(e) => handleInputChange("age", e.target.value)}
                />
              </div>

              {/* Height */}
              <div className="space-y-2">
                <Label htmlFor="height" className="text-sm font-arone/bold">
                  Height (cm)
                </Label>
                <Input
                  id="height"
                  placeholder="Enter Your Height"
                  value={formData.height}
                  onChange={(e) => handleInputChange("height", e.target.value)}
                />
              </div>

              {/* Current Weight */}
              <div className="space-y-2">
                <Label htmlFor="weight" className="text-sm font-arone/bold">
                  Current Weight
                </Label>
                <Input
                  id="weight"
                  placeholder="Enter Your Weight"
                  value={formData.weight}
                  onChange={(e) => handleInputChange("weight", e.target.value)}
                />
              </div>

              {/* Activity Level */}
              <div className="space-y-2">
                <Label className="text-sm font-arone/bold">Activity Level</Label>
                <Select
                  value={formData.activityLevel}
                  onValueChange={(value) =>
                    handleInputChange("activityLevel", value)
                  }
                >
                  <SelectTrigger>
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
                <Label className="text-sm font-arone/bold">
                  Primary Fitness Goal
                </Label>
                <Select
                  value={formData.fitnessGoal}
                  onValueChange={(value) =>
                    handleInputChange("fitnessGoal", value)
                  }
                >
                  <SelectTrigger>
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
                <Label className="text-sm font-arone/bold">
                  Preferred Workout Frequency
                </Label>
                <Select
                  value={formData.workoutFrequency}
                  onValueChange={(value) =>
                    handleInputChange("workoutFrequency", value)
                  }
                >
                  <SelectTrigger>
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
              <Label htmlFor="dietary" className="text-sm font-arone/bold">
                Dietary Restrictions or Preferences
              </Label>
              <Textarea
                id="dietary"
                placeholder="Any dietary restrictions, allergies, or preferences (Vegetarian, keto, etc.)"
                value={formData.dietaryRestrictions}
                onChange={(e) =>
                  handleInputChange("dietaryRestrictions", e.target.value)
                }
                className="min-h-[80px]"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                className="flex-1 bg-green-500 hover:bg-green-600"
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
