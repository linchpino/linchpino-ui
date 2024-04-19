import {DateObject} from "react-multi-date-picker";
import Image from "next/image";
import Rating from "@mui/material/Rating";
import React, {FC} from "react";

interface FinalizeProp {
    emailInput: string,
    setEmailInput: React.Dispatch<React.SetStateAction<string>>;
}

const Finalize: FC<FinalizeProp> = (props) => {
    const {emailInput, setEmailInput} = props
    const now = new DateObject()
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
                <h6 className='text-[#F9A826] text-[14px]'>mentor name</h6>
                <Rating name="half-rating-read" defaultValue={2.5} precision={0.5} readOnly/>
            </div>
                <label className="form-control w-full ">
                <div className="label">
                    <span className="label-text text-[#3F3D56]">Enter Your Email Address:</span>
                </div>
                <input value={emailInput} onChange={(e) => setEmailInput(e.target.value)} type="text"
                       placeholder="***@gmail.com"
                       className="input input-bordered w-full  bg-white"/>
            </label>
        </div>
    )
}
export default Finalize
