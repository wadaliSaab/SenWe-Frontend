import React from "react";
import { twMerge } from "tailwind-merge";

function AppText({
  as: Component = "p",
  variant = "body",
  children,
  className = "",
  active,
}) {
  const variants = {
    title: "text-xl md:text-xl font-semibold tracking-tight text-premium",
    
    heading: "sm:text-2xl text-xl font-semibold tracking-tight text-accent-light",
    subheading: "text-md font-semibold tracking-tight   text-premium",

    subtitle: "text-sm font-semibold text-text-primary",

    body: "text-sm leading-6 text-text-primary",

    label: "text-sm font-medium text-text-primary",

    label2: "sm:text-xs text-2xs font-medium text-text-secondary",

    caption: `${active ? "text-accent" : "text-text-secondary"} text-xs font-medium`,

    meta: "text-2xs text-text-tertiary",
    meta2: "text-3xs font-semibold text-text-tertiary",

    chat: "text-sm text-text-primary",

    small: "text-xs text-accent",
  };

  return (
    <Component className={twMerge(variants[variant], className)}>
      {children}
    </Component>
  );
}

export default AppText;
