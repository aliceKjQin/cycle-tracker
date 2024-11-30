import { Open_Sans, Roboto } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { AuthProvider } from "@/contexts/AuthContext";
import Head from "./head";
import Logout from "@/app/Logout";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ThemeToggle from "@/app/ThemeToggle";

const opensans = Open_Sans({ subsets: ["latin"] });
const roboto = Roboto({ subsets: ["latin"], weight: ["700"] });

export const metadata = {
  title: "Cycle Tracker",
  description: "Track your cycle throughout the year",
};

export default function RootLayout({ children }) {
  const header = (
    <header className="p-4 sm:p-8 flex items-center justify-between gap-4">
      <Link href="/">
        <h1 className={`text-base sm:text-lg textGradient ${roboto.className}`}>
          Cycle Tracker
        </h1>
      </Link>
      <div className="flex gap-6">
        <ThemeToggle />
        <Logout />
      </div>
    </header>
  );
  const footer = (
    <footer className="p-4 sm:p-8 grid place-items-center">
      <p className={`textGradient ${roboto.className}`}>
        Be kind to yourself{" "}
        <i className="fa-regular fa-face-kiss-wink-heart fa-lg"></i>
      </p>
    </footer>
  );

  return (
    <html lang="en">
      <Head />
      <AuthProvider>
        <ThemeProvider>
          <body
            className={`w-full max-w-[1000px] mx-auto text-sm sm:text-base min-h-screen flex flex-col  ${opensans.className} bg-stone-100 dark:bg-indigo-100 text-stone-600`}
          >
            {header}
            {children}
            {footer}
          </body>
        </ThemeProvider>
      </AuthProvider>
    </html>
  );
}
