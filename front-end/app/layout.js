import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ['latin'],
  // Inter includes these weights by default, no need to specify them all
  variable: '--font-inter',
});

export const metadata = {
  title: "BharatBazaar",
  description: "The platform where aspirations turn into reality",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}