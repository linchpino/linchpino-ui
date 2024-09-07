import {useRouter} from 'next/navigation';
import React, {useEffect, useState} from 'react';
import useStore from "@/store/store";
import CrudSkeleton from '@/components/seletonLoading/CrudSkeleon';

interface PrivatePageProps {
    children: React.ReactNode;
}

export default function PrivatePage({children}: PrivatePageProps) {
    const {userRoles, token} = useStore(state => ({
        userRoles: state.userRoles,
        token: state.token,
    }));
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    console.log(userRoles)
    useEffect(() => {
        const checkAccess = () => {
            if (!userRoles || userRoles.length === 0) return; // صبر برای بارگذاری `userRoles`
            const allowedRoles = ['ADMIN', 'JOB_SEEKER', 'MENTOR'];
            if (!userRoles.some((role: string) => allowedRoles.includes(role))) {
                router.push('/404'); // هدایت به 404 اگر دسترسی ندارند
            } else {
                setLoading(false); // پایان نمایش لودینگ
            }
        };

        if (userRoles.length > 0) {
            checkAccess(); // چک دسترسی پس از لود شدن `userRoles`
        }
    }, [userRoles, router]);

    if (loading || userRoles.length === 0) {
        return <CrudSkeleton />; // نمایش اسکلتون در زمان لود شدن
    }

    return (
        <>{children}</>
    );
}
