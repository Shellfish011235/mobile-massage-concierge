import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Anam Beo | The Addison Massage Concierge",
  description: "Private resident massage booking at The Addison. Florida massage license MA-28774. Booking requests are subject to approval.",
  applicationName: "Anam Beo Massage Concierge",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Anam Beo", statusBarStyle: "default" },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#173d34",
  width: "device-width",
  initialScale: 1,
};

export default function AddisonLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
