'use client'
import React, {useEffect, useRef, useState, } from "react";
import {
    BsFillPersonFill,
    BsEmojiAngry,
    BsEmojiFrown,
    BsEmojiNeutral,
    BsEmojiSmile,
    BsEmojiHeartEyes
} from 'react-icons/bs';
import Image from "next/image";
import {usePathname, useRouter} from 'next/navigation';
import useStore from "@/store/store";

interface Props {
}

const Header: React.FC<Props> = () => {
    const router = useRouter();
    const linkData = [
        {id: 1, name: "Our Services"},
        {id: 2, name: "Blog"},
        {id: 3, name: "About Us"},
        {id: 4, name: "Contact Us"},
    ];

    const {token} = useStore(state => ({
        token: state.token,
    }));
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);
    const [isNavOpen, setIsNavOpen] = useState(false);

    const handleLoginOrPanelClick = () => {
        if (token) {
            router.push('/panel/profile');
        } else {
            router.push('/signin');
        }
    };
    const handleLogoClick = () => {
        router.push('/')
    }
    return (
        <>
            <div className="flex items-center justify-between border-b border-[#5F5791] py-8 z-10 relative container">
                <button onClick={handleLogoClick} className="flex items-end">
                    <Image src="/Logo.svg" alt='logo' width={103} height={130}/>
                    <div className='ml-4 hidden lg:flex lg:flex-col'>
                        <Image src="/LinchpinoHeader.svg" alt='logo' width={331} height={73}/>
                        <Image src="/LinchpinoHeaderContent.svg" alt='logo' width={330} height={20}/>
                    </div>
                </button>

                <nav>
                    <section className="MOBILE-MENU flex lg:hidden z-20">
                        <div className='flex flex-col '>
                            <button type="button"
                                    className="HAMBURGER-ICON space-y-2"
                                    onClick={() => setIsNavOpen((prev) => !prev)}
                            >
                                <span className="block h-0.5 w-8 animate-pulse bg-gray-600"></span>
                                <span className="block h-0.5 w-8 animate-pulse bg-gray-600"></span>
                                <span className="block h-0.5 w-8 animate-pulse bg-gray-600"></span>
                            </button>
                            <button onClick={handleLoginOrPanelClick}>
                                <BsFillPersonFill className="mt-4 w-11 h-11 pr-2"/>
                            </button>

                        </div>

                    </section>
                    <div className='DESKTOP-MENU hidden lg:flex flex-col justify-end '>
                        <div className='flex justify-end gap-6'>
                            {linkData.map(linkItem => {
                                return (
                                    <button key={linkItem.id}>
                                        {linkItem.name}
                                    </button>
                                )
                            })}

                        </div>
                        <div className='lg:flex items-center justify-end mt-6'>
                            <div
                                className="input input-bordered input-md bg-transparent rounded-md w-[60%] flex items-center gap-2 mr-4">
                                <input type="text" className="grow" placeholder="Search Here ..."/>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
                                     className="w-4 h-4 opacity-70">
                                    <path fillRule="evenodd"
                                          d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                                          clipRule="evenodd"/>
                                </svg>
                            </div>
                            <button onClick={handleLoginOrPanelClick}
                                  className='btn btn-warning py-3 px-5 bg-[#F9A826] text-white rounded-md shadow-md'>
                                {isClient ? (token ? 'Panel' : 'SignIn / Register') : 'SignIn / Register'}
                            </button>
                        </div>
                    </div>
                </nav>
                <style>{`
      .hideMenuNav {
        display: none;
      }
      .showMenuNav {
        display: block;
        position: fixed;
        width: 100%;
        height: 100vh;
        top: 0;
        left: 0;
        background: white;
        z-index: 10;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
      }
    `}</style>
            </div>
            <div className={isNavOpen ? "showMenuNav" : "hideMenuNav"}>
                <button type="button"
                        className="CROSS-ICON absolute top-0 right-0 px-8 py-8"
                        onClick={() => setIsNavOpen(false)}
                >
                    <svg
                        className="h-8 w-8 text-gray-600"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                </button>
                <div className="MENU-LINK-MOBILE-OPEN flex fixed flex-col items-center justify-between min-h-[350px]">
                    <div
                        className="input input-bordered input-md bg-transparent rounded-md w-[100%] flex items-center gap-2 mt-5">
                        <input type="text" className="grow" placeholder="Search Here ..."/>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
                             className="w-4 h-4 opacity-70">
                            <path fillRule="evenodd"
                                  d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                                  clipRule="evenodd"/>
                        </svg>
                    </div>
                    {linkData.map(linkItem => {
                        // @ts-ignore
                        return (
                            <button className="border-b border-gray-400 my-8 uppercase" key={linkItem.id}>
                                {linkItem.name}
                            </button>
                        )
                    })}
                </div>
            </div>
        </>

    );
}
export default Header;
