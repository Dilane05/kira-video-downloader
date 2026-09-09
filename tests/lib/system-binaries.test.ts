// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";
import fs from "fs";
import * as childProcess from "child_process";

vi.mock("fs", async (importOriginal) => {
  const actual = await importOriginal<typeof import("fs")>();
  return { ...actual, default: { ...actual, existsSync: vi.fn() } };
});
vi.mock("child_process", async (importOriginal) => {
  const actual = await importOriginal<typeof import("child_process")>();
  return { ...actual, execFileSync: vi.fn() };
});

const existsSyncMock = fs.existsSync as unknown as ReturnType<typeof vi.fn>;
const execFileSyncMock = childProcess.execFileSync as unknown as ReturnType<typeof vi.fn>;

describe("system-binaries", () => {
  afterEach(() => {
    vi.resetAllMocks();
    vi.resetModules();
  });

  it("resolveBinary returns the first matching known install path", async () => {
    existsSyncMock.mockImplementation((p: string) => p === "/usr/bin/yt-dlp");
    const { resolveBinary } = await import("@/lib/system-binaries");

    expect(resolveBinary("yt-dlp")).toBe("/usr/bin/yt-dlp");
  });

  it("resolveBinary returns null when no known path matches", async () => {
    existsSyncMock.mockReturnValue(false);
    const { resolveBinary } = await import("@/lib/system-binaries");

    expect(resolveBinary("yt-dlp")).toBeNull();
  });

  it("binaryOnPath returns true when the command runs successfully", async () => {
    execFileSyncMock.mockReturnValue(Buffer.from(""));
    const { binaryOnPath } = await import("@/lib/system-binaries");

    expect(binaryOnPath("ffmpeg")).toBe(true);
  });

  it("binaryOnPath returns false when the command is not found", async () => {
    execFileSyncMock.mockImplementation(() => {
      throw new Error("command not found");
    });
    const { binaryOnPath } = await import("@/lib/system-binaries");

    expect(binaryOnPath("ffmpeg")).toBe(false);
  });

  it("binaryCommand falls back to the bare name when no known path matches", async () => {
    existsSyncMock.mockReturnValue(false);
    const { binaryCommand } = await import("@/lib/system-binaries");

    expect(binaryCommand("yt-dlp")).toBe("yt-dlp");
  });

  it("binaryCommand prefers a known absolute path over the bare name", async () => {
    existsSyncMock.mockImplementation((p: string) => p === "/opt/homebrew/bin/yt-dlp");
    const { binaryCommand } = await import("@/lib/system-binaries");

    expect(binaryCommand("yt-dlp")).toBe("/opt/homebrew/bin/yt-dlp");
  });
});
