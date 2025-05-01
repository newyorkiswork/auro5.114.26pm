"use client"

import { useState, useEffect, useRef } from "react"
import { useVoice, VoiceProvider } from "@humeai/voice-react"
import { Button } from "@/components/ui/button"
import { Mic, MicOff, Phone, Loader2, Volume2 } from "lucide-react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

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

// Component to handle the voice interface inside the modal
function VoiceInterface({ onClose }: { onClose: () => void }) {
  const { status, connect, disconnect, isMuted, mute, unmute, messages, isSpeaking } = useVoice()
  const [isConnecting, setIsConnecting] = useState(false)
  const router = useRouter()
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null)
  const [navigationConfirmed, setNavigationConfirmed] = useState(false)
  const [lastProcessedUserMessage, setLastProcessedUserMessage] = useState("")
  const [lastProcessedAssistantMessage, setLastProcessedAssistantMessage] = useState("")
  const navigationTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Define routes and confirmation phrases
  const routes = [
    { path: "/landing", keywords: ["landing", "home page"] },
    { path: "/user", keywords: ["user", "profile", "account"] },
    { path: "/admin", keywords: ["admin", "administrator", "dashboard"] },
  ]

  const confirmationPhrases = [
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
  ]

  // Connect to voice service
  const handleConnect = async () => {
    setIsConnecting(true)
    try {
      await connect()
    } catch (error) {
      console.error("Failed to connect:", error)
    } finally {
      setIsConnecting(false)
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
    for (const route of routes) {
      if (route.keywords.some((keyword) => content.includes(keyword))) {
        setPendingNavigation(route.path)
        setNavigationConfirmed(false)
        break
      }
    }
  }, [messages, lastProcessedUserMessage, status.value, routes])

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
    const isNavigationConfirmation = confirmationPhrases.some((phrase) => content.includes(phrase))

    if (isNavigationConfirmation) {
      setNavigationConfirmed(true)
    }
  }, [messages, pendingNavigation, lastProcessedAssistantMessage, status.value, confirmationPhrases])

  // Monitor speaking state and navigate when speech is complete
  useEffect(() => {
    if (navigationTimeoutRef.current) {
      clearTimeout(navigationTimeoutRef.current)
      navigationTimeoutRef.current = null
    }

    // If navigation is confirmed and Auro was speaking but has stopped
    if (navigationConfirmed && pendingNavigation && !isSpeaking) {
      navigationTimeoutRef.current = setTimeout(() => {
        // Close the modal
        onClose()

        // Navigate to the new page
        router.push(pendingNavigation)

        // Reset navigation state
        setPendingNavigation(null)
        setNavigationConfirmed(false)
      }, 800) // Delay after speech
    }

    return () => {
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current)
      }
    }
  }, [navigationConfirmed, pendingNavigation, isSpeaking, router, onClose])

  // Add this inside the VoiceInterface function, with the other useEffect hooks:
  useEffect(() => {
    // When the component mounts or when connection status changes to connected
    if (status.value === "connected") {
      // Try to route audio to the user's preferred device
      const audioElements = document.querySelectorAll("audio")

      // If we have audio elements from Hume, try to route them
      if (audioElements.length > 0) {
        // Check if the browser supports the Audio Output Devices API
        if (navigator.mediaDevices && "enumerateDevices" in navigator.mediaDevices) {
          navigator.mediaDevices
            .enumerateDevices()
            .then((devices) => {
              // Filter for audio output devices
              const audioOutputDevices = devices.filter((device) => device.kind === "audiooutput")

              // If we have headphones connected (more than just default speakers)
              if (audioOutputDevices.length > 1) {
                // Find likely headphone devices (common keywords in device names)
                const headphoneKeywords = ["headphone", "headset", "earphone", "earpiece", "earbuds"]
                const likelyHeadphones = audioOutputDevices.find((device) =>
                  headphoneKeywords.some((keyword) => device.label.toLowerCase().includes(keyword)),
                )

                // If we found likely headphones, route audio to them
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

  return (
    <div className="flex flex-col h-[500px]">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-muted-foreground">
            <div className="mb-4">
              <motion.div
                className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
              >
                <Mic className="h-8 w-8 text-blue-500 dark:text-blue-300" />
              </motion.div>
            </div>
            <h3 className="text-lg font-medium mb-2">Welcome to Auro Assistant</h3>
            <p>Click the button below to start a conversation with Auro.</p>
            <p className="text-sm mt-2">You can ask about laundry services or navigate to different pages.</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            if (msg.type === "user_message" || msg.type === "assistant_message") {
              const isUser = msg.type === "user_message"
              return (
                <div key={`${msg.type}-${index}`} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      isUser ? "bg-blue-500 text-white rounded-br-none" : "bg-gray-100 dark:bg-gray-800 rounded-bl-none"
                    }`}
                  >
                    {msg.message.content}
                  </div>
                </div>
              )
            }
            return null
          })
        )}
      </div>

      {/* Navigation indicator */}
      {navigationConfirmed && (
        <div className="px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></div>
            <span>Preparing to navigate...</span>
          </div>
        </div>
      )}

      {/* Controls area */}
      <div className="border-t p-4 flex items-center justify-between">
        {status.value === "connected" ? (
          <>
            <Button
              variant="outline"
              size="icon"
              onClick={() => (isMuted ? unmute() : mute())}
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>
            <div className="text-sm text-muted-foreground">{isMuted ? "Click to unmute" : "Auro is listening..."}</div>
            <Button variant="destructive" size="sm" onClick={disconnect}>
              <Phone className="h-4 w-4 mr-2" />
              End Call
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={routeAudioToHeadphones}
              className="ml-2"
              title="Select audio output device"
            >
              <Volume2 className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <>
            <div className="w-10" /> {/* Spacer */}
            <Button onClick={handleConnect} disabled={isConnecting}>
              {isConnecting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Mic className="h-4 w-4 mr-2" />
                  Start Conversation
                </>
              )}
            </Button>
            <div className="w-10" /> {/* Spacer */}
          </>
        )}
      </div>
    </div>
  )
}

// Main modal component that fetches the access token and sets up the voice provider
export default function AuroModal({ onClose }: { onClose: () => void }) {
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchToken = async () => {
      try {
        setIsLoading(true)
        // In a client component, we need to fetch the token from an API route
        const response = await fetch("/api/get-hume-token")
        const data = await response.json()

        if (!data.accessToken) {
          throw new Error("Failed to get access token")
        }

        setAccessToken(data.accessToken)
      } catch (err) {
        console.error("Error fetching token:", err)
        setError("Failed to initialize Auro. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchToken()
  }, [])

  if (isLoading) {
    return (
      <div className="h-[500px] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p>Initializing Auro...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-[500px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    )
  }

  // Use the configId from environment variable
  const configId = process.env.NEXT_PUBLIC_HUME_CONFIG_ID

  return (
    <div className="w-full">
      <VoiceProvider auth={{ type: "accessToken", value: accessToken! }} configId={configId}>
        <VoiceInterface onClose={onClose} />
      </VoiceProvider>
    </div>
  )
}
