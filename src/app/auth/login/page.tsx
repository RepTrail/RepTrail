'use client'

import { RegistryMain } from '@/components/store/advanced/registry-main'
import { RegistryProvider } from '@/components/store/advanced/registry-context'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { AuthLoginSection } from '@/components/store/sections/auth-login-section'
import Script from 'next/script'
import { Lock } from 'lucide-react'

export default function LoginPage() {
    return (
        <RegistryProvider>
            <Script id="meta-pixel-login" strategy="afterInteractive">
                {`
                    !function(f,b,e,v,n,t,s)
                    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                    n.queue=[];t=b.createElement(e);t.async=!0;
                    t.src=v;s=b.getElementsByTagName(e)[0];
                    s.parentNode.insertBefore(t,s)}(window, document,'script',
                    'https://connect.facebook.net/en_US/fbevents.js');
                    fbq('init', '795120573646319');
                    fbq('track', 'PageView');
                `}
            </Script>
            
            <RegistryMain
                title="RepTrail Login"
                subtitle="Acesso ao sistema RepTrail"
                icon={Lock}
                showHeader={false}
            >
                <RegistrySection
                    title="Acesso ao Sistema"
                    subtitle="Faça login com suas credenciais."
                    icon={Lock}
                >
                    <AuthLoginSection />
                </RegistrySection>
            </RegistryMain>

            <noscript>
                <span style={{ display: 'none' }}>
                    <img height="1" width="1" src="https://www.facebook.com/tr?id=795120573646319&ev=PageView&noscript=1" />
                </span>
            </noscript>
        </RegistryProvider>
    )
}
