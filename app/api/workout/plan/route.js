// app/api/workout/plan/route.js
import { NextResponse } from "next/server";

const API_NINJAS_KEY = process.env.API_NINJAS_KEY;

function mapDifficulty(activityLevel) {
  switch (activityLevel) {
    case "sedentary":
      return "beginner";
    case "lightly-active":
    case "moderately-active":
      return "intermediate";
    case "very-active":
    case "extremely-active":
      return "advanced";
    default:
      return "beginner";
  }
}

function mapSessions(freq) {
  switch (freq) {
    case "1-2-times":
      return 2;
    case "3-4-times":
      return 4;
    case "5-6-times":
      return 5;
    case "daily":
      return 6;
    default:
      return 3;
  }
}

function goalDescription(goal) {
  switch (goal) {
    case "lose-weight":
      return "Mix of strength and cardio to burn fat while keeping muscle.";
    case "build-muscle":
    case "gain-weight":
      return "Strength-focused split to build size and strength.";
    case "improve-endurance":
      return "Endurance-focused plan with more cardio volume.";
    case "maintain-weight":
    default:
      return "Balanced plan to maintain weight and overall fitness.";
  }
}

export async function POST(req) {
  if (!API_NINJAS_KEY) {
    return NextResponse.json(
      { error: "Server missing API_NINJAS_KEY env var" },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const { fitnessGoal, workoutFrequency, activityLevel } = body || {};

    if (!fitnessGoal || !workoutFrequency || !activityLevel) {
      return NextResponse.json(
        { error: "Missing fitnessGoal, workoutFrequency or activityLevel" },
        { status: 400 }
      );
    }

    const difficulty = mapDifficulty(activityLevel);
    const sessionsPerWeek = mapSessions(workoutFrequency);

    const musclesByGoal = {
      "lose-weight": [
        "quadriceps",
        "hamstrings",
        "glutes",
        "back",
        "chest",
        "abdominals",
      ],
      "build-muscle": [
        "chest",
        "back",
        "shoulders",
        "biceps",
        "triceps",
        "quadriceps",
        "hamstrings",
      ],
      "gain-weight": [
        "chest",
        "back",
        "shoulders",
        "biceps",
        "triceps",
        "quadriceps",
        "hamstrings",
      ],
      "improve-endurance": ["quadriceps", "hamstrings", "calves", "abdominals"],
      "maintain-weight": ["chest", "back", "quadriceps", "hamstrings", "abdominals"],
    };

    const muscles =
      musclesByGoal[fitnessGoal] || musclesByGoal["maintain-weight"];

    let allExercises = [];

    // Call API Ninjas for a few muscles (each call returns up to 5 exercises)
    for (const muscle of muscles) {
      const url = new URL("https://api.api-ninjas.com/v1/exercises");
      url.searchParams.set("type", "strength");
      url.searchParams.set("muscle", muscle);
      url.searchParams.set("difficulty", difficulty);

      const res = await fetch(url.toString(), {
        headers: { "X-Api-Key": API_NINJAS_KEY },
        cache: "no-store",
      });

      if (!res.ok) {
        console.error("Exercise API error", res.status, muscle);
        continue;
      }

      const data = await res.json();
      if (Array.isArray(data)) {
        allExercises = allExercises.concat(data);
      }
    }

    if (!allExercises.length) {
      return NextResponse.json(
        { error: "No exercises found for your settings" },
        { status: 502 }
      );
    }

    // Shuffle exercises (Fisher–Yates)
    for (let i = allExercises.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allExercises[i], allExercises[j]] = [allExercises[j], allExercises[i]];
    }

    const exercisesPerDay = 5;
    const days = [];
    let index = 0;

    for (let day = 1; day <= sessionsPerWeek; day++) {
      const slice = allExercises.slice(index, index + exercisesPerDay);
      if (!slice.length) break;
      index += exercisesPerDay;

      days.push({
        dayLabel: `Day ${day}`,
        focus:
          sessionsPerWeek >= 4
            ? day % 2 === 0
              ? "Lower body & core"
              : "Upper body"
            : "Full body",
        exercises: slice.map((e) => ({
          name: e.name,
          muscle: e.muscle,
          type: e.type,
          equipment: e.equipment,
          difficulty: e.difficulty,
          instructions: e.instructions,
        })),
      });
    }

    return NextResponse.json({
      sessionsPerWeek,
      styleDescription: goalDescription(fitnessGoal),
      days,
    });
  } catch (err) {
    console.error("Workout plan error:", err);
    return NextResponse.json(
      { error: "Failed to generate workout plan" },
      { status: 500 }
    );
  }
}
