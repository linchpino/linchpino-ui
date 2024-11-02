"use client"
import React, {useState} from "react";
import MobileStepper from '@mui/material/MobileStepper';
import {SubmitHandler, useForm} from "react-hook-form";
import {empty, ValidateEmailPattern} from "@/utils/helper";
import RegisterMentor from "@/containers/beMentor/RegisterMentor";
import FinalizeRegister from "@/containers/beMentor/FinalizeRegister";
import ConfirmationMentor from "@/containers/beMentor/ConfirmationMentor";
import useStore from '../../../store/store';
import {useTranslations} from "next-intl";

type Inputs = {
    email: string
    emailRequired: string
}

const BeMentor = () => {
    const t = useTranslations()

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
            return t("BeMentor.emailStep")
        } else if (activeStep === 2) {
            return t("BeMentor.infoStep")
        } else if (activeStep === 3) {
            return t("BeMentor.finalizeStep")
        }
        return t("BeMentor.confirmationStep")

    }
    const renderCurrentStepComponent = () => {
        if (activeStep === 1) {
            return (
                <form onSubmit={handleSubmit(onSubmit)} className='w-full max-w-xs'>
                    <label className="form-control w-full ">
                        <div className="label">
                            <span className="label-text text-[#3F3D56]">{t("BeMentor.enterEmail")}</span>
                        </div>
                        <input {...register("email", {
                            required: t("Forms.emailRequired"),
                            pattern: {
                                value: ValidateEmailPattern,
                                message: t("Forms.emailInvalid")
                            }
                        })} type="text"
                               placeholder={t("Forms.emailPlaceholder")}
                               className="input input-bordered w-full  bg-white text-left"/>
                        {errors?.email && <p className='text-red-500 mt-1 text-left'>{errors.email.message}</p>}

                    </label>
                    <button disabled={empty(watch("email"))} type="submit"
                            className='btn btn-warning w-52 bg-[#F9A826] text-white rounded-md shadow-md mt-8 py-2 px-3'>
                        {t("BeMentor.nextButton")}
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
    )
}
export default BeMentor
