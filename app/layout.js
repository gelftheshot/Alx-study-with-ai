import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '../styles/theme';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "FlashCard Pro - Create Flashcards Easily",
  description: "Turn your text into flashcards with our AI-powered tool",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}