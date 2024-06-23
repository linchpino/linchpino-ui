"use client"
import React, {useState,Suspense} from "react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import MobileStepper from '@mui/material/MobileStepper';
import ChooseMentor from "../../../containers/scheduleInteview/ChooseMentor";
import Finalize from "../../../containers/scheduleInteview/Finalize";
import {SubmitHandler, useForm} from "react-hook-form";
import {empty, ValidateEmailPattern} from "../../../utils/helper";
import Confirmation from "../../../containers/scheduleInteview/Confirmation";
import {Value} from "react-multi-date-picker";
import useStore from "../../../store/store";
import {useMutation} from "@tanstack/react-query";
import {Bounce, toast, ToastContainer} from "react-toastify";
import axios from "axios";
import {BASE_URL_API} from "../../../utils/system";
import {ClipLoader} from "react-spinners";

type ScheduleInterviewData = {
    interviewTypeId: number | null | string;
    jobPositionId: number | null | string;
    jobSeekerEmail: string | null;
    mentorAccountId: number | null | string;
    timeSlotId: number | null | string;
};

type Inputs = {
    email: string;
    emailRequired: string;
};

const ScheduleInterview = () => {
    const {scheduleInterview, setScheduleInterviewItem} = useStore();
    const [activeStep, setActiveStep] = useState(1);
    const [isLoadingSendForm, setIsLoadingSendForm] = useState(false);
    const [calendarValue, setCalendarValue] = useState<Value>('');
    const {
        register,
        handleSubmit,
        watch,
        formState: {errors},
    } = useForm<Inputs>()

    const sendInterviewData = async (data: ScheduleInterviewData) => {
        try {
            setIsLoadingSendForm(true)
            const response = await axios.post(`${BASE_URL_API}interviews`, data);
            return response
        } catch (error: any) {
            throw new Error('Error sending interview data: ' + error.message);
        }
    };
    const interviewMutation = useMutation( {
        mutationFn :sendInterviewData,
        onSuccess: () => {
            toast.success('Yes! You are logged in.', {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'light',
                transition: Bounce,
            });
            setActiveStep(activeStep + 1);
            setIsLoadingSendForm(false)

        },
        onError: () => {
            setIsLoadingSendForm(false)

            toast.error('Login failed. Please check your credentials.', {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'light',
                transition: Bounce,
            });
        },
    });
    const onSubmit: SubmitHandler<Inputs> = (data) =>   {
        const interviewData: ScheduleInterviewData = {
            interviewTypeId: scheduleInterview.interviewTypeId,
            jobPositionId: scheduleInterview.jobPositionId,
            jobSeekerEmail: data.email,
            mentorAccountId:scheduleInterview.mentorAccountId,
            timeSlotId: scheduleInterview.timeSlotId
        };
        setScheduleInterviewItem('jobSeekerEmail',data.email)
        interviewMutation.mutate(interviewData);

    };
    const renderStepperTitle = () => {
        if (activeStep === 1) {
            return "Choose a mentor and schedule an interview"
        } else if (activeStep === 2) {
            return "Finalize the interview session"

        } else if (activeStep === 3) {
            return "Confirmation"
        }
        return "What are you looking for?"
    }

    const renderCurrentStepComponent = () => {
        if (activeStep === 1) {
            return <ChooseMentor calendarValue={calendarValue} setCalendarValue={setCalendarValue}
                                 activeStep={activeStep} setActiveStep={setActiveStep} />
        } else if (activeStep === 2) {
            return (
                <Finalize>
                    <form onSubmit={handleSubmit(onSubmit)} className='w-full'>
                        <label className="form-control w-full " >
                            <div className="label">
                                <span className="label-text text-[#3F3D56]">Enter Your Email Address:</span>
                            </div>
                            <input {...register("email", {
                                required: "Email is required!",
                                pattern: {
                                    value: ValidateEmailPattern,
                                    message: "Please enter a valid email"
                                }
                            })} type="text"
                                   placeholder="***@gmail.com"
                                   className="input input-bordered w-full  bg-white"/>
                            {errors?.email && <p className='text-red-500 mt-1 text-left'>{errors.email.message}</p>}

                        </label>
                        {activeStep === 2 &&
                            <div className="flex items-center justify-between w-full max-w-xs mt-10">
                                <button  onClick={() => setActiveStep(activeStep - 1)}
                                         className='btn btn-sm w-28 xs:w-36 border-none px-2 bg-[#3F3D56] text-[#F9A826] rounded-md shadow-md text-xs'>
                                    Back
                                </button>
                                <button disabled={isLoadingSendForm || empty(watch("email"))} type='submit'
                                        className={`btn btn-sm w-28 xs:w-36 border-none px-2 bg-[#F9A826] text-[#FFFFFF] rounded-md shadow-md text-xs hover:bg-[#F9A945]`}>
                                    {isLoadingSendForm ? <ClipLoader size={24} color={"#fff"} /> : 'Confirm'}

                                </button>
                            </div>
                        }
                    </form>
                </Finalize>
            )
        }else if (activeStep === 3){
            return  <Confirmation/>
        }
    }

    return (
        <Suspense>
            <Header/>
            <div className='bg-white p-6 sm:container text-center flex flex-col gap-y-9 items-center'>
                <p className='text-black text-2xl mt-9'>{renderStepperTitle()}</p>
                <div className='w-full flex items-center justify-center'>
                    <MobileStepper
                        variant="progress"
                        steps={4}
                        position="static"
                        activeStep={activeStep}
                        sx={{
                            width: '100%',
                            backgroundColor: 'white',
                            '& .MuiLinearProgress-bar': {
                                backgroundColor: '#F9A826',
                                width: '100%',
                            },
                            '& .MuiLinearProgress-determinate': {
                                backgroundColor: '#FFDCBF',
                            },
                        }}
                        nextButton={
                            <div className='w-1'/>
                        }
                        backButton={
                            <div className='w-1'/>
                        }
                    />
                </div>
                {renderCurrentStepComponent()}
            </div>
            <Footer/>
            <ToastContainer/>
        </Suspense>
    )
}
export default ScheduleInterview
