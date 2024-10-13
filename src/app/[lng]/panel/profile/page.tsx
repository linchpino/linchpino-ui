'use client';
import React from 'react';
import ProfilePicture from '@/containers/panel/profile/ProfilePicture';
import ProfileInformation from '@/containers/panel/profile/ProfileInformation';
import ProfileTimeSlot from '@/containers/panel/profile/ProfileTimeSlot';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Spinner from '@/components/Spinner';
import useStore from '@/store/store';
import { BASE_URL_API } from "@/utils/system";

interface Schedule {
    id: number;
    startTime: string;
    duration: number;
    accountId: number;
    recurrenceType: string;
    interval: number;
    endTime: string;
    weekDays: string[];
    monthDays: number[];
}

interface ProfileData {
    id: number | null;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    type: string[] | null;
    status: string | null;
    externalId: string | null;
    avatar: string | null;
    detailsOfExpertise: string | undefined;
    schedule: Schedule | null;
}

const fetchProfileData = async (token: string | null): Promise<ProfileData> => {
    const { data } = await axios.get(`${BASE_URL_API}accounts/profile`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return data;
};

const Profile: React.FC = () => {
    const { userRoles, token } = useStore(state => ({
        userRoles: state.userRoles,
        token: state.token,
    }));

    const { data, isLoading, error } = useQuery({
        queryKey: ['profileData'],
        queryFn: () => fetchProfileData(token),
        enabled: !!token,
    });

    if (isLoading) return <div className="flex items-center justify-center"><Spinner loading={true} /></div>;

    if (error) return <div>Error loading profile data</div>;

    if (!data) return null;

    const { avatar, firstName, lastName, email, detailsOfExpertise, schedule } = data;

    const isMentor = userRoles.includes("MENTOR");

    return (
        <>
            <ProfilePicture avatar={avatar} />
            <ProfileInformation
                firstName={firstName ?? ''}
                lastName={lastName ?? ''}
                email={email ?? ''}
                detailsOfExpertise={detailsOfExpertise}
            />
            {isMentor &&
                <ProfileTimeSlot
                    startTime={schedule?.startTime ?? ''}
                    endTime={schedule?.endTime ?? ''}
                    durationTime={schedule?.duration ?? 0}
                    accountId={schedule?.accountId ?? 0}
                    recurrenceType={schedule?.recurrenceType ?? ''}
                    interval={schedule?.interval ?? 0}
                    weekDays={schedule?.weekDays ?? []}
                    monthDays={schedule?.monthDays ?? []}
                />
            }

        </>
    );
};

export default Profile;
