const PULSE_BASE_PATH = "/pulse";

function isPulsePath(path: string) {
  return path === PULSE_BASE_PATH || path.startsWith(`${PULSE_BASE_PATH}/`) || path.startsWith(`${PULSE_BASE_PATH}?`) || path.startsWith(`${PULSE_BASE_PATH}#`);
}

export function ensurePulsePath(path: string | null | undefined, fallback = "/pulse/dashboard") {
  if (!path || !path.startsWith("/") || path.startsWith("//") || path === "/" || path.startsWith("/?") || path.startsWith("/#")) {
    return fallback;
  }

  if (isPulsePath(path)) {
    return path;
  }

  return `${PULSE_BASE_PATH}${path}`;
}
