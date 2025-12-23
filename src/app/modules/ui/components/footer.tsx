"use client";

import {
  Dribbble,
  Facebook,
  Github,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from "lucide-react";
import Link from "next/link";

const data = {
  facebookLink: "https://facebook.com/hirecards",
  instaLink: "https://instagram.com/hirecards",
  twitterLink: "https://twitter.com/hirecards",
  githubLink: "https://github.com/hirecards",
  dribbbleLink: "https://dribbble.com/hirecards",
  services: {
    webdev: "/candidate-profiles",
    webdesign: "/recruiter-tools",
    marketing: "/talent-discovery",
    googleads: "/job-promotions",
  },
  about: {
    history: "/our-story",
    team: "/our-team",
    handbook: "/platform-guidelines",
    careers: "/careers",
  },
  help: {
    faqs: "/faqs",
    support: "/support",
    livechat: "/live-chat",
  },
  contact: {
    email: "hello@hirecards.com",
    phone: "+251 9 0000 0000",
    address: "Addis Ababa, Ethiopia",
  },
  company: {
    name: "HireCards",
    description:
      "HireCards helps companies discover talent faster through clean, visual candidate profiles. We simplify hiring by turning resumes into modern, scannable cards.",
    logo: "/logo.webp",
  },
};

const socialLinks = [
  { icon: Facebook, label: "Facebook", href: data.facebookLink },
  { icon: Instagram, label: "Instagram", href: data.instaLink },
  { icon: Twitter, label: "Twitter", href: data.twitterLink },
  { icon: Github, label: "GitHub", href: data.githubLink },
  { icon: Dribbble, label: "Dribbble", href: data.dribbbleLink },
];

const aboutLinks = [
  { text: "Company History", href: data.about.history },
  { text: "Meet the Team", href: data.about.team },
  { text: "Employee Handbook", href: data.about.handbook },
  { text: "Careers", href: data.about.careers },
];

const serviceLinks = [
  { text: "Web Development", href: data.services.webdev },
  { text: "Web Design", href: data.services.webdesign },
  { text: "Marketing", href: data.services.marketing },
  { text: "Google Ads", href: data.services.googleads },
];

const helpfulLinks = [
  { text: "FAQs", href: data.help.faqs },
  { text: "Support", href: data.help.support },
  { text: "Live Chat", href: data.help.livechat, hasIndicator: true },
];

const contactInfo = [
  { icon: Mail, text: data.contact.email },
  { icon: Phone, text: data.contact.phone },
  { icon: MapPin, text: data.contact.address, isAddress: true },
];

export default function Footer() {
  return (
    <footer className="relative z-10 mt-16 w-full overflow-hidden pt-16 pb-8">
      <style jsx global>{`
        .glass-footer {
          backdrop-filter: blur(3px) saturate(180%);
          background: radial-gradient(
            circle,
            #f0fdf4 0%,
            #dcfce7 60%,
            #f0fdf4 100%
          );
          border: 1px solid #86efac33;
          justify-content: center;
          align-items: center;
          transition: all 0.3s;
          display: flex;
        }
        .glass-footer:where(.dark, .dark *) {
          backdrop-filter: blur(2px) !important;
          background: radial-gradient(
            circle,
            #ffffff1a 0%,
            #0f2f1a1a 60%,
            #0a1f0e 100%
          ) !important;
          border: 1px solid #22c55e1a !important;
          border-radius: 16px !important;
          justify-content: center !important;
          align-items: center !important;
        }
      `}</style>

      <div className="pointer-events-none absolute top-0 left-1/2 z-0 h-full w-full -translate-x-1/2 select-none">
        <div className="absolute -top-32 left-1/4 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl"></div>
        <div className="absolute right-1/4 -bottom-24 h-80 w-80 rounded-full bg-green-500/20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-500/15 blur-3xl"></div>
      </div>

      <div className="glass-footer relative mx-auto max-w-screen-xl rounded-2xl px-4 pt-16 pb-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div>
            <div className="flex justify-center gap-2 sm:justify-start">
              <img
                src={data.company.logo || "/placeholder.svg"}
                alt="logo"
                className="h-8 w-8 rounded-full"
              />
              <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-2xl font-semibold text-transparent">
                {data.company.name}
              </span>
            </div>

            <p className="text-foreground/70 mt-6 max-w-md text-center leading-relaxed sm:max-w-xs sm:text-left">
              {data.company.description}
            </p>

            <ul className="mt-8 flex justify-center gap-6 sm:justify-start md:gap-8">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-emerald-600 hover:text-emerald-500 transition-colors"
                  >
                    <span className="sr-only">{label}</span>
                    <Icon className="size-6" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 lg:col-span-2">
            <div className="text-center sm:text-left">
              <p className="text-lg font-semibold text-emerald-600">About Us</p>
              <ul className="mt-8 space-y-4 text-sm">
                {aboutLinks.map(({ text, href }) => (
                  <li key={text}>
                    <a
                      className="text-foreground/70 hover:text-emerald-600 transition-colors"
                      href={href}
                    >
                      {text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center sm:text-left">
              <p className="text-lg font-semibold text-emerald-600">
                Our Services
              </p>
              <ul className="mt-8 space-y-4 text-sm">
                {serviceLinks.map(({ text, href }) => (
                  <li key={text}>
                    <a
                      className="text-foreground/70 hover:text-emerald-600 transition-colors"
                      href={href}
                    >
                      {text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center sm:text-left">
              <p className="text-lg font-semibold text-emerald-600">
                Helpful Links
              </p>
              <ul className="mt-8 space-y-4 text-sm">
                {helpfulLinks.map(({ text, href, hasIndicator }) => (
                  <li key={text}>
                    <a
                      href={href}
                      className={`${
                        hasIndicator
                          ? "group flex justify-center gap-1.5 sm:justify-start"
                          : "text-foreground/70 hover:text-emerald-600 transition-colors"
                      }`}
                    >
                      <span className="text-foreground/70 group-hover:text-emerald-600 transition-colors">
                        {text}
                      </span>
                      {hasIndicator && (
                        <span className="relative flex size-2">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                          <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                        </span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center sm:text-left">
              <p className="text-lg font-semibold text-emerald-600">
                Contact Us
              </p>
              <ul className="mt-8 space-y-4 text-sm">
                {contactInfo.map(({ icon: Icon, text, isAddress }) => (
                  <li key={text}>
                    <a
                      className="flex items-center justify-center gap-1.5 hover:text-emerald-600 transition-colors sm:justify-start"
                      href="#"
                    >
                      <Icon className="size-5 shrink-0 text-emerald-600 shadow-sm" />
                      {isAddress ? (
                        <address className="text-foreground/70 -mt-0.5 flex-1 not-italic">
                          {text}
                        </address>
                      ) : (
                        <span className="text-foreground/70 flex-1">
                          {text}
                        </span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-emerald-500/20 pt-6">
          <div className="text-center sm:flex sm:justify-between sm:text-left">
            <p className="text-sm text-foreground/70">
              <span className="block sm:inline">All rights reserved.</span>
            </p>

            <p className="text-foreground/70 mt-4 text-sm sm:order-first sm:mt-0">
              &copy; 2025 {data.company.name}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
