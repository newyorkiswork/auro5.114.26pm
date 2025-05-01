"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Loader, Download, Share2 } from "lucide-react"

interface QRCodeDisplayProps {
  bookingId: string
  accessCode?: string
}

export function QRCodeDisplay({ bookingId, accessCode }: QRCodeDisplayProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        setLoading(true)
        // In a real app, this would generate a QR code using a library
        // For now, we'll just simulate it with a timeout
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock QR code (just a placeholder)
        setQrDataUrl(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${bookingId}`)
        setError(null)
      } catch (err) {
        setError("Failed to generate QR code. Please try again.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    generateQRCode()
  }, [bookingId])

  const handleDownload = () => {
    if (qrDataUrl) {
      const link = document.createElement("a")
      link.href = qrDataUrl
      link.download = `booking-${bookingId}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleShare = async () => {
    if (qrDataUrl && navigator.share) {
      try {
        await navigator.share({
          title: "Booking QR Code",
          text: `Access code: ${accessCode || "N/A"}`,
          url: qrDataUrl,
        })
      } catch (err) {
        console.error("Error sharing:", err)
      }
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-blue-50 dark:bg-blue-900/20">
        <CardTitle className="text-center">Booking Access</CardTitle>
      </CardHeader>
      <CardContent className="p-6 flex flex-col items-center">
        {loading ? (
          <div className="flex justify-center items-center h-48 w-48">
            <Loader className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : error ? (
          <div className="text-red-500 p-4 text-center">{error}</div>
        ) : (
          <>
            <div className="bg-white p-3 rounded-lg shadow-sm mb-4">
              <img src={qrDataUrl || ""} alt="QR Code" className="h-48 w-48" />
            </div>

            {accessCode && (
              <div className="mb-4 text-center">
                <div className="text-sm text-gray-500 mb-1">Access Code</div>
                <div className="text-2xl font-mono font-bold tracking-wider">{accessCode}</div>
              </div>
            )}

            <div className="flex gap-2 w-full">
              <Button variant="outline" className="flex-1" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" className="flex-1" onClick={handleShare} disabled={!navigator.share}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default QRCodeDisplay
