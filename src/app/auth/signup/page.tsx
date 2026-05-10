'use client'

import { AuthForm } from '@/components/store/advanced/auth-form'
import { Suspense } from 'react'
import { AuthFormSkeleton } from '@/components/store/advanced/auth-form-skeleton'
import { RegistryProvider } from '@/components/store/advanced/registry-context'
import { AuthShell } from '@/components/store/advanced/auth-shell'
import { Box } from '@/components/store/base/box'
import Script from 'next/script'

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

            <AuthShell>
                <Suspense fallback={<AuthFormSkeleton />}>
                    <AuthForm view="signup" />
                </Suspense>
            </AuthShell>

            <noscript>
                <Box as="span" display="none">
                    <img height="1" width="1" src="https://www.facebook.com/tr?id=795120573646319&ev=PageView&noscript=1" />
                </Box>
            </noscript>
        </RegistryProvider>
    )
}
