import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ["en", "vi"],

  // Used when no locale matches
  defaultLocale: "vi",

  // The `pathnames` object holds a collection of paths
  pathnames: {
    "/": "/",
    "/login": "/login",
    "/dashboard": "/dashboard",
    "/payments": "/payments",
    "/payments/[id]": "/payments/[id]",
    "/orders": "/orders",
    "/products": "/products",
    "/users": "/users",
    "/settings": "/settings",
  },
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);
