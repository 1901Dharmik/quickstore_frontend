import { Inter, Nunito, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import QueryProvider from "@/components/providers/QueryProvider";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/sonner";
import { GoogleOAuthProvider } from '@react-oauth/google';

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const nunito = Nunito({
  variable: "--font-display",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "QuickStore — The Art of Horology",
  description:
    "Curated timepieces for collectors. Precision movements, considered design, delivered.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${nunito.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans" suppressHydrationWarning>
        <QueryProvider>
          <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'your-client-id'}>
            <AuthProvider>
              <TooltipProvider>
                {children}
                <Toaster position="top-right" />
              </TooltipProvider>
            </AuthProvider>
          </GoogleOAuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
