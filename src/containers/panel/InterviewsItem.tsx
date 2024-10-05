import React, {FC, useRef, useState} from "react";
import moment from 'moment';
import Countdown from "../../components/Countdown";
import {FaUserAlt, FaClock, FaCalendarAlt, FaStopwatch, FaCommentDots, FaLink} from 'react-icons/fa';
import {BsEmojiAngry, BsEmojiFrown, BsEmojiHeartEyes, BsEmojiNeutral, BsEmojiSmile} from "react-icons/bs";
import {useMutation} from "@tanstack/react-query";
import axiosInstance from "@/utils/axiosInstance";
import {BASE_URL_API} from "@/utils/system";
import {toastError, toastSuccess} from "@/components/CustomToast";
import {ClipLoader} from "react-spinners";
import Cookies from "js-cookie";
import {empty} from "@/utils/helper";

interface InterviewsItemProp {
    data: any;
    isPast: boolean;
    role: string;
}

const InterviewsItem: FC<InterviewsItemProp> = (props) => {
    const userInfoFromCookie = Cookies.get('userInfo');
    const userInfo = userInfoFromCookie ? JSON.parse(userInfoFromCookie) : null;

    const [activeRate, setActiveRate] = useState(4);
    const rateData = [
        {
            id: 1,
            rate: 'very-bad',
            icon: <BsEmojiAngry size={'100%'} className={activeRate === 1 ? 'fill-[#F9A826]' : ''}/>
        },
        {id: 2, rate: 'bad', icon: <BsEmojiFrown size={'100%'} className={activeRate === 2 ? 'fill-[#F9A826]' : ''}/>},
        {
            id: 3,
            rate: 'normal',
            icon: <BsEmojiNeutral size={'100%'} className={activeRate === 3 ? 'fill-[#F9A826]' : ''}/>
        },
        {
            id: 4,
            rate: 'good',
            icon: <BsEmojiSmile size={'100%'} className={activeRate === 4 ? 'fill-[#F9A826]' : ''}/>
        },
        {
            id: 5,
            rate: 'very-good',
            icon: <BsEmojiHeartEyes size={'100%'} className={activeRate === 5 ? 'fill-[#F9A826]' : ''}/>
        },
    ];
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [goToInterviewLoading, setGoToInterviewLoading] = useState(false);

    const modalRef = useRef<HTMLDialogElement>(null);

    const calculateDuration = (fromTime: string, toTime: string) => {
        const from = moment(fromTime);
        const to = moment(toTime);
        const duration = moment.duration(to.diff(from));

        return {
            hours: Math.floor(duration.asHours()),
            minutes: duration.minutes(),
            seconds: duration.seconds(),
        };
    };
    const duration = calculateDuration(props.data.fromTime, props.data.toTime);
    const renderDuration = () => {
        const {hours, minutes, seconds} = duration;
        let durationString = '';

        if (hours > 0) {
            durationString += `${hours} hours `;
        }
        if (minutes > 0) {
            durationString += `${minutes} minutes `;
        }
        if (seconds > 0) {
            durationString += `${seconds} seconds`;
        }

        return durationString.trim();
    };

    const submitFeedback = async (feedbackData: { status: number; content: string }) => {
        const interviewId = props.data.id;
        const response = await axiosInstance.post(`${BASE_URL_API}interviews/${interviewId}/feedback`, feedbackData);
        return response.data;
    };
    const feedbackMutation = useMutation({
        mutationFn: submitFeedback,
        onSuccess: () => {
            toastSuccess({message: 'Feedback sent successfully!'});
            if (modalRef.current) {
                modalRef.current.close();
            }
            setComment("")
            setActiveRate(4)
        },
        onError: (error: any) => {
            const errorMessage = error.response?.data?.error || 'An error occurred';
            toastError({message: errorMessage});
        },
        onSettled: () => {
            setLoading(false);
        },
    });
    const handleFeedbackSubmit = () => {
        setLoading(true);
        feedbackMutation.mutate({
            status: activeRate,
            content: comment,
        });
    };
    const handleFeedbackClick = () => {
        if (modalRef.current) modalRef.current.showModal();
    };

    const handleGoToInterview = async () => {
        setGoToInterviewLoading(true);
        try {
            const response = await axiosInstance.get(`${BASE_URL_API}interviews/${props.data.id}/validity`);
            if (response.data.verifyStatus) {
                window.location.href = response.data.link;
            } else {
                toastError({message: 'Interview is not valid.'});
            }
        } catch (error) {
            toastError({message: 'An error occurred while verifying the interview.'});
        } finally {
            setGoToInterviewLoading(false);
        }
    };
    if (!props.isPast) {
        console.log(moment(props.data.fromTime).diff(moment(), 'minutes') <= 5)
        console.log(!props.isPast && moment(props.data.fromTime).diff(moment(), 'minutes') <= 5)
    }
    return (
        <div
            className='rounded-xl hover:border-t-[.1px] hover:border-[#F2A926]
             shadow-[0_4px_10px_rgba(204,204,204,0.65)]
             bg-white flex flex-col mt-3 p-6 gap-y-4 xs:gap-y-2  duration-200 transition-all ease-linear'>

            <div className="flex flex-col xs:flex-row gap-1 text-sm font-semibold items-center">
                <div className="flex items-center gap-2 text-gray-700 ">
                    <FaUserAlt className="text-[#F9A826]"/>
                    <span>{props.role === "MENTOR" ? 'Jobseeker' : 'Mentor'}:</span>
                </div>
                <span className="text-black text-center">{props.data.intervieweeName}</span>
            </div>
            <div className="flex flex-col xs:flex-row gap-1 text-sm font-semibold items-center">
                <div className="flex items-center gap-2 text-gray-700  font-medium">
                    <FaCalendarAlt className="text-[#34D399]"/>
                    {props.isPast ? (
                        <>
                            <span>From:</span>
                        </>
                    ) : (
                        <>
                            <span>Start:</span>
                        </>
                    )}
                </div>
                {props.isPast ? (
                    <>
                        <span
                            className="ml-2 text-black text-center font-semibold">{moment(props.data.fromTime).format('MMMM D, YYYY h:mm A')}</span>
                    </>
                ) : (
                    <>
                        <Countdown targetDate={props.data.fromTime} startDate={props.data.fromTime}
                                   endDate={props.data.toTime}/>
                    </>
                )}
            </div>
            <div className="flex flex-col xs:flex-row gap-1 text-sm font-semibold items-center">
                <div className="flex items-center gap-2 text-gray-700 text-sm font-medium">
                    <FaStopwatch className="text-[#F472B6]"/>
                    <span>Duration:</span>
                </div>
                <span className="ml-2 text-black text-center">{renderDuration()}</span>
            </div>
            <div className="flex flex-col xs:flex-row gap-1 text-sm font-semibold items-center">
                <div className="flex items-center gap-2 text-gray-700 text-sm font-medium">
                    <FaClock className="text-[#60A5FA]"/>
                    <span>Interview Type:</span>
                </div>
                <span className="ml-2 font-semibold text-black text-center">{props.data.interviewType}</span>

            </div>

            {props.isPast && userInfo && userInfo.type.includes("JOB_SEEKER") && (
                <button
                    onClick={handleFeedbackClick}
                    className="mt-3 w-full flex justify-center items-center border-[.1px] border-[#F2A926] text-[#F2A926] text-sm font-semibold py-2 px-4 rounded-xl shadow-lg"
                >
                    <FaCommentDots className="mr-2"/>
                    Feedback
                </button>
            )}
            {!props.isPast && moment(props.data.fromTime).diff(moment(), 'minutes') <= 5 ? (
                <button
                    onClick={handleGoToInterview}
                    className={`mt-3 w-full flex justify-center items-center border-[.1px] border-green-300 text-green-600 text-sm font-semibold py-2 px-4 rounded-xl shadow-lg`}
                    disabled={goToInterviewLoading}
                >
                    {goToInterviewLoading ? <ClipLoader size={18} color={"#fff"}/> : <><FaLink className="mr-2"/> Go to
                        Interview</>}
                </button>
            ) : null}

            <dialog ref={modalRef} id="modal"
                    className="modal">
                <div className="modal-box max-w-lg bg-white flex flex-col items-center">
                    <button
                        type='button'
                        onClick={(e) => {
                            e.preventDefault();
                            if (modalRef.current) modalRef.current.close();
                        }}
                        className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕
                    </button>
                    <h1 className='text-xl text-center text-[#000] mt-4'>Thank you for attending to the
                        interview</h1>
                    <div
                        className="flex flex-col py-6 items-center justify-center w-full border-[.6px] rounded-md mt-4 mb-10 lg:mb-0 container p-3">

                        <form onSubmit={(e) => {
                            e.preventDefault();
                            handleFeedbackSubmit();
                        }} className='flex flex-col text-center w-full max-w-xs'>
                            <span className='mt-2'>What is your feeling?</span>
                            <div className="flex mt-3 justify-between">
                                {rateData.map((item => {
                                    return (
                                        <div key={item.id} className="tooltip tooltip-bottom"
                                             data-tip={item.rate}>
                                            <button className='w-10 xs:w-12'
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setActiveRate(item.id);
                                                    }}
                                                    type="button"
                                            >
                                                {item.icon}
                                            </button>
                                        </div>
                                    )
                                }))}
                            </div>
                            <span className='mt-10'>Tell us what do you want?</span>
                            <textarea maxLength={300} value={comment}
                                      onChange={(e) => setComment(e.target.value)}
                                      className="textarea textarea-bordered bg-white mt-2 w-full max-w-sm"
                                      placeholder="Write something..."></textarea>
                            <span className="text-xs text-left ml-1 mt-1">{comment.length} / 300</span>
                            <div className="modal-action">
                                <button
                                    type="button"
                                    className="w-[48%] btn btn-sm btn-outline btn-ghost font-medium text-[.9rem] border-[.1px] hover:bg-transparent hover:border-gray-400 hover:text-gray-400"
                                    onClick={() => {
                                        if (modalRef.current) {
                                            modalRef.current.close();
                                        }
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading || empty(comment)}
                                    className='w-[48%] btn btn-sm btn-warning bg-[#F9A826] text-white rounded-md shadow-md py-2 px-3'>
                                    {loading ? <ClipLoader size={18} color={"#fff"}/> : 'Send'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </dialog>
        </div>
    )
};

export default InterviewsItem;
