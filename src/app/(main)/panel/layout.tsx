'use client';
import {useState, useEffect} from 'react';
import {useRouter} from 'next/navigation';
import {ReactNode, Suspense} from "react";
import Loading from "@/app/(main)/panel/loading";
// @ts-ignore
import Cookies from 'js-cookie';
import dynamic from 'next/dynamic';

const Sidebar = dynamic(() => import('@/containers/panel/Sidebar'), {
    suspense: true
});
const PanelContentChild = dynamic(() => import('@/containers/panel/PanelContentChild'), {
    suspense: true
});

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
                <Suspense fallback={<Loading />}>
                    <Sidebar />
                </Suspense>
                <div className='shadow-[0px_10px_25px_-5px_rgba(0,0,0,0.3)] w-[85%] md:w-4/5 rounded-md'>
                    <Suspense fallback={<Loading />}>
                        <PanelContentChild>
                            {children}
                        </PanelContentChild>
                    </Suspense>
                </div>
            </div>
        </div>
    );
}

export default PanelLayout;
