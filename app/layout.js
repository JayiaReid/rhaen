
// import localFont from "next/font/local";
import "./globals.css";
import Nav from "./_components/Nav";
import { ThemeProvider } from "./Theme";
import { ClerkProvider } from "@clerk/nextjs";
// import { useState } from "react";
import { light } from '@clerk/themes';
import { Toaster } from "@/components/ui/toaster";

export const metadata = {
  title: "Rhaen",
  description: "Cake Store",
};

export default function RootLayout({ children }) {

  return (
    <ClerkProvider
    frontendApi={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
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
        <Toaster />
        <div className="bg-black p-3 mt-8 flex items-center justify-center">
        <h2 className="text-white">© 2024 Our cakestore. All rights reserved.</h2>
      </div>
          </ThemeProvider>
        
      </body>
    </html>
    </ClerkProvider>
  );
}

