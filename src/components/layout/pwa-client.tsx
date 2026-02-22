'use client'

import dynamic from "next/dynamic";

const PWAInstallPrompt = dynamic(() => import("@/components/feature/pwa-install-prompt").then(mod => mod.PWAInstallPrompt), {
    ssr: false
});

export function PWAClient() {
    return <PWAInstallPrompt />;
}
