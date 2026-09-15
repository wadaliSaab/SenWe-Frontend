import React from "react";
import { LoaderCircle } from "lucide-react";
import { twMerge } from "tailwind-merge";

function AppButton({
  children,
  active = false,
  type = "button",
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  disabled = false,
  onClick,

  className = "",
   activeClassName = "",
  
}) {
  const sizes = {
    xs: "h-6 px-3 text-sm",
    sm: "h-9 px-4 text-sm",
    md: "h-10 px-5 text-md",
    lg: "h-15 px-6 text-base",
  };

  const variants = {
    primary:
      "bg-accent-light text-background rounded-xl font-semibold shadow-sm hover:opacity-90 focus:ring-2 focus:ring-accent-light/40",
    primary2:
      "bg-accent text-text-secondary hover:text-text-primary rounded-md font-semibold shadow-sm hover:bg-accent/80 focus:ring-2 focus:ring-accent/40",

    secondary: `
      flex   shadow-text-secondary/10 
      text-xs font-semibold  
      ${
        active
          ? "bg-accent border-accent text-premium hover:bg-accent/80"
          : "  text-text-secondary  hover:text-text-secondary hover:bg-background-secondary "
      }
    `,

    chip: `
      flex  rounded-lg border  hover:scale-105 shadow shadow-xs shadow-text-secondary/10 
      text-xs font-semibold
      ${
        active
          ? "bg-accent border-accent text-premium hover:bg-accent/80"
          : "bg-background border-shadow/60 text-text-secondary hover:border-accent hover:text-text-secondary hover:bg-background-hover "
      }
    `,

    ghost: "bg-transparent text-text-secondary hover:text-text-primary ",

    link: "bg-transparent text-accent-light hover:underline p-0 h-auto focus:ring-0",

    icon: "bg-transparent text-text-secondary rounded-full hover:text-text-primary",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
        
      className={twMerge(
        "flex items-center justify-center gap-2 transition-all duration-200 focus:outline-none ",

        variants[variant],

        sizes[size],

        fullWidth && "w-full",

        disabled || loading
          ? "opacity-60 cursor-not-allowed"
          : "cursor-pointer",

        className,
        active && activeClassName, 
      )}
    >
      {loading ? <LoaderCircle size={18} className="animate-spin" /> : children}
    </button>
  );
}

export default AppButton;
