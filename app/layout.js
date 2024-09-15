
// import localFont from "next/font/local";
import "./globals.css";
import Nav from "./_components/Nav";
import { ThemeProvider } from "./Theme";
// import { useState } from "react";

export const metadata = {
  title: "Rhaen",
  description: "Luxury Fashion Brand",
};

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <body
        className="bg-black"
      >
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <Nav/>
        {children}
        
          </ThemeProvider>
        
      </body>
    </html>
  );
}

