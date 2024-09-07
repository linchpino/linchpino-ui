'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useState} from 'react';
import {BsFillPersonFill, BsPersonVcard, BsPeopleFill, BsKey, BsCalendar3Week, BsBoxArrowRight} from 'react-icons/bs';
import {FaLaptopCode, FaSignOutAlt} from 'react-icons/fa';
import useStore from '@/store/store';
import LogoutModal from './LogoutModal';

const Sidebar = () => {
    const pathname = usePathname();
    const {userInfo} = useStore(state => state);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const links = [
        {
            href: '/panel/profile',
            label: 'Profile',
            icon: <BsFillPersonFill size={20}/>,
            roles: ['ADMIN', 'JOB_SEEKER', 'MENTOR']
        },
        {
            href: '/panel/interviews',
            label: 'Interviews',
            icon: <BsPersonVcard size={20}/>,
            roles: ['JOB_SEEKER', 'MENTOR']
        },
        {
            href: '/panel/users',
            label: 'Users',
            icon: <BsPeopleFill size={20}/>,
            roles: ['ADMIN']
        },
        {
            href: '/panel/job-position',
            label: 'Job Positions',
            icon: <FaLaptopCode size={20}/>,
            roles: ['ADMIN']
        },
        {
            href: '/panel/interview-type',
            label: 'Interview Types',
            icon: <BsCalendar3Week size={20}/>,
            roles: ['ADMIN']
        },
        {
            href: '/panel/change-password',
            label: 'Change Password',
            icon: <BsKey size={20}/>,
            roles: ['ADMIN', 'JOB_SEEKER', 'MENTOR']
        },
    ];

    return (
        <>
            <aside
                className="sidebar sticky top-5 h-fit shadow-[0px_10px_25px_-5px_rgba(0,0,0,0.3)] w-[15%] md:w-1/5 rounded-md p-1 md:p-3 flex flex-col items-center md:items-start">
                <ul className="w-full flex flex-col items-center">
                    {links
                        .filter(link => userInfo?.type?.some(role => link.roles.includes(role)))
                        .map(link => (
                            <li key={link.href}
                                className="w-full flex justify-center md:text-sm lg:text-[.9rem] xl:text-[1rem]">
                                <Link
                                    href={link.href}
                                    className={`flex gap-x-2 items-center justify-start ${pathname === link.href ? 'bg-[#F9A826] text-white' : ''} px-2 my-2 rounded-md w-8 h-8 md:h-10 md:w-full cursor-pointer ${pathname !== link.href && 'hover:bg-orange-100'}`}
                                >
                                    {link.icon}
                                    <span className="hidden md:flex">{link.label}</span>
                                </Link>
                            </li>
                        ))}
                    <li className="w-full flex justify-center md:text-sm lg:text-[.9rem] xl:text-[1rem]">
                        <button onClick={() => setIsModalOpen(true)}
                                className={`flex gap-x-2 items-center justify-start ${pathname === '/panel/logout' ? 'bg-[#F9A826] text-white' : ''} px-2 my-2 rounded-md w-8 h-8 md:h-10 md:w-full cursor-pointer ${pathname !== '/panel/logout' && 'hover:bg-orange-100'}`}>
                            <BsBoxArrowRight size={20}/>
                            <span className='hidden md:flex'>Logout</span>
                        </button>
                    </li>
                </ul>
            </aside>

            <LogoutModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>

    );
};

export default Sidebar;
