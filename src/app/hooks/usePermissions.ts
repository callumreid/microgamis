import { useCallback } from "react";
import { Capacitor } from "@capacitor/core";

export function usePermissions() {
  const requestMicrophonePermission =
    useCallback(async (): Promise<boolean> => {
      // Only handle permissions on mobile platforms
      if (Capacitor.isNativePlatform()) {
        try {
          // On Capacitor, permissions are handled automatically when getUserMedia is called
          // We can check if mediaDevices is available
          if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            console.error("getUserMedia is not available in this context");
            return false;
          }

          // Test if we can access the microphone
          // This will trigger the native permission request
          const testStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
          });

          // If we got here, permission was granted
          testStream.getTracks().forEach((track) => track.stop());
          return true;
        } catch (error) {
          console.error("Error requesting microphone permission:", error);
          if (error instanceof Error) {
            if (error.name === "NotAllowedError") {
              console.warn("Microphone permission was denied by user");
            } else if (error.name === "NotFoundError") {
              console.warn("No microphone device found");
            }
          }
          return false;
        }
      }

      // On web, permissions are handled by getUserMedia
      return true;
    }, []);

  const checkSecureContext = useCallback((): boolean => {
    if (typeof window === "undefined") return true;

    const isSecure = window.isSecureContext;
    if (!isSecure) {
      console.error(
        "App is not running in a secure context. getUserMedia will fail."
      );
      console.error("Current origin:", window.location.origin);
    }

    return isSecure;
  }, []);

  return {
    requestMicrophonePermission,
    checkSecureContext,
  };
}
