'use client'

import Link from 'next/link'
import { HeartPulse, Activity, Utensils, Brain } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from './contexts/AuthContext'
import { useEffect } from 'react'

export default function Home() {
    const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard')
    }

  }, [user, loading, router])

  // if (loading || user) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       <div className="text-lg">Loading...</div>
  //     </div>
  //   )
  // }
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
          Predict Diabetes Risk with AI
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Get personalized diabetes risk assessment and lifestyle recommendations using advanced machine learning technology.
        </p>
        <div className="flex gap-4 justify-center">
          <Link 
            href="/authentication/login" 
            className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Get Started
          </Link>
          <Link 
            href="/authentication/register" 
            className="border border-green-600 text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition"
          >
            Create Account
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="flex justify-center flex-col md:flex-row gap-8 mb-12 ">
        <div className="text-center p-6 bg-white rounded-lg shadow-sm">
          <HeartPulse className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h3 className="font-semibold text-lg mb-2 text-black">AI Prediction</h3>
          <p className="text-gray-600">Advanced SVM algorithm for accurate diabetes risk assessment</p>
        </div>
        
        <div className="text-center p-6 bg-white rounded-lg shadow-sm">
          <Utensils className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h3 className="font-semibold text-lg mb-2 text-black">Meal Plans</h3>
          <p className="text-gray-600">Personalized dietary recommendations based on your profile</p>
        </div>
        
        <div className="text-center p-6 bg-white rounded-lg shadow-sm">
          <Activity className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h3 className="font-semibold text-lg mb-2 text-black">Lifestyle Tips</h3>
          <p className="text-gray-600">Exercise and wellness guidance tailored to your needs</p>
        </div>
{/*         
        <div className="text-center p-6 bg-white rounded-lg shadow-sm">
          <Brain className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h3 className="font-semibold text-lg mb-2 text-black">Smart Monitoring</h3>
          <p className="text-gray-600">Track your health metrics and progress over time</p>
        </div> */}
      </div>

      {/* Stats Section */}
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="grid grid-cols-3 gap-8">
          <div>
            <div className="text-3xl font-bold text-green-600">95%</div>
            <div className="text-gray-600">Prediction Accuracy</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-600">99%</div>
            <div className="text-gray-600">Specificity Rate</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-600">10k+</div>
            <div className="text-gray-600">Health Profiles</div>
          </div>
        </div>
      </div>
    </div>
  )
}