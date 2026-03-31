"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { useEffect, Suspense } from "react";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: (...args: unknown[]) => void;
  }
}

export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID?.trim();
const META_PIXEL_DISABLED = process.env.NEXT_PUBLIC_DISABLE_META_PIXEL === "true";
const META_PIXEL_ENABLED = Boolean(FB_PIXEL_ID) && !META_PIXEL_DISABLED;

// Função para disparar eventos de conversão (Padrão ou Customizado)
export const fbqEvent = (name: string, options = {}) => {
  if (typeof window !== "undefined" && window.fbq && META_PIXEL_ENABLED) {
    window.fbq("track", name, options);
  }
};

export const fbqCustomEvent = (name: string, options = {}) => {
  if (typeof window !== "undefined" && window.fbq && META_PIXEL_ENABLED) {
    window.fbq("trackCustom", name, options);
  }
};

function FacebookPixelInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Dispara PageView em mudanças de rota sem duplicar no bootstrap.
    if (typeof window !== "undefined" && window.fbq && META_PIXEL_ENABLED) {
      const query = searchParams.toString();
      const pagePath = query ? `${pathname}?${query}` : pathname;
      window.fbq("track", "PageView", { page_path: pagePath });
    }
  }, [pathname, searchParams]);

  if (!META_PIXEL_ENABLED) return null;

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
