'use client';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import Link from 'next/link';
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Header() {
  return (
    <AppBar position="static" color="default" elevation={0}>
      <Toolbar sx={{ flexWrap: 'wrap' }}>
        <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
          <Link href="/" passHref style={{ textDecoration: 'none', color: 'inherit' }}>
            FlashCard AI
          </Link>
        </Typography>
        <nav>
          <Link href="/my-flashcards" passHref>
            <Button sx={{ my: 1, mx: 1.5 }}>My Flashcards</Button>
          </Link>
        </nav>
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
        <SignedOut>
          <Link href="/sign-in" passHref>
            <Button sx={{ my: 1, mx: 1.5 }}>Login</Button>
          </Link>
          <Link href="/sign-up" passHref>
            <Button variant="outlined" sx={{ my: 1, mx: 1.5 }}>Sign Up</Button>
          </Link>
        </SignedOut>
      </Toolbar>
    </AppBar>
  );
}