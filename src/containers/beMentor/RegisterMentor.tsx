"use client";
import { empty } from "@/utils/helper";
import React, { FC } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { AsyncPaginate } from "react-select-async-paginate";
import axios from "axios";
import { BASE_URL_API } from "@/utils/system";
import useStore from "../../store/store";

type Inputs = {
    firstName: string;
    lastName: string;
    firstNameRequired: string;
    lastNameRequired: string;
};

interface Interview {
    value: number;
    label: string;
}

interface RegisterMentorProp {
    activeStep: number;
    setActiveStep: React.Dispatch<React.SetStateAction<number>>;
}

const RegisterMentor: FC<RegisterMentorProp> = (props) => {
    const { activeStep, setActiveStep } = props;
    const { mentorInformation, setMentorInformation } = useStore();
    const { register, handleSubmit, watch, formState: { errors } } = useForm<Inputs>();

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        setMentorInformation({
            firstName: data.firstName,
            lastName: data.lastName,
        });
        setActiveStep(activeStep + 1);
    };
    const loadInterview = async (search: string, loadedOptions: unknown[], { page }: { page: number }) => {
        try {
            const response = await axios.get(`${BASE_URL_API}interviewtypes/search`, {
                params: {
                    page,
                    name: search,
                },
            });
            const options = response.data.content.map((item: any) => ({
                value: item.id,
                label: item.title,
            }));
            return {
                options,
                hasMore: !response.data.last,
                additional: { page: page + 1 },
            };
        } catch (error) {
            console.error("Error loading interviews:", error);
            return { options: [], additional: { page: page + 1 } };
        }
    };

    const handleInterviewChange = (selectedOptions: Interview[]) => {
        const selectedInterviews = selectedOptions.map(option => ({ id: option.value, title: option.label }));
        setMentorInformation({ interviewTypes: selectedInterviews });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='w-full max-w-xs'>
            <label className="form-control w-full">
                <div className="label">
                    <span className="label-text text-[#3F3D56]"><span className='text-[#F9A826]'>*</span>First Name:</span>
                </div>
                <input {...register("firstName")} type="text" className="input input-bordered w-full bg-white" />
                {errors?.firstName && <p className='text-red-500 mt-1 text-left'>{errors.firstName.message}</p>}
            </label>
            <label className="form-control w-full">
                <div className="label">
                    <span className="label-text text-[#3F3D56]"><span className='text-[#F9A826]'>*</span>Last Name:</span>
                </div>
                <input {...register("lastName")} type="text" className="input input-bordered w-full bg-white" />
                {errors?.lastName && <p className='text-red-500 mt-1 text-left'>{errors.lastName.message}</p>}
            </label>
            <label className="form-control w-full">
                <div className="label">
                    <span className="label-text text-[#3F3D56]"><span className='text-[#F9A826]'>*</span>Field of expertise:</span>
                </div>
                <AsyncPaginate
                    classNames={{
                        control: () => "border border-gray-300 w-full rounded-md min-h-[48px] mt-1 text-sm px-3 mr-2 py-2",
                        container: () => "text-sm rounded w-full text-[#000000] text-left",
                        menu: () => "bg-gray-100 rounded border py-2",
                        option: ({ isSelected, isFocused }) => isSelected
                            ? "dark:bg-base-content dark:text-base-200 bg-gray-400 text-gray-50 px-4 py-2"
                            : isFocused
                                ? "bg-gray-200 px-4 py-2"
                                : "px-4 py-2",
                        multiValue: () => "bg-[#F9A82699] rounded border p-1 mx-1 truncate my-1 max-w-40",
                    }}
                    //@ts-ignore
                    value={mentorInformation.interviewTypes.map(interview => ({ value: interview.id, label: interview.title }))}
                    //@ts-ignore
                    onChange={handleInterviewChange}
                    isMulti
                    placeholder="Interview Type"
                    //@ts-ignore
                    loadOptions={loadInterview}
                    additional={{ page: 0 }}
                />
            </label>
            <button disabled={empty(watch("firstName")) || empty(watch("lastName")) || empty(mentorInformation.interviewTypes)}
                    type="submit"
                    className='btn btn-warning w-52 bg-[#F9A826] text-white rounded-md shadow-md mt-8 py-2 px-3'>
                Next
            </button>
        </form>
    );
};

export default RegisterMentor;
