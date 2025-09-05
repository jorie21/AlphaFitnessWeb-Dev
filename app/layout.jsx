
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Topbar from "@/components/Topbar";
import { AuthProvider, useAuth } from "@/context/authContext";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Alpha Fitness",
};


export default function RootLayout({ children }) {
  
  return (
    <html lang="en" className="w-full overflow-x-hidden">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen w-full overflow-x-hidden`}
      >
        <AuthProvider>
          <div className="pt-20">
            <Topbar />
          </div>

          <main className="w-full">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
