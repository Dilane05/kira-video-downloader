// @vitest-environment node
import { describe, expect, it } from "vitest";
import { sanitizeName } from "@/app/api/download/route";

describe("sanitizeName", () => {
  it("replaces filesystem-unsafe characters with a dash", () => {
    expect(sanitizeName('My/Video:Title*?"<>|')).toBe("My-Video-Title------");
  });

  it("collapses repeated dots into a single dot", () => {
    expect(sanitizeName("Season...1")).toBe("Season.1");
  });

  it("trims surrounding whitespace", () => {
    expect(sanitizeName("  Clean Title  ")).toBe("Clean Title");
  });

  it("truncates names longer than 180 characters", () => {
    const long = "a".repeat(250);
    expect(sanitizeName(long)).toHaveLength(180);
  });

  it("leaves an already-safe name untouched", () => {
    expect(sanitizeName("Ma Playlist Preferee")).toBe("Ma Playlist Preferee");
  });
});
