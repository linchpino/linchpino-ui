"use client"
import React, {useState} from "react";
import MobileStepper from '@mui/material/MobileStepper';
import {SubmitHandler, useForm} from "react-hook-form";
import {empty, ValidateEmailPattern} from "@/utils/helper";
import RegisterMentor from "@/containers/beMentor/RegisterMentor";
import FinalizeRegister from "@/containers/beMentor/FinalizeRegister";
import ConfirmationMentor from "@/containers/beMentor/ConfirmationMentor";
import useStore from '../../../store/store';

type Inputs = {
    email: string
    emailRequired: string
}

const BeMentor = () => {
    const [activeStep, setActiveStep] = useState(1);
    const {setMentorInformation} = useStore();
    const {
        register,
        handleSubmit,
        watch,
        formState: {errors},
    } = useForm<Inputs>()
    const onSubmit: SubmitHandler<Inputs> = (data) => {
        setMentorInformation(data);
        setActiveStep(activeStep + 1)
    }
    const renderStepperTitle = () => {
        if (activeStep === 1) {
            return "Sign Up"
        } else if (activeStep === 2) {
            return "Register yourself as a mentor"
        } else if (activeStep === 3) {
            return "Finalize your registration"
        }
        return "Confirmation"

    }
    const renderCurrentStepComponent = () => {
        if (activeStep === 1) {
            return (
                <form onSubmit={handleSubmit(onSubmit)} className='w-full max-w-xs'>
                    <label className="form-control w-full ">
                        <div className="label">
                            <span className="label-text text-[#3F3D56]">Enter Your Email Address:</span>
                        </div>
                        <input {...register("email", {
                            required: "Email is required!",
                            pattern: {
                                value: ValidateEmailPattern,
                                message: "Invalid email address"
                            }
                        })} type="text"
                               placeholder="***@gmail.com"
                               className="input input-bordered w-full  bg-white"/>
                        {errors?.email && <p className='text-red-500 mt-1 text-left'>{errors.email.message}</p>}

                    </label>
                    <button disabled={empty(watch("email"))} type="submit"
                            className='btn btn-warning w-52 bg-[#F9A826] text-white rounded-md shadow-md mt-8 py-2 px-3'>
                        Next
                    </button>
                </form>
            )
        } else if (activeStep === 2) {
            return <RegisterMentor activeStep={activeStep} setActiveStep={setActiveStep}/>
        } else if (activeStep === 3) {
            return <FinalizeRegister activeStep={activeStep} setActiveStep={setActiveStep}/>
        } else if (activeStep === 4) {
            return <ConfirmationMentor/>
        }
    }
    return (
        <>
            <div className='bg-white p-6 sm:container text-center flex flex-col gap-y-9 items-center'>
                <p className='text-black text-2xl mt-9'>{renderStepperTitle()}</p>
                <div className='w-full flex items-center justify-center'>
                    <MobileStepper
                        variant="progress"
                        steps={5}
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
        </>
    )
}
export default BeMentor
