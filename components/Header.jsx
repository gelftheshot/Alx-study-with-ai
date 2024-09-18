'use client';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import Link from 'next/link';
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Header() {
  return (
    <AppBar position="static" color="primary" elevation={0}>
      <Toolbar sx={{ flexWrap: 'wrap' }}>
        <Typography variant="h6" color="white" noWrap sx={{ flexGrow: 1 }}>
          <Link href="/" passHref style={{ textDecoration: 'none', color: 'inherit' }}>
            ALX Study with AI
          </Link>
        </Typography>
        <nav>
          <Link href="/study-tools" passHref>
            <Button sx={{ my: 1, mx: 1.5, color: 'white' }}>Study Tools</Button>
          </Link>
          <Link href="/progress" passHref>
            <Button sx={{ my: 1, mx: 1.5, color: 'white' }}>Progress</Button>
          </Link>
        </nav>
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
        <SignedOut>
          <Link href="/sign-in" passHref>
            <Button sx={{ my: 1, mx: 1.5, color: 'white' }}>Login</Button>
          </Link>
          <Link href="/sign-up" passHref>
            <Button variant="outlined" sx={{ my: 1, mx: 1.5, color: 'white', borderColor: 'white' }}>Sign Up</Button>
          </Link>
        </SignedOut>
      </Toolbar>
    </AppBar>
  );
}