'use client'

import { RegistryMain } from '@/components/store/advanced/registry-main'
import { RegistryProvider } from '@/components/store/advanced/registry-context'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { AuthSignupSection } from '@/components/store/sections/auth-signup-section'
import Script from 'next/script'
import { UserPlus } from 'lucide-react'

export default function SignupPage() {
    return (
        <RegistryProvider>
            <Script id="meta-pixel-signup" strategy="afterInteractive">
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
                title="Criar Conta"
                subtitle="Crie sua conta no RepTrail"
                icon={UserPlus}
                showHeader={false}
            >
                <RegistrySection
                    title="Criar Conta"
                    subtitle="Crie sua conta no RepTrail."
                    icon={UserPlus}
                >
                    <AuthSignupSection />
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
