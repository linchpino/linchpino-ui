import Image from "next/image";
import {Button} from "@mui/material";

export default function ScheduleAnInterview() {
    return (
        <div className='flex items-center mt-14'>
            <div className="flex-col items-center px-10">
                <h2 style={{
                    fontWeight: '600',
                    fontSize: '20px',
                }}>Free mock interviews await!</h2>
                <p className='whitespace-pre-line text-[#6F7CB2] mt-6'>
                    Prepare for your next interview with confidence! Request a meeting with a mentor from our network.
                    Our
                    mentors will review your request, offering guidance and acceptance, ensuring you're well-prepared to
                    ace
                    your interview.
                </p>
                <Button className='mt-6 py-2 px-10' style={{
                    backgroundColor: '#F9A826',
                    color: '#FFFFFF',
                    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                    borderRadius: '5px',
                }}>
                    Schedule an interview
                </Button>
            </div>
            <Image src="/home/ScheduleAnInterview.svg" alt='logo' width={480} height={472}/>
        </div>

    )
}
