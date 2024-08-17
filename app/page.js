'use client';
import Hero from '../components/Hero';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import CallToAction from '../components/CallToAction';

export default function Home() {
  return (
    <main>
      <Hero />
      <Features />
      <HowItWorks />
      <CallToAction />
    </main>
  );
}