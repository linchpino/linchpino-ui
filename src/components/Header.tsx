//@ts-nocheck
'use client'
import React, {useState} from "react";
import { BsFillPersonFill} from 'react-icons/bs'
import Image from "next/image";
import Link from "next/link";

interface Props {
}

const Header: React.FC<Props> = () => {
    const [isNavOpen, setIsNavOpen] = useState(false); // initiate isNavOpen state with false
    const linkData = [
        {id: 1, name: "Our Services"},
        {id: 2, name: "Blog"},
        {id: 3, name: "About Us"},
        {id: 4, name: "Contact Us"},
    ]
    const [activeRate, setActiveRate] = useState(4)
    const [comment, setComment] = useState('')
    const rateData = [
        {id: 1, rate: 'very-bad', image: '/emoji/very-bad.png', disableImage: '/emoji/very-bad-disable.png'},
        {id: 2, rate: 'bad', image: '/emoji/bad.png', disableImage: '/emoji/bad-disable.png'},
        {id: 3, rate: 'normal', image: '/emoji/normal.png', disableImage: '/emoji/normal-disable.png'},
        {id: 4, rate: 'good', image: '/emoji/good.png', disableImage: '/emoji/good-disable.png'},
        {id: 5, rate: 'very-good', image: '/emoji/very-good.png', disableImage: '/emoji/very-good-disable.png'},
    ]
    return (
        <>
            <div className="flex items-center justify-between border-b border-[#5F5791] py-8 z-10 relative container">
                <button onClick={() => document.getElementById(`modal`).showModal()} className="flex items-end">
                    <Image src="/Logo.svg" alt='logo' width={103} height={130}/>
                    <div className='ml-4 hidden lg:flex lg:flex-col'>
                        <Image src="/LinchpinoHeader.svg" alt='logo' width={331} height={73}/>
                        <Image src="/LinchpinoHeaderContent.svg" alt='logo' width={330} height={20}/>
                    </div>
                </button>
                <dialog id='modal'
                        className="modal">
                    <div className="modal-box max-w-lg bg-white flex flex-col items-center">
                        <form method="dialog">
                            <button
                                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕
                            </button>
                        </form>
                        <div
                            className="flex flex-col py-6 items-center justify-center w-full border-[.6px] rounded-md mt-10 mb-10 lg:mb-0 container p-3">
                            <h1 className='text-xl text-center text-[#000]'>Thank you for attending to the
                                interview</h1>
                            <div className='flex flex-col text-center w-full max-w-xs'>
                                <span className='mt-10'>What is your feeling?</span>
                                <div className="flex mt-3 justify-between">
                                    {rateData.map((item => {
                                        return (
                                            <div key={item.id} className="tooltip tooltip-bottom"
                                                 data-tip={item.rate}>
                                                <button onClick={() => setActiveRate(item.id)}>
                                                    {item.id === activeRate
                                                        ?
                                                        <Image width={40} height={40} src={item.image}
                                                               key={item.id}
                                                               alt='Rate'/>
                                                        :
                                                        <Image width={40} height={40}
                                                               src={item.disableImage}
                                                               key={item.id} alt='Rate'/>
                                                    }
                                                </button>
                                            </div>
                                        )
                                    }))}
                                </div>
                                <span className='mt-10'>Tell us what do you want?</span>
                                <textarea maxLength={300} value={comment}
                                          onChange={(e) => setComment(e.target.value)}
                                          className="textarea textarea-bordered bg-white mt-2 w-full max-w-sm"
                                          placeholder="Write something..."></textarea>
                                <span className="text-xs text-left ml-1 mt-1">{comment.length} / 300</span>
                                <button
                                    className='btn btn-sm btn-warning w-32 bg-[#F9A826] text-white rounded-md shadow-md mt-6 py-2 px-3'>
                                    Send
                                </button>
                            </div>

                        </div>
                    </div>
                </dialog>
                <nav>
                    <section className="MOBILE-MENU flex lg:hidden z-20">
                        <div className='flex flex-col '>
                            <button type="button"
                                    className="HAMBURGER-ICON space-y-2"
                                    onClick={() => setIsNavOpen((prev) => !prev)} // toggle isNavOpen state on click
                            >
                                <span className="block h-0.5 w-8 animate-pulse bg-gray-600"></span>
                                <span className="block h-0.5 w-8 animate-pulse bg-gray-600"></span>
                                <span className="block h-0.5 w-8 animate-pulse bg-gray-600"></span>
                            </button>
                            <Link href="/signin">
                                <BsFillPersonFill className="mt-4 w-11 h-11 pr-2"/>
                            </Link>

                        </div>

                    </section>
                    <div className='DESKTOP-MENU hidden lg:flex flex-col justify-end '>
                        <div className='flex justify-end gap-6'>
                            {linkData.map(linkItem => {
                                // @ts-ignore
                                return (
                                    <button  key={linkItem.id}>
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
                            <Link href='/signin'
                                  className='btn btn-warning py-3 px-5 bg-[#F9A826] text-white rounded-md shadow-md'>
                                SignIn / Register
                            </Link>
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
