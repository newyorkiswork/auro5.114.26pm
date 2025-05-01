"use client"

import { useVoice } from "@humeai/voice-react"
import { AnimatePresence, motion } from "framer-motion"
import { useVoiceNavigation } from "@/hooks/use-voice-navigation"

export default function SpeechIndicator() {
  const { isSpeaking } = useVoice()
  const { navigationConfirmed } = useVoiceNavigation()

  return (
    <AnimatePresence>
      {isSpeaking && (
        <motion.div
          className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-40"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
        >
          <div
            className={`px-4 py-2 rounded-full ${navigationConfirmed ? "bg-blue-500" : "bg-green-500"} text-white text-sm flex items-center gap-2`}
          >
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 bg-white rounded-full"
                  animate={{
                    y: [0, -4, 0],
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
            <span>{navigationConfirmed ? "Preparing to navigate..." : "Auro is speaking..."}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
