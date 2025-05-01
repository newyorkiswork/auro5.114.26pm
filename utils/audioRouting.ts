/**
 * Utility functions for audio routing in the Auro app
 */

// Function to prompt user to select audio output device
export async function selectAudioOutput(): Promise<boolean> {
  try {
    // Check if the browser supports the Audio Output Devices API
    if (!navigator.mediaDevices || !navigator.mediaDevices.selectAudioOutput) {
      console.log("Audio output device selection not supported")
      return false
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

    return true
  } catch (err) {
    console.error("Error selecting audio output device:", err)
    return false
  }
}

// Function to automatically route audio to headphones if connected
export async function routeAudioToHeadphones(): Promise<boolean> {
  try {
    // Check if the browser supports device enumeration
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      console.log("Device enumeration not supported")
      return false
    }

    // Get all media devices
    const devices = await navigator.mediaDevices.enumerateDevices()

    // Filter for audio output devices
    const audioOutputDevices = devices.filter((device) => device.kind === "audiooutput")

    // If we have more than just the default speaker
    if (audioOutputDevices.length > 1) {
      // Look for likely headphone devices
      const headphoneKeywords = ["headphone", "headset", "earphone", "earpiece", "earbuds"]
      const likelyHeadphones = audioOutputDevices.find((device) =>
        headphoneKeywords.some((keyword) => device.label.toLowerCase().includes(keyword)),
      )

      // If we found likely headphones
      if (likelyHeadphones) {
        // Route all audio elements to the headphones
        const promises = Array.from(document.querySelectorAll("audio")).map((audio) => {
          if ("setSinkId" in audio) {
            // @ts-ignore - TypeScript doesn't recognize setSinkId yet
            return audio
              .setSinkId(likelyHeadphones.deviceId)
              .then(() => true)
              .catch(() => false)
          }
          return Promise.resolve(false)
        })

        const results = await Promise.all(promises)
        return results.some((result) => result)
      }
    }

    return false
  } catch (err) {
    console.error("Error routing audio to headphones:", err)
    return false
  }
}

// Function to set up a mutation observer to watch for new audio elements
export function setupAudioRoutingObserver(): void {
  // Check if we have a preferred audio device stored
  const preferredDeviceId = localStorage.getItem("preferredAudioDevice")

  if (!preferredDeviceId) return

  // Create a mutation observer to watch for new audio elements
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length) {
        mutation.addedNodes.forEach((node) => {
          // Check if the added node is an audio element
          if (node.nodeName === "AUDIO") {
            const audio = node as HTMLAudioElement
            if ("setSinkId" in audio) {
              // @ts-ignore - TypeScript doesn't recognize setSinkId yet
              audio
                .setSinkId(preferredDeviceId)
                .catch((err) => console.error("Error setting audio output for new element:", err))
            }
          }

          // Check for audio elements within the added node
          if (node.nodeType === Node.ELEMENT_NODE) {
            const audioElements = (node as Element).querySelectorAll("audio")
            audioElements.forEach((audio) => {
              if ("setSinkId" in audio) {
                // @ts-ignore - TypeScript doesn't recognize setSinkId yet
                audio
                  .setSinkId(preferredDeviceId)
                  .catch((err) => console.error("Error setting audio output for new element:", err))
              }
            })
          }
        })
      }
    })
  })

  // Start observing the document with the configured parameters
  observer.observe(document.body, { childList: true, subtree: true })
}
