
import React from "react";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export const Header = () => {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <a href="/" className="text-xl font-bold">
            Journal<span className="text-primary">Hub</span>
          </a>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
              Home
            </a>
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
              Categories
            </a>
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
              Popular
            </a>
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
              Latest
            </a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" className="hidden md:flex">
            Sign In
          </Button>
          <Button>Get Started</Button>
        </div>
      </div>
    </header>
  );
};
