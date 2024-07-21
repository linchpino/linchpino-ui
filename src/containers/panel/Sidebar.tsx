'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar = () => {
    const pathname = usePathname();
    const links = [
        { href: '/panel/interviews', label: 'Interviews' },
        { href: '/panel/profile', label: 'Profile' },
    ];

    return (
        <div className="shadow-[0px_10px_25px_-5px_rgba(0,0,0,0.3)] w-full md:w-1/3 rounded-md p-4 max-h-80 lg:sticky top-10">
            <ul>
                {links.map((link) => (
                    <li key={link.href} className={`${pathname === link.href ? 'bg-[#F9A826] text-white' : ''} p-2 my-3 rounded-md`}>
                        <Link href={link.href}>{link.label}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;
