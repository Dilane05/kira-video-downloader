import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

describe("Home page", () => {
  it("renders the URL input and submit button", () => {
    render(<Home />);

    expect(
      screen.getByPlaceholderText(/youtube\.com\/watch/i),
    ).toBeInTheDocument();
  });
});
