import { execFileSync } from "child_process";
import fs from "fs";
import os from "os";
import path from "path";

const isWin = process.platform === "win32";

// Common install locations per platform/package manager, checked in order.
function candidatePaths(name: string): string[] {
  const exe = isWin ? `${name}.exe` : name;
  return [
    `/opt/homebrew/bin/${name}`,                                    // macOS, Homebrew (Apple Silicon)
    `/usr/local/bin/${name}`,                                       // macOS, Homebrew (Intel) / Linux, manual install
    `/usr/bin/${name}`,                                             // Linux, apt/dnf/pacman
    path.join(os.homedir(), ".local", "bin", name),                 // Linux/macOS, pip install --user
    `C:\\ProgramData\\chocolatey\\bin\\${exe}`,                     // Windows, Chocolatey
    path.join(os.homedir(), "AppData", "Local", "Microsoft", "WinGet", "Links", exe), // Windows, winget
  ];
}

/** Absolute path to `name` if found at a known install location, otherwise null. */
export function resolveBinary(name: string): string | null {
  for (const p of candidatePaths(name)) {
    try {
      if (fs.existsSync(p)) return p;
    } catch {
      /* ignore */
    }
  }
  return null;
}

/** True if `name` runs successfully via the shell PATH (not a known install location). */
export function binaryOnPath(name: string): boolean {
  try {
    execFileSync(name, ["--version"], { stdio: "ignore", windowsHide: true });
    return true;
  } catch {
    return false;
  }
}

/** True if `name` is available, either at a known install location or on PATH. */
export function binaryAvailable(name: string): boolean {
  return resolveBinary(name) !== null || binaryOnPath(name);
}

/** Command to pass to spawn/execFile: an absolute path if known, otherwise the bare name (resolved via PATH). */
export function binaryCommand(name: string): string {
  return resolveBinary(name) ?? name;
}
