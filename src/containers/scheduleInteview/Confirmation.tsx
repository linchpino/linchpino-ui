import Link from "next/link";
import useStore from "@/store/store";
import {useTranslations} from "next-intl";

const Confirmation = () => {
    const {scheduleInterview, setScheduleInterviewItem} = useStore();
    const t = useTranslations()

    return (
        <div className="w-full max-w-4xl">
            <p className='text-[#3F3D56]'>
                <span className="text-black font-bold">{scheduleInterview.isoDate}</span> with <span className="text-black font-bold">{scheduleInterview.mentorName}</span>.
                Check your <span className="text-black font-bold">{scheduleInterview.jobSeekerEmail}</span> for immediate confirmation details. In a few minutes, you'll also receive the interview link.
                We look forward to connecting with you!
            </p>
            <Link href='/' className='btn btn-warning w-52 bg-[#F9A826] text-white rounded-md shadow-md mt-8 py-2 px-3'>
                Back To Home
            </Link>
        </div>
    )
}
export default Confirmation
