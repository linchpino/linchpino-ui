import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');

    if (!code) {
        return NextResponse.json({ error: 'Code is missing' }, { status: 400 });
    }

    try {
        const response = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', null, {
            params: {
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: 'http://localhost:3000/signin',
                client_id: '77ealfulm14qfu',
                client_secret: 'WPL_AP1.FflBvLK8JH8AQuDf.qdttHQ==',
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        return NextResponse.json(response.data, { status: 200 });
    } catch (error) {
        console.error('Error fetching LinkedIn token:', error);
        return NextResponse.json({ error: 'Failed to fetch LinkedIn token' }, { status: 500 });
    }
}
