import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none transition-all active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-brand-primary text-zinc-950 font-bold hover:bg-brand-primary/90",
        destructive: "bg-destructive text-white hover:bg-destructive/90",
        outline: "border border-surface-800 bg-transparent shadow-xs hover:bg-surface-800 hover:text-white",
        secondary: "bg-surface-800 text-white hover:bg-surface-800/80",
        ghost: "hover:bg-surface-800 hover:text-white",
        link: "text-brand-primary underline-offset-4 hover:underline",
        premium: "bg-white text-zinc-950 hover:bg-zinc-200 font-bold italic uppercase tracking-widest",
        brand: "bg-brand-primary text-zinc-950 hover:bg-brand-primary/90 font-bold uppercase italic tracking-widest",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        xs: "h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        xl: "h-12 rounded-xl px-8 text-base",
        icon: "size-9",
        "icon-xs": "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
        landing: "h-auto min-h-[4rem] py-4 px-8 text-base md:text-xl rounded-2xl italic uppercase tracking-wide",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
