"use client"
import React, {useState} from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileStepper from '@mui/material/MobileStepper';
import ChooseMentor from "@/containers/scheduleInteview/ChooseMentor";
import Finalize from "@/containers/scheduleInteview/Finalize";
import {useQuery} from "@tanstack/react-query";
import {SubmitHandler, useForm} from "react-hook-form";
import {empty} from "@/helper/helper";
import Confirmation from "@/containers/scheduleInteview/Confirmation";

type Inputs = {
    email:string
    emailRequired:string
}

const ScheduleInterview = () => {
    const [activeStep, setActiveStep] = useState(1);
    const {
        register,
        handleSubmit,
        watch,
        formState: {errors},
    } = useForm<Inputs>()
    const onSubmit: SubmitHandler<Inputs> = (data) => setActiveStep(activeStep+1)
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
    const fetchProjects = async () => {
        const res = await fetch('https://jsonplaceholder.typicode.com/posts')
        return res.json()
    }
    const { data} = useQuery({
        queryKey: ['todos'],
        queryFn: fetchProjects,
    })
    async function loadOptions() {
        const response = await fetch(`https://jsonplaceholder.typicode.com/todos/1`);
        const responseJSON = await response.json();

        return {
            options: responseJSON.results,
            hasMore: responseJSON.has_more,
        };
    }

    const renderCurrentStepComponent = () => {
        if (activeStep === 1) {
            return <ChooseMentor activeStep={activeStep} setActiveStep={setActiveStep} data={data}/>
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
                                    value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
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
                                <button disabled={empty(watch("email"))} type='submit'
                                        className={`btn btn-sm w-28 xs:w-36 border-none px-2 bg-[#F9A826] text-[#FFFFFF] rounded-md shadow-md text-xs hover:bg-[#F9A945]`}>
                                    Confirm
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
        <>
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
        </>
    )
}
export default ScheduleInterview
