import Image from "next/image";
import React, {FC, useState} from "react";
import useStore from "@/store/store";
import {useMutation, useQueryClient} from '@tanstack/react-query';
import axios from 'axios';
import {BASE_URL_API} from "@/utils/system";
import {toastError, toastSuccess} from '@/components/CustomToast';

interface FinalizeRegisterProp {
    activeStep: number,
    setActiveStep: React.Dispatch<React.SetStateAction<number>>;
}

const FinalizeRegister: FC<FinalizeRegisterProp> = (props) => {
    const {activeStep, setActiveStep} = props;
    const {mentorInformation,setMentorInformation} = useStore();
    const [isLoading, setIsLoading] = useState(false);

    const submitMentorInformation = async (data: any) => {
        const response = await axios.post(`${BASE_URL_API}accounts/mentors`, data);
        return response.data;
    };
    const mutation = useMutation({
        mutationFn: async (data: any) => {
            setIsLoading(true);
            await submitMentorInformation(data);
            setIsLoading(false);
        },
        onSuccess: () => {
            toastSuccess({message: "Your information submitted successfully!"});
            setActiveStep(activeStep + 1);
        },
        onError: (error: any) => {
            setIsLoading(false);
            if (error.response) {
                const status = error.response.status;
                const errorMessage = error.response.data.error;
                if (status === 400) {
                    toastError({message: errorMessage});
                } else if (status === 401) {
                    toastError({message: errorMessage});
                } else if (status === 500) {
                    toastError({message: errorMessage});
                } else {
                    toastError({message: errorMessage});
                }
            } else {
                toastError({message: "Network Error. Please check your internet connection."});
            }
        }
    });
    const handleConfirm = () => {
        const interviewTypeIDsPush = mentorInformation.interviewTypeIDs.map(type => type.value);
        const {interviewTypeIDs, ...rest} = mentorInformation;
        const dataToSend = {
            ...rest,
            interviewTypeIDs: interviewTypeIDsPush,
        };
        mutation.mutate(dataToSend);
    };
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
                <h6 className='text-[#F9A826] text-[14px]'>{mentorInformation.firstName} {mentorInformation.lastName}</h6>
                {mentorInformation.interviewTypeIDs.map((type) => (
                    <h6 key={type.value} className='text-[#F9A826] text-[14px]'>{type.label}</h6>
                ))}
            </div>
            <div className="flex items-center justify-between w-full max-w-xs mt-10">
                <button onClick={() => {
                    setMentorInformation({interviewTypeIDs: []});
                    setActiveStep(activeStep - 1)
                }}
                        className='btn btn-sm w-28 xs:w-36 border-none px-2 bg-[#3F3D56] text-[#F9A826] rounded-md shadow-md text-xs'>
                    Back
                </button>
                <button onClick={handleConfirm}
                        disabled={isLoading}
                        className={`btn btn-sm w-28 xs:w-36 border-none px-2 bg-[#F9A826] text-[#FFFFFF] rounded-md shadow-md text-xs`}>
                    {isLoading ? 'Loading...' : 'Confirm'}
                </button>
            </div>

        </div>
    );
};

export default FinalizeRegister;
