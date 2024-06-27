import * as React from "react";
import * as TooltipServerPrimitive from "@radix-ui/react-Tooltip";

import { cn } from "@/lib/utils";

const TooltipServerProvider = TooltipServerPrimitive.Provider;

const TooltipServer = (props) => (
  <TooltipServerPrimitive.Root delayDuration={0} {...props} />
);

const TooltipServerTrigger = TooltipServerPrimitive.Trigger;

const TooltipServerContent = React.forwardRef<
  React.ElementRef<typeof TooltipServerPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipServerPrimitive.Content>
>(({ className, side = "right", sideOffset = 4, ...props }, ref) => (
  <TooltipServerPrimitive.Content
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
TooltipServerContent.displayName = TooltipServerPrimitive.Content.displayName;

export {
  TooltipServer,
  TooltipServerTrigger,
  TooltipServerContent,
  TooltipServerProvider,
};
