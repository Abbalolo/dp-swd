'use client'

import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

interface PredictionFormData {
  pregnancies: number
  glucose: number
  bloodPressure: number
  skinThickness: number
  insulin: number
  bmi: number
  diabetesPedigreeFunction: number
  age: number
}

interface Meal {
  name: string
  description: string
  calories: number
  carbs: number
  protein: number
  ingredients: string[]
}

interface Exercise {
  type: string
  duration: string
  frequency: string
  examples: string[]
  benefits: string
}

interface Recommendations {
  meals: {
    breakfast: Meal[]
    lunch: Meal[]
    dinner: Meal[]
    snacks: Meal[]
  }
  lifestyle: {
    exercise: Exercise[]
    sleep: string[]
    stress: string[]
    monitoring: string[]
  }
  riskLevel: string
  generalTips: string[]
}

export default function PredictionForm() {
  const [formData, setFormData] = useState<PredictionFormData>({
    pregnancies: 1,
    glucose: 85,
    bloodPressure: 66,
    skinThickness: 29,
    insulin: 0,
    bmi: 26.6,
    diabetesPedigreeFunction: 0.351,
    age: 31
  })

  const [prediction, setPrediction] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'prediction' | 'meals' | 'lifestyle'>('prediction')
  const { user } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ formData, userId: user?.id }),
      })
      
      if (!response.ok) {
        throw new Error('Prediction failed')
      }
      
      const result = await response.json()
      setPrediction(result)
      setActiveTab('prediction')
    } catch (error) {
      console.error('Prediction error:', error)
      setPrediction({
        class: 'Error',
        probability: 0,
        error: 'Failed to get prediction. Please try again.'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const getRiskLevel = (probability: number) => {
    if (probability < 0.3) return 'Low Risk'
    if (probability < 0.7) return 'Medium Risk'
    return 'High Risk'
  }

  const getRiskColor = (probability: number) => {
    if (probability < 0.3) return 'green'
    if (probability < 0.7) return 'yellow'
    return 'red'
  }

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-sm p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Diabetes Prediction & Health Plan</h2>
        <p className="text-gray-600">
          Based on the Pima Indians Diabetes Dataset. Enter your health information to assess diabetes risk and get personalized recommendations.
        </p>
      </div>
      
       <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Pregnancies */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Pregnancies
            </label>
            <input 
              type="number" 
              value={formData.pregnancies}
              onChange={(e) => handleInputChange('pregnancies', parseInt(e.target.value) || 0)}
              className="w-full text-gray-500 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              min="0"
              max="20"
            />
          </div>

          {/* Glucose */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Glucose Level (mg/dL)
            </label>
            <input 
              type="number" 
              value={formData.glucose}
              onChange={(e) => handleInputChange('glucose', parseInt(e.target.value) || 0)}
              className="w-full text-gray-500 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              min="0"
              max="300"
            />
            <p className="text-xs text-gray-500 mt-1">Normal range: 70-100 mg/dL</p>
          </div>

          {/* Blood Pressure */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Blood Pressure (mm Hg)
            </label>
            <input 
              type="number" 
              value={formData.bloodPressure}
              onChange={(e) => handleInputChange('bloodPressure', parseInt(e.target.value) || 0)}
              className="w-full text-gray-500 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              min="0"
              max="200"
            />
            <p className="text-xs text-gray-500 mt-1">Normal: below 120/80 mm Hg</p>
          </div>

          {/* Skin Thickness */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Skin Thickness (mm)
            </label>
            <input 
              type="number" 
              value={formData.skinThickness}
              onChange={(e) => handleInputChange('skinThickness', parseInt(e.target.value) || 0)}
              className="w-full text-gray-500 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              min="0"
              max="100"
            />
            <p className="text-xs text-gray-500 mt-1">Triceps skin fold thickness</p>
          </div>

          {/* Insulin */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Insulin Level (mu U/ml)
            </label>
            <input 
              type="number" 
              value={formData.insulin}
              onChange={(e) => handleInputChange('insulin', parseInt(e.target.value) || 0)}
              className="w-full text-gray-500 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              min="0"
              max="1000"
            />
          </div>

          {/* BMI */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Body Mass Index (BMI)
            </label>
            <input 
              type="number" 
              step="0.1"
              value={formData.bmi}
              onChange={(e) => handleInputChange('bmi', parseFloat(e.target.value) || 0)}
              className="w-full text-gray-500 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              min="10"
              max="60"
            />
            <p className="text-xs text-gray-500 mt-1">Normal: 18.5-24.9</p>
          </div>

          {/* Diabetes Pedigree Function */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Diabetes Pedigree Function
            </label>
            <input 
              type="number" 
              step="0.001"
              value={formData.diabetesPedigreeFunction}
              onChange={(e) => handleInputChange('diabetesPedigreeFunction', parseFloat(e.target.value) || 0)}
              className="w-full text-gray-500 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              min="0"
              max="3"
            />
            <p className="text-xs text-gray-500 mt-1">Diabetes family history likelihood</p>
          </div>

          {/* Age */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Age
            </label>
            <input 
              type="number" 
              value={formData.age}
              onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 0)}
              className="w-full text-gray-500 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              min="0"
              max="120"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 transition"
        >
          {loading ? 'Predicting...' : 'Predict Diabetes Risk'}
        </button>
      </form>
 
      {prediction && !prediction.error && (
        <div className="border rounded-lg">
          {/* Navigation Tabs */}
          <div className="border-b">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('prediction')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'prediction'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                📊 Prediction Result
              </button>
              <button
                onClick={() => setActiveTab('meals')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'meals'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                🍽️ Meal Plan
              </button>
              <button
                onClick={() => setActiveTab('lifestyle')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'lifestyle'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                🏃 Lifestyle Tips
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'prediction' && (
              <PredictionResult 
                prediction={prediction} 
                getRiskLevel={getRiskLevel}
                getRiskColor={getRiskColor}
              />
            )}

            {activeTab === 'meals' && prediction.recommendations && (
              <MealRecommendations recommendations={prediction.recommendations} />
            )}

            {activeTab === 'lifestyle' && prediction.recommendations && (
              <LifestyleRecommendations recommendations={prediction.recommendations} />
            )}
          </div>
        </div>
      )}

      {prediction && prediction.error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {prediction.error}
        </div>
      )}
    </div>
  )
}

// Prediction Result Component
function PredictionResult({ prediction, getRiskLevel, getRiskColor }: any) {
  return (
    <div className={`p-6 rounded-lg border ${
      prediction.class === 'Diabetic' ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`font-semibold text-lg ${
          prediction.class === 'Diabetic' ? 'text-red-800' : 'text-green-800'
        }`}>
          {prediction.class}
        </h3>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          prediction.class === 'Diabetic' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
        }`}>
          {getRiskLevel(prediction.probability)}
        </span>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Confidence Level:</span>
          <span>{(prediction.probability * 100).toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${
              prediction.class === 'Diabetic' ? 'bg-red-500' : 'bg-green-500'
            }`}
            style={{ width: `${prediction.probability * 100}%` }}
          ></div>
        </div>
      </div>
      
      <p className="text-gray-700 mb-3">
        {prediction.class === 'Diabetic' 
          ? 'The prediction indicates a risk of diabetes based on the provided information. We recommend consulting with a healthcare provider and following the personalized meal and lifestyle plan below.'
          : 'The prediction suggests low risk of diabetes based on the provided information. Maintain your health with the recommended lifestyle habits below.'
        }
      </p>
      
      <div className="mt-4 p-4 bg-white rounded border">
        <h4 className="font-medium text-gray-900 mb-2">Quick Health Tips:</h4>
        <ul className="text-sm text-gray-700 space-y-1">
          {prediction.recommendations.generalTips.slice(0, 3).map((tip: string, index: number) => (
            <li key={index}>• {tip}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

// Meal Recommendations Component
function MealRecommendations({ recommendations }: { recommendations: Recommendations }) {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">🍽️ Personalized Meal Plan</h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Breakfast */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-3">Breakfast Options</h4>
          {recommendations.meals.breakfast.map((meal, index) => (
            <div key={index} className="mb-4 last:mb-0 p-3 bg-white rounded border">
              <h5 className="font-medium text-gray-900">{meal.name}</h5>
              <p className="text-sm text-gray-600 mb-2">{meal.description}</p>
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>Calories: {meal.calories}</span>
                <span>Carbs: {meal.carbs}g</span>
                <span>Protein: {meal.protein}g</span>
              </div>
              <div className="text-xs text-gray-600">
                <strong>Ingredients:</strong> {meal.ingredients.join(', ')}
              </div>
            </div>
          ))}
        </div>

        {/* Lunch */}
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-semibold text-green-800 mb-3">Lunch Options</h4>
          {recommendations.meals.lunch.map((meal, index) => (
            <div key={index} className="mb-4 last:mb-0 p-3 bg-white rounded border">
              <h5 className="font-medium text-gray-900">{meal.name}</h5>
              <p className="text-sm text-gray-600 mb-2">{meal.description}</p>
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>Calories: {meal.calories}</span>
                <span>Carbs: {meal.carbs}g</span>
                <span>Protein: {meal.protein}g</span>
              </div>
              <div className="text-xs text-gray-600">
                <strong>Ingredients:</strong> {meal.ingredients.join(', ')}
              </div>
            </div>
          ))}
        </div>

        {/* Dinner */}
        <div className="bg-purple-50 p-4 rounded-lg">
          <h4 className="font-semibold text-purple-800 mb-3">Dinner Options</h4>
          {recommendations.meals.dinner.map((meal, index) => (
            <div key={index} className="mb-4 last:mb-0 p-3 bg-white rounded border">
              <h5 className="font-medium text-gray-900">{meal.name}</h5>
              <p className="text-sm text-gray-600 mb-2">{meal.description}</p>
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>Calories: {meal.calories}</span>
                <span>Carbs: {meal.carbs}g</span>
                <span>Protein: {meal.protein}g</span>
              </div>
              <div className="text-xs text-gray-600">
                <strong>Ingredients:</strong> {meal.ingredients.join(', ')}
              </div>
            </div>
          ))}
        </div>

        {/* Snacks */}
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h4 className="font-semibold text-yellow-800 mb-3">Healthy Snacks</h4>
          {recommendations.meals.snacks.map((meal, index) => (
            <div key={index} className="mb-4 last:mb-0 p-3 bg-white rounded border">
              <h5 className="font-medium text-gray-900">{meal.name}</h5>
              <p className="text-sm text-gray-600 mb-2">{meal.description}</p>
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>Calories: {meal.calories}</span>
                <span>Carbs: {meal.carbs}g</span>
                <span>Protein: {meal.protein}g</span>
              </div>
              <div className="text-xs text-gray-600">
                <strong>Ingredients:</strong> {meal.ingredients.join(', ')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Lifestyle Recommendations Component
function LifestyleRecommendations({ recommendations }: { recommendations: Recommendations }) {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">🏃 Lifestyle & Wellness Plan</h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Exercise */}
        <div className="bg-red-50 p-4 rounded-lg">
          <h4 className="font-semibold text-red-800 mb-3">💪 Exercise Routine</h4>
          {recommendations.lifestyle.exercise.map((exercise, index) => (
            <div key={index} className="mb-4 last:mb-0 p-3 bg-white rounded border">
              <h5 className="font-medium text-gray-900">{exercise.type}</h5>
              <div className="text-sm text-gray-600 space-y-1">
                <div><strong>Duration:</strong> {exercise.duration}</div>
                <div><strong>Frequency:</strong> {exercise.frequency}</div>
                <div><strong>Examples:</strong> {exercise.examples.join(', ')}</div>
                <div><strong>Benefits:</strong> {exercise.benefits}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Sleep */}
        <div className="bg-indigo-50 p-4 rounded-lg">
          <h4 className="font-semibold text-indigo-800 mb-3">😴 Sleep Hygiene</h4>
          <div className="p-3 bg-white rounded border">
            <ul className="text-sm text-gray-600 space-y-2">
              {recommendations.lifestyle.sleep.map((tip, index) => (
                <li key={index}>• {tip}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Stress Management */}
        <div className="bg-teal-50 p-4 rounded-lg">
          <h4 className="font-semibold text-teal-800 mb-3">🧘 Stress Management</h4>
          <div className="p-3 bg-white rounded border">
            <ul className="text-sm text-gray-600 space-y-2">
              {recommendations.lifestyle.stress.map((tip, index) => (
                <li key={index}>• {tip}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Health Monitoring */}
        <div className="bg-orange-50 p-4 rounded-lg">
          <h4 className="font-semibold text-orange-800 mb-3">📊 Health Monitoring</h4>
          <div className="p-3 bg-white rounded border">
            <ul className="text-sm text-gray-600 space-y-2">
              {recommendations.lifestyle.monitoring.map((tip, index) => (
                <li key={index}>• {tip}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* General Tips */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-3">💡 General Health Tips</h4>
        <div className="p-3 bg-white rounded border">
          <ul className="text-sm text-gray-600 space-y-2">
            {recommendations.generalTips.map((tip, index) => (
              <li key={index}>• {tip}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

