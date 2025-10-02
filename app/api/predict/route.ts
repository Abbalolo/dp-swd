import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { spawn } from 'child_process';
import fs from 'fs';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// 🍽️ Meal Recommendations Database
const mealRecommendations:any = {
  diabetic: {
    breakfast: [
      {
        name: "Oatmeal with Berries",
        description: "High-fiber oatmeal with fresh berries and nuts",
        calories: 300,
        carbs: 45,
        protein: 12,
        ingredients: ["1/2 cup oats", "1/2 cup mixed berries", "1 tbsp almonds", "1 cup unsweetened almond milk"]
      },
      {
        name: "Greek Yogurt Parfait",
        description: "Protein-rich yogurt with low-glycemic fruits",
        calories: 250,
        carbs: 20,
        protein: 18,
        ingredients: ["1 cup Greek yogurt", "1/2 cup blueberries", "1 tbsp chia seeds", "1 tsp cinnamon"]
      }
    ],
    lunch: [
      {
        name: "Quinoa Salad",
        description: "Protein-packed quinoa with vegetables and lean protein",
        calories: 400,
        carbs: 35,
        protein: 20,
        ingredients: ["1/2 cup cooked quinoa", "2 cups mixed greens", "4 oz grilled chicken", "1/4 avocado", "lemon vinaigrette"]
      },
      {
        name: "Vegetable Stir-fry",
        description: "Colorful vegetables with tofu in light sauce",
        calories: 350,
        carbs: 25,
        protein: 15,
        ingredients: ["2 cups mixed vegetables", "4 oz tofu", "1 tsp olive oil", "low-sodium soy sauce", "ginger & garlic"]
      }
    ],
    dinner: [
      {
        name: "Baked Salmon",
        description: "Omega-3 rich salmon with roasted vegetables",
        calories: 450,
        carbs: 20,
        protein: 35,
        ingredients: ["6 oz salmon fillet", "2 cups roasted vegetables", "1 tsp olive oil", "lemon herbs"]
      },
      {
        name: "Turkey Meatballs",
        description: "Lean turkey meatballs with zucchini noodles",
        calories: 400,
        carbs: 15,
        protein: 30,
        ingredients: ["4 oz ground turkey", "2 cups zucchini noodles", "sugar-free marinara", "herbs & spices"]
      }
    ],
    snacks: [
      {
        name: "Apple with Almond Butter",
        description: "Fiber-rich apple with healthy fats",
        calories: 150,
        carbs: 20,
        protein: 5,
        ingredients: ["1 medium apple", "1 tbsp almond butter"]
      },
      {
        name: "Vegetable Sticks with Hummus",
        description: "Crunchy vegetables with protein dip",
        calories: 120,
        carbs: 15,
        protein: 6,
        ingredients: ["carrot sticks", "celery sticks", "bell peppers", "1/4 cup hummus"]
      }
    ]
  },
  nonDiabetic: {
    breakfast: [
      {
        name: "Whole Grain Toast with Eggs",
        description: "Balanced breakfast with complex carbs and protein",
        calories: 350,
        carbs: 30,
        protein: 18,
        ingredients: ["2 slices whole grain bread", "2 eggs", "1/2 avocado", "spinach leaves"]
      }
    ],
    lunch: [
      {
        name: "Mediterranean Bowl",
        description: "Heart-healthy Mediterranean ingredients",
        calories: 420,
        carbs: 40,
        protein: 22,
        ingredients: ["1/2 cup brown rice", "3 oz grilled chicken", "cucumber", "tomatoes", "feta cheese", "olive oil"]
      }
    ],
    dinner: [
      {
        name: "Lean Beef with Sweet Potato",
        description: "Iron-rich meal with complex carbohydrates",
        calories: 480,
        carbs: 35,
        protein: 32,
        ingredients: ["4 oz lean beef", "1 medium sweet potato", "steamed broccoli", "1 tsp olive oil"]
      }
    ],
    snacks: [
      {
        name: "Greek Yogurt with Honey",
        description: "Protein snack with natural sweetness",
        calories: 180,
        carbs: 22,
        protein: 15,
        ingredients: ["1 cup Greek yogurt", "1 tsp honey", "handful of walnuts"]
      }
    ]
  }
};

// 🏃 Lifestyle Recommendations
const lifestyleRecommendations = {
  diabetic: {
    exercise: [
      {
        type: "Aerobic Exercise",
        duration: "30 minutes",
        frequency: "5 days/week",
        examples: ["Brisk walking", "Cycling", "Swimming"],
        benefits: "Improves insulin sensitivity and blood sugar control"
      },
      {
        type: "Strength Training",
        duration: "20-30 minutes",
        frequency: "2-3 days/week",
        examples: ["Bodyweight exercises", "Resistance bands", "Light weights"],
        benefits: "Builds muscle mass to improve glucose metabolism"
      }
    ],
    sleep: [
      "Aim for 7-9 hours of quality sleep per night",
      "Maintain consistent sleep schedule",
      "Avoid screens 1 hour before bedtime",
      "Keep bedroom dark, quiet, and cool"
    ],
    stress: [
      "Practice daily meditation (10-15 minutes)",
      "Deep breathing exercises",
      "Yoga or tai chi",
      "Regular breaks during work"
    ],
    monitoring: [
      "Check blood sugar levels regularly",
      "Keep a food and activity journal",
      "Regular medical check-ups",
      "Monitor blood pressure weekly"
    ]
  },
  nonDiabetic: {
    exercise: [
      {
        type: "Cardiovascular Exercise",
        duration: "30-45 minutes",
        frequency: "3-5 days/week",
        examples: ["Running", "Dancing", "Sports"],
        benefits: "Maintains heart health and prevents weight gain"
      },
      {
        type: "Flexibility Training",
        duration: "15-20 minutes",
        frequency: "2-3 days/week",
        examples: ["Stretching", "Yoga", "Pilates"],
        benefits: "Improves mobility and prevents injury"
      }
    ],
    sleep: [
      "Maintain 7-8 hours of sleep nightly",
      "Establish relaxing bedtime routine",
      "Limit caffeine after 2 PM"
    ],
    stress: [
      "Regular physical activity",
      "Social connections",
      "Hobbies and leisure activities"
    ],
    monitoring: [
      "Annual health check-ups",
      "Maintain healthy weight",
      "Balanced diet with variety"
    ]
  }
};

// 🧠 Generate Personalized Recommendations
function generateRecommendations(prediction: any, userData: any) {
  const isDiabetic = prediction.class === 'Diabetic';
  const riskLevel = prediction.probability > 0.7 ? 'high' : prediction.probability > 0.4 ? 'medium' : 'low';
  
  const userAge = userData.age;
  const userBMI = userData.bmi;
  
  let personalizedMeals = isDiabetic ? mealRecommendations.diabetic : mealRecommendations.nonDiabetic;
  let personalizedLifestyle = isDiabetic ? lifestyleRecommendations.diabetic : lifestyleRecommendations.nonDiabetic;

  // Adjust based on BMI
  if (userBMI > 30) {
    personalizedMeals = {
      ...personalizedMeals,
      recommendations: ["Focus on portion control", "Increase vegetable intake", "Choose lean proteins"]
    };
  }

  // Adjust based on age
  if (userAge > 50) {
    personalizedLifestyle.exercise.push({
      type: "Low-Impact Exercise",
      duration: "20-30 minutes",
      frequency: "3-4 days/week",
      examples: ["Walking", "Swimming", "Chair exercises"],
      benefits: "Joint-friendly while maintaining fitness"
    });
  }

  return {
    meals: personalizedMeals,
    lifestyle: personalizedLifestyle,
    riskLevel,
    generalTips: generateGeneralTips(isDiabetic, riskLevel, userData)
  };
}

// 💡 General Health Tips
function generateGeneralTips(isDiabetic: boolean, riskLevel: string, userData: any) {
  const tips = [];
  
  if (isDiabetic || riskLevel === 'high') {
    tips.push(
      "Limit added sugars and refined carbohydrates",
      "Choose whole grains over processed grains",
      "Include protein with every meal",
      "Stay hydrated with water instead of sugary drinks",
      "Eat regular, balanced meals throughout the day"
    );
  } else {
    tips.push(
      "Maintain balanced diet with variety",
      "Stay physically active regularly",
      "Get adequate sleep each night",
      "Manage stress through healthy coping strategies",
      "Schedule regular health check-ups"
    );
  }

  // BMI-specific tips
  if (userData.bmi > 25) {
    tips.push("Focus on portion control and mindful eating");
  }

  // Age-specific tips
  if (userData.age > 45) {
    tips.push("Increase calcium and vitamin D intake for bone health");
  }

  return tips;
}

// 🧠 Python Model Integration
const pythonScript = `
import joblib
import numpy as np
import json
import sys

try:
    model_data = joblib.load('models/diabetes_model.joblib')
    model = model_data['model']
    scaler = model_data['scaler']
    
    input_data = json.loads(sys.argv[1])
    input_array = np.array([input_data])
    
    input_scaled = scaler.transform(input_array)
    prediction = model.predict(input_scaled)[0]
    probability = model.predict_proba(input_scaled)[0]
    
    result = {
        "success": True,
        "prediction": int(prediction),
        "probability": float(probability[1]),
        "class": "Diabetic" if prediction == 1 else "Non-Diabetic",
        "isRealModel": True
    }
    print(json.dumps(result))
    
except Exception as e:
    print(json.dumps({"error": str(e), "isRealModel": False}))
`;

async function callRealModel(formData: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const inputData = [
      formData.pregnancies,
      formData.glucose,
      formData.bloodPressure,
      formData.skinThickness,
      formData.insulin,
      formData.bmi,
      formData.diabetesPedigreeFunction,
      formData.age
    ];

    fs.writeFileSync('temp_predict.py', pythonScript);
    
    const pythonProcess = spawn('python', ['temp_predict.py', JSON.stringify(inputData)]);
    
    let stdout = '';
    let stderr = '';
    
    pythonProcess.stdout.on('data', (data) => stdout += data.toString());
    pythonProcess.stderr.on('data', (data) => stderr += data.toString());
    
    pythonProcess.on('close', (code) => {
      try { fs.unlinkSync('temp_predict.py'); } catch (e) {}
      
      if (code !== 0) {
        reject(new Error(`Python error: ${stderr}`));
        return;
      }
      
      try {
        const result = JSON.parse(stdout);
        resolve(result);
      } catch (e) {
        reject(new Error('Failed to parse Python output'));
      }
    });
    
    setTimeout(() => {
      pythonProcess.kill();
      reject(new Error('Python process timeout'));
    }, 5000);
  });
}

// 🧠 Mock Prediction Fallback
function mockPredictDiabetes(data: any): any {
  const riskFactors = [
    data.pregnancies > 3 ? 1 : 0,
    data.glucose > 140 ? 1 : 0,
    data.bloodPressure > 80 ? 1 : 0,
    data.bmi > 30 ? 1 : 0,
    data.age > 45 ? 1 : 0,
    data.diabetesPedigreeFunction > 0.8 ? 1 : 0,
  ];

  const riskScore = riskFactors.reduce((a, b) => a + b, 0);
  const probability = Math.min(0.95, riskScore * 0.15 + Math.random() * 0.1);

  return {
    prediction: probability > 0.5 ? 1 : 0,
    probability,
    class: probability > 0.5 ? "Diabetic" : "Non-Diabetic",
    isRealModel: false
  };
}

// ✅ Main Prediction API
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { formData, userId } = body;

    if (!userId || !formData) {
      return NextResponse.json({ error: "Missing userId or formData" }, { status: 400 });
    }

    // Validate required fields
    const requiredFields = [
      "pregnancies", "glucose", "bloodPressure", "skinThickness",
      "insulin", "bmi", "diabetesPedigreeFunction", "age",
    ];

    for (const field of requiredFields) {
      if (formData[field] === undefined || formData[field] === null) {
        return NextResponse.json({ error: `Missing field: ${field}` }, { status: 400 });
      }
    }

    let prediction;

    // Try real model first
    try {
      prediction = await callRealModel(formData);
      if (prediction.error) throw new Error(prediction.error);
    } catch (error) {
      console.log('Using mock prediction:', error);
      prediction = mockPredictDiabetes(formData);
    }

    // 🍽️ Generate personalized recommendations
    const recommendations = generateRecommendations(prediction, formData);

    // Combine prediction with recommendations
    const result = {
      ...prediction,
      recommendations: recommendations
    };

    // Save to database
    try {
      const { error: insertError } = await supabaseAdmin
        .from("predictions")
        .insert({
          user_id: userId,
          prediction_data: formData,
          prediction_result: prediction.class,
          confidence: prediction.probability,
          recommendations: recommendations,
          created_at: new Date().toISOString(),
        });

      if (insertError) {
        console.error("DB error:", insertError);
      }
    } catch (dbError) {
      console.error("Database error:", dbError);
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: "ready",
    timestamp: new Date().toISOString(),
    message: "Diabetes Prediction API with Meal Recommendations"
  });
}