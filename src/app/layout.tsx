import './globals.css';
import QueryProvider from '@/app/QueryProvider';
import 'react-toastify/dist/ReactToastify.css';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import React, {Suspense} from "react";
import Loading from "@/app/loading";
import {ToastContainer} from 'react-toastify';
import {NextIntlClientProvider} from 'next-intl';
import {getMessages, getLocale} from 'next-intl/server';

export default async function LocaleLayout({
                                               children,
                                           }: Readonly<{
    children: React.ReactNode;
}>) {
    // const locale = await getLocale();
    const locale = process.env.NEXT_PUBLIC_LANGUAGE
    const messages = await getMessages();
    const direction = locale === 'en' ? 'ltr' : 'rtl';

    return (
        <html dir={direction} lang={locale} className="bg-white">
        <head>
            <title>لینچپینو - برای آینده</title>
        </head>
        <body className="bg-white font-vazir">
        <NextIntlClientProvider messages={messages}>
            <QueryProvider>
                <div className="min-h-screen flex flex-col justify-between">
                    <Header/>
                    <Suspense fallback={<Loading/>}>
                        {children}
                        <ToastContainer/>
                    </Suspense>
                    <Footer/>

                </div>
            </QueryProvider>
        </NextIntlClientProvider>
        </body>
        </html>
    );
}
