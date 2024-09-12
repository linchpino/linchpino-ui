import React from 'react';

const SidebarSkeleton = () => {
    return (
        <aside className="sidebar sticky top-5 h-fit shadow-[0px_10px_25px_-5px_rgba(0,0,0,0.3)] w-[15%] md:w-1/5 rounded-md p-1 md:p-3 flex flex-col items-center md:items-start">
            <ul className='w-full flex flex-col items-center'>
                {[...Array(3)].map((_, index) => (
                    <li key={index} className="w-full flex justify-center md:text-sm lg:text-[.9rem] xl:text-[1rem]">
                        <div className="flex gap-x-2 items-center justify-start px-2 my-2 rounded-md w-8 h-8 md:h-10 md:w-full cursor-pointer bg-gray-200 animate-pulse">
                            <div className="w-6 h-6 bg-gray-300 rounded-full animate-pulse"></div>
                            <div className="w-3/4 h-4 bg-gray-300 rounded-md animate-pulse"></div>
                        </div>
                    </li>
                ))}
            </ul>
        </aside>
    );
};

export default SidebarSkeleton;
