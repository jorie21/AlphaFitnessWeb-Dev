import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Topbar from "@/components/Topbar";
import { AuthProvider, useAuth } from "@/context/authContext";
import { Toaster } from "sonner";

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
          <Toaster
            position="bottom-right"
            richColors
            closeButton
            expand
            toastOptions={{
              classNames: {
                toast: "rounded-xl shadow-lg border border-gray-200 bg-white",
                title: "text-sm font-medium text-gray-900",
                description: "text-xs text-gray-600",
                actionButton: "bg-green-600 text-white px-3 py-1 rounded-md",
                cancelButton: "bg-gray-200 text-gray-800 px-3 py-1 rounded-md",
              },
            }}
          />

          <div className="pt-20">
            <Topbar />
          </div>

          <main className="w-full">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
