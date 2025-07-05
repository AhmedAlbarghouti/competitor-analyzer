"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { Menu, X, User, LogOut } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut, loading } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-primary">Competitor Analyzer</h1>
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <a href="#features" className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition-colors">
                How It Works
              </a>
              <a href="#pricing" className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Pricing
              </a>
              {!loading && (
                user ? (
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/dashboard">
                        <User className="h-4 w-4 mr-2" />
                        Dashboard
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" onClick={signOut}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/login">Sign In</Link>
                    </Button>
                    <Button size="sm" asChild>
                      <Link href="/signup">Get Started</Link>
                    </Button>
                  </div>
                )
              )}
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-background border-b border-border">
            <a href="#features" className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground">
              Features
            </a>
            <a href="#how-it-works" className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground">
              How It Works
            </a>
            <a href="#pricing" className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground">
              Pricing
            </a>
            {!loading && (
              <div className="flex flex-col space-y-2 px-3 py-2">
                {user ? (
                  <>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/dashboard">
                        <User className="h-4 w-4 mr-2" />
                        Dashboard
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" onClick={signOut}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/login">Sign In</Link>
                    </Button>
                    <Button size="sm" asChild>
                      <Link href="/signup">Get Started</Link>
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}