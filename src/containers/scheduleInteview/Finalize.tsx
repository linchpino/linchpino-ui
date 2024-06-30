import {DateObject} from "react-multi-date-picker";
import Image from "next/image";
import Rating from "@mui/material/Rating";
import React, {FC} from "react";
import useStore from "@/store/store";

type Inputs = {
    children:any
}

const Finalize: FC<Inputs> = (props) => {
    const {children} = props
    const now = new DateObject()
    const {scheduleInterview, setScheduleInterviewItem} = useStore();

    return (
        <div className='flex flex-col items-center w-full max-w-xs gap-y-4'>
            <p className="text-[20px] text-[#F9A826]">{now.format("dddd DD MMMM YYYY HH:mm")}</p>
            <div className='flex flex-col w-full items-center sm:w-full shadow-lg rounded gap-y-3 p-3'>
                <div className="relative h-32 w-32 mx-auto overflow-hidden">
                    <Image
                        src="/home/2.jpg"
                        alt="mentor-avatar"
                        layout="fill"
                        objectFit="cover"
                        className="rounded-full"
                    />
                </div>
                <h6 className='text-[#F9A826] text-[14px]'>{scheduleInterview.mentorName}</h6>
                <Rating name="half-rating-read" defaultValue={2.5} precision={0.5} readOnly/>
            </div>
            {children}
        </div>
    )
}
export default Finalize
