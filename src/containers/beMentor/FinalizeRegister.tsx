"use client"
import Image from "next/image";
import React, { FC, useState } from "react";
import useStore from "@/store/store";
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { BASE_URL_API } from "@/utils/system";
import { toastError, toastSuccess } from '@/components/CustomToast';
import {ToastContainer} from "react-toastify";

import 'react-toastify/dist/ReactToastify.css';

interface FinalizeRegisterProp {
    activeStep: number,
    setActiveStep: React.Dispatch<React.SetStateAction<number>>;
}

export interface PaymentMethodRequest {
    type: string;
    min?: string;
    max?: string;
    fixRate?: string;
}

const MAX_LENGTH = 20;
const shortenText = (text: string, maxLength: number) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

const FinalizeRegister: FC<FinalizeRegisterProp> = (props) => {
    const { activeStep, setActiveStep } = props;
    const { mentorInformation, setMentorInformation } = useStore();
    const [isLoading, setIsLoading] = useState(false);

    const submitMentorInformation = async (data: Omit<any, 'sheba'>) => {
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
            toastSuccess({ message: "Your information submitted successfully!" });
            setActiveStep(activeStep + 1);
        },
        onError: (error: any) => {
            setIsLoading(false);
            if (error.response) {
                const status = error.response.status;
                let errorMessage = "An error occurred";
                if (status === 400 || status === 401 || status === 500) {
                    errorMessage = error.response.data.error || "An unexpected error occurred.";
                }
                toastError({ message: errorMessage });
            } else {
                toastError({ message: "Network Error. Please check your internet connection." });
            }
        }
    });

    const handleConfirm = () => {
        const interviewTypeIDsPush = mentorInformation.interviewTypeIDs.map(type => type.value);
        const { interviewTypeIDs, sheba, ...rest } = mentorInformation;
        const paymentMethodRequest: Partial<PaymentMethodRequest> = {
            type: mentorInformation.paymentMethodRequest.type.value
        };

        if (mentorInformation.paymentMethodRequest.type.value === "PAY_AS_YOU_GO") {
            paymentMethodRequest.min = mentorInformation.paymentMethodRequest.min;
            paymentMethodRequest.max = mentorInformation.paymentMethodRequest.max;
        }

        if (mentorInformation.paymentMethodRequest.type.value === "FIX_PRICE") {
            paymentMethodRequest.fixRate = mentorInformation.paymentMethodRequest.fixRate;
        }

        const dataToSend = {
            ...rest,
            interviewTypeIDs: interviewTypeIDsPush,
            paymentMethodRequest,
            iban: mentorInformation.sheba
        };

        mutation.mutate(dataToSend);
    };

    return (
        <div className='flex flex-col items-center w-full max-w-xs gap-y-4'>
            <div className='flex flex-col w-full items-center sm:w-full shadow-lg rounded gap-y-3 p-3'>
                <div className="relative h-32 w-32 mx-auto ">
                    <Image
                        src="/logo-sm.svg"
                        alt="mentor-avatar"
                        layout="fill"
                        objectFit="contain"
                        className="rounded-full bg-white "
                    />
                </div>
                <h6 className='text-[#F9A826] text-[16px] font-bold'>{mentorInformation.firstName} {mentorInformation.lastName}</h6>
                {mentorInformation.interviewTypeIDs.map((type) => (
                    <h6 key={type.value}
                        className='text-[#F9A826] text-[14px]'>{shortenText(type.label, MAX_LENGTH)}</h6>
                ))}
            </div>
            <div className="flex items-center justify-between w-full max-w-xs mt-10">
                <button onClick={() => {
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
            <ToastContainer/>

        </div>
    );
};

export default FinalizeRegister;
