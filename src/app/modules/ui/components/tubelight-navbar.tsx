"use client";

import React, { useEffect, useState } from "react";

import { motion } from "framer-motion";

import Link from "next/link";

import { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface NavItem {
  name: string;
  url: string;
  icon: LucideIcon;
}

interface NavBarProps {
  items: NavItem[];
  className?: string;
  logo?: React.ReactNode;
  getStartedText?: string;
  onGetStartedClick?: () => void;
}

import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function NavBar({
  items,
  className,
  logo,
  getStartedText = "Get Started",
  onGetStartedClick,
}: NavBarProps) {
  const [activeTab, setActiveTab] = useState(items[0].name);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Mobile Navbar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 p-4 flex items-center justify-between bg-background/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center">
          {logo || <div className="text-lg font-bold text-foreground">LOGO</div>}
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-4 mt-8">
              {items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.name;
                return (
                  <Link
                    key={item.name}
                    href={item.url}
                    onClick={() => setActiveTab(item.name)}
                    className={cn(
                      "flex items-center gap-2 text-lg font-medium px-4 py-2 rounded-md transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-foreground/80 hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
              <Button
                className="mt-4 w-full rounded-full"
                onClick={onGetStartedClick}
              >
                {getStartedText}
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Navbar */}
      <div
        className={cn(
          "hidden md:block fixed top-0 left-0 right-0 z-50 pt-6 px-4",
          className
        )}
      >
        <div className="max-w-5xl mx-auto flex items-stretch justify-between gap-4 bg-background/5 border border-border backdrop-blur-lg py-1 pl-1 pr-0 rounded-full shadow-lg overflow-hidden">
          {/* Logo on the left */}
          <div className="flex items-center px-4">
            {logo || (
              <div className="text-lg font-bold text-foreground">LOGO</div>
            )}
          </div>

          {/* Navigation items in the center */}
          <div className="flex items-center gap-3 flex-1 justify-center">
            {items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.name;

              return (
                <Link
                  key={item.name}
                  href={item.url}
                  onClick={() => setActiveTab(item.name)}
                  className={cn(
                    "relative cursor-pointer text-sm font-semibold px-6 py-2 rounded-full transition-colors",
                    "text-foreground/80 hover:text-primary",
                    isActive && "bg-muted text-primary"
                  )}
                >
                  <span className="hidden md:inline">{item.name}</span>
                  <span className="md:hidden">
                    <Icon size={18} strokeWidth={2.5} />
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="lamp"
                      className="absolute inset-0 w-full bg-primary/5 rounded-full -z-10"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    >
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-t-full">
                        <div className="absolute w-12 h-6 bg-primary/20 rounded-full blur-md -top-2 -left-2" />
                        <div className="absolute w-8 h-6 bg-primary/20 rounded-full blur-md -top-1" />
                        <div className="absolute w-4 h-4 bg-primary/20 rounded-full blur-sm top-0 left-2" />
                      </div>
                    </motion.div>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Get Started button on the right */}
          <div className="flex items-stretch -my-1">
            <Button
              className="rounded-full h-full py-0 px-6 flex items-center"
              onClick={onGetStartedClick}
            >
              <span className="hidden sm:inline">{getStartedText}</span>
              <span className="sm:hidden">Start</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
