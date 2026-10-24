import Link from "next/link";
import type { ComponentProps } from "react";

import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "accent" | "ghost";
type Size = "md" | "sm" | "icon";

type StyleProps = {
  variant?: Variant;
  size?: Size;
  block?: boolean;
};

const variantClass: Record<Variant, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  accent: "btn-accent",
  ghost: "btn-ghost",
};

const sizeClass: Record<Size, string> = {
  md: "",
  sm: "btn-sm",
  icon: "btn-icon",
};

export function buttonClass({
  variant = "primary",
  size = "md",
  block = false,
}: StyleProps = {}) {
  return cn("btn", variantClass[variant], sizeClass[size], block && "btn-block");
}

type ButtonProps = ComponentProps<"button"> & StyleProps;

export function Button({
  variant,
  size,
  block,
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(buttonClass({ variant, size, block }), className)}
      {...props}
    />
  );
}

type ButtonLinkProps = ComponentProps<typeof Link> & StyleProps;

/** A link styled as a button, for navigation CTAs ("Shop now"). */
export function ButtonLink({
  variant,
  size,
  block,
  className,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={cn(buttonClass({ variant, size, block }), className)}
      {...props}
    />
  );
}
