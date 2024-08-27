import {NextRequest, NextResponse} from 'next/server';
import axios from 'axios';

export async function GET(req: NextRequest) {
    const {searchParams} = new URL(req.url);
    const code = searchParams.get('code');

    if (!code) {
        return NextResponse.json({error: 'Code is missing'}, {status: 400});
    }

    try {
        const response = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', null, {
            params: {
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: process.env.NEXT_PUBLIC_LINKEDIN_REDIRECT_URI,
                client_id: process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID,
                client_secret: process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_SECRET,
            },
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Cache-Control': 'no-store',
                'Pragma': 'no-cache'
            },
        });

        return NextResponse.json(response.data, {status: 200});
    } catch (error) {
        console.error('Error fetching LinkedIn token:', error);
        return NextResponse.json({error: 'Failed to fetch LinkedIn token'}, {status: 500});
    }
}
