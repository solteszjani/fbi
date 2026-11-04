import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "FBI Operations Center",
  description: "Federal investigations and operations management for FiveM roleplay"
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="hu"><body>{children}</body></html>;
}
