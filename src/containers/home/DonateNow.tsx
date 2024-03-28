import Image from "next/image";
import {Button} from "@mui/material";

export default function DonateNow() {
    return (
        <div className='flex items-center mt-14'>
            <Image src="/home/DonateNow.svg" alt='logo' width={450} height={472}/>

            <div className="flex-col items-center px-20">
                <h2 style={{
                    fontWeight: '600',
                    fontSize: '20px',
                }}>Do you know what is the best nation in the world?</h2>
                <p className='whitespace-pre-line text-[#6F7CB2] mt-6'>
                    DoNation! Join us in creating a world where potential knows no bounds. Your donation, no matter how
                    small, amplifies the impact of our initiative. Together, let's build a community where everyone has
                    the tools they need to succeed.</p>
                <Button className='mt-6 py-2 px-10' style={{
                    backgroundColor: '#F9A826',
                    color: '#FFFFFF',
                    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                    borderRadius: '5px',
                }}>
                    Donate now
                </Button>
            </div>

        </div>
    )
}
