"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Mic, MicOff, X, Volume2, Headphones } from "lucide-react"

interface VoiceUIProps {
  onClose: () => void
}

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

// Default export
export default function VoiceUI({ onClose }: VoiceUIProps) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [response, setResponse] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  // Simulate voice recognition
  useEffect(() => {
    if (isListening) {
      const timer = setTimeout(() => {
        setTranscript("Find me a laundromat nearby")
        setIsListening(false)
        setIsProcessing(true)

        // Simulate processing
        setTimeout(() => {
          setIsProcessing(false)
          setResponse(
            "I found 3 laundromats within 1 mile of your location. The closest is Fresh & Clean Laundromat, 0.3 miles away. Would you like to see details?",
          )
        }, 1500)
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [isListening])

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false)
    } else {
      setTranscript("")
      setResponse("")
      setIsListening(true)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Voice Assistant</h2>
        <Button variant="ghost" size="icon" onClick={routeAudioToHeadphones} title="Select audio output">
          <Headphones className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 flex flex-col">
        {/* Voice Visualization */}
        <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-6 mb-6 flex flex-col items-center justify-center min-h-[200px]">
          <div className={`relative mb-4 ${isListening ? "animate-pulse" : ""}`}>
            <div className="absolute inset-0 bg-blue-500 rounded-full opacity-20 scale-150"></div>
            <div className="absolute inset-0 bg-blue-500 rounded-full opacity-30 scale-125"></div>
            <Button
              onClick={toggleListening}
              size="icon"
              className={`h-16 w-16 rounded-full relative z-10 ${
                isListening ? "bg-red-500 hover:bg-red-600" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
            </Button>
          </div>
          <p className="text-sm text-center text-gray-500">
            {isListening ? "Listening..." : isProcessing ? "Processing..." : "Tap the microphone to speak"}
          </p>
        </div>

        {/* Transcript */}
        {transcript && (
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-1">You said:</p>
            <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg">
              <p>{transcript}</p>
            </div>
          </div>
        )}

        {/* Response */}
        {response && (
          <div>
            <p className="text-sm text-gray-500 mb-1">Auro says:</p>
            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg flex items-start gap-3">
              <Volume2 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <p>{response}</p>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-auto pt-6">
          <h3 className="text-sm font-medium mb-3">Quick Commands:</h3>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" className="justify-start">
              "Find laundromat"
            </Button>
            <Button variant="outline" size="sm" className="justify-start">
              "Book a washer"
            </Button>
            <Button variant="outline" size="sm" className="justify-start">
              "Check my booking"
            </Button>
            <Button variant="outline" size="sm" className="justify-start">
              "Machine status"
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Named export for compatibility
export { VoiceUI }
