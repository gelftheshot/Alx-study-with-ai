'use client';
import { AppBar, Toolbar, Typography, Button, Box, IconButton } from '@mui/material';
import Link from 'next/link';
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useTheme } from './ThemeProvider';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

export default function Header() {
  const { darkMode, toggleDarkMode } = useTheme();

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
        <IconButton onClick={toggleDarkMode} color="inherit" sx={{ mr: 2 }}>
          {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
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