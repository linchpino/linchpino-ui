'use client'
import React, {useState} from 'react';
import PanelContentChild from "@/containers/panel/PanelContentChild";
import InterviewsItem from "@/containers/panel/InterviewsItem";
import {useQuery} from '@tanstack/react-query';
import axios from 'axios';
import {BASE_URL_API} from "@/utils/system";
import useStore from "@/store/store";
import Spinner from "@/components/Spinner";

type Interview = {
    intervieweeId: number;
    intervieweeName: string;
    fromTime: string;
    toTime: string;
    interviewType: string;
};
const Interviews: React.FC = () => {
    const {token} = useStore(state => ({
        token: state.token,
        decodedToken: state.decodedToken,
    }));

    const [page, setPage] = useState(0);
    const fetchInterviews = async (page: number) => {
        const response = await axios.get(`${BASE_URL_API}interviews/jobseekers/past`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    };

    const {data, isLoading, error} = useQuery({
        queryKey: ['pastInterviews', page],
        queryFn: () => fetchInterviews(page),
        enabled: !!token,
    });

    const loadMore = () => {
        if (data && data.number < data.totalPages - 1) {
            setPage(prev => prev + 1);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Spinner loading={isLoading}/>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-red-500">Error loading interviews.</p>
            </div>
        );
    }

    return (
        <PanelContentChild>
            <div className='flex flex-col gap-x-8 gap-y-5 lg:gap-y-0 relative'>
                <div className='mt-10'>
                    <span className='text-[#F9A826]'>Past Interviews</span>
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-4'>
                        {data?.content.map((interview: Interview) => (
                            <InterviewsItem key={interview.intervieweeId} data={interview} isPast={true}/>
                        ))}
                    </div>
                    {data && data.number < data.totalPages - 1 && (
                        <button
                            onClick={loadMore}
                            className='w-full bg-[#F9A826] text-white p-2 mt-8'>
                            Show More
                        </button>
                    )}
                </div>
            </div>
        </PanelContentChild>
    );
};

export default Interviews;
