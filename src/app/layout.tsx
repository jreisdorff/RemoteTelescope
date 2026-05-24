import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "RemoteTelescope",
  description: "Catoptric observation and remote viewing across worlds",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <header className="border-b border-[var(--border)] bg-[var(--panel)]">
          <nav className="mx-auto flex max-w-5xl items-center gap-6 px-6 py-4 text-sm">
            <Link href="/observatory" className="font-semibold tracking-wide no-underline">
              RemoteTelescope
            </Link>
            <Link href="/observatory" className="text-[var(--muted)] no-underline hover:text-[var(--foreground)]">
              Observatory
            </Link>
          </nav>
        </header>
        <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
