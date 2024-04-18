"use client"
import {useState} from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileStepper from '@mui/material/MobileStepper';
import Link from "next/link";
import ChooseMentor from "@/containers/scheduleInteview/ChooseMentor";

const ScheduleInterview = () => {
    const [activeStep, setActiveStep] = useState(1);
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
        }
    }
    return (
        <>
            <Header/>
            <div className='bg-white p-3 sm:container text-center flex flex-col gap-y-9 items-center'>
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
                                backgroundColor: '#F9A826'
                            }
                        }}
                        nextButton={
                            <div className='w-5'/>
                        }
                        backButton={
                            <div className='w-5'/>
                        }
                    />
                </div>
                {renderCurrentStepComponent()}
                <Link onClick={() => setActiveStep(1)} href='/'
                      className='btn btn-warning w-full max-w-xs bg-[#F9A826] text-white rounded-md shadow-md mt-6 py-2 px-3'>
                    Next
                </Link>

            </div>
            <Footer/>
        </>
    )
}
export default ScheduleInterview
