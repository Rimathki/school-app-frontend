import type { Metadata } from "next";
import StoreProvider from "./provider";
import { Toaster } from "@/components/ui/toaster";
import Notification from "@/components/elements/notification";
import "./globals.css";

export const metadata: Metadata = {
  title: "School quiz app",
  description: "School quiz app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        <StoreProvider>
          {children}
          <Toaster />
          <Notification/>
        </StoreProvider>
      </body>
    </html>
  );
}
