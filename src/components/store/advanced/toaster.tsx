"use client"

import {
    Toast,
    ToastClose,
    ToastDescription,
    ToastProvider,
    ToastTitle,
    ToastViewport,
} from "@/components/store/base/toast"
import { useToast } from "@/hooks/use-toast"
import { Stack } from "@/components/store/base/stack"
import { STORE_TOKENS } from "@/components/store/constants/tokens"

export function Toaster() {
    const { toasts } = useToast()

    return (
        <ToastProvider>
            {toasts.map(function ({ id, title, description, action, ...props }: any) {
                return (
                    <Toast key={id} {...props}>
                        <Stack gap={2.5} flex1>
                            {title && <ToastTitle>{title}</ToastTitle>}
                            {description && (
                                <ToastDescription>{description}</ToastDescription>
                            )}
                        </Stack>
                        {action}
                        <ToastClose />
                    </Toast>
                )
            })}
            <ToastViewport />
        </ToastProvider>
    )
}
