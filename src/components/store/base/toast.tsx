'use client'

import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

// Design System Imports
import { STORE_TOKENS } from "@/components/store/constants/tokens"
import { Surface } from "@/components/store/base/surface"
import { Stack } from "@/components/store/base/stack"
import { Font } from "@/components/store/base/font"
import { Box } from "@/components/store/base/box"
import { Icon } from "@/components/store/base/icon"

const ToastProvider = ToastPrimitives.Provider

const ToastViewport = React.forwardRef<
    React.ElementRef<typeof ToastPrimitives.Viewport>,
    React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
    <ToastPrimitives.Viewport
        ref={ref}
        style={{
            position: 'fixed',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 100001,
            display: 'flex',
            flexDirection: 'column-reverse',
            padding: '1.25rem',
            width: '100%',
            maxHeight: '100vh'
        }}
        {...props}
    />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const toastVariants = cva(
    "group pointer-events-auto relative flex w-full items-center justify-between overflow-hidden shadow-2xl transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
    {
        variants: {
            variant: {
                default: "",
                destructive: "",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

const Toast = React.forwardRef<
    React.ElementRef<typeof ToastPrimitives.Root>,
    React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
    return (
        <ToastPrimitives.Root
            ref={ref}
            className={cn(toastVariants({ variant }))}
            asChild
            {...props}
        >
            <Surface 
                variant={variant === 'destructive' ? 'tonal-red' : 'tonal-zinc'} 
                padding={STORE_TOKENS.PADDING.NONE} 
                rounded={STORE_TOKENS.RADIUS.SYSTEM}
            >
                <Stack direction="row" align="center" justify="between" padding={STORE_TOKENS.PADDING.CONTAINER} flex1 position="relative">
                    <Box style={{ paddingRight: '2rem' }} flex1>
                        {props.children}
                    </Box>
                </Stack>
            </Surface>
        </ToastPrimitives.Root>
    );
})
Toast.displayName = ToastPrimitives.Root.displayName

const ToastAction = React.forwardRef<
    React.ElementRef<typeof ToastPrimitives.Action>,
    React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
    <ToastPrimitives.Action
        ref={ref}
        asChild
        {...props}
    >
        <Box 
            as="button"
            bg={STORE_TOKENS.COLORS.WHITE} 
            bgOpacity={STORE_TOKENS.OPACITY.LOW} 
            border 
            borderColor={STORE_TOKENS.COLORS.DIVIDER.STANDARD} 
            rounded={STORE_TOKENS.RADIUS.SYSTEM} 
            height="8" 
            display="flex" 
            align="center" 
            justify="center"
            padding={STORE_TOKENS.PADDING.ELEMENT}
            shrink={0}
        >
            <Font variant="auxiliary" weight="bold" color={STORE_TOKENS.COLORS.WHITE} uppercase italic tracking="widest">
                {props.children}
            </Font>
        </Box>
    </ToastPrimitives.Action>
))
ToastAction.displayName = ToastPrimitives.Action.displayName

const ToastClose = React.forwardRef<
    React.ElementRef<typeof ToastPrimitives.Close>,
    React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
    <ToastPrimitives.Close
        ref={ref}
        style={{
            position: 'absolute',
            right: '0.5rem',
            top: '0.5rem',
            padding: '0.25rem'
        }}
        {...props}
    >
        <Icon icon={X} size="xs" />
    </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastTitle = React.forwardRef<
    React.ElementRef<typeof ToastPrimitives.Title>,
    React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
    <ToastPrimitives.Title
        ref={ref}
        asChild
        {...props}
    >
        <Font variant="body-sm" weight="black" uppercase italic tracking="tight">
            {props.children}
        </Font>
    </ToastPrimitives.Title>
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef<
    React.ElementRef<typeof ToastPrimitives.Description>,
    React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
    <ToastPrimitives.Description
        ref={ref}
        asChild
        {...props}
    >
        <Font variant="tiny" opacity={STORE_TOKENS.OPACITY.OVERLAY} weight="bold" display="block">
            {props.children}
        </Font>
    </ToastPrimitives.Description>
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>
type ToastActionElement = React.ReactElement<typeof ToastAction>

export {
    type ToastProps,
    type ToastActionElement,
    ToastProvider,
    ToastViewport,
    Toast,
    ToastTitle,
    ToastDescription,
    ToastClose,
    ToastAction,
}
