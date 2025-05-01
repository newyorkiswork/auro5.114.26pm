"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { useTheme } from "next-themes"
import { MessageCircle } from "lucide-react"
import { Modal, ModalHeader, ModalTitle, ModalBody } from "@/components/ui/modal"
import AuroModal from "@/components/AuroModal"
import Link from "next/link"
import { Button } from "@/components/ui/button"

function Bubble({ x, y, size, color }: { x: number; y: number; size: number; color: string }) {
  // Create a unique ID for this bubble's gradient
  const gradientId = `bubble-gradient-${x}-${y}-${size}`
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0.6, 0.8, 0.6],
        scale: [1, 1.2, 1],
        x: x + Math.random() * 100 - 50,
        y: y + Math.random() * 100 - 50,
      }}
      transition={{
        duration: 5 + Math.random() * 10,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
      }}
      filter={isDark ? "drop-shadow(0 2px 4px rgba(0,180,255,0.3))" : "drop-shadow(0 2px 4px rgba(0,0,80,0.2))"}
    >
      <defs>
        <radialGradient id={gradientId} cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" stopColor={isDark ? "rgba(30, 30, 50, 0.8)" : "rgba(255, 255, 255, 0.4)"} />
          <stop offset="100%" stopColor={isDark ? "rgba(70, 130, 180, 0.6)" : "rgba(173, 216, 230, 0.5)"} />
        </radialGradient>
      </defs>
      <circle
        cx={x}
        cy={y}
        r={size}
        fill={`url(#${gradientId})`}
        stroke={isDark ? "#4D8BF0" : "#1E90FF"}
        strokeWidth={2}
      />
    </motion.g>
  )
}

function FloatingBubbles() {
  const [bubbles, setBubbles] = useState<Array<{ id: number; x: number; y: number; size: number; color: string }>>([])
  const { theme } = useTheme()
  const [deviceType, setDeviceType] = useState<"mobile" | "tablet" | "desktop">("desktop")

  useEffect(() => {
    // Detect device type
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setDeviceType("mobile")
      } else if (window.innerWidth < 1024) {
        setDeviceType("tablet")
      } else {
        setDeviceType("desktop")
      }
    }

    // Create bubbles
    const createBubbles = () => {
      // Adjust number of bubbles based on device type
      const bubbleCount = deviceType === "mobile" ? 30 : deviceType === "tablet" ? 40 : 50

      const newBubbles = Array.from({ length: bubbleCount }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 20 + 5,
        color: theme === "dark" ? "#4D8BF0" : "#1E90FF", // Dynamic color based on theme
      }))
      setBubbles(newBubbles)
    }

    // Initial setup
    handleResize()
    createBubbles()

    // Add event listeners
    window.addEventListener("resize", () => {
      handleResize()
      createBubbles()
    })

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [theme, deviceType])

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg className="w-full h-full">
        <title>Floating Bubbles</title>
        {bubbles.map((bubble) => (
          <Bubble key={bubble.id} {...bubble} />
        ))}
      </svg>
    </div>
  )
}

export default function FloatingBubblesBackground({
  title = "Auro",
}: {
  title?: string
}) {
  const { theme } = useTheme()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [deviceType, setDeviceType] = useState<"mobile" | "tablet" | "desktop">("desktop")

  // Detect device type
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setDeviceType("mobile")
      } else if (window.innerWidth < 1024) {
        setDeviceType("tablet")
      } else {
        setDeviceType("desktop")
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-background transition-colors duration-300">
      <FloatingBubbles />

      <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="max-w-4xl mx-auto"
        >
          {/* Logo */}
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="flex justify-center mb-10"
          >
            <Image src="/auro-logo.svg" alt="Auro Logo" width={300} height={300} className="drop-shadow-md" />
          </motion.div>

          {/* Tagline */}
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="text-2xl md:text-3xl font-medium mb-8 text-center"
          >
            Your intelligent laundry assistant
          </motion.h2>

          {/* Buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/user/dashboard">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-full text-lg">
                Go to User Portal
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="lg">
        <ModalHeader>
          <ModalTitle>Auro Assistant</ModalTitle>
        </ModalHeader>
        <ModalBody className="p-0">
          <AuroModal onClose={() => setIsModalOpen(false)} />
        </ModalBody>
      </Modal>
    </div>
  )
}
