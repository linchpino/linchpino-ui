import '../../globals.css';
import QueryProvider from '@/QueryProvider';
import 'react-toastify/dist/ReactToastify.css';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import React, {Suspense} from "react";
import Loading from "@/loading";
import {ToastContainer} from 'react-toastify';
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';

export default async function LocaleLayout({
                                               children,
                                               params: {locale}
                                           }: Readonly<{
    children: React.ReactNode;
    params: { locale: string };
}>) {
    if (!routing.locales.includes(locale as any)) {
        notFound();
    }
    const messages = await getMessages();
    console.log(locale)
    return (
        <html dir={locale === 'fa' ? 'rtl' : 'ltr'} lang={locale} className="bg-white   ">
        <head>
            <link
                href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
                rel="stylesheet"
            />
            <link
                href="https://cdn.rawgit.com/rastikerdar/vazir-font/master/font-face.css"
                rel="stylesheet"
            />
            <title>لینچپینو - برای آینده</title>
        </head>
        <body className="bg-white font-Vazir">
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
