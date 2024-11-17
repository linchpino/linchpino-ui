'use client';

import React, {Suspense} from 'react';
import {ToastContainer} from 'react-toastify';
import {NextIntlClientProvider} from 'next-intl';
import dynamic from 'next/dynamic';
import Loading from "@/app/loading";
import QueryProvider from '@/app/QueryProvider';
import {useRouter, ContainerLink, ContainerLinkProps, ProgressLoader} from 'nextjs-progressloader';

const links: ContainerLinkProps["links"] = [
    {
        href: "/",
        nickname: "home",
    },
    {
        href: "/signin",
        nickname: "signin"
    },
    {
        href: "/signup",
        nickname: "signup"
    },
    {
        href: "/be-mentor",
        nickname: "beMentor"
    },
    {
        href: "/schedule-interview",
        nickname: "scheduleInterview"
    },
    {
        href: "/panel/profile",
        nickname: "panelProfile"
    },
    {
        href: "/panel/interviews",
        nickname: "panelInterviews"
    },
    {
        href: "/panel/change-password",
        nickname: "panelChangePassword"
    },
    {
        href: "/panel/reset-password",
        nickname: "panelResetPassword"
    },
    {
        href: "/panel/users",
        nickname: "panelUsers"
    },
    {
        href: "/panel/interview-type",
        nickname: "panelInterviewType"
    },
    {
        href: "/panel/job-position",
        nickname: "panelJobPosition"
    },

];

const Header = dynamic(() => import('@/components/Header'), {
    suspense: true
});
const Footer = dynamic(() => import('@/components/Footer'), {
    suspense: true
});

interface LocaleClientLayoutProps {
    children: React.ReactNode;
    messages: any;
    direction: string;
    locale: string;
}

export default function LocaleClientLayout({
                                               children,
                                               messages,
                                               direction,
                                               locale,
                                           }: LocaleClientLayoutProps) {
    return (
        <html dir={direction} lang={locale} className="bg-white">
        <head>
            <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
                  rel="stylesheet"/>
            <link href="https://cdn.rawgit.com/rastikerdar/vazir-font/master/font-face.css" rel="stylesheet"/>
            <title>Linchpino</title>
        </head>
        <body className="bg-white font-vazir">

        <NextIntlClientProvider messages={messages} locale={locale}>
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
                    <ProgressLoader showSpinner={false} color="#F9A826" height={6}/>
                    <ContainerLink links={links} />
                    <ToastContainer/>
                </div>
            </QueryProvider>
        </NextIntlClientProvider>
        </body>
        </html>
    );
}
