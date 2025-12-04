// app/api/nutrition/recommendation/route.js
import { NextResponse } from "next/server";

// Simple helper to build a basic meal plan layout
function buildSimpleMealPlan({ calories, fitnessGoal, dietaryRestrictions, macros }) {
  const { proteinGrams, carbsGrams, fatGrams } = macros;

  const meals = [
    { id: "breakfast", label: "Breakfast", ratio: 0.25 },
    { id: "lunch", label: "Lunch", ratio: 0.30 },
    { id: "dinner", label: "Dinner", ratio: 0.30 },
    { id: "snacks", label: "Snacks", ratio: 0.15 },
  ];

  const prefs = (dietaryRestrictions || "").toLowerCase();
  const isVegan = prefs.includes("vegan");
  const isVegetarian = !isVegan && prefs.includes("vegetarian");

  const templates = {
    omnivore: {
      breakfast: [
        { name: "Oatmeal with berries and almonds" },
        { name: "Greek yogurt (low-fat)" },
      ],
      lunch: [
        { name: "Grilled chicken salad with quinoa" },
        { name: "Olive oil dressing" },
      ],
      dinner: [
        { name: "Baked salmon with sweet potato" },
        { name: "Brown rice (1/2 cup)" },
      ],
      snacks: [
        { name: "Apple with almond butter" },
        { name: "Protein shake" },
      ],
    },
    vegetarian: {
      breakfast: [
        { name: "Overnight oats with chia & berries" },
        { name: "Skim/soy milk" },
      ],
      lunch: [
        { name: "Lentil & veggie bowl" },
        { name: "Hummus with carrot sticks" },
      ],
      dinner: [
        { name: "Tofu stir-fry with mixed veggies" },
        { name: "Brown rice or quinoa" },
      ],
      snacks: [
        { name: "Greek yogurt with honey" },
        { name: "Mixed nuts (small handful)" },
      ],
    },
    vegan: {
      breakfast: [
        { name: "Oatmeal with banana & peanut butter" },
        { name: "Almond milk" },
      ],
      lunch: [
        { name: "Chickpea salad wrap" },
        { name: "Side green salad" },
      ],
      dinner: [
        { name: "Black bean & veggie chili" },
        { name: "Brown rice" },
      ],
      snacks: [
        { name: "Trail mix (nuts & seeds)" },
        { name: "Fresh fruit" },
      ],
    },
  };

  const templateKey = isVegan ? "vegan" : isVegetarian ? "vegetarian" : "omnivore";

  return meals.map((meal) => {
    const targetCals = Math.round((calories * meal.ratio) / 10) * 10;
    const items = templates[templateKey][meal.id] || [];
    const perItem = items.length
      ? Math.round(targetCals / items.length / 10) * 10
      : targetCals;

    return {
      id: meal.id,
      title: meal.label,
      calories: targetCals,
      items: items.map((item) => ({
        ...item,
        calories: perItem,
      })),
    };
  });
}

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      age,
      height,
      weight,
      activityLevel,
      fitnessGoal,
      workoutFrequency,
      dietaryRestrictions,
    } = body;

    const ageNum = Number(age);
    const heightNum = Number(height);
    const weightNum = Number(weight);

    if (
      !Number.isFinite(ageNum) ||
      !Number.isFinite(heightNum) ||
      !Number.isFinite(weightNum)
    ) {
      return NextResponse.json(
        { error: "Invalid age, height, or weight" },
        { status: 400 }
      );
    }

    // Activity factor (TDEE)
    const activityMap = {
      "sedentary": 1.2,
      "lightly-active": 1.375,
      "moderately-active": 1.55,
      "very-active": 1.725,
      "extremely-active": 1.9,
    };
    const activityFactor = activityMap[activityLevel] || 1.375;

    // Goal factor
    let goalFactor = 1;
    switch (fitnessGoal) {
      case "lose-weight":
        goalFactor = 0.8; // ~20% deficit
        break;
      case "gain-weight":
      case "build-muscle":
        goalFactor = 1.1; // ~10% surplus
        break;
      case "improve-endurance":
        goalFactor = 1.05;
        break;
      case "maintain-weight":
      default:
        goalFactor = 1;
    }

    // BMR (Mifflin-St Jeor, assume male by default – you can add gender later) :contentReference[oaicite:0]{index=0}
    const bmr = 10 * weightNum + 6.25 * heightNum - 5 * ageNum + 5;
    const tdee = bmr * activityFactor;
    const targetCalories = Math.round((tdee * goalFactor) / 10) * 10;

    // Macro rules based on goal
    let proteinPerKg = 1.6;
    let fatPerKg = 0.8;

    if (fitnessGoal === "lose-weight") {
      proteinPerKg = 1.8;
      fatPerKg = 0.8;
    } else if (fitnessGoal === "gain-weight" || fitnessGoal === "build-muscle") {
      proteinPerKg = 2.0;
      fatPerKg = 1.0;
    } else if (fitnessGoal === "improve-endurance") {
      proteinPerKg = 1.7;
      fatPerKg = 0.9;
    }

    const proteinGrams = Math.round(weightNum * proteinPerKg);
    const fatGrams = Math.round(weightNum * fatPerKg);

    const calsFromProtein = proteinGrams * 4;
    const calsFromFat = fatGrams * 9;
    let remainingCalories = targetCalories - (calsFromProtein + calsFromFat);

    if (remainingCalories < targetCalories * 0.2) {
      remainingCalories = Math.max(targetCalories * 0.2, remainingCalories);
    }

    const carbsGrams = Math.max(0, Math.round(remainingCalories / 4));

    const mealPlan = buildSimpleMealPlan({
      calories: targetCalories,
      fitnessGoal,
      dietaryRestrictions,
      macros: { proteinGrams, carbsGrams, fatGrams },
    });

    return NextResponse.json({
      calories: targetCalories,
      protein: proteinGrams,
      carbs: carbsGrams,
      fats: fatGrams,
      mealPlan,
    });
  } catch (err) {
    console.error("Nutrition recommendation error:", err);
    return NextResponse.json(
      { error: "Failed to generate recommendation" },
      { status: 500 }
    );
  }
}
