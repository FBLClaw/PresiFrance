import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  it("fusionne les classes Tailwind", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });
});
