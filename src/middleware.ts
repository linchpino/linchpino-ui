import { NextResponse } from 'next/server'
import acceptLanguage from 'accept-language'
import { fallbackLng, languages, cookieName } from './app/i18n/setting'

acceptLanguage.languages(languages)

export const config = {
    // matcher: '/:lng*'
    matcher: ['/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|site.webmanifest).*)']
}

export function middleware(req: { cookies: { has: (arg0: any) => any; get: (arg0: any) => { (): any; new(): any; value: string | null | undefined } }; headers: { get: (arg0: string) => string | URL | null | undefined; has: (arg0: string) => any }; nextUrl: { pathname: string }; url: string | URL | undefined }) {
    let lng
    if (req.cookies.has(cookieName)) lng = acceptLanguage.get(req.cookies.get(cookieName).value)
    if (!lng) { // @ts-ignore
        lng = acceptLanguage.get(req.headers.get('Accept-Language'))
    }
    if (!lng) lng = fallbackLng

    if (
        !languages.some((loc: any) => req.nextUrl.pathname.startsWith(`/${loc}`)) &&
        !req.nextUrl.pathname.startsWith('/_next')
    ) {
        return NextResponse.redirect(new URL(`/${lng}${req.nextUrl.pathname}`, req.url))
    }

    if (req.headers.has('referer')) {
        // @ts-ignore
        const refererUrl = new URL(req.headers.get('referer'))
        const lngInReferer = languages.find((l: any) => refererUrl.pathname.startsWith(`/${l}`))
        const response = NextResponse.next()
        if (lngInReferer) response.cookies.set(cookieName, lngInReferer)
        return response
    }

    return NextResponse.next()
}
