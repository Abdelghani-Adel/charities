import { createRouter } from "@tanstack/react-router";
import { Route as rootRoute } from "./routes/__root";
import { Route as authenticatedRoute } from "./routes/_authenticated";
import { Route as indexRoute } from "./routes/index";
import { Route as loginRoute } from "./routes/login";

const routeTree = rootRoute.addChildren([
  authenticatedRoute.addChildren([indexRoute]),
  loginRoute,
]);

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  context: {
    auth: { isAuthenticated: false },
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
