'use client';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {BsCalendar3Week, BsFillPersonFill, BsPersonVcard} from 'react-icons/bs'
import {FaLaptopCode} from "react-icons/fa";

const Sidebar = () => {
    const pathname = usePathname();
    const links = [
        {href: '/panel/interviews', label: 'Interviews', icon: <BsPersonVcard size={20}/>},
        {href: '/panel/profile', label: 'Profile', icon: <BsFillPersonFill size={20}/>},
        {href: '/panel/job-position', label: 'Job Position', icon: <FaLaptopCode size={20}/>},
        {href: '/panel/interview-type', label: 'Interview Type', icon: <BsCalendar3Week size={20}/>},
    ];

    return (
        <aside
            className="sidebar sticky top-5 h-fit shadow-[0px_10px_25px_-5px_rgba(0,0,0,0.3)] w-[15%] md:w-1/5 rounded-md p-1 md:p-3 flex flex-col items-center md:items-start">
            <ul className='w-full flex flex-col items-center'>
                {links.map((link) => (
                    <li key={link.href}
                        className={`${pathname === link.href ? 'bg-[#F9A826] text-white' : ''} flex items-center justify-start px-2 my-2 rounded-md w-8 h-8 md:h-10 md:w-full cursor-pointer ${pathname !== link.href && 'hover:bg-orange-100'}`}>
                        {link.icon}
                        <Link className='ml-1 md:ml-2 hidden md:flex md:text-xs lg:text-[.9rem] font-medium'
                              href={link.href}>{link.label}</Link>
                    </li>
                ))}
            </ul>
        </aside>
    );
};

export default Sidebar;


