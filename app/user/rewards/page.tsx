"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Gift, Star, Trophy } from "lucide-react"

const rewards = [
  {
    id: 1,
    name: "Free Wash",
    points: 500,
    description: "Get a free wash on any machine",
    icon: <Gift className="h-5 w-5" />
  },
  {
    id: 2,
    name: "50% Off Dry",
    points: 300,
    description: "50% discount on your next dry cycle",
    icon: <Star className="h-5 w-5" />
  },
  {
    id: 3,
    name: "Premium Detergent",
    points: 200,
    description: "One free premium detergent",
    icon: <Trophy className="h-5 w-5" />
  }
]

export default function RewardsPage() {
  // In a real app, these would come from an API
  const userPoints = 350
  const totalPointsEarned = 750

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">My Rewards</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Points Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{userPoints}</span>
                <Badge variant="secondary">Points Available</Badge>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Progress to next tier</span>
                  <span>{totalPointsEarned} / 1000</span>
                </div>
                <Progress value={(totalPointsEarned / 1000) * 100} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Wash Completed</p>
                  <p className="text-sm text-muted-foreground">Apr 30, 2024</p>
                </div>
                <Badge>+50 points</Badge>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Dry Cycle</p>
                  <p className="text-sm text-muted-foreground">Apr 30, 2024</p>
                </div>
                <Badge>+25 points</Badge>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Reward Redeemed</p>
                  <p className="text-sm text-muted-foreground">Apr 29, 2024</p>
                </div>
                <Badge variant="destructive">-200 points</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-bold mt-12 mb-6">Available Rewards</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {rewards.map(reward => (
          <Card key={reward.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {reward.icon}
                {reward.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600">{reward.description}</p>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">{reward.points} points</Badge>
                  <Button
                    variant={userPoints >= reward.points ? "default" : "outline"}
                    disabled={userPoints < reward.points}
                  >
                    {userPoints >= reward.points ? "Redeem" : "Not Enough Points"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
