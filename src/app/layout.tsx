import './globals.css';
import QueryProvider from '@/app/QueryProvider';
import 'react-toastify/dist/ReactToastify.css';
import React, {Suspense} from "react";
import Loading from "@/app/loading";
import {ToastContainer} from 'react-toastify';
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import dynamic from 'next/dynamic';

const Header = dynamic(() => import('@/components/Header'), {
    suspense: true
});
const Footer = dynamic(() => import('@/components/Footer'), {
    suspense: true
});


export default async function LocaleLayout({
                                               children,
                                           }: Readonly<{
    children: React.ReactNode;
}>) {
    const locale = process.env.NEXT_PUBLIC_LANGUAGE
    const messages = await getMessages();
    const direction = locale === 'en' ? 'ltr' : 'rtl';

    return (
        <html dir={direction} lang={locale} className="bg-white">
        <head>
            <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
                  rel="stylesheet"/>
            <link href="https://cdn.rawgit.com/rastikerdar/vazir-font/master/font-face.css" rel="stylesheet"/>

            <title>Linchpino</title>
        </head>
        <body className="bg-white font-vazir">
        <NextIntlClientProvider messages={messages}>
            <QueryProvider>
                <div className="min-h-screen flex flex-col justify-between">
                <Suspense fallback={<Loading/>}>
                        <Header/>
                    </Suspense>
                    <Suspense fallback={<Loading/>}>
                        {children}
                    </Suspense>

                    <Suspense fallback={<Loading/>}>
                        <Footer/>
                    </Suspense>
                    <ToastContainer/>
                </div>
            </QueryProvider>
        </NextIntlClientProvider>
        </body>
        </html>
    );
}
