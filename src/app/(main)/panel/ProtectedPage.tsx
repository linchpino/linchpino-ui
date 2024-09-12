import React, {useEffect, useState} from 'react';
import {usePathname, useRouter} from 'next/navigation';
import useStore from "@/store/store";
import CrudSkeleton from '@/components/skeletonLoading/CrudSkeleon';
import ProfileSkeleton from '@/components/skeletonLoading/ProfileSkeleton';
import InterviewsSkeleton from "@/components/skeletonLoading/InterviewsSkeleton";
import PasswordChangeSkeleton from "@/components/skeletonLoading/PasswordChangeSkeleton";

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

const PrivatePage: React.FC<PrivatePageProps> = ({children}) => {
    const {userInfo} = useStore(state => ({
        userInfo: state.userInfo,
    }));
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const checkAccess = () => {
            if (!userInfo) return;

            //@ts-ignore
            const allowedRoles = roleBasedAccess[pathname] || [];
            //@ts-ignore
            if (!allowedRoles.some((role: string) => userInfo.type.includes(role))) {
                console.log('er')
                router.push('/not-found');
            } else {
                setLoading(false);
            }
        };

        checkAccess();
    }, [userInfo, router, pathname]);

    if (loading || !userInfo) {
        switch (pathname) {
            case '/panel/profile':
                return <ProfileSkeleton/>;
            case '/panel/interviews':
                return <InterviewsSkeleton/>;
            case '/panel/change-password':
                return <PasswordChangeSkeleton/>;
            default:
                return <CrudSkeleton/>;
        }
    }

    return (
        <>{children}</>
    );
};

export default PrivatePage;
