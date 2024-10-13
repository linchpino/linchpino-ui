'use client';
import {useState, useEffect} from 'react';
import {useRouter} from 'next/navigation';
import Sidebar from "@/containers/panel/Sidebar";
import {ReactNode, Suspense} from "react";
import Loading from "@/app/[lng]/panel/loading";
import PanelContentChild from "@/containers/panel/PanelContentChild";
import Cookies from 'js-cookie';

const PanelLayout = ({children}: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const router = useRouter();

    useEffect(() => {
        const token = Cookies.get('token');
        const expiresAt = Cookies.get('expiresAt');
        const expiresAtDate = expiresAt ? new Date(expiresAt) : null;
        const currentDate = new Date();

        if (!token || (expiresAtDate && expiresAtDate < currentDate)) {
            router.push('/');
            return;
        }
        setIsAuthenticated(true);
    }, [router]);

    if (isAuthenticated === null) {
        return <div/>;
    }

    if (!isAuthenticated) {
        return null;
    }

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
    );
}

export default PanelLayout;
