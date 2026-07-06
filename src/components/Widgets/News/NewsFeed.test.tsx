import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import NewsFeed from "./NewsFeed";
import useProfileStore from "../../../stores/profileStore";
import { useNewsStore } from "../../../stores/newsStore";

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, layout: _layout, transition: _transition, exit: _exit, ...props }: React.ComponentPropsWithoutRef<"div"> & { layout?: unknown; transition?: unknown; exit?: unknown }) => (
      <div {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe("NewsFeed", () => {
  beforeEach(() => {
    vi.spyOn(useNewsStore.getState(), "fetchArticles").mockResolvedValue(undefined);

    useProfileStore.setState({
      name: "Alex",
      city: "Hanoi,VN",
      interests: ["thethao", "thoisu"],
      hasCompletedSetup: true,
    });

    useNewsStore.setState({
      articles: [
        {
          id: "news-1",
          title: "Vòng 16 World Cup",
          url: "https://vnexpress.net",
          source: "VnExpress",
          category: "thethao",
          imageUrl: "https://images.unsplash.com/photo-1",
          publishedAt: "5 ngày trước",
          likes: 98,
        },
        {
          id: "news-2",
          title: "Bão suy yếu ở miền Bắc",
          url: "https://tienphong.vn",
          source: "Tiền Phong",
          category: "thoisu",
          imageUrl: "https://images.unsplash.com/photo-2",
          publishedAt: "6 giờ trước",
          likes: 31,
        },
      ],
      isLoading: false,
      hasError: false,
      errorMessage: null,
      likedArticleIds: [],
    });
  });

  it("renders news feed header and dynamic tabs", () => {
    render(<NewsFeed />);

    expect(screen.getByText("Tin tức nổi bật")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Tất cả" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Thể thao" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Thời sự" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Thế giới" })).not.toBeInTheDocument();
  });

  it("filters articles by category tab", async () => {
    const user = userEvent.setup();
    render(<NewsFeed />);

    expect(screen.getByText("Vòng 16 World Cup")).toBeInTheDocument();
    expect(screen.getByText("Bão suy yếu ở miền Bắc")).toBeInTheDocument();

    const sportsTab = screen.getByRole("button", { name: "Thể thao" });
    await user.click(sportsTab);

    expect(screen.getByText("Vòng 16 World Cup")).toBeInTheDocument();
    expect(screen.queryByText("Bão suy yếu ở miền Bắc")).not.toBeInTheDocument();
  });

  it("displays loading skeleton when loading", () => {
    useNewsStore.setState({
      articles: [],
      isLoading: true,
      hasError: false,
    });

    render(<NewsFeed />);
    expect(screen.queryByText("Vòng 16 World Cup")).not.toBeInTheDocument();
  });
});
