"use client";

import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";
import { UserButton, SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { BookmarkIcon } from "lucide-react";

export default function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/60 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="flex items-center gap-2 shrink-0 transition-opacity hover:opacity-80">
                    <div className="p-1.5 bg-blue-600/10 rounded-md dark:bg-blue-400/10">
                        <BookmarkIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="font-bold text-base sm:text-lg tracking-tight">
                        LinkVault
                    </span>
                </Link>
                <div className="flex items-center gap-2 sm:gap-4">
                    <ModeToggle />
                    <SignedIn>
                        <Link href="/dashboard">
                            <Button variant="ghost" size="sm" className="text-xs sm:text-sm font-medium">
                                Dashboard
                            </Button>
                        </Link>
                        <UserButton />
                    </SignedIn>
                    <SignedOut>
                        <div className="flex items-center gap-1.5 sm:gap-2">
                            <SignInButton mode="modal" fallbackRedirectUrl="/dashboard" forceRedirectUrl="/dashboard">
                                <Button variant="ghost" size="sm" className="text-xs sm:text-sm font-medium px-2 sm:px-4">
                                    Log In
                                </Button>
                            </SignInButton>
                            <SignUpButton mode="modal" fallbackRedirectUrl="/dashboard" forceRedirectUrl="/dashboard">
                                <Button size="sm" className="text-xs sm:text-sm font-medium px-3 sm:px-4 bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600">
                                    Sign Up
                                </Button>
                            </SignUpButton>
                        </div>
                    </SignedOut>
                </div>
            </div>
        </header>
    );
}