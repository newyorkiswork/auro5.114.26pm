"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle } from "lucide-react"
import { useTheme } from "next-themes"
import { Modal, ModalHeader, ModalTitle, ModalBody } from "@/components/ui/modal"
import AuroModal from "@/components/AuroModal"
import { selectAudioOutput, routeAudioToHeadphones } from "@/utils/audioRouting"

interface AuroButtonProps {
  positionClass?: string
}

export default function AuroButton({ positionClass = "bottom-6" }: AuroButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { theme } = useTheme()
  const isDark = theme === "dark"

  const setupAudioAndOpenModal = async () => {
    // First try to automatically route to headphones
    const autoRouted = await routeAudioToHeadphones()

    // If auto-routing failed or we're not sure, prompt the user
    if (!autoRouted) {
      // Check if the browser supports audio output selection
      if (navigator.mediaDevices && navigator.mediaDevices.selectAudioOutput) {
        await selectAudioOutput()
      }
    }

    // Now open the modal
    setIsModalOpen(true)
  }

  return (
    <>
      {/* Floating Action Button - responsive sizing */}
      <motion.button
        className={`fixed ${positionClass} right-4 sm:right-6 z-40 flex items-center justify-center rounded-full shadow-lg ${
          isDark
            ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-900/20"
            : "bg-blue-500 hover:bg-blue-600 text-white shadow-blue-500/20"
        } h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16`}
        onClick={setupAudioAndOpenModal}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        aria-label="Open Auro Assistant"
      >
        <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" />

        {/* Pulsing effect */}
        <AnimatePresence>
          <motion.span
            className="absolute inset-0 rounded-full"
            initial={{ opacity: 0.3, scale: 1 }}
            animate={{ opacity: 0, scale: 1.5 }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 2,
              repeatType: "loop",
            }}
            key="pulse"
          />
        </AnimatePresence>
      </motion.button>

      {/* Modal - responsive sizing */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        size="lg"
        className="w-[95vw] sm:w-auto max-h-[90vh] sm:max-h-[80vh]"
      >
        <ModalHeader className="p-3 sm:p-4 md:p-6">
          <ModalTitle className="text-base sm:text-lg md:text-xl">Auro Assistant</ModalTitle>
        </ModalHeader>
        <ModalBody className="p-0">
          <AuroModal onClose={() => setIsModalOpen(false)} />
        </ModalBody>
      </Modal>
    </>
  )
}
