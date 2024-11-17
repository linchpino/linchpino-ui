'use client';
import {Suspense, useRef} from 'react';
import dynamic from 'next/dynamic';

const JobSearchSection = dynamic(() => import('@/containers/home/JobSearchSection'), {
    suspense: true,
});
const BeMentor = dynamic(() => import('@/containers/home/BeMentor'), {
    suspense: true,
});
const ScheduleAnInterview = dynamic(() => import('@/containers/home/ScheduleAnInterview'), {
    suspense: true,
});
const InterviewMeeting = dynamic(() => import('@/containers/home/InterviewMeeting'), {
    suspense: true,
});
const MasterArt = dynamic(() => import('@/containers/home/MasterArt'), {
    suspense: true,
});
const DonateNow = dynamic(() => import('@/containers/home/DonateNow'), {
    suspense: true,
});

export default function Home() {
    const scheduleRef = useRef<HTMLDivElement>(null);
    const scrollToSchedule = () => {
        if (scheduleRef.current) {
            const offsetTop = scheduleRef.current.offsetTop;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }

    return (
        <div className='bg-white pb-5 lg:pb-0 overflow-x-hidden container'>
            <div ref={scheduleRef}>
                <Suspense fallback={<div>Loading Job Search...</div>}>
                    <JobSearchSection />
                </Suspense>
            </div>
            <Suspense fallback={<div>Loading Be Mentor...</div>}>
                <BeMentor />
            </Suspense>
            <Suspense fallback={<div>Loading Schedule Interview...</div>}>
                <ScheduleAnInterview onClick={scrollToSchedule} />
            </Suspense>
            <Suspense fallback={<div>Loading Interview Meeting...</div>}>
                <InterviewMeeting />
            </Suspense>
            <Suspense fallback={<div>Loading Master Art...</div>}>
                <MasterArt />
            </Suspense>
            <Suspense fallback={<div>Loading Donate Now...</div>}>
                <DonateNow />
            </Suspense>
        </div>
    );
}
