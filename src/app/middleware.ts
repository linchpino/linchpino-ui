import {NextRequest, NextResponse} from 'next/server';
import useStore from "@/store/store";

const roleBasedAccess = {
    '/panel/interviews': ['JOB_SEEKER', 'MENTOR'],
    '/panel/profile': ['ADMIN', 'JOB_SEEKER', 'MENTOR'],
    '/panel/users': ['ADMIN'],
    '/panel/job-position': ['ADMIN'],
    '/panel/interview-type': ['ADMIN'],
    '/panel/change-password': ['ADMIN', 'JOB_SEEKER', 'MENTOR'],
};

export function middleware(request: NextRequest) {
    console.log("token")

    const url = new URL(request.url);
    const path = url.pathname;
    // @ts-ignore
    const {token} = useStore(state => ({
        setToken: state.token,
    }));
    const userRoles = JSON.parse(token).type || [];

    // @ts-ignore
    const allowedRoles = roleBasedAccess[path];
    if (allowedRoles && !allowedRoles.some((role: any) => userRoles.includes(role))) {
        return NextResponse.redirect('/not-found');
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/panel/:path*'],
};
