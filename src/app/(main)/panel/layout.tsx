'use client'
import Sidebar from "@/containers/panel/Sidebar";
import {ReactNode} from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PanelLayout = ({ children }: { children: ReactNode }) => {

    return(
        <div>
            <Header />
            <div className='flex gap-x-4 sm:gap-x-8 p-6 sm:container mt-6 relative'>
                <Sidebar />
                <div className='shadow-[0px_10px_25px_-5px_rgba(0,0,0,0.3)] w-[85%] md:w-4/5 rounded-md'>
                    {children}
                </div>
            </div>
            <Footer />
        </div>
    )
}
export default PanelLayout
