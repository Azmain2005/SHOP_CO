
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster, toast } from "react-hot-toast";




const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "InStylebyShifa",
  description: "Where Style Meets Storytelling",
};

const CLIENT_ID = "1037614128251-kk326tc7ll40i5gfo3f6d0flc3n6tjmc.apps.googleusercontent.com";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <GoogleOAuthProvider clientId={CLIENT_ID}>
          {children}
          <Toaster position="top-center" reverseOrder={false} />
          </GoogleOAuthProvider>
        </Providers>
      </body>
    </html>
  );
}
