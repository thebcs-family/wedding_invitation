"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import AnimatedSection from "./components/AnimatedSection";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push("/");
    }, 3000);
    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[var(--primary-color)] px-4">
      <AnimatedSection className="w-full max-w-md text-center">
        <div className="relative w-full h-72 mb-8">
          <Image
            src="/images/dragons.png"
            alt="Cartoon couple with dragons"
            fill
            style={{ objectFit: "contain" }}
            className="rounded-xl shadow-lg"
            priority
          />
        </div>
        <h1 className="text-3xl font-bold mb-4 text-[var(--button-color)]">Oops! Page not found</h1>
        <p className="mb-6 text-gray-700">Looks like you took a wrong turn. Redirecting you home...</p>
        <Link
          href="/"
          className="inline-block text-white px-6 py-3 rounded-lg transition-colors text-lg"
          style={{ backgroundColor: "var(--button-color)" }}
        >
          Go to Home Now
        </Link>
      </AnimatedSection>
    </main>
  );
} 