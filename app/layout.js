
// import localFont from "next/font/local";
import "./globals.css";
import Nav from "./_components/Nav";
import { ThemeProvider } from "./Theme";
import { ClerkProvider } from "@clerk/nextjs";
// import { useState } from "react";
import { light } from '@clerk/themes';

export const metadata = {
  title: "Rhaen",
  description: "Luxury Fashion Brand",
};

export default function RootLayout({ children }) {

  return (
    <ClerkProvider
    appearance={{
      baseTheme: light,
      variables: { colorPrimary: '#E11D48', colorBackground:'#fff', fontSize:'1rem', spacingUnit:'1rem' }
    }}>
    <html lang="en">
      <body
        className="bg-black"
      >
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            // enableSystem
            disableTransitionOnChange
          >
            <Nav/>
        {children}
        {/* contact in footer */}
          </ThemeProvider>
        
      </body>
    </html>
    </ClerkProvider>
  );
}

