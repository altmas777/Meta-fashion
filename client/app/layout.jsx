import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata = {
  title: {
    template: "%s | Meta Fashion",
    default: "Meta Fashion - Premium Ecommerce",
  },
  description: "Discover the exceptional at Meta Fashion. Curated collections for the discerning few. Shop premium fashion, electronics, and accessories.",
  keywords: ["Premium Ecommerce", "Luxury Fashion", "Meta Fashion", "Exclusive Electronics", "Designer Wear", "Online Shopping India"],
  openGraph: {
    title: "Meta Fashion - Premium Ecommerce",
    description: "Discover the exceptional at Meta Fashion. Curated collections for the discerning few.",
    url: "https://meta-fashion.vercel.app",
    siteName: "Meta Fashion",
    images: [
      {
        url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop",
        width: 1200,
        height: 630,
        alt: "Meta Fashion Premium Storefront",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Meta Fashion - Premium Ecommerce",
    description: "Discover the exceptional at Meta Fashion.",
    images: ["https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} bg-background text-textPrimary font-sans min-h-screen flex flex-col`}>
        {children}
        <Toaster 
          position="top-right" 
          toastOptions={{
            style: {
              background: '#1E1E1E',
              color: '#F5F5F5',
              border: '1px solid #C8A97E',
            },
            success: {
              iconTheme: {
                primary: '#22C55E',
                secondary: '#1E1E1E',
              },
            },
          }} 
        />
      </body>
    </html>
  );
}
