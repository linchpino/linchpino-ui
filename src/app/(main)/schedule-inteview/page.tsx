"use client"
import {useState} from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileStepper from '@mui/material/MobileStepper';
import {AsyncPaginate} from "react-select-async-paginate";
import Link from "next/link";
const ScheduleInterview = () => {
    const [activeStep, setActiveStep] = useState(1);
   const renderStepperTitle = () => {
        if (activeStep === 2) {
            return "Choose a mentor and schedule an interview"
        } else if (activeStep === 3) {
            return "Finalize the interview session"

        } else if (activeStep === 4) {
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

    return (
        <>
            <Header/>
            <div className='bg-white container text-center flex flex-col gap-y-9 items-center'>
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
                <div
                    className='flex flex-col items-center gap-y-8 w-full sm:w-2/3 md:w-1/2 lg:w-1/3'>
                    <AsyncPaginate
                        classNames={{
                            control: () =>
                                'border border-gray-300 w-full rounded-md h-[48px] mt-1 text-sm px-3 mr-2 ',
                            container: () => 'text-sm rounded w-full',
                            menu: () => 'bg-withe border py-2',
                            option: ({isSelected}) =>
                                isSelected ? "dark:bg-base-content dark:text-base-200 bg-gray-400 text-gray-50 px-4 py-2" : "px-4 py-2",
                        }}
                        value={''}
                        onChange={(e: any) => console.log(e.target.value)}
                        unstyled
                        placeholder="Field of proficiency"
                        loadOptions={loadOptions}/>
                    <AsyncPaginate
                        classNames={{
                            control: () =>
                                'border border-gray-300 w-full rounded-md h-[48px] mt-1 text-sm px-3 mr-2',
                            container: () => 'text-sm rounded w-full',
                            menu: () => 'bg-withe border py-2',
                            option: ({isSelected}) =>
                                isSelected ? "dark:bg-base-content dark:text-base-200 bg-gray-400 text-gray-50 px-4 py-2" : "px-4 py-2",
                        }}
                        value={''}
                        onChange={(e: any) => console.log(e.target.value)}
                        unstyled
                        placeholder="Dream job"
                        loadOptions={loadOptions}/>

                </div>
                <Link href='/'
                      className='btn btn-warning w-full max-w-xs bg-[#F9A826] text-white rounded-md shadow-md mt-6 py-2 px-3'>
                    Next
                </Link>

            </div>
            <Footer/>
        </>
    )
}
export default ScheduleInterview
