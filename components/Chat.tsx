"use client"

import { VoiceProvider } from "@humeai/voice-react"
import Messages from "./Messages"
import Controls from "./Controls"
import StartCall from "./StartCall"
import SpeechIndicator from "./SpeechIndicator"
import { type ComponentRef, useRef, useEffect } from "react"
import { useVoiceNavigation } from "@/hooks/use-voice-navigation"
import { AnimatePresence, motion } from "framer-motion"

// Create a component to handle routing based on voice input
function VoiceRouter() {
  const { pendingNavigation, navigationConfirmed, isSpeaking } = useVoiceNavigation()

  // Debug information (remove in production)
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log({
        pendingNavigation,
        navigationConfirmed,
        isSpeaking,
      })
    }
  }, [pendingNavigation, navigationConfirmed, isSpeaking])

  return null // This component doesn't render anything
}

// Create a component to show a loading indicator during navigation
function NavigationIndicator() {
  const { isNavigating } = useVoiceNavigation()

  return (
    <AnimatePresence>
      {isNavigating && (
        <motion.div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="h-8 w-8 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
            <p className="text-sm text-muted-foreground">Navigating...</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function ClientComponent({
  accessToken,
}: {
  accessToken: string
}) {
  const timeout = useRef<number | null>(null)
  const ref = useRef<ComponentRef<typeof Messages> | null>(null)

  // optional: use configId from environment variable
  const configId = process.env["NEXT_PUBLIC_HUME_CONFIG_ID"]

  return (
    <div className={"relative grow flex flex-col mx-auto w-full overflow-hidden h-[0px]"}>
      <VoiceProvider
        auth={{ type: "accessToken", value: accessToken }}
        configId={configId}
        onMessage={() => {
          if (timeout.current) {
            window.clearTimeout(timeout.current)
          }

          timeout.current = window.setTimeout(() => {
            if (ref.current) {
              const scrollHeight = ref.current.scrollHeight

              ref.current.scrollTo({
                top: scrollHeight,
                behavior: "smooth",
              })
            }
          }, 200)
        }}
      >
        <Messages ref={ref} />
        <Controls />
        <StartCall />
        <VoiceRouter />
        <NavigationIndicator />
        <SpeechIndicator />
      </VoiceProvider>
    </div>
  )
}
