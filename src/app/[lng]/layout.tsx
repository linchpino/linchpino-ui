import '../globals.css';
import QueryProvider from '@/app/QueryProvider';
import 'react-toastify/dist/ReactToastify.css';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import React, {ReactNode, Suspense} from "react";
import Loading from "@/loading";
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { languages } from './../i18n/setting'
import { dir } from 'i18next'

export async function generateStaticParams() {
    return languages.map((lng) => ({ lng }))
}
interface RootLayoutProps {
    children: ReactNode;
    params: {
        lng: string;
    };
}
const RootLayout: React.FC<RootLayoutProps> = ({ children, params: { lng } }) => {

    return (
        <html lang={lng} dir={dir(lng)} className="bg-white">
        <body className="bg-white">
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
        </body>
        </html>
    );
}
export default RootLayout
