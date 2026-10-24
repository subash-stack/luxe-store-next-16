import type { ComponentProps, ElementType } from "react";

import { cn } from "@/lib/cn";

const widthClass = {
  page: "page-container",
  content: "content-container",
  prose: "prose-container",
} as const;

type ContainerProps = ComponentProps<"div"> & {
  as?: ElementType;
  width?: keyof typeof widthClass;
};

/** Centered, gutter-padded wrapper. `page` for grids/chrome, `content` for PDP/checkout, `prose` for copy. */
export function Container({
  as: Tag = "div",
  width = "page",
  className,
  ...props
}: ContainerProps) {
  return <Tag className={cn(widthClass[width], className)} {...props} />;
}

type SectionProps = ComponentProps<"section"> & {
  as?: ElementType;
  inverse?: boolean;
};

/** Vertical section with fluid spacing; `inverse` flips to the dark palette. */
export function Section({
  as: Tag = "section",
  inverse,
  className,
  ...props
}: SectionProps) {
  return (
    <Tag
      className={cn("section", inverse && "theme-inverse", className)}
      {...props}
    />
  );
}
