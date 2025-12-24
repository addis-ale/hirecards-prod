"use client";

import { NavBar } from "@/app/modules/landing-page/ui/components/tubelight-navbar";
import {
  Sparkles,
  PlayCircle,
  MessageSquare,
  DollarSign,
  HelpCircle,
} from "lucide-react";

const navItems = [
  {
    name: "How It Works",
    url: "#how-it-works",
    icon: PlayCircle,
  },
  {
    name: "For You",
    url: "#built-for",
    icon: Sparkles,
  },
  {
    name: "Testimonials",
    url: "#testimonials",
    icon: MessageSquare,
  },
  {
    name: "Pricing",
    url: "#pricing",
    icon: DollarSign,
  },
  {
    name: "FAQ",
    url: "#faq",
    icon: HelpCircle,
  },
];

export const HomeNavbar = () => {
  return <NavBar items={navItems} />;
};
