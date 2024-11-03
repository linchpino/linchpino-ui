'use client';

import {Link, usePathname,routing} from '../../i18n/routing';
import {useEffect, useState} from 'react';
import {BsFillPersonFill, BsPersonVcard, BsPeopleFill, BsKey, BsCalendar3Week, BsBoxArrowRight} from 'react-icons/bs';
import {FaLaptopCode} from 'react-icons/fa';
import useStore from '@/store/store';
import LogoutModal from './LogoutModal';
import {MdOutlineLockReset} from "react-icons/md";
import {useTranslations} from "next-intl";

const Sidebar = () => {
    const t = useTranslations();

    const pathname = usePathname();
    const {userInfo} = useStore(state => state);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
    }, []);
    const getCurrentLocale = () => {
        const currentPath = pathname.split('/')[1];
        // @ts-ignore
        return routing.locales.includes(currentPath) ? currentPath : routing.defaultLocale;
    };
    console.log(getCurrentLocale())
    const locale = getCurrentLocale();
    const links = [
        { href: '/panel/profile', label: t('sidebar.profile'), icon: <BsFillPersonFill size={20} />, roles: ['ADMIN', 'JOB_SEEKER', 'MENTOR'] },
        { href: '/panel/interviews', label: t('sidebar.interviews'), icon: <BsPersonVcard size={20} />, roles: ['JOB_SEEKER', 'MENTOR'] },
        { href: '/panel/users', label: t('sidebar.users'), icon: <BsPeopleFill size={20} />, roles: ['ADMIN'] },
        { href: '/panel/job-position', label: t('sidebar.jobPositions'), icon: <FaLaptopCode size={20} />, roles: ['ADMIN'] },
        { href: '/panel/interview-type', label: t('sidebar.interviewTypes'), icon: <BsCalendar3Week size={20} />, roles: ['ADMIN'] },
        { href: '/panel/change-password', label: t('sidebar.changePassword'), icon: <BsKey size={20} />, roles: ['ADMIN', 'JOB_SEEKER', 'MENTOR'] },
        { href: '/panel/reset-password', label: t('sidebar.resetPassword'), icon: <MdOutlineLockReset size={21} />, roles: ['ADMIN'] },
    ];
    return (
        <>
            <aside
                className="sidebar sticky top-5 h-fit shadow-[0px_10px_25px_-5px_rgba(0,0,0,0.3)] w-[15%] md:w-1/5 rounded-md p-1 md:p-3 flex flex-col items-center md:items-start">
                <ul className="w-full flex flex-col items-center">
                    {isClient && links.filter(link => userInfo?.type?.some(role => link.roles.includes(role)))
                        .map(link => (
                            <li key={link.href}
                                className="w-full flex justify-center md:text-sm lg:text-[.9rem] xl:text-[1rem]">
                                <Link
                                    href={link.href}
                                    className={`flex gap-x-2 items-center justify-start ${pathname === link.href  ? 'bg-[#F9A826] text-white' : ''} px-2 my-2 rounded-md w-8 h-8 md:h-10 md:w-full cursor-pointer ${pathname === link.href  && 'hover:bg-orange-100'}`}
                                >
                                    {link.icon}
                                    <span className="hidden md:flex">{link.label}</span>
                                </Link>
                            </li>
                        ))}
                    <li className="w-full flex justify-center md:text-sm lg:text-[.9rem] xl:text-[1rem]">
                        <button onClick={() => setIsModalOpen(true)}
                                className={`flex gap-x-2 items-center justify-start ${pathname === '/panel/signout' ? 'bg-[#F9A826] text-white' : ''} px-2 my-2 rounded-md w-8 h-8 md:h-10 md:w-full cursor-pointer ${pathname === '/panel/signout' && 'hover:bg-orange-100'}`}>
                            <BsBoxArrowRight size={20}/>
                            <span className='hidden md:flex'>{t('sidebar.signOut')}</span>
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


