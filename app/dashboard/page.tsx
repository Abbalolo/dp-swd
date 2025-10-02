'use client'

import { useAuth } from '../contexts/AuthContext' 
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import PredictionForm from '../components/Predictions' 

export default function Dashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/authentication/login')
    }
    router.push("/")
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user.full_name || user.email}!
        </h1>
        <p className="text-gray-600">
          Check your diabetes risk and get personalized recommendations.
        </p>
      </div>
      
      <PredictionForm />
    </div>
  )
}