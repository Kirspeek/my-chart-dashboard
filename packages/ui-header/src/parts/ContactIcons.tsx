import React from "react";
import type { HeaderLink } from "../types";
import { Github, Linkedin, Mail, Send, Link as LinkIcon } from "lucide-react";

export type ContactIconsProps = {
  contactEmail?: string;
  contactLinks?: HeaderLink[];
  aboutLink?: HeaderLink;
  showAboutLink: boolean;
  color: string;
  size: number;
  stroke: number;
  gapClass?: string;
};

export default function ContactIcons({
  contactEmail,
  contactLinks = [],
  aboutLink,
  showAboutLink,
  color,
  size,
  stroke,
  gapClass = "gap-4",
}: ContactIconsProps) {
  return (
    <div className={`flex items-center ${gapClass}`}>
      {contactEmail && (
        <a
          href={`mailto:${contactEmail}`}
          title={contactEmail}
          aria-label={`Email ${contactEmail}`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Mail size={size} color={color} strokeWidth={stroke} />
        </a>
      )}
      {contactLinks
        ?.filter((l) => /github|linkedin|instagram|telegram/i.test(l.label))
        .map((l) => {
          const isGithub = /github/i.test(l.label);
          const isInstagram = /instagram/i.test(l.label);
          const isLinkedIn = /linkedin/i.test(l.label);
          const isTelegram = /telegram/i.test(l.label);
          return (
            <a
              key={l.label}
              href={l.href}
              target={l.target}
              rel={l.rel}
              title={l.label}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {isGithub ? (
                <Github size={size} color={color} strokeWidth={stroke} />
              ) : isLinkedIn ? (
                <Linkedin size={size} color={color} strokeWidth={stroke} />
              ) : isTelegram ? (
                <Send size={size} color={color} strokeWidth={stroke} />
              ) : isInstagram ? (
                <LinkIcon size={size} color={color} strokeWidth={stroke} />
              ) : null}
            </a>
          );
        })}
      {showAboutLink && (
        <a
          href={aboutLink?.href}
          target={aboutLink?.target}
          rel={aboutLink?.rel}
          title={aboutLink?.label ?? "About me"}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <LinkIcon size={size} color={color} strokeWidth={stroke} />
        </a>
      )}
    </div>
  );
}
