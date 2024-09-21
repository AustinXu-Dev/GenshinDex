import localFont from "next/font/local";
import "./globals.css";

// Import local fonts
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Update the metadata
export const metadata = {
  title: "Genshin Impact Database", // New title
  description: "Explore characters, weapons, and monsters in Genshin Impact.", // New description
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Metadata settings */}
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />

        {/* Favicon settings */}
        <link rel="icon" href="/icon.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="/icon.png" type="image/png" sizes="16x16" />
        <link rel="apple-touch-icon" href="/img/icon.png" />

        {/* Optionally add a fallback for older browsers */}
        <link rel="shortcut icon" href="/icon.png" type="image/x-icon" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}