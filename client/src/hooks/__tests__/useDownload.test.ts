import { renderHook, act, waitFor } from "@testing-library/react";
import { useDownload } from "../useDownload";

vi.mock("../../services/api", () => ({
  fetchMediaInfo: vi.fn().mockResolvedValue({
    title: "Test Video",
    thumbnail: "https://example.com/thumb.jpg",
    duration: 120,
    platform: "YouTube",
    formats: [
      {
        id: "22",
        ext: "mp4",
        resolution: "1280x720",
        filesize: 10485760,
        hasAudio: true,
        hasVideo: true,
        label: "1280x720 - video+audio - MP4 - 10.0 MB",
      },
    ],
    originalUrl: "https://www.youtube.com/watch?v=test",
  }),
  getDownloadUrl: vi.fn().mockReturnValue("/api/media/download?url=test&formatId=22"),
}));

describe("useDownload", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });
  it("starts with empty queue", () => {
    const { result } = renderHook(() => useDownload());
    expect(result.current.queue).toHaveLength(0);
  });

  it("adds URL to queue and fetches info", async () => {
    const { result } = renderHook(() => useDownload());

    act(() => {
      result.current.addUrl("https://www.youtube.com/watch?v=test");
    });

    expect(result.current.queue).toHaveLength(1);
    expect(result.current.queue[0].status).toBe("loading");

    await waitFor(() => {
      expect(result.current.queue[0].status).toBe("ready");
    });

    expect(result.current.queue[0].info?.title).toBe("Test Video");
    expect(result.current.queue[0].selectedFormatId).toBe("22");
  });

  it("removes item from queue", async () => {
    const { result } = renderHook(() => useDownload());

    act(() => {
      result.current.addUrl("https://www.youtube.com/watch?v=test");
    });

    await waitFor(() => {
      expect(result.current.queue[0].status).toBe("ready");
    });

    const id = result.current.queue[0].id;
    act(() => {
      result.current.removeItem(id);
    });

    expect(result.current.queue).toHaveLength(0);
  });

  it("clears entire queue", async () => {
    const { result } = renderHook(() => useDownload());

    act(() => {
      result.current.addUrl("https://www.youtube.com/watch?v=test1");
    });

    await waitFor(() => {
      expect(result.current.queue.length).toBeGreaterThan(0);
    });

    act(() => {
      result.current.clearQueue();
    });

    expect(result.current.queue).toHaveLength(0);
  });
});
