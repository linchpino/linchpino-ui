import Link from "next/link";
import {BsFacebook, BsLinkedin, BsTwitter, BsYoutube, BsInstagram} from 'react-icons/bs'

export default function Footer() {
    return (
        <div className='hidden lg:flex flex-col gap-y-10 mt-10 w-full bg-[#E7ECFF] pt-12 px-24 pb-10'>
            <div className='flex justify-between items -center'>
                <p>
                    ©2024 Linchpino
                </p>
                <button className='btn btn-sm bg-[#111B47] rounded text-white shadow-md px-6'>
                    Donate Now
                </button>
            </div>
            <div className="h-0.5 w-full bg-[#5F5791]"/>
            <div className='flex justify-between items-center'>
                <div className='flex justify-end gap-6'>
                    <Link href="/">
                        Home
                    </Link>
                    <Link href="/">
                        About Us
                    </Link>
                    <Link href="/">
                        Contact Us
                    </Link>
                    <Link href="/">
                        Invite Friends
                    </Link>
                </div>
                <div className='flex justify-end gap-6'>
                    {/*<Link href="/">*/}
                    {/*    Home*/}
                    {/*</Link>*/}
                    {/*<Link href="/">*/}
                    {/*    About Us*/}
                    {/*</Link>*/}
                    {/*<Link href="/">*/}
                    {/*    Contact Us*/}
                    {/*</Link>*/}
                    {/*<Link href="/">*/}
                    {/*    Invite Friends*/}
                    {/*</Link>*/}
                    <a href='https://google.com/'><BsFacebook color='#473F77'/></a>
                    <a href='https://google.com/'><BsLinkedin color='#473F77'/></a>
                    <a href='https://google.com/'><BsTwitter color='#473F77'/></a>
                    <a href='https://google.com/'><BsYoutube color='#473F77'/></a>
                    <a href='https://google.com/'><BsInstagram color='#473F77'/></a>

                </div>
            </div>
        </div>
    )
}
