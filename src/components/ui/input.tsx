import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "h-9 w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-1 text-sm text-white outline-none focus:border-orange-500",
        className
      )}
      {...props}
    />
  )
}

export { Input }
