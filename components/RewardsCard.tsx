import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Gift, Award } from "lucide-react"

interface RewardsCardProps {
  points: number
  freeDryPasses: number
}

export default function RewardsCard({ points, freeDryPasses }: RewardsCardProps) {
  const getRewardTier = (points: number) => {
    if (points >= 1000) return "Platinum"
    if (points >= 500) return "Gold"
    if (points >= 200) return "Silver"
    return "Bronze"
  }

  const tier = getRewardTier(points)
  const tierColors = {
    Bronze: "bg-amber-100 text-amber-800 border-amber-200",
    Silver: "bg-gray-100 text-gray-800 border-gray-200",
    Gold: "bg-yellow-100 text-yellow-800 border-yellow-200",
    Platinum: "bg-purple-100 text-purple-800 border-purple-200",
  }

  return (
    <Card className="overflow-hidden border-0 shadow-md rounded-2xl transition-all hover:shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            <span>My Rewards</span>
          </CardTitle>
          <Badge variant="outline" className={`border ${tierColors[tier as keyof typeof tierColors]}`}>
            {tier} Member
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <p className="text-sm text-gray-500 mb-1">Available Points</p>
            <p className="text-3xl font-bold text-blue-600">{points}</p>
          </div>
          <div className="bg-green-50 rounded-xl p-4 text-center">
            <p className="text-sm text-gray-500 mb-1">Free Dry Passes</p>
            <div className="flex items-center justify-center gap-1">
              <Gift className="h-5 w-5 text-green-600" />
              <p className="text-3xl font-bold text-green-600">{freeDryPasses}</p>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">Points to next tier:</h3>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{
                width:
                  tier === "Bronze"
                    ? `${(points / 200) * 100}%`
                    : tier === "Silver"
                      ? `${((points - 200) / 300) * 100}%`
                      : tier === "Gold"
                        ? `${((points - 500) / 500) * 100}%`
                        : "100%",
              }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>
              {tier === "Bronze"
                ? `${points}/200 to Silver`
                : tier === "Silver"
                  ? `${points}/500 to Gold`
                  : tier === "Gold"
                    ? `${points}/1000 to Platinum`
                    : "Max tier reached!"}
            </span>
            <span>
              {tier === "Bronze"
                ? `${200 - points} more points`
                : tier === "Silver"
                  ? `${500 - points} more points`
                  : tier === "Gold"
                    ? `${1000 - points} more points`
                    : ""}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Add named export for compatibility
export { RewardsCard }
