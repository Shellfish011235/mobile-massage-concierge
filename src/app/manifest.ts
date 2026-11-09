import type { MetadataRoute } from "next";

/** Installable web-app metadata. No offline caching of bookings or customer data. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Anam Beo Massage Concierge",
    short_name: "Anam Beo",
    description: "Private resident massage booking at The Addison",
    start_url: "/addison",
    scope: "/addison",
    display: "standalone",
    background_color: "#173d34",
    theme_color: "#173d34",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
    ],
  };
}
