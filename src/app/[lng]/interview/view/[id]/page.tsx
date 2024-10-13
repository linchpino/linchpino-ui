'use client'
import React, {useEffect, useState} from "react";
import Spinner from "@/components/Spinner";
import {useRouter, usePathname} from "next/navigation";
import useStore from "@/store/store";
import useFetchData from "@/utils/hooks/useFetchData";
import {BASE_URL_API} from "@/utils/system";
import moment from 'moment';
import {AxiosError} from "axios";
import {FaHourglassEnd } from "react-icons/fa6";
import {MdError} from "react-icons/md";

const JoinInterview = () => {
    const interviewIdPathname = usePathname();
    const interviewId = interviewIdPathname.split('/').pop();
    const router = useRouter();

    const [isCheck, setIsCheck] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    const {token} = useStore(state => ({
        token: state.token,
    }));

    const {
        data,
        error
    } = useFetchData(`${BASE_URL_API}interviews/${interviewId}/validity`, token, 'interviewValidity');

    useEffect(() => {
        if (error) {
            setIsCheck(false);
            if (error instanceof AxiosError) {
                const errorMessage = error.response?.data?.error || "Unknown error";
                setErrorMessage(`Unfortunately, your request encountered an error. (${errorMessage})`);
            } else {
                setErrorMessage("Unfortunately, your request encountered an error.");
            }
        } else if (data) {
            setIsCheck(false);
            if (data.verifyStatus && data.link) {
                router.push(data.link);
            }
        }
    }, [data, error, router]);

    const message = data && !data.verifyStatus ? `
    Hi there! It looks like you're a bit early for your session scheduled on <span class="font-bold text-gray-600">${moment(data.interviewDateTimeStart).format('MMMM D, YYYY [at] h:mm A')}</span>. 
    Your session is set to last <span class="font-bold text-gray-600">${moment.duration(moment(data.interviewDateTimeEnd).diff(moment(data.interviewDateTimeStart))).humanize()}</span>. 
    Feel free to explore, ask any questions, or let us know if there's anything specific you'd like to prepare for. We’ll be ready to start soon!
` : '';

    //@ts-ignore
    const MessageBox = ({message}) => (
        <div className="max-w-xl mx-auto mt-8 p-6 bg-blue-100 shadow-lg rounded-lg">
            <div className="flex items-center mb-4">
                <FaHourglassEnd className="text-blue-500 text-3xl mr-2"/>
                <h2 className="text-xl font-semibold text-gray-800">Interview Summary</h2>
            </div>
            <div className="text-left text-gray-700">
                <p dangerouslySetInnerHTML={{__html: message}} className="leading-relaxed"/>
            </div>
        </div>
    );
    //@ts-ignore
    const ErrorBox = ({errorMessage}) => (
        <div className="max-w-xl mx-auto mt-8 p-6 bg-red-100 shadow-lg rounded-lg">
            <div className="flex items-center mb-4">
                <MdError className="text-red-500 text-3xl mr-2"/>
                <h2 className="text-xl font-semibold text-red-800">Error</h2>
            </div>
            <p className="text-left text-red-700 leading-relaxed">{errorMessage}</p>
        </div>
    );

    return (
        <>
            <div className="py-16 text-center m-6">
                {errorMessage && <ErrorBox errorMessage={errorMessage}/>}
                {!errorMessage && message && <MessageBox message={message}/>}
            </div>
            {isCheck && !errorMessage && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="flex flex-col items-center justify-center">
                        <Spinner loading={isCheck}/>
                        <p className="text-[#F2A926]">Checking your request...</p>
                    </div>
                </div>
            )}
        </>
    );
}

export default JoinInterview;
