/** AR Quick Look helpers — this experience is intentionally iOS-only. */

export const MODEL_PATH = "/models/robot.usdz";
export const MODEL_TYPE = "model/vnd.usdz+zip";

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
 * Reusable props for a real `<a rel="ar">` element. Directly tapping a
 * genuine anchor is the most reliable way to open AR Quick Look across iOS
 * versions (12–18+), including iOS 16 where synthetic clicks on hidden
 * anchors are unreliable.
 */
export const arLinkProps = {
  rel: "ar",
  type: MODEL_TYPE,
  href: MODEL_PATH,
} as const;

/**
 * Programmatic fallback: opens AR Quick Look with the USDZ model. Must be
 * called synchronously from a user gesture (tap / click). Uses a single
 * persistent anchor parked off-screen instead of a `display:none` element —
 * iOS 16 ignores clicks on display:none anchors, but an off-screen anchor
 * with real dimensions is treated as a normal clickable link.
 * Returns false when the device can't run Quick Look.
 */
let arAnchor: HTMLAnchorElement | null = null;

export function launchQuickLook(): boolean {
  if (!canLaunchAR()) return false;
  try {
    if (!arAnchor) {
      arAnchor = document.createElement("a");
      arAnchor.rel = "ar";
      arAnchor.type = MODEL_TYPE;
      arAnchor.href = MODEL_PATH;
      // Off-screen but not display:none — keeps the element clickable on iOS 16.
      arAnchor.style.cssText =
        "position:fixed;left:-9999px;top:0;width:1px;height:1px;opacity:0.01;pointer-events:none;";
      document.body.appendChild(arAnchor);
    }
    arAnchor.click();
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
