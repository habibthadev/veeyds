import { render, screen } from "@testing-library/react";
import { Input } from "../ui/Input";

describe("Input", () => {
  it("renders with placeholder", () => {
    render(<Input placeholder="Enter URL..." />);
    expect(screen.getByPlaceholderText("Enter URL...")).toBeInTheDocument();
  });

  it("displays error message", () => {
    render(<Input error="Invalid URL" />);
    expect(screen.getByText("Invalid URL")).toBeInTheDocument();
  });
});
