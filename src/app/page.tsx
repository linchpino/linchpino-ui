import Header from "@/components/Header";
import JobSearchSection from "@/containers/home/JobSearchSection";
import BeMentor from "@/containers/home/BeMentor";
import ScheduleAnInterview from "@/containers/home/ScheduleAnInterview";
import InterviewMeeting from "@/containers/home/InterviewMeeting";
import MasterArt from "@/containers/home/MasterArt";
import DonateNow from "@/containers/home/DonateNow";
import Footer from "@/components/Footer";

export default function Home() {
    return (
        <>
            <div className='bg-white container'>
                <Header/>
                <JobSearchSection/>
                <BeMentor/>
                <ScheduleAnInterview/>
                <InterviewMeeting/>
                <MasterArt/>
                <DonateNow/>
            </div>
            <Footer/>
        </>
    );
}
