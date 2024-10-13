import {DateObject} from "react-multi-date-picker";
import Image from "next/image";
import React, {FC, useEffect, useState} from "react";
import useStore from "@/store/store";
import {BASE_URL_API} from "@/utils/system";
import axios from "axios";
import PulseLoader from "react-spinners/PulseLoader";

type Inputs = {
    children: any;
}

const Finalize: FC<Inputs> = (props) => {
    const {children} = props;
    const now = new DateObject();
    const {scheduleInterview} = useStore();
    const [imageUrl, setImageUrl] = useState<string>('/logo-sm.svg');
    const [isLoadingAvatar, setIsLoadingAvatar] = useState<boolean>(true);
    const localStartTime = scheduleInterview.startTime
        ? new Date(scheduleInterview.startTime).toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
        : null;

    useEffect(() => {
        const fetchAvatar = async () => {
            if (scheduleInterview.avatar) {
                try {
                    const response = await axios.get(`${BASE_URL_API}files/image/${scheduleInterview.avatar}`, {
                        responseType: 'blob',
                    });
                    const url = URL.createObjectURL(response.data);
                    setImageUrl(url);
                } catch (error) {
                    console.error("Error fetching avatar:", error);
                    setImageUrl('/logo-sm.svg');
                } finally {
                    setIsLoadingAvatar(false);
                }
            } else {
                setIsLoadingAvatar(false);
            }
        };

        fetchAvatar();
    }, [scheduleInterview.avatar]);

    return (
        <div className='flex flex-col items-center w-full max-w-xs gap-y-4'>
            <p className="text-[20px] text-[#F9A826]">
                {localStartTime ? localStartTime : "No Date Available"}
            </p>
            <div className='flex flex-col w-full items-center sm:w-full shadow-lg rounded gap-y-3 p-3'>
                <div className="relative h-32 w-32 mx-auto flex items-center justify-center">
                    {isLoadingAvatar ? (
                        <PulseLoader size={10} color='#F9A826'/>

                    ) : (
                        <Image
                            src={imageUrl || "/logo-sm.svg"}
                            alt="mentor-avatar"
                            layout="fill"
                            objectFit="cover"
                            className="rounded-full bg-white"
                            onLoad={() => setIsLoadingAvatar(false)}
                            onError={() => setIsLoadingAvatar(false)}
                        />
                    )}
                </div>
                <h6 className='text-[#F9A826] text-[14px]'>{scheduleInterview.mentorName}</h6>
                {/*<Rating name="half-rating-read" defaultValue={2.5} precision={0.5} readOnly/>*/}
            </div>
            {children}
        </div>
    )
}

export default Finalize;
