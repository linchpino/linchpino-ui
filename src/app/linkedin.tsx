import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

const LinkedInCallback: React.FC = () => {
    const router = useRouter();

    useEffect(() => {
        const fetchAccessToken = async (code: string) => {
            const response = await fetch('/api/auth/linkedin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code }),
            });

            const data = await response.json();

            if (data.access_token) {
                localStorage.setItem('linkedin_token', data.access_token);
                router.push('/dashboard');
            } else {
                console.error('Error fetching access token:', data);
                router.push('/signin');
            }
        };

        if (router.query.code) {
            fetchAccessToken(router.query.code as string);
        }
    }, [router.query.code]);

    return <div>Logging in...</div>;
};

export default LinkedInCallback;
