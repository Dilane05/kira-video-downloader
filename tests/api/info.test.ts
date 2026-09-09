// @vitest-environment node
import { describe, expect, it } from "vitest";
import { buildFormats } from "@/app/api/info/route";

describe("buildFormats", () => {
  it("keeps progressive formats (video+audio in one file) without needing ffmpeg", () => {
    const formats = buildFormats(
      [
        {
          format_id: "22",
          ext: "mp4",
          vcodec: "avc1",
          acodec: "mp4a",
          height: 720,
          protocol: "https",
        },
      ],
      false,
    );

    expect(formats).toHaveLength(1);
    expect(formats[0]).toMatchObject({
      id: "22",
      label: "720p",
      hasVideo: true,
      hasAudio: true,
      needsMerge: false,
    });
  });

  it("builds merge-required formats from separate video/audio streams", () => {
    const formats = buildFormats(
      [
        { format_id: "137", ext: "mp4", vcodec: "avc1", acodec: "none", height: 1080, vbr: 4000 },
        { format_id: "140", ext: "m4a", vcodec: "none", acodec: "mp4a", abr: 128 },
      ],
      true,
    );

    const merged = formats.find((f) => f.id === "merge-1080");
    expect(merged).toBeDefined();
    expect(merged?.needsMerge).toBe(true);
    expect(merged?.selector).toContain("bestvideo[height<=1080]");
  });

  it("excludes HLS/DASH manifest formats from the progressive list", () => {
    const formats = buildFormats(
      [
        {
          format_id: "96",
          ext: "mp4",
          vcodec: "avc1",
          acodec: "mp4a",
          height: 720,
          protocol: "m3u8_native",
        },
      ],
      false,
    );

    expect(formats.find((f) => f.id === "96")).toBeUndefined();
  });

  it("lists up to 3 distinct audio-only formats sorted after video formats", () => {
    const formats = buildFormats(
      [
        { format_id: "22", ext: "mp4", vcodec: "avc1", acodec: "mp4a", height: 720 },
        { format_id: "140", ext: "m4a", vcodec: "none", acodec: "mp4a", abr: 128 },
        { format_id: "139", ext: "m4a", vcodec: "none", acodec: "mp4a", abr: 48 },
      ],
      false,
    );

    const audioOnly = formats.filter((f) => !f.hasVideo);
    expect(audioOnly).toHaveLength(2);
    expect(formats[formats.length - 1].hasVideo).toBe(false);
  });

  it("returns an empty list when no usable formats are present", () => {
    expect(buildFormats([], false)).toEqual([]);
  });
});

describe("GET /api/info", () => {
  it("returns 400 when the url query parameter is missing", async () => {
    const { GET } = await import("@/app/api/info/route");
    const { NextRequest } = await import("next/server");

    const req = new NextRequest("http://localhost/api/info");
    const res = await GET(req);

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/url/i);
  });
});
