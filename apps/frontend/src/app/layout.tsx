import type { Metadata } from "next";
import "./global.scss";

export const metadata: Metadata = {
  title: "Star Wars Codex",
  description: "NextJs + Nest"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
