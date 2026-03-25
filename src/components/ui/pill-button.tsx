import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const pillButtonVariants = cva(
  "h-11 px-5 rounded-full text-[10px] font-black uppercase tracking-widest italic transition-all flex items-center justify-center gap-2 shadow-none border-2 cursor-pointer",
  {
    variants: {
      variant: {
        orange: "border-orange-500/20 bg-orange-500/10 text-orange-500 hover:bg-orange-500/30 hover:border-orange-500/50 hover:text-orange-400",
        emerald: "border-emerald-500/20 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/30 hover:border-emerald-500/50 hover:text-emerald-400",
      }
    },
    defaultVariants: {
      variant: "orange"
    }
  }
)

export interface PillButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof pillButtonVariants> {
  asChild?: boolean
}

const PillButton = React.forwardRef<HTMLButtonElement, PillButtonProps>(
  ({ className, variant, asChild = false, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant="outline" // Base variant to avoid conflict
        asChild={asChild}
        className={cn(pillButtonVariants({ variant, className }))}
        {...props}
      />
    )
  }
)
PillButton.displayName = "PillButton"

export { PillButton, pillButtonVariants }
