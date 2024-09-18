'use client';
import { useUser } from '@clerk/nextjs';
import HomeSignedOut from '../components/HomeSignedOut';
import HomeSignedIn from '../components/HomeSignedIn';

export default function Home() {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return <div>Loading ALX Study with AI...</div>;
  }

  return isSignedIn ? <HomeSignedIn /> : <HomeSignedOut />;
}