"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Facebook,
  Instagram,
  Linkedin,
  Moon,
  Send,
  Sun,
  Twitter,
} from "lucide-react";
import { useTheme } from "next-themes";

export const Footer = () => {
  const { theme, setTheme } = useTheme();
  const [email, setEmail] = React.useState("");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isDarkMode = theme === "dark";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    setEmail("");
  };

  return (
    <footer className="relative border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
      <div className="px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
            <div className="relative">
              <h2 className="mb-4 text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                Stay Connected
              </h2>
              <p className="mb-6 text-slate-600 dark:text-slate-400">
                Join our newsletter for the latest hiring insights and Battle
                Cards updates.
              </p>
              <form className="relative" onSubmit={handleSubmit}>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pr-12 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 dark:text-white"
                />
                <Button
                  type="submit"
                  size="icon"
                  className="absolute right-1 top-1 h-8 w-8 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 transition-transform hover:scale-105 hover:bg-slate-800 dark:hover:bg-slate-200"
                >
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Subscribe</span>
                </Button>
              </form>
              <div className="absolute -right-4 top-0 h-24 w-24 rounded-full bg-slate-900/10 dark:bg-white/5 blur-2xl" />
            </div>

            <div>
              <h3 className="mb-4 text-lg font-black text-slate-900 dark:text-white">
                Quick Links
              </h3>
              <nav className="space-y-2 text-sm">
                <a
                  href="#"
                  className="block text-slate-600 dark:text-slate-400 transition-colors hover:text-slate-900 dark:hover:text-white"
                >
                  Home
                </a>
                <a
                  href="#"
                  className="block text-slate-600 dark:text-slate-400 transition-colors hover:text-slate-900 dark:hover:text-white"
                >
                  About Us
                </a>
                <a
                  href="#"
                  className="block text-slate-600 dark:text-slate-400 transition-colors hover:text-slate-900 dark:hover:text-white"
                >
                  Battle Cards
                </a>
                <a
                  href="#"
                  className="block text-slate-600 dark:text-slate-400 transition-colors hover:text-slate-900 dark:hover:text-white"
                >
                  Pricing
                </a>
                <a
                  href="#"
                  className="block text-slate-600 dark:text-slate-400 transition-colors hover:text-slate-900 dark:hover:text-white"
                >
                  Contact
                </a>
              </nav>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-black text-slate-900 dark:text-white">
                Contact Us
              </h3>
              <address className="space-y-2 text-sm not-italic text-slate-600 dark:text-slate-400">
                <p>123 Innovation Street</p>
                <p>Tech City, TC 12345</p>
                <p>Phone: (123) 456-7890</p>
                <p>Email: hello@hirecards.com</p>
              </address>
            </div>

            <div className="relative">
              <h3 className="mb-4 text-lg font-black text-slate-900 dark:text-white">
                Follow Us
              </h3>
              <div className="mb-6 flex space-x-4">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full border-slate-200 dark:border-slate-800 hover:border-slate-900 dark:hover:border-white dark:text-white"
                      >
                        <Facebook className="h-4 w-4" />
                        <span className="sr-only">Facebook</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Follow us on Facebook</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full border-slate-200 dark:border-slate-800 hover:border-slate-900 dark:hover:border-white dark:text-white"
                      >
                        <Twitter className="h-4 w-4" />
                        <span className="sr-only">Twitter</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Follow us on Twitter</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full border-slate-200 dark:border-slate-800 hover:border-slate-900 dark:hover:border-white dark:text-white"
                      >
                        <Instagram className="h-4 w-4" />
                        <span className="sr-only">Instagram</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Follow us on Instagram</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full border-slate-200 dark:border-slate-800 hover:border-slate-900 dark:hover:border-white dark:text-white"
                      >
                        <Linkedin className="h-4 w-4" />
                        <span className="sr-only">LinkedIn</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Connect with us on LinkedIn</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="flex items-center space-x-2">
                <Sun className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                <Switch
                  id="dark-mode"
                  checked={mounted ? isDarkMode : false}
                  onCheckedChange={(checked: boolean) =>
                    setTheme(checked ? "dark" : "light")
                  }
                  disabled={!mounted}
                />
                <Moon className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                <Label htmlFor="dark-mode" className="sr-only">
                  Toggle dark mode
                </Label>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-200 dark:border-slate-800 pt-8 text-center md:flex-row">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              © 2024 HireCards. All rights reserved.
            </p>
            <nav className="flex gap-4 text-sm">
              <a
                href="#"
                className="text-slate-600 dark:text-slate-400 transition-colors hover:text-slate-900 dark:hover:text-white"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-slate-600 dark:text-slate-400 transition-colors hover:text-slate-900 dark:hover:text-white"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-slate-600 dark:text-slate-400 transition-colors hover:text-slate-900 dark:hover:text-white"
              >
                Cookie Settings
              </a>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
};
