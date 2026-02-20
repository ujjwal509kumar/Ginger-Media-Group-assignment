"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { SignedOut, SignUpButton, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles } from "lucide-react";

export default function HomePage() {
  const { userId, isLoaded } = useAuth();
  const router = useRouter();
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [loopCount, setLoopCount] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  const fullText = "LinkVault";

  // rediret to dashboard after logged in
  useEffect(() => {
    if (isLoaded && userId) {
      router.replace("/dashboard");
    }
  }, [userId, isLoaded, router]);

  // typewriter style logic
  useEffect(() => {
    if (isFinished) return;
    const handleType = () => {
      const currentTextLength = text.length;
      if (!isDeleting) {
        // Typing mode
        setText(fullText.substring(0, currentTextLength + 1));
        setTypingSpeed(150);
        if (text === fullText) {
          if (loopCount === 0) {
            // tyoe first time then stop logic
            setTimeout(() => setIsDeleting(true), 1500);
          } else {
            // second type logic
            setIsFinished(true);
          }
        }
      } else {
        // deleting backside logic
        setText(fullText.substring(0, currentTextLength - 1));
        setTypingSpeed(70);
        if (text === "") {
          setIsDeleting(false);
          setLoopCount(1);
        }
      }
    };

    const timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, typingSpeed, isFinished, loopCount]);

  if (!isLoaded || userId) return null;

  return (
    <div className="relative min-h-screen flex flex-col bg-background text-foreground overflow-hidden transition-colors duration-300">
      <Navbar />
      <div className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(hsl(var(--muted-foreground)/0.15)_1px,transparent_1px)] bg-size-[24px_24px]"></div>
      <div className="absolute top-[-10%] left-[-10%] -z-10 h-125 w-125 rounded-full bg-blue-600/20 blur-[120px] dark:bg-blue-900/20"></div>
      <div className="absolute bottom-[-10%] right-[-10%] -z-10 h-150 w-150 rounded-full bg-purple-600/20 blur-[150px] dark:bg-purple-900/20"></div>
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 md:py-32">
        <section className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 relative mx-auto">
          <Badge variant="secondary" className="px-4 py-2 text-sm rounded-full border-blue-500/20 bg-blue-500/10 text-blue-700 dark:text-blue-300">
            <Sparkles className="mr-2 h-4 w-4 fill-blue-500" />
            Organize your digital life
          </Badge>
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl">
            Manage your links with <br className="hidden sm:block" />
            <span className="inline-block bg-linear-to-r from-blue-600 via-violet-600 to-indigo-600 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent pb-2 min-h-[1.2em]">
              {text}
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl leading-relaxed">
            Save, organize, and securely access your favorite URLs from anywhere. Built with modern tools for ultimate speed and simplicity.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <SignedOut>
              <SignUpButton mode="modal" fallbackRedirectUrl="/dashboard" forceRedirectUrl="/dashboard">
                <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-md gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 transition-all hover:scale-105 dark:bg-blue-500 dark:hover:bg-blue-600 font-bold">
                  Get Started Free <ArrowRight className="w-4 h-4" />
                </Button>
              </SignUpButton>
            </SignedOut>

            <Link href="https://github.com/ujjwal509kumar/Ginger-Media-Group-assignment" target="_blank">
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 text-md bg-background/50 backdrop-blur-sm transition-all hover:bg-muted border-border font-bold">
                View Source Code
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}