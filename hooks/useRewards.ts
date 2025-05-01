"use client"

import { useState, useEffect } from "react"

interface Reward {
  id: string
  title: string
  description: string
  points: number
  expiresAt: string
  redeemed: boolean
}

interface RewardsState {
  availableRewards: Reward[]
  redeemedRewards: Reward[]
  totalPoints: number
  loading: boolean
  error: string | null
}

export function useRewards(userId: string) {
  const [state, setState] = useState<RewardsState>({
    availableRewards: [],
    redeemedRewards: [],
    totalPoints: 0,
    loading: true,
    error: null,
  })

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }))

        // In a real app, this would be an API call
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1200))

        // Mock data
        const mockRewards: Reward[] = [
          {
            id: "r1",
            title: "Free Wash",
            description: "One free wash cycle",
            points: 500,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            redeemed: false,
          },
          {
            id: "r2",
            title: "50% Off Dry",
            description: "50% off your next dry cycle",
            points: 300,
            expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
            redeemed: false,
          },
          {
            id: "r3",
            title: "Free Detergent",
            description: "One free detergent packet",
            points: 200,
            expiresAt: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
            redeemed: false,
          },
          {
            id: "r4",
            title: "Free Dryer Sheet",
            description: "One free dryer sheet",
            points: 100,
            expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
            redeemed: true,
          },
          {
            id: "r5",
            title: "10% Off Next Booking",
            description: "10% off your next booking",
            points: 150,
            expiresAt: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
            redeemed: true,
          },
        ]

        setState({
          availableRewards: mockRewards.filter((r) => !r.redeemed),
          redeemedRewards: mockRewards.filter((r) => r.redeemed),
          totalPoints: 750,
          loading: false,
          error: null,
        })
      } catch (err) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: "Failed to load rewards. Please try again.",
        }))
        console.error(err)
      }
    }

    fetchRewards()
  }, [userId])

  const redeemReward = async (rewardId: string) => {
    try {
      // In a real app, this would be an API call
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Update local state
      setState((prev) => {
        const reward = prev.availableRewards.find((r) => r.id === rewardId)
        if (!reward) return prev

        const updatedReward = { ...reward, redeemed: true }
        const newAvailableRewards = prev.availableRewards.filter((r) => r.id !== rewardId)
        const newRedeemedRewards = [...prev.redeemedRewards, updatedReward]
        const newTotalPoints = prev.totalPoints - reward.points

        return {
          ...prev,
          availableRewards: newAvailableRewards,
          redeemedRewards: newRedeemedRewards,
          totalPoints: newTotalPoints,
        }
      })

      return true
    } catch (err) {
      console.error(err)
      return false
    }
  }

  return {
    ...state,
    redeemReward,
  }
}

export default useRewards
