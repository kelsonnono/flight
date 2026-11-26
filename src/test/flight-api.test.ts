import { describe, expect, it } from "vitest";

import { formatTwd, parseTargetPrice } from "@/lib/flight-api";

describe("parseTargetPrice", () => {
  it.each([
    ["10000", 10000],
    ["10,000", 10000],
    ["NT$ 9,500", 9500],
    ["7999.6", 8000],
    [" 1 ", 1],
    ["1000000", 1000000],
  ])("parses %j as %d TWD", (input, expected) => {
    expect(parseTargetPrice(input)).toBe(expected);
  });

  it.each(["", "abc", "0", "-500", "1000001", "1e5", "12,3x"])("rejects %j", (input) => {
    expect(parseTargetPrice(input)).toBeNull();
  });
});

describe("formatTwd", () => {
  it("formats with a thousands separator", () => {
    expect(formatTwd(9325)).toBe("NT$9,325");
  });
});
