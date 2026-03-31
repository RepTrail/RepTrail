"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { useEffect, Suspense } from "react";

declare global {
  interface Window {
    fbq: any;
    _fbq: any;
  }
}

export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;

// Função para disparar eventos de conversão (Padrão ou Customizado)
export const fbqEvent = (name: string, options = {}) => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", name, options);
  }
};

export const fbqCustomEvent = (name: string, options = {}) => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("trackCustom", name, options);
  }
};

function FacebookPixelInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Dispara 'PageView' em toda mudança de rota
    if (typeof window !== "undefined" && window.fbq && FB_PIXEL_ID) {
      window.fbq("track", "PageView");
    }
  }, [pathname, searchParams]);

  if (!FB_PIXEL_ID) return null;

  return (
    <>
      <Script
        id="fb-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${FB_PIXEL_ID}');
            fbq('track', 'PageView');
          `,
        }}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}

export default function FacebookPixel() {
  return (
    <Suspense fallback={null}>
      <FacebookPixelInner />
    </Suspense>
  );
}
