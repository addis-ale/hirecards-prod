"use client";

import { NavBar } from "@/app/modules/ui/components/tubelight-navbar";
import { Sparkles, PlayCircle, MessageSquare, Briefcase } from "lucide-react";

const navItems = [
  {
    name: "Features",
    url: "#features",
    icon: Sparkles,
  },
  {
    name: "How It Works",
    url: "#how-it-works",
    icon: PlayCircle,
  },
  {
    name: "Testimonial",
    url: "#testimonial",
    icon: MessageSquare,
  },
  {
    name: "My Hirecards",
    url: "#my-hirecards",
    icon: Briefcase,
  },
];

export const HomeNavbar = () => {
  return <NavBar items={navItems} />;
};
