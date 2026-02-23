'use client'

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { registerServiceWorker } from "@/lib/notifications";

const PWAInstallPrompt = dynamic(() => import("@/components/feature/pwa-install-prompt").then(mod => mod.PWAInstallPrompt), {
    ssr: false
});

export function PWAClient() {
    useEffect(() => {
        registerServiceWorker();
    }, []);

    return <PWAInstallPrompt />;
}
