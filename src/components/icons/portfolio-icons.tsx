import type { SVGProps } from "react";

type PortfolioIconProps = SVGProps<SVGSVGElement>;

export function GitHubLogo({
  "aria-hidden": ariaHidden = true,
  focusable = "false",
  ...props
}: PortfolioIconProps) {
  return (
    <svg
      aria-hidden={ariaHidden}
      fill="currentColor"
      focusable={focusable}
      viewBox="0 0 16 16"
      {...props}
    >
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82A7.5 7.5 0 0 1 8 3.86c.68 0 1.36.09 2 .27 1.53-1.03 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  );
}

export function LinkedInLogo({
  "aria-hidden": ariaHidden = true,
  focusable = "false",
  ...props
}: PortfolioIconProps) {
  return (
    <svg
      aria-hidden={ariaHidden}
      fill="currentColor"
      focusable={focusable}
      viewBox="0 0 24 24"
      {...props}
    >
      <path d="M6.94 20.45H3.38V9h3.56v11.45ZM5.16 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12Zm15.29 13.02H16.9v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.26 2.37 4.26 5.46v6.28Z" />
    </svg>
  );
}

export function MailIcon({
  "aria-hidden": ariaHidden = true,
  focusable = "false",
  ...props
}: PortfolioIconProps) {
  return (
    <svg
      aria-hidden={ariaHidden}
      fill="none"
      focusable={focusable}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
      {...props}
    >
      <rect height="14" rx="2" width="18" x="3" y="5" />
      <path d="m4.5 7 7.5 6 7.5-6" />
    </svg>
  );
}

export function ExternalLinkIcon({
  "aria-hidden": ariaHidden = true,
  focusable = "false",
  ...props
}: PortfolioIconProps) {
  return (
    <svg
      aria-hidden={ariaHidden}
      fill="none"
      focusable={focusable}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
      {...props}
    >
      <path d="M14 4h6v6" />
      <path d="m20 4-9 9" />
      <path d="M20 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h4" />
    </svg>
  );
}

export function CertificateIcon({
  "aria-hidden": ariaHidden = true,
  focusable = "false",
  ...props
}: PortfolioIconProps) {
  return (
    <svg
      aria-hidden={ariaHidden}
      fill="none"
      focusable={focusable}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
      {...props}
    >
      <path d="M6 3.75h8.25L18 7.5v12.75H6V3.75Z" />
      <path d="M14.25 3.75V7.5H18" />
      <path d="M9 9.75h4.5" />
      <path d="M9 12.25h3" />
      <circle cx="12" cy="15.25" r="1.75" />
      <path d="m10.8 16.55-.55 2 1.75-.8 1.75.8-.55-2" />
    </svg>
  );
}

export function ArrowUpIcon({
  "aria-hidden": ariaHidden = true,
  focusable = "false",
  ...props
}: PortfolioIconProps) {
  return (
    <svg
      aria-hidden={ariaHidden}
      fill="none"
      focusable={focusable}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
      {...props}
    >
      <path d="M12 20V5" />
      <path d="m6.5 10.5 5.5-5.5 5.5 5.5" />
    </svg>
  );
}

export function CopyrightIcon({
  "aria-hidden": ariaHidden = true,
  focusable = "false",
  ...props
}: PortfolioIconProps) {
  return (
    <svg
      aria-hidden={ariaHidden}
      fill="none"
      focusable={focusable}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
      {...props}
    >
      <circle cx="12" cy="12" r="8" />
      <path d="M14.75 9.75A3.4 3.4 0 0 0 12 8.5a3.5 3.5 0 0 0 0 7 3.4 3.4 0 0 0 2.75-1.25" />
    </svg>
  );
}
