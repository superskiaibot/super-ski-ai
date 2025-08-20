"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch@1.1.3";

import { cn } from "./utils";

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        // Apple iOS exact dimensions: 51px x 31px
        "peer inline-flex h-[31px] w-[51px] shrink-0 items-center rounded-full border-0 transition-all duration-200 ease-in-out outline-none",
        "focus-visible:ring-4 focus-visible:ring-green-500/20 focus-visible:ring-offset-0",
        "disabled:cursor-not-allowed disabled:opacity-40",
        // Apple iOS colors - green when checked, light gray when unchecked
        "data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-300",
        "dark:data-[state=checked]:bg-green-500 dark:data-[state=unchecked]:bg-gray-600",
        // Subtle inner shadow like iOS
        "shadow-inner",
        "data-[state=checked]:shadow-green-600/20 data-[state=unchecked]:shadow-gray-400/20",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          // Apple iOS thumb: 27px diameter with proper positioning
          "pointer-events-none block h-[27px] w-[27px] rounded-full bg-white ring-0",
          "transition-all duration-200 ease-in-out",
          // Apple iOS positioning - 2px margin on each side
          "data-[state=checked]:translate-x-[22px] data-[state=unchecked]:translate-x-[2px]",
          // iOS-style drop shadow for depth
          "shadow-lg shadow-black/25",
          "data-[state=checked]:shadow-green-800/30 data-[state=unchecked]:shadow-gray-500/30",
          // Subtle press effect like iOS
          "active:scale-95",
          // Ensure white thumb in both light and dark modes
          "dark:bg-white",
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };