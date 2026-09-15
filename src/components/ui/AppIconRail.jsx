import React from "react";
import { twMerge } from "tailwind-merge";
import AppButton from "./AppButton";
import AppText from "./AppText";

function AppIconRail({
  actions,
  onActionClick,
  className = "",
  tooltipPosition = "right",
}) {
  const isLeft = tooltipPosition === "left";

  
  const DEFAULT_ACTIVE_CLASS = "scale-110 text-premium";
  const DEFAULT_INACTIVE_CLASS =
    "text-text-tertiary hover:scale-110 hover:text-text-primary";

  return (
    <div
      className={twMerge(
        "flex min-h-60  flex-col items-center bg-background/30 py-2",
        className
      )}
    >
      {actions.map((action) => {
        if (action.render) {
          return <div key={action.id}>{action.render()}</div>;
        }

        if (!action.icon) {
          throw new Error(
            `AppIconRail: Action "${action.id}" must provide either an icon or render function.`
          );
        }

        const Icon = action.icon;
        const isActive = action.active ?? false;

        
        const iconClassName = twMerge(
          "h-5 w-5  transition-all duration-200",
          isActive
            ? action.activeClassName ?? DEFAULT_ACTIVE_CLASS
            : action.inactiveClassName ?? DEFAULT_INACTIVE_CLASS
        );

        
        const iconFill = action.filled
          ? isActive
            ? "currentColor"
            : "none"
          : undefined;

       
        const iconStrokeWidth = action.strokeWidth ?? undefined;

        return (
          <div key={action.id} className="group relative flex items-center">
            <AppButton
              type="button"
              variant="icon"
              size="sm"
              disabled={action.disabled}
              aria-label={action.label ?? action.id}
              className={action.buttonClassName}
              onClick={() => {
                if (action.disabled) return;
                if (action.onClick) {
                  action.onClick();
                } else {
                  onActionClick?.(action.id);
                }
              }}
            >
              <Icon
                className={iconClassName}
                fill={iconFill}
                strokeWidth={iconStrokeWidth}
              />
            </AppButton>

            {action.label && (
              <div
                className={twMerge(
                  "pointer-events-none absolute top-1/2 z-10 -translate-y-1/2 whitespace-nowrap rounded-md border border-text-secondary/30 bg-background px-2 py-1 opacity-0 shadow-sm transition-all duration-150",
                  isLeft
                    ? "right-full mr-2 group-hover:-translate-x-0.5 group-hover:opacity-100"
                    : "left-full ml-2 group-hover:translate-x-0.5 group-hover:opacity-100"
                )}
              >
                <AppText variant="label2">{action.label}</AppText>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default AppIconRail;