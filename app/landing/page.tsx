"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Mic, MapPin, Clock, QrCode, ChevronDown, ArrowRight } from "lucide-react"
import Image from "next/image"
import { cn } from "@/utils"
import "./landing.css"

export default function LandingPage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [activeSlide, setActiveSlide] = useState(0)
  const featuresRef = useRef<HTMLDivElement>(null)
  const demoRef = useRef<HTMLDivElement>(null)

  // For parallax scrolling effect
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 500], [0, -100])
  const y2 = useTransform(scrollY, [0, 500], [0, -50])
  const opacity = useTransform(scrollY, [0, 300], [1, 0.3])

  // Simulate loading and show orb after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  // Carousel auto-rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % 3)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Scroll to features section
  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Feature cards data
  const features = [
    {
      icon: Mic,
      title: "Voice-Only Interface",
      description: "Talk to Auro anywhere—no typing required.",
    },
    {
      icon: MapPin,
      title: "Geo-Based Booking",
      description: "Automatically find machines near you in under a mile.",
    },
    {
      icon: Clock,
      title: "Real-Time Availability",
      description: "See live machine status and promotions before you reserve.",
    },
    {
      icon: QrCode,
      title: "Secure QR & NFC Access",
      description: "Unlock machines hands-free with one-time codes.",
    },
  ]

  // Demo screenshots data
  const screenshots = [
    {
      src: "/mobile-map-search.png",
      alt: "Map search interface",
      title: "Find Nearby Machines",
    },
    {
      src: "/mobile-booking-confirmation.png",
      alt: "Booking confirmation interface",
      title: "Confirm Your Booking",
    },
    {
      src: "/laundry-monitor-app.png",
      alt: "Live wash monitor interface",
      title: "Monitor Your Wash",
    },
  ]

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Animated background with bubbles */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-950">
          <div className="bubbles-container">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="bubble"
                style={
                  {
                    "--size": `${Math.random() * 5 + 2}rem`,
                    "--left": `${Math.random() * 100}%`,
                    "--delay": `${Math.random() * 5}s`,
                    "--duration": `${Math.random() * 10 + 10}s`,
                  } as React.CSSProperties
                }
              ></div>
            ))}
          </div>
        </div>

        {/* Hero content */}
        <motion.div className="relative z-10 container mx-auto px-4 text-center" style={{ y: y1, opacity }}>
          {/* Pulsing orb avatar */}
          <AnimatePresence>
            {isLoaded && (
              <motion.div
                className="mx-auto mb-8 relative"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
              >
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 dark:from-blue-500 dark:to-blue-700 shadow-lg flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-full"></div>
                  <span className="text-4xl md:text-5xl font-bold text-white">A</span>

                  {/* Pulsing effect */}
                  <motion.div
                    className="absolute inset-0 rounded-full border-4 border-blue-300 dark:border-blue-400"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.7, 0, 0.7],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "loop",
                    }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Heading */}
          <motion.h1
            className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500 dark:from-blue-300 dark:to-blue-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Welcome to Auro — Your AI Laundry Concierge
          </motion.h1>

          {/* Subheading */}
          <motion.p
            className="text-lg md:text-xl lg:text-2xl mb-8 md:mb-10 text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            Find, book, and manage washers & dryers with just your voice.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            <Link href="/user">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-full text-lg">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/user/dashboard">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-blue-700 hover:text-white px-8 py-6 rounded-full text-lg">
                Go to User Portal
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 cursor-pointer"
            animate={{
              y: [0, 10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
            }}
            onClick={scrollToFeatures}
          >
            <ChevronDown className="h-8 w-8 text-blue-500 dark:text-blue-400" />
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-16 md:py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-12 text-gray-800 dark:text-gray-100"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Designed for Effortless Laundry Management
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-blue-50 dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <div className="bg-blue-100 dark:bg-blue-900/50 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                  <feature.icon className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Screenshots/Demo Section */}
      <section ref={demoRef} className="py-16 md:py-24 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-4 text-gray-800 dark:text-gray-100"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Auro in Action
          </motion.h2>

          <motion.p
            className="text-center text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            From voice request to wash complete — see how Auro simplifies your laundry experience.
          </motion.p>

          {/* Carousel */}
          <div className="relative max-w-5xl mx-auto">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${activeSlide * 100}%)` }}
              >
                {screenshots.map((screenshot, index) => (
                  <div key={index} className="min-w-full px-4 flex justify-center">
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-4 md:p-6 max-w-md">
                      <div className="relative rounded-lg overflow-hidden shadow-md mb-4">
                        <Image
                          src={screenshot.src || "/placeholder.svg"}
                          alt={screenshot.alt}
                          width={300}
                          height={600}
                          className="mx-auto"
                        />
                      </div>
                      <h3 className="text-xl font-semibold text-center text-gray-800 dark:text-gray-100">
                        {screenshot.title}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Carousel indicators */}
            <div className="flex justify-center mt-6 gap-2">
              {screenshots.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveSlide(index)}
                  className={cn(
                    "w-3 h-3 rounded-full transition-all",
                    activeSlide === index ? "bg-blue-600 dark:bg-blue-400 w-6" : "bg-gray-300 dark:bg-gray-600",
                  )}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Secondary CTA Section */}
      <section className="py-16 md:py-24 bg-blue-600 dark:bg-blue-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.h2
            className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Ready to transform your laundry experience?
          </motion.h2>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <Link href="/user">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8">
                Get Started
              </Button>
            </Link>
            <Link href="/user/dashboard">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-blue-700 px-8">
                Go to User Portal
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
