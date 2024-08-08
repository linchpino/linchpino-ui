import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import QueryProvider from "@/app/QueryProvider";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import React from "react";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "Linchpino System",
    description: "Powered by Linchpino",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <html lang="en" className="bg-white">
            <body className={`${inter.className} bg-white `}>
                <QueryProvider>
                    <ToastContainer/>
                    {children}
                </QueryProvider>
            </body>
        </html>
    );
}
