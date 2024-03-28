import Link from "next/link";
import Image from "next/image";

interface Props {
}

const Header: React.FC<Props> = () => {
    return (
        <div>
            <div className="flex items-center justify-between mt-5 z-10 relative">
                <div className='flex items-end'>
                    <Image src="/Logo.svg" alt='logo' width={103} height={130}/>
                    <div className='ml-4'>
                        <Image src="/LinchpinoHeader.svg" alt='logo' width={331} height={73}/>
                        <Image src="/LinchpinoHeaderContent.svg" alt='logo' width={330} height={20}/>
                    </div>
                </div>
                <div className='flex-col w-1/2 justify-end'>
                    <div className='flex justify-end gap-6'>
                        <Link href="/">
                            Our Services
                        </Link>
                        <Link href="/">
                            Blog
                        </Link>
                        <Link href="/">
                            About Us
                        </Link>
                        <Link href="/">
                            Contact Us
                        </Link>
                    </div>
                    <div className='flex items-center justify-end mt-6'>
                        <label
                            className="input input-bordered input-md bg-transparent rounded-md w-[60%] flex items-center gap-2 mr-4">
                            <input type="text" className="grow" placeholder="Search Here ..."/>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
                                 className="w-4 h-4 opacity-70">
                                <path fillRule="evenodd"
                                      d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                                      clipRule="evenodd"/>
                            </svg>
                        </label>
                        <Link href='/signin' className='btn btn-warning py-3 px-5 bg-[#F9A826] text-white rounded-md shadow-md'>
                            SignIn / Register
                        </Link>
                    </div>
                </div>

            </div>
            <div className="w-full h-1 bg-[#5F5791] rounded mt-3"/>
        </div>
    );
};

export default Header;
