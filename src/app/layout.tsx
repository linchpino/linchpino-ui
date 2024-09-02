import './globals.css';
import QueryProvider from '@/app/QueryProvider';
import 'react-toastify/dist/ReactToastify.css';
import {ToastContainer} from 'react-toastify';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {Suspense} from "react";
import Loading from "@/app/loading";

export default function RootLayout({
                                       children,
                                   }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" className="bg-white">
        <body className="bg-white">
        <QueryProvider>
            <ToastContainer/>
            <div className='min-h-screen flex flex-col justify-between'>
                <Header/>
                <Suspense fallback={<Loading/>}>
                    {children}
                </Suspense>
                <Footer/>
            </div>
        </QueryProvider>
        </body>
        </html>
    );
}
