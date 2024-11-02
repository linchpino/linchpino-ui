'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const NotFound: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center gap-y-4 pb-4 lg:pb-0">
            <h1 className="text-4xl font-bold text-gray-800 mt-8">Oops! Page Not Found</h1>
            <Image src="/404.png" alt="Not Found" width={300} height={300} />
            <Link href="/public" className="btn btn-sm w-2/3   md:w-48 bg-[#F9A826] text-white border-none md:ml-4 font-medium text-sm">
                Go Back Home
            </Link>
        </div>
    );
};

export default NotFound;
