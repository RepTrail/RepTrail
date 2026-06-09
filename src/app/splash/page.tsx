'use client';

import { RegistryMain } from '@/components/store/advanced/registry-main'
import { SplashScreen } from "@/components/store/advanced/splash-screen"
import { MonitorPlay } from 'lucide-react'

export default function SplashPage() {
    return (
        <RegistryMain
            title="RepTrail"
            subtitle="Carregando..."
            icon={MonitorPlay}
            showHeader={false}
            noPadding
            hideFooter
        >
            <SplashScreen redirectHref="/" />
        </RegistryMain>
    );
}
