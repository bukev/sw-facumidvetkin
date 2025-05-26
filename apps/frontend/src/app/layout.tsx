import type { Metadata } from "next";
import "./global.scss";
import { ClientSideProviders } from "src/providers/ClientSideProviders";

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
        <div className="content">
          <ClientSideProviders>
            {children}
          </ClientSideProviders>
        </div>
      </body>
    </html>
  );
}
