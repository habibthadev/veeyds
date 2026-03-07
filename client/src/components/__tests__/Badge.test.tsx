import { render, screen } from "@testing-library/react";
import { Badge } from "../ui/Badge";

describe("Badge", () => {
  it("renders children", () => {
    render(<Badge>YouTube</Badge>);
    expect(screen.getByText("YouTube")).toBeInTheDocument();
  });

  it("applies accent variant styles", () => {
    render(<Badge variant="accent">Active</Badge>);
    const badge = screen.getByText("Active");
    expect(badge).toBeInTheDocument();
  });
});
