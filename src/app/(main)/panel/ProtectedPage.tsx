import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Cookies from 'js-cookie';
import CrudSkeleton from '@/components/skeletonLoading/CrudSkeleon';
import ProfileSkeleton from '@/components/skeletonLoading/ProfileSkeleton';
import InterviewsSkeleton from '@/components/skeletonLoading/InterviewsSkeleton';
import PasswordChangeSkeleton from '@/components/skeletonLoading/PasswordChangeSkeleton';

interface PrivatePageProps {
    children: React.ReactNode;
}

const roleBasedAccess = {
    '/panel/profile': ['ADMIN', 'JOB_SEEKER', 'MENTOR'],
    '/panel/interviews': ['JOB_SEEKER', 'MENTOR'],
    '/panel/users': ['ADMIN'],
    '/panel/job-position': ['ADMIN'],
    '/panel/interview-type': ['ADMIN'],
    '/panel/change-password': ['ADMIN', 'JOB_SEEKER', 'MENTOR'],
};

const PrivatePage: React.FC<PrivatePageProps> = ({ children }) => {
    const router = useRouter();
    const pathname = usePathname();

    const [loading, setLoading] = useState(true);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);

        const token = Cookies.get('token');
        const expiresAt = Cookies.get('expiresAt');
        const userInfoFromCookie = Cookies.get('userInfo');
        const userInfo = userInfoFromCookie ? JSON.parse(userInfoFromCookie) : null;
        const expiresAtDate = expiresAt ? new Date(expiresAt) : null;
        // @ts-ignore
        console.log(new Date().getTime() >= expiresAtDate.getTime())
        console.log(token)
        console.log(userInfo)
        const checkAccess = () => {
            if (!token || !expiresAt || !expiresAtDate || new Date().getTime() >= expiresAtDate.getTime()) {
                Cookies.remove('token');
                Cookies.remove('expiresAt');
                Cookies.remove('userInfo');
                router.push('/');
                return;
            }

            if (!userInfo) {
                router.push('/');
                return;
            }

            // @ts-ignore
            const allowedRoles = roleBasedAccess[pathname] || [];
            if (!allowedRoles.some((role: string) => userInfo.type.includes(role))) {
                router.push('/not-found');
                return;
            }

            setLoading(false);
        };

        if (isMounted) {
            checkAccess();
        }
    }, [router, pathname, isMounted]);

    if (!isMounted) return null;

    if (loading) {
        switch (pathname) {
            case '/panel/profile':
                return <ProfileSkeleton />;
            case '/panel/interviews':
                return <InterviewsSkeleton />;
            case '/panel/change-password':
                return <PasswordChangeSkeleton />;
            default:
                return <CrudSkeleton />;
        }
    }

    return <>{children}</>;
};

export default PrivatePage;
