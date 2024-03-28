'use client'
import Image from "next/image";
import {AsyncPaginate} from "react-select-async-paginate";

export default function JobSearchSection() {
    async function loadOptions(search: any, loadedOptions: any) {
        const response = await fetch(`https://jsonplaceholder.typicode.com/todos/1`);
        const responseJSON = await response.json();

        return {
            options: responseJSON.results,
            hasMore: responseJSON.has_more,
        };
    }

    return (
        <div className='flex flex-col items-center justify-center text-black'>
            <Image style={{position: 'absolute', top: 25, left: 0}} src="/home/HomeCloudTwo.svg" alt='logo' width={350}
                   height={107}/>
            <Image style={{position: 'absolute', top: 10, right: 200}} src="/home/HomeCloudOne.svg" alt='logo'
                   width={260} height={119}/>
            <div className='flex justify-between relative z-10'>
                <Image src="/home/HomeCloudThree.svg" alt='logo' width={312} height={61}/>
                <Image className='mt-5' src="/home/HomeCloudThree.svg" alt='logo' width={700} height={150}/>
            </div>
            <p className='whitespace-pre-line'>
                Empower Your Job Search
                Participate in a Free Mock Interview with Professionals
            </p>


            <div className="flex-col items-center relative">
                <h2 className="whitespace-pre-line relative z-10 text-center ml-[40%]">
                    Empower Your Job Search
                    <br/>
                    Participate in a Free Mock Interview with Professionals
                </h2>
                <Image className='mt-[-5rem]' src="/home/JobSearch.svg" alt='logo' width={1000} height={250}/>
                <div
                    className='flex flex-col items-center text-left backdrop-blur bg-black/5 px-5 py-10 absolute top-0 border-2 border-[#F9A826] rounded-lg gap-y-8'>
                    <AsyncPaginate
                        classNames={{
                            control: () =>
                                'border border-gray-300 rounded-md h-[48px] mt-1 text-sm px-3 mr-2',
                            container: () => 'text-sm rounded w-full',
                            menu: (isSelected) => 'bg-withe border py-2',
                            option: ({isSelected}) =>
                                isSelected ? "dark:bg-base-content dark:text-base-200 bg-gray-400 text-gray-50 px-4 py-2" : "px-4 py-2",
                        }}
                        value={''}
                        onChange={(e: any) => console.log(e.target.value)}
                        unstyled
                        placeholder="Select your field of proficiency"
                        // loadingMessage={selectedBenefactor => "درحال بارگزاری..."}
                        // noOptionsMessage={selectedBenefactor => "موردی یافت نشد"}
                        // additional={{
                        //     page: 1,
                        // }}
                        loadOptions={loadOptions}/>
                    <AsyncPaginate
                        classNames={{
                            control: () =>
                                'border border-gray-300 rounded-md h-[48px] mt-1 text-sm px-3 mr-2',
                            container: () => 'text-sm rounded w-full',
                            menu: (isSelected) => 'bg-withe border py-2',
                            option: ({isSelected}) =>
                                isSelected ? "dark:bg-base-content dark:text-base-200 bg-gray-400 text-gray-50 px-4 py-2" : "px-4 py-2",
                        }}
                        value={''}
                        onChange={(e: any) => console.log(e.target.value)}
                        unstyled
                        placeholder="Select your dream job"
                        // loadingMessage={selectedBenefactor => "درحال بارگزاری..."}
                        // noOptionsMessage={selectedBenefactor => "موردی یافت نشد"}
                        // additional={{
                        //     page: 1,
                        // }}
                        loadOptions={loadOptions}/>
                    <button
                        className='btn btn-sm w-2/3 border-none px-2 bg-[#3F3D56] text-[#F9A826] rounded-md shadow-md text-xs'>
                        Schedule the interview
                    </button>
                </div>
            </div>
        </div>
    )
}
