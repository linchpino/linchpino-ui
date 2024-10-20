'use client'
import React, {useState} from 'react';
import InterviewsItem from "@/containers/panel/InterviewsItem";
import Spinner from "@/components/Spinner";
import {BASE_URL_API} from "@/utils/system";
import useStore from "@/store/store";
import useFetchData from "@/utils/hooks/useFetchData";
import ProtectedPage from "@/app/(main)/panel/ProtectedPage";

type Interview = {
    intervieweeId: number;
    intervieweeName: string;
    fromTime: string;
    toTime: string;
    interviewType: string;
};


interface InterviewDataProps {
    url: string;
    queryKey: string;
    title: string;
    isPast: boolean;
    role: string;
}

const InterviewData: React.FC<InterviewDataProps> = ({url, queryKey, title, isPast, role}) => {
    const {token} = useStore(state => ({
        token: state.token,
        decodedToken: state.decodedToken,
    }));
    const [page, setPage] = useState(0);
    const {data, isLoading, error} = useFetchData(`${url}?page=${page}`, token, queryKey);

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
                <p className="text-red-500">Error loading {title.toLowerCase()}.</p>
            </div>
        );
    }
    return (
            <div className={`${isPast && 'mt-10'} flex flex-col gap-x-8 gap-y-5 lg:gap-y-0 relative`}>
                <div>
                    <h1 className="text-md font-bold">{title}</h1>
                    {data?.content.length === 0 ? (
                        <p className="text-left text-gray-500 mt-4">No interviews available at the moment.</p>
                    ) : (
                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-2'>
                            {data?.content.map((interview: Interview) => (
                                <InterviewsItem key={interview.intervieweeId} data={interview} isPast={isPast}
                                                role={role}/>
                            ))}
                        </div>
                    )}
                    {data && data.number < data.totalPages - 1 && (
                        <button
                            onClick={loadMore}
                            className='w-full bg-[#F9A826] text-white p-2 mt-8'>
                            Show More
                        </button>
                    )}
                </div>
            </div>
    );
};

const Interviews: React.FC = () => {
    const {decodedToken} = useStore(state => ({
        decodedToken: state.decodedToken,
    }));
    const isMentor = decodedToken?.scope === "MENTOR";

    const upcomingUrl = isMentor
        ? `${BASE_URL_API}interviews/mentors/upcoming`
        : `${BASE_URL_API}interviews/jobseekers/upcoming`;

    const pastUrl = isMentor
        ? `${BASE_URL_API}interviews/mentors/past`
        : `${BASE_URL_API}interviews/jobseekers/past`;
    return (
        <ProtectedPage>
            <InterviewData url={upcomingUrl} queryKey="upcomingInterviews" title="Upcoming Interviews" isPast={false}
                           role={isMentor ? 'MENTOR' : "JOB_SEEKER"}/>
            <InterviewData url={pastUrl} queryKey="pastInterviews" title="Past Interviews" isPast={true}
                           role={isMentor ? 'MENTOR' : "JOB_SEEKER"}/>
        </ProtectedPage>
    );
};

export default Interviews;
