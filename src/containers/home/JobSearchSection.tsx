"use client"
import React, { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AsyncPaginate } from "react-select-async-paginate";
import { BASE_URL_API } from "@/utils/system";
import axios from "axios";
import { empty } from "@/utils/helper";
import { useUpdateEffect } from "react-use";

interface Job {
    id: number;
    title: string;
}

interface Interview {
    id: number;
    title: string;
}

export default function JobSearchSection() {
    const router = useRouter();
    const interViewRef = useRef(null);
    const [jobValue, setJobValue] = useState<Job | null>(null);
    const [interviewValue, setInterviewValue] = useState<Interview | null>(null);

    useUpdateEffect(() => {
        if (jobValue && !empty(jobValue)) {
            loadInterview("",[],{ page: 0 });
        }
    }, [jobValue]);

    const loadJob = async (search: string,loadedOptions:unknown[], { page }: { page: number }): Promise<{
        additional: {
            page: number
        };
        options: Job[];
        hasMore: boolean
    }> => {
        const response = await axios.get(`${BASE_URL_API}jobposition/search`, {
            params: {
                page,
                name: search,
            },
        });
        const options: Job[] = response.data.content.map((item: any) => ({
            value: item.id,
            label: item.title,
        }));
        console.log(response)
        return {
            options,
            hasMore: !response.data.last,
            additional: {
                page: page + 1,
            },
        };
    };

    const loadInterview = async (search: string,loadedOptions:unknown[], { page }: { page: number }): Promise<{
        additional: {
            page: number
        };
        options: Job[];
        hasMore: boolean
    }>=>{
        if (!jobValue) { // @ts-ignore
            return Promise.resolve({ options: [], additional: { page: page + 1 } });
        }
        try {
            // @ts-ignore
            const response = await axios.get(`${BASE_URL_API}jobposition/${jobValue?.value}/interviewtype`, {
                params: {
                    page,
                },
            });
            const options: Interview[] = response.data.content.map((item: any) => ({
                value: item.id,
                label: item.title,
            }));

            if (options.length > 0) {
                setInterviewValue(options[0]);
            }else {
                //@ts-ignore
                setInterviewValue(null);
            }
            return {
                options,
                hasMore : !response.data.last,
                additional: {
                    page: page + 1,
                },
            };
        } catch (error) {
            console.error("Error loading interviews:", error);
            // @ts-ignore
            return Promise.resolve({ options: [], additional: { page: page + 1 } });
        }
    };

    return (
        <div className="flex flex-col items-center justify-center text-black mt-8 md:mt-0">
            <Image
                className="hidden md:flex"
                style={{ position: "absolute", top: 25, left: 0 }}
                src="/home/HomeCloudTwo.svg"
                alt="logo"
                width={350}
                height={107}
            />
            <Image
                className="hidden md:flex"
                style={{ position: "absolute", top: 10, right: 200 }}
                src="/home/HomeCloudOne.svg"
                alt="logo"
                width={260}
                height={119}
            />
            <div className="hidden md:flex justify-between relative z-5">
                <Image src="/home/HomeCloudThree.svg" alt="logo" width={312} height={61} />
                <Image className="mt-5" src="/home/HomeCloudThree.svg" alt="logo" width={700} height={150} />
            </div>
            <div className="flex flex-col items-center justify-between relative">
                <h2 className="relative z-5 text-center md:ml-[40%] ">
                    Empower Your Job Search
                    <br />
                    Participate in a Free Mock Interview with Professionals
                </h2>
                <div className="flex flex-col justify-between items-center">
                    <Image
                        className="hidden sm:flex mt-[-40px]"
                        src="/home/JobSearch.svg"
                        alt="logo"
                        width={820}
                        height={180}
                    />
                </div>
                <div className="flex flex-col items-center text-left backdrop-blur bg-black/5 px-5 py-10 mt-4 sm:absolute sm:top-[15%] md:top-0 md:left-[-3rem] w-72 border-2 border-[#F9A826] rounded-lg gap-y-8">
                    <AsyncPaginate
                        classNames={{
                            control: () => " border border-gray-300 w-full rounded-md h-[48px] mt-1 text-sm px-3 mr-2",
                            container: () => "text-sm rounded w-full text-[#000000]",
                            menu: () => " bg-gray-100 rounded border py-2 ",
                            option: ({ isSelected, isFocused }) =>
                                isSelected
                                    ? "dark:bg-base-content dark:text-base-200 bg-gray-400 text-gray-50 px-4 py-2"
                                    : isFocused
                                        ? "bg-gray-200 px-4 py-2"
                                        : "px-4 py-2",
                        }}
                        value={jobValue}
                        onChange={(e) => {
                            setJobValue(e);
                        }}
                        unstyled
                        placeholder="Dream job"
                        //@ts-ignore
                        loadOptions={loadJob}
                        additional={{
                            page: 0,
                        }}
                    />
                    <AsyncPaginate
                        cacheUniqs={[jobValue]}
                        selectRef={interViewRef}
                        classNames={{
                            control: () => " border border-gray-300 w-full rounded-md h-[48px] mt-1 text-sm px-3 mr-2",
                            container: () => "text-sm rounded w-full text-[#000000]",
                            menu: () => " bg-gray-100 rounded border py-2 ",
                            option: ({ isSelected, isFocused }) =>
                                isSelected
                                    ? "dark:bg-base-content dark:text-base-200 bg-gray-400 text-gray-50 px-4 py-2"
                                    : isFocused
                                        ? "bg-gray-200 px-4 py-2"
                                        : "px-4 py-2",
                        }}
                        value={interviewValue}
                        onChange={setInterviewValue}
                        unstyled
                        placeholder="Interview Type"
                        //@ts-ignore
                        loadOptions={loadInterview}
                        additional={{
                            page: 0,
                        }}
                    />
                    <button
                        disabled={!jobValue || !interviewValue}
                        onClick={() => router.push("/schedule-inteview")}
                        className="btn btn-sm w-2/3 border-none px-2 bg-[#3F3D56] text-[#F9A826] rounded-md shadow-md text-xs"
                    >
                        Schedule the interview
                    </button>
                </div>
            </div>
        </div>
    );
}
