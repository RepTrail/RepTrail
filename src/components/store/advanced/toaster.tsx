"use client";
import { STORE_TOKENS } from '@/components/store/constants/tokens';

import {
    Toast,
    ToastClose,
    ToastDescription,
    ToastProvider,
    ToastTitle,
    ToastViewport,
} from "@/components/store/base/toast"
import { useToast } from "@/components/store/hooks/use-toast"
import { Stack } from "@/components/store/base/stack"

export function Toaster() {
    const { toasts } = useToast()

    return (
        <ToastProvider>
            {toasts.map(function ({ id, title, description, action, ...props }: any) {
                return (
                    <Toast key={id} {...props}>
                        <Stack gap={STORE_TOKENS.SPACING.ELEMENT} flex1>
                            {title && <ToastTitle>{title}</ToastTitle>}
                            {description && (
                                <ToastDescription>{description}</ToastDescription>
                            )}
                        </Stack>
                        {action}
                        <ToastClose />
                    </Toast>
                );
            })}
            <ToastViewport />
        </ToastProvider>
    );
}
