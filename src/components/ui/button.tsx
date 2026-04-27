import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-normal rounded-md text-sm font-black uppercase tracking-widest transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 italic leading-tight py-2 text-center cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-brand-primary text-zinc-950 hover:bg-brand-primary/90",
        destructive: "bg-destructive text-white hover:bg-destructive/90",
        outline: "border border-zinc-800 bg-zinc-950/50 text-zinc-400 hover:bg-zinc-900 hover:text-white hover:border-zinc-700",
        secondary: "bg-brand-secondary text-zinc-950 hover:bg-brand-secondary/90",
        accent: "bg-brand-accent text-zinc-950 hover:bg-brand-accent/90",
        ghost: "hover:bg-zinc-900 hover:text-zinc-100",
        link: "text-brand-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-6 py-2",
        xs: "h-7 gap-1 rounded-lg px-3 text-[10px]",
        sm: "h-9 rounded-lg gap-1.5 ",
        lg: "h-12 rounded-xl px-8 text-base",
        hero: "h-auto min-h-[4rem] px-8 py-4 text-base md:text-xl rounded-2xl",
        icon: "size-11",
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
  const Comp = asChild ? Slot : "button"

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
