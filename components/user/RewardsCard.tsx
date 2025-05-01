import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface RewardsCardProps {
  points: number
  freeDryPasses: number
  nextReward: number
}

export function RewardsCard({ points, freeDryPasses, nextReward }: RewardsCardProps) {
  const progressPercentage = Math.min(100, (points / nextReward) * 100)

  return (
    <Card className="rounded-2xl shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4">
        <h3 className="text-white text-lg font-semibold">Your Rewards</h3>
      </div>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="text-sm text-gray-500 mb-1">Current Points</div>
            <div className="text-3xl font-bold">{points}</div>
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Progress to next reward</span>
                <span>
                  {points} / {nextReward}
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2 rounded-full" />
              <div className="text-xs text-gray-500 mt-1">
                {nextReward - points} points away from your next free dry pass
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-2xl">
            <div className="text-sm text-gray-500 mb-1">Available Rewards</div>
            <div className="flex items-center mt-2">
              <div className="bg-blue-100 text-blue-800 p-3 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-wind"
                >
                  <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2" />
                  <path d="M9.6 4.6A2 2 0 1 1 11 8H2" />
                  <path d="M12.6 19.4A2 2 0 1 0 14 16H2" />
                </svg>
              </div>
              <div className="ml-4">
                <div className="text-xl font-bold">{freeDryPasses}</div>
                <div className="text-sm text-gray-500">Free Dry Passes</div>
              </div>
            </div>

            <button
              className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-2xl transition-colors"
              disabled={freeDryPasses === 0}
            >
              Use a Free Dry Pass
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
