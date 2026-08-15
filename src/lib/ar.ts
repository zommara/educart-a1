/** AR Quick Look helpers — this experience is intentionally iOS-only. */

export const MODEL_PATH = "/models/robot.usdz";

export function isIOS(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  const iosUa = /iPad|iPhone|iPod/.test(ua);
  // iPadOS 13+ reports itself as a Mac in the UA, but keeps touch input.
  const ipadDesktop = navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
  return iosUa || ipadDesktop;
}

export function supportsQuickLook(): boolean {
  try {
    const a = document.createElement("a");
    return (
      "relList" in a &&
      typeof a.relList.supports === "function" &&
      a.relList.supports("ar")
    );
  } catch {
    return false;
  }
}

export function canLaunchAR(): boolean {
  return isIOS() && supportsQuickLook();
}

/**
 * Programmatically launches AR Quick Look with the USDZ model.
 * Must be called synchronously from a user gesture (tap / click).
 * Returns false when the device can't run Quick Look.
 */
export function launchQuickLook(): boolean {
  if (!canLaunchAR()) return false;
  try {
    const a = document.createElement("a");
    a.setAttribute("rel", "ar");
    a.href = MODEL_PATH;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    // Defer removal: iOS can abort the Quick Look transition if the
    // triggering anchor disappears from the DOM in the same tick.
    window.setTimeout(() => a.remove(), 0);
    return true;
  } catch {
    return false;
  }
}

export interface DeviceState {
  isIOS: boolean;
  supportsQL: boolean;
}

export function deviceState(): DeviceState {
  return { isIOS: isIOS(), supportsQL: supportsQuickLook() };
}

/** Human-readable guidance for devices that can't launch AR. */
export function guidanceFor(state: DeviceState): { title: string; body: string } {
  if (!state.isIOS) {
    return {
      title: "This experience is iOS-only",
      body: "AR Quick Look is Apple's built-in viewer, so the model can only be placed on a real surface from an iPhone or iPad. Open this page in Safari on your iPhone or iPad to place the robot — the rear camera does the tracking.",
    };
  }
  return {
    title: "Update your iOS",
    body: "Your iPhone or iPad doesn't support AR Quick Look yet. This experience needs iOS 13 or later — check for a software update in Settings → General, then come back and launch again.",
  };
}
