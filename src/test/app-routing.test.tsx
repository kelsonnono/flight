import { matchRoutes } from "react-router";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/integrations/supabase/client", () => ({ supabase: { auth: { getUser: vi.fn() } } }));

import { routes } from "@/router";

// Match routes without running loaders or rendering: loaders need Supabase/network the
// test run lacks, and jsdom never loads the stylesheets.
describe("App routing", () => {
  it.each(["/", "/auth", "/signup", "/app"])("matches a real page for %s", (path) => {
    const matches = matchRoutes(routes, path);
    const leaf = matches?.at(-1)?.route;
    expect(leaf).toBeDefined();
    expect(leaf?.path).not.toBe("*");
  });

  it("falls back to the not-found page for unknown paths", () => {
    expect(matchRoutes(routes, "/nope")?.at(-1)?.route.path).toBe("*");
  });
});
