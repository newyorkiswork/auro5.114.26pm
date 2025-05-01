"use client"

import { useVoice } from "@humeai/voice-react"
import { useRouter } from "next/navigation"
import { useState, useEffect, useRef } from "react"

// Add this function at the top of the file, after the imports
async function routeAudioToHeadphones() {
  try {
    // Check if the browser supports the Audio Output Devices API
    if (!navigator.mediaDevices || !navigator.mediaDevices.selectAudioOutput) {
      console.log("Audio output device selection not supported")
      return
    }

    // Prompt user to select their preferred audio output device
    const audioDevice = await navigator.mediaDevices.selectAudioOutput()
    console.log("Selected audio output device:", audioDevice.label)

    // Set the audio output device for all audio elements
    document.querySelectorAll("audio").forEach((audio) => {
      if ("setSinkId" in audio) {
        // @ts-ignore - TypeScript doesn't recognize setSinkId yet
        audio
          .setSinkId(audioDevice.deviceId)
          .then(() => console.log("Audio output device set successfully"))
          .catch((err) => console.error("Error setting audio output device:", err))
      }
    })
  } catch (err) {
    console.error("Error selecting audio output device:", err)
  }
}

type Route = {
  path: string
  keywords: string[]
}

type NavigationOptions = {
  routes: Route[]
  confirmationPhrases: string[]
  delayAfterSpeech: number
}

const defaultOptions: NavigationOptions = {
  routes: [
    { path: "/landing", keywords: ["landing", "home page"] },
    { path: "/user", keywords: ["user", "profile", "account"] },
    { path: "/admin", keywords: ["admin", "administrator", "dashboard"] },
  ],
  confirmationPhrases: [
    "navigate you there",
    "take you to",
    "bringing you to",
    "redirecting you to",
    "going to the",
    "let me navigate",
    "i'll navigate",
    "i'll take you",
    "i'll redirect you",
    "navigating to",
  ],
  delayAfterSpeech: 800, // ms
}

export function useVoiceNavigation(options: Partial<NavigationOptions> = {}) {
  const mergedOptions = { ...defaultOptions, ...options }
  const { messages, status, isSpeaking } = useVoice()
  const router = useRouter()

  const [lastProcessedUserMessage, setLastProcessedUserMessage] = useState("")
  const [lastProcessedAssistantMessage, setLastProcessedAssistantMessage] = useState("")
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null)
  const [navigationConfirmed, setNavigationConfirmed] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)

  const navigationTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Navigate function
  const navigateToRoute = (route: string) => {
    setIsNavigating(true)

    try {
      // Force a hard navigation to ensure it works
      window.location.href = route
    } catch (error) {
      // Fallback to router.push
      try {
        router.push(route)
      } catch (innerError) {
        console.error("Navigation failed", innerError)
        setIsNavigating(false)
      }
    }
  }

  // Process user messages to detect navigation intent
  useEffect(() => {
    if (status.value !== "connected") return

    const userMessages = messages.filter((msg) => msg.type === "user_message")
    if (userMessages.length === 0) return

    const lastMessage = userMessages[userMessages.length - 1]
    const content = lastMessage.message.content.toLowerCase()

    if (content === lastProcessedUserMessage) return
    setLastProcessedUserMessage(content)

    // Find matching route
    for (const route of mergedOptions.routes) {
      if (route.keywords.some((keyword) => content.includes(keyword))) {
        setPendingNavigation(route.path)
        setNavigationConfirmed(false)
        break
      }
    }
  }, [messages, lastProcessedUserMessage, status.value, mergedOptions.routes])

  // Process assistant messages to detect navigation confirmation
  useEffect(() => {
    if (!pendingNavigation || status.value !== "connected") return

    const assistantMessages = messages.filter((msg) => msg.type === "assistant_message")
    if (assistantMessages.length === 0) return

    const lastMessage = assistantMessages[assistantMessages.length - 1]
    const content = lastMessage.message.content.toLowerCase()

    if (content === lastProcessedAssistantMessage) return
    setLastProcessedAssistantMessage(content)

    // Check if Auro is confirming navigation
    const isNavigationConfirmation = mergedOptions.confirmationPhrases.some((phrase) => content.includes(phrase))

    if (isNavigationConfirmation) {
      setNavigationConfirmed(true)
    }
  }, [messages, pendingNavigation, lastProcessedAssistantMessage, status.value, mergedOptions.confirmationPhrases])

  // Monitor speaking state and navigate when speech is complete
  useEffect(() => {
    if (navigationTimeoutRef.current) {
      clearTimeout(navigationTimeoutRef.current)
      navigationTimeoutRef.current = null
    }

    // If navigation is confirmed and Auro was speaking but has stopped
    if (navigationConfirmed && pendingNavigation && !isSpeaking) {
      navigationTimeoutRef.current = setTimeout(() => {
        navigateToRoute(pendingNavigation)
        setPendingNavigation(null)
        setNavigationConfirmed(false)
      }, mergedOptions.delayAfterSpeech)
    }

    return () => {
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current)
      }
    }
  }, [navigationConfirmed, pendingNavigation, isSpeaking, mergedOptions.delayAfterSpeech])

  // Add a useEffect to handle audio routing when the hook is used
  // Add this inside the useVoiceNavigation function, with the other useEffect hooks:

  useEffect(() => {
    if (status.value === "connected") {
      // Try to automatically route audio to headphones if connected
      const audioElements = document.querySelectorAll("audio")

      if (audioElements.length > 0) {
        if (navigator.mediaDevices && "enumerateDevices" in navigator.mediaDevices) {
          navigator.mediaDevices
            .enumerateDevices()
            .then((devices) => {
              const audioOutputDevices = devices.filter((device) => device.kind === "audiooutput")

              if (audioOutputDevices.length > 1) {
                const headphoneKeywords = ["headphone", "headset", "earphone", "earpiece", "earbuds"]
                const likelyHeadphones = audioOutputDevices.find((device) =>
                  headphoneKeywords.some((keyword) => device.label.toLowerCase().includes(keyword)),
                )

                if (likelyHeadphones) {
                  audioElements.forEach((audio) => {
                    if ("setSinkId" in audio) {
                      // @ts-ignore - TypeScript doesn't recognize setSinkId yet
                      audio
                        .setSinkId(likelyHeadphones.deviceId)
                        .then(() => console.log("Audio routed to headphones:", likelyHeadphones.label))
                        .catch((err) => console.error("Error routing audio to headphones:", err))
                    }
                  })
                }
              }
            })
            .catch((err) => console.error("Error enumerating audio devices:", err))
        }
      }
    }
  }, [status.value])

  // Update the return object to include the routeAudioToHeadphones function
  // Find the return statement at the end of the hook and update it:

  return {
    pendingNavigation,
    navigationConfirmed,
    isNavigating,
    isSpeaking,
    routeAudioToHeadphones, // Add this line
  }
}
