'use client'
import Sidebar from "@/containers/panel/Sidebar";
import {ReactNode, Suspense} from "react";
import Loading from "@/app/(main)/panel/loading";
import PanelContentChild from "@/containers/panel/PanelContentChild";

const PanelLayout = ({children}: { children: ReactNode }) => {

    return (
        <div>
            <div className='flex gap-x-4 sm:gap-x-8 p-6 sm:container mt-6 relative'>
                <Sidebar/>
                <div className='shadow-[0px_10px_25px_-5px_rgba(0,0,0,0.3)] w-[85%] md:w-4/5 rounded-md'>
                    <PanelContentChild>
                        <Suspense fallback={<Loading/>}>
                            {children}
                        </Suspense>
                    </PanelContentChild>
                </div>
            </div>
        </div>
    )
}
export default PanelLayout
