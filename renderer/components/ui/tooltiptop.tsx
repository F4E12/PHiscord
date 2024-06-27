import * as React from "react";
import * as TooltipTopPrimitive from "@radix-ui/react-Tooltip";

import { cn } from "@/lib/utils";

const TooltipTopProvider = TooltipTopPrimitive.Provider;

const TooltipTop = (props) => (
  <TooltipTopPrimitive.Root delayDuration={0} {...props} />
);

const TooltipTopTrigger = TooltipTopPrimitive.Trigger;

const TooltipTopContent = React.forwardRef<
  React.ElementRef<typeof TooltipTopPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipTopPrimitive.Content>
>(({ className, side = "top", sideOffset = 4, ...props }, ref) => (
  <TooltipTopPrimitive.Content
    ref={ref}
    side={side}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
));
TooltipTopContent.displayName = TooltipTopPrimitive.Content.displayName;

export { TooltipTop, TooltipTopTrigger, TooltipTopContent, TooltipTopProvider };
