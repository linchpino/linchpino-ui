'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {BsFillPersonFill,BsPersonVcard} from 'react-icons/bs'

const Sidebar = () => {
    const pathname = usePathname();
    const links = [
        { href: '/panel/interviews', label: 'Interviews',icon:<BsPersonVcard size={20}/>},
        { href: '/panel/profile', label: 'Profile',icon:<BsFillPersonFill size={20}/>},
        { href: '/panel/job-position', label: 'Job Position',icon:<BsFillPersonFill size={20}/>},
    ];

    return (
        <aside className="sidebar sticky top-5 max-h-60 shadow-[0px_10px_25px_-5px_rgba(0,0,0,0.3)] w-[15%] md:w-1/5 rounded-md p-1 lg:p-4 flex flex-col items-center md:items-start">
            <ul>
                {links.map((link) => (
                    <li key={link.href} className={`${pathname === link.href ? 'bg-[#F9A826] text-white' : ''} flex items-center justify-start p-2 my-3 rounded-md w-8 h-8 md:w-full`}>
                        {link.icon}
                        <Link className='ml-1 hidden md:flex' href={link.href}>{link.label}</Link>
                    </li>
                ))}
            </ul>
        </aside>
    );
};

export default Sidebar;


