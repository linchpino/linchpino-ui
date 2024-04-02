import Image from "next/image";
import {Button} from "@mui/material";

export default function MasterArt() {
    return (
        <div className='lg:flex items-center mt-14'>
            <Image src="/home/MasterArt.svg" className="flex order-2 lg:order-2" alt='logo' width={480} height={472}/>
            <div className="flex-col items-center lg:px-20 order-1 lg:order-1 mt-5 lg:mt-0">
                <h2 style={{
                    fontWeight: '600',
                    fontSize: '20px',
                }}>Master the art!</h2>
                <p className='whitespace-pre-line text-[#6F7CB2] mt-6'>
                    Elevate your skills with our insightful blogs. Dive into expert tips for success and conquer your
                    next interview with confidence
                </p>
                <Button className='mt-6 py-2 px-10' style={{
                    backgroundColor: '#F9A826',
                    color: '#FFFFFF',
                    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                    borderRadius: '5px',
                }}>
                    Explore techniques
                </Button>
            </div>
        </div>
    )
}
