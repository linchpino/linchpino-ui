import './globals.css';
import QueryProvider from '@/app/QueryProvider';
import 'react-toastify/dist/ReactToastify.css';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import React, {Suspense} from "react";
import Loading from "@/app/loading";
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function RootLayout({
                                       children,
                                   }: { children: React.ReactNode }) {

    return (
        <html lang="en" className="bg-white">
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
