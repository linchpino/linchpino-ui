'use client'
import React, {FC, useEffect, useState} from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { AsyncPaginate } from "react-select-async-paginate";
import axios from "axios";
import { BASE_URL_API } from "@/utils/system";
import useStore from "../../store/store";
import { z, ZodError } from "zod";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { zodResolver } from "@hookform/resolvers/zod";
import { empty } from "@/utils/helper";

const passwordPattern = /^(?=.*[A-Za-z\d@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
const schema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    password: z.string().min(6, "Password must contain at least 6 character(s)").regex(passwordPattern, "Password must include at least one letter, one number, or one special character"),
    repeatPassword: z.string().min(6, "Re-Password must contain at least 6 character(s)").regex(passwordPattern, "Re-Password must include at least one letter, one number, or one special character"),
}).refine((data) => data.password === data.repeatPassword, {
    message: "Passwords don't match",
    path: ["repeatPassword"],
});

type Inputs = z.infer<typeof schema>;

interface Interview {
    value: number;
    label: string;
}
interface RegisterMentorProps {
    activeStep: number;
    setActiveStep: React.Dispatch<React.SetStateAction<number>>;
}

const RegisterMentor: FC<RegisterMentorProps> = ({ activeStep, setActiveStep }) => {
    const { mentorInformation, setMentorInformation } = useStore();
    const { register, handleSubmit, watch, formState: { errors } } = useForm<Inputs>({
        resolver: zodResolver(schema),
        defaultValues: {
            firstName: mentorInformation.firstName,
            lastName: mentorInformation.lastName,
            password: mentorInformation.password,
            repeatPassword: "",
        },
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);

    const toggleShowPassword = () => setShowPassword(prev => !prev);
    const toggleShowRepeatPassword = () => setShowRepeatPassword(prev => !prev);

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        setMentorInformation({
            firstName: data.firstName,
            lastName: data.lastName,
            password: data.password,
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
        const selectedInterviews = selectedOptions.map(option => ({ value: option.value, label: option.label }));
        setMentorInformation({ interviewTypeIDs: selectedInterviews });
    };

    useEffect(() => {
        if (mentorInformation.interviewTypeIDs.length) {
            // Ensure data is loaded when component mounts
            console.log("Interview Type IDs loaded:", mentorInformation.interviewTypeIDs);
        }
    }, [mentorInformation.interviewTypeIDs]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='w-full max-w-xs'>
            <label className="form-control w-full">
                <div className="label">
                    <span className="label-text text-[#3F3D56]"><span className='text-[#F9A826]'>*</span>First Name:</span>
                </div>
                <input {...register("firstName")} type="text" className="input input-bordered w-full bg-white"/>
                {errors?.firstName && <p className='text-red-500 mt-1 text-left'>{errors.firstName.message}</p>}
            </label>
            <label className="form-control w-full">
                <div className="label">
                    <span className="label-text text-[#3F3D56]"><span className='text-[#F9A826]'>*</span>Last Name:</span>
                </div>
                <input {...register("lastName")} type="text" className="input input-bordered w-full bg-white"/>
                {errors?.lastName && <p className='text-red-500 mt-1 text-left'>{errors.lastName.message}</p>}
            </label>
            <div className="flex flex-col md:flex-row flex-nowrap md:flex-wrap gap-x-2 w-full gap-y-5">
                <label className="w-full lg:w-[20rem]">
                    <div className="label">
                        <span className="label-text">Password:</span>
                    </div>
                    <div className="flex items-center justify-between relative">
                        <input {...register("password")} type={showPassword ? "text" : "password"}
                               placeholder="********"
                               className="input input-bordered w-full bg-white pr-8"/>
                        <button type="button" onClick={toggleShowPassword}
                                className="absolute right-3 flex items-center text-gray-700">
                            {showPassword ? <BsEyeSlashFill color="#686868"/> :
                                <BsEyeFill color="#686868"/>}
                        </button>
                    </div>
                    {errors.password && (
                        <div className="text-red-500 text-sm mt-1 text-left">{errors.password.message}</div>
                    )}
                </label>
                <label className="w-full lg:w-[20rem]">
                    <div className="label">
                        <span className="label-text">Re-Password:</span>
                    </div>
                    <div className="flex items-center justify-between relative">
                        <input {...register("repeatPassword")}
                               type={showRepeatPassword ? "text" : "password"} placeholder="********"
                               className="input input-bordered w-full bg-white pr-8"/>
                        <button type="button" onClick={toggleShowRepeatPassword}
                                className="absolute right-3 flex items-center text-gray-700">
                            {showRepeatPassword ? <BsEyeSlashFill color="#686868"/> :
                                <BsEyeFill color="#686868"/>}
                        </button>
                    </div>
                    {errors.repeatPassword && (
                        <div className="text-red-500 text-sm mt-1 text-left">{errors.repeatPassword.message}</div>
                    )}
                </label>
            </div>
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
                    value={mentorInformation.interviewTypeIDs.map(interview => ({ value: interview.value, label: interview.label }))}
                    //@ts-ignore
                    onChange={handleInterviewChange}
                    isMulti
                    placeholder="Interview Type"
                    //@ts-ignore
                    loadOptions={loadInterview}
                    additional={{ page: 0 }}
                />
            </label>
            <button
                type="submit"
                disabled={empty(watch('firstName')) || empty(watch('lastName')) || empty(mentorInformation.interviewTypeIDs.length) || empty(watch('password')) || empty(watch('repeatPassword'))}
                className='btn btn-warning w-52 bg-[#F9A826] text-white rounded-md shadow-md mt-8 py-2 px-3'>
                Next
            </button>
        </form>
    );
};

export default RegisterMentor;
