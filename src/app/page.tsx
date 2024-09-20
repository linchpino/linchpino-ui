'use client'
import {useRef} from 'react';
import JobSearchSection from "@/containers/home/JobSearchSection";
import BeMentor from "@/containers/home/BeMentor";
import ScheduleAnInterview from "@/containers/home/ScheduleAnInterview";
import InterviewMeeting from "@/containers/home/InterviewMeeting";
import MasterArt from "@/containers/home/MasterArt";
import DonateNow from "@/containers/home/DonateNow";

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
        <div className='bg-white  pb-5 lg:pb-0 overflow-x-hidden container'>
            <div ref={scheduleRef}>
                <JobSearchSection/>
            </div>
            <BeMentor/>
            <ScheduleAnInterview onClick={scrollToSchedule}/>
            <InterviewMeeting/>
            <MasterArt/>
            <DonateNow/>
        </div>
    );
}
