'use client'
import Header from "../../../../../components/Header";
import React, { useEffect, useState } from "react";
import Footer from "../../../../../components/Footer";
import Spinner from "@/components/Spinner";
import { useRouter, usePathname } from "next/navigation";
import useStore from "@/store/store";
import useFetchData from "@/utils/hooks/useFetchData";
import { BASE_URL_API } from "@/utils/system";
import moment from 'moment';
import { AxiosError } from "axios";

const JoinInterview = () => {
    const interviewIdPathname = usePathname();
    const interviewId = interviewIdPathname.split('/').pop();
    const router = useRouter();

    const [isCheck, setIsCheck] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    const { token } = useStore(state => ({
        token: state.token,
    }));

    const { data, isLoading, error } = useFetchData(`${BASE_URL_API}interviews/${interviewId}/validity`, token, 'interviewValidity');

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

    const message = data && !data.verifyStatus ?
        `Hi again ;)
        Your interview started on <span class="font-bold text-gray-600">${moment(data.interviewDateTimeStart).format('MMMM D, YYYY [at] h:mm A')}</span> 
        and lasted for <span class="font-bold text-gray-600">${moment.duration(moment(data.interviewDateTimeEnd).diff(moment(data.interviewDateTimeStart))).humanize()}</span>.
        It ended at <span class="font-bold text-gray-600">${moment(data.interviewDateTimeEnd).format('MMMM D, YYYY [at] h:mm A')}</span>.`
        : '';

    return (
        <>
            <Header />
            <div className="py-16 text-center m-6">
                {isCheck && !errorMessage && (
                    <p className="mt-4 text-[#F2A926]">Checking your request...</p>
                )}
                {errorMessage && (
                    <p className="mt-4 text-red-500">{errorMessage}</p>
                )}
                {!errorMessage && message && (
                    <p className="whitespace-pre-line" dangerouslySetInnerHTML={{ __html: message }}></p>
                )}
            </div>
            {isCheck && !errorMessage && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="flex flex-col items-center justify-center ">
                        <Spinner loading={isCheck} />
                        <p className="text-[#F2A926]">Checking your request...</p>
                    </div>
                </div>
            )}
            <Footer />
        </>
    );
}

export default JoinInterview;
