import Image from "next/image";
import {Button} from "@mui/material";

export default function BeMentor() {
    return (
        <div className='flex items-center mt-14'>
            <Image src="/home/BeMentor.svg" alt='logo' width={480} height={364}/>

            <div className="flex-col items-center px-20">
                <h2 style={{
                    fontWeight: '600',
                    fontSize: '20px',
                }}>Mentorship magic</h2>
                <p className='whitespace-pre-line text-[#6F7CB2] mt-6'>
                    Join our platform as a potential mentor and contribute to shaping future talent. Sign up! Your
                    application will be reviewed and endorsed by our community of established mentors, ensuring quality
                    and expertise in guiding aspiring professionals.</p>
                <Button className='mt-6 py-2 px-10' style={{
                    backgroundColor: '#F9A826',
                    color: '#FFFFFF',
                    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                    borderRadius: '5px',
                }}>
                    Be a mentor
                </Button>
            </div>

        </div>
    )
}
