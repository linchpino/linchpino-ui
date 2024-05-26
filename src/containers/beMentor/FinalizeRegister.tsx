import Image from "next/image";
import React, {FC} from "react";
import {SubmitHandler} from "react-hook-form";
interface FinalizeRegisterProp {
    activeStep: number,
    setActiveStep: React.Dispatch<React.SetStateAction<number>>;
}
const FinalizeRegister: FC<FinalizeRegisterProp> = (props) =>{
    const { activeStep, setActiveStep} = props

    return (
        <div className='flex flex-col items-center w-full max-w-xs gap-y-4'>
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
                <h6 className='text-[#F9A826] text-[14px]'>data scientest</h6>
            </div>
            <div className="flex items-center justify-between w-full max-w-xs mt-10">
                <button onClick={()=>setActiveStep(activeStep - 1)}
                        className='btn btn-sm w-28 xs:w-36 border-none px-2 bg-[#3F3D56] text-[#F9A826] rounded-md shadow-md text-xs'>
                    Back
                </button>
                <button
                        className={`btn btn-sm w-28 xs:w-36 border-none px-2 bg-[#F9A826] text-[#FFFFFF] rounded-md shadow-md text-xs`}>
                    Confirm
                </button>
            </div>
        </div>
    )
}
export default FinalizeRegister
