'use client'
import {useRouter} from 'next/navigation';
import React, {useEffect} from 'react';
import useStore from "@/store/store";

interface PrivatePageProps {
    children: React.ReactNode;
}

export default function PrivatePage({children}: PrivatePageProps) {
    const {userInfo} = useStore(state => state);
    const router = useRouter();
    console.log('1', userInfo);

    useEffect(() => {
        console.log('2', userInfo);

        const checkAccess = () => {
            if (!userInfo) {
                // router.push('/signin');
                return;
            }
            const allowedRoles = ['ADMIN', 'JOB_SEEKER', 'MENTOR'];
            // @ts-ignore
            if (!userInfo?.type?.some(role => allowedRoles.includes(role))) {
                console.log('Access denied');
                // router.push('/404');
                return;
            }
        };

        checkAccess();
    }, [userInfo, router]);

    return (
        <>{children}</>
    );
}
