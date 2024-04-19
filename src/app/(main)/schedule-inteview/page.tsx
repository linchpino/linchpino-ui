"use client"
import {useState} from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileStepper from '@mui/material/MobileStepper';
import Link from "next/link";
import ChooseMentor from "@/containers/scheduleInteview/ChooseMentor";
import Finalize from "@/containers/scheduleInteview/Finalize";
import {empty} from "@/helper/helper";

const ScheduleInterview = () => {
    const [activeStep, setActiveStep] = useState(1);
    const [emailInput, setEmailInput] = useState("");
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
            return <ChooseMentor/>
        } else if (activeStep === 2) {
            return <Finalize emailInput={emailInput} setEmailInput={setEmailInput}/>
        }
    }
    const checkNextButtonStatus = () => {
        return !!(activeStep === 2 && empty(emailInput));
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
                <div className="flex items-center justify-between w-full max-w-xs">
                    <button onClick={() => setActiveStep(activeStep - 1)}
                            className='btn btn-sm w-28 xs:w-36 border-none px-2 bg-[#3F3D56] text-[#F9A826] rounded-md shadow-md text-xs'>
                        Back
                    </button>
                    <button disabled={checkNextButtonStatus()} onClick={() => setActiveStep(activeStep + 1)}
                            className={`btn btn-sm w-28 xs:w-36 border-none px-2 bg-[#3F3D56] text-[#F9A826] rounded-md shadow-md text-xs`}>
                        Next
                    </button>
                </div>

            </div>
            <Footer/>
        </>
    )
}
export default ScheduleInterview
