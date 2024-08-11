"use client"
import PanelContentChild from "@/containers/panel/PanelContentChild";
import React, {useState} from "react";
import axios from "axios";
import {BASE_URL_API} from "@/utils/system";
import {toastError, toastSuccess} from "@/components/CustomToast";
import {SubmitHandler, useForm} from "react-hook-form";

import {z} from "zod";
import {ValidateEmailPattern} from "@/utils/helper";
import {BsEyeFill, BsEyeSlashFill} from "react-icons/bs";
import {zodResolver} from "@hookform/resolvers/zod";
import {AsyncPaginate} from "react-select-async-paginate";

const passwordPattern = /^(?=.*[A-Za-z\d@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
const schema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must contain at least 6 character(s)").regex(passwordPattern, "Password must include at least one letter, one number, or one special character"),
    repeat_password: z.string().min(6, "Re-Password must contain at least 6 character(s)").regex(passwordPattern, "Re-Password must include at least one letter, one number, or one special character"),
}).refine((data) => data.password === data.repeat_password, {
    message: "Passwords don't match",
    path: ["repeat_password"],
});
type SignUpFields = z.infer<typeof schema>;

interface Interview {
    value: number;
    label: string;
}

const Profile = () => {
    const timeCards = [
        {id: 1, start: "2024-08-10", duration: "30 min", repeat: "no", days: ["sun", "mon", "tue", "wed", "thu"]},
        {id: 2, start: "2024-08-11", duration: "60 min", repeat: "1 week", days: ["sun", "mon", "tue", "wed", "thu"]},
        {id: 3, start: "2024-08-13", duration: "15 min", repeat: "1 week", days: ["sun", "wed", "thu"]},
        {id: 4, start: "2024-08-14", duration: "45 min", repeat: "2 week", days: ["sun"]},
    ]
    const {register, handleSubmit, formState: {errors}} = useForm<SignUpFields>({
        resolver: zodResolver(schema)
    });
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);

    const toggleShowPassword = () => setShowPassword(prev => !prev);
    const toggleShowRepeatPassword = () => setShowRepeatPassword(prev => !prev);

    const sendSignupForm = async (data: Omit<SignUpFields, 'repeat_password'> & { type: number }) => {
        setIsLoading(true);
        try {
            const response = await axios.post(`${BASE_URL_API}accounts`, data);
            toastSuccess({message: 'Registration successful!'});
            return response.data;
        } catch (error) {
            console.log(error)
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 400 && error.response?.data?.error) {
                    toastError({message: error.response?.data?.error});
                } else if (error.response?.status === 500) {
                    toastError({message: 'An error occurred. Please try again.'});
                }
            } else {
                toastError({message: 'Registration failed. Please try again.'});
            }
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmit: SubmitHandler<SignUpFields> = async (data) => {
        const {repeat_password, ...dataToSubmit} = data;
        try {
            await sendSignupForm({...dataToSubmit, type: 1});
        } catch (error) {
            console.error('Signup failed', error);
        }
    };

    const loadInterview = async (search: string, loadedOptions: unknown[], {page}: { page: number }) => {
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
                additional: {page: page + 1},
            };
        } catch (error) {
            console.error("Error loading interviews:", error);
            return {options: [], additional: {page: page + 1}};
        }
    };

    const handleInterviewChange = (selectedOptions: Interview[]) => {
        const selectedInterviews = selectedOptions.map(option => ({value: option.value, label: option.label}));
        console.log(selectedInterviews)
    };
    console.log(isLoading)
    return (
        <PanelContentChild>
            <h4>Profile Picture</h4>
            <div className='flex flex-col md:flex-row items-center gap-x-8'>
                <div className="avatar mt-3">
                    <div className="w-36 rounded-xl">
                        <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"/>
                    </div>
                </div>
                <button
                    className={`btn btn-sm w-28 xs:w-36 border-none px-2 bg-[#F9A826] text-[#FFFFFF] rounded-md shadow-md text-xs hover:bg-[#F9A945]`}>
                    Choose Picture
                </button>
                <button
                    className={`btn btn-outline btn-error btn-sm w-28 xs:w-36 px-2 rounded-md shadow-md text-xs hover:bg-[#F9A945]`}>
                    Remove Picture
                </button>
            </div>
            <h4 className='mt-8'>Your Information</h4>
            <form onSubmit={handleSubmit(onSubmit)} className="gap-y-5 flex flex-col justify-center mt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 w-full gap-y-5">
                    <label className="w-full">
                        <div className="label">
                            <span className="label-text">First Name:</span>
                        </div>
                        <input {...register("firstName")} type="text" placeholder="Your first name"
                               className="input input-bordered w-full bg-white"/>
                        {errors.firstName && (
                            <div className="text-red-500 text-sm mt-1">{errors.firstName.message}</div>
                        )}
                    </label>
                    <label className="w-full">
                        <div className="label">
                            <span className="label-text">Last Name:</span>
                        </div>
                        <input {...register("lastName")} type="text" placeholder="Your last name"
                               className="input input-bordered w-full bg-white"/>
                        {errors.lastName && (
                            <div className="text-red-500 text-sm mt-1">{errors.lastName.message}</div>
                        )}
                    </label>
                    <label className="w-full">
                        <div className="label">
                            <span className="label-text">Email:</span>
                        </div>
                        <input {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: ValidateEmailPattern,
                                message: "Invalid email address"
                            }
                        })} type="email" placeholder="***@gmail.com"
                               className="input input-bordered w-full bg-white"/>
                        {errors.email && (
                            <div className="text-red-500 text-sm mt-1">{errors.email.message}</div>
                        )}
                    </label>
                    <label className="w-full">
                        <div className="label">
                            <span className="label-text">Field of expertise:</span>
                        </div>
                        <AsyncPaginate
                            classNames={{
                                control: () => " w-full min-h-[48px] text-sm px-2 mr-2 py-1",
                                container: () => "text-sm w-full text-[#000000] text-left",
                                menu: () => "bg-gray-100 rounded border py-2",
                                option: ({isSelected, isFocused}) => isSelected
                                    ? " dark:bg-base-content dark:text-base-200 bg-gray-400 text-gray-50 px-4 py-2"
                                    : isFocused
                                        ? "bg-gray-200 px-4 py-2"
                                        : "px-4 py-2",
                                multiValue: () => "bg-[#F9A82699] rounded-lg border p-1 mx-1 truncate my-1 max-w-40",
                            }}
                            value={""}
                            //@ts-ignore
                            onChange={handleInterviewChange}
                            isMulti
                            placeholder="Interview Type"
                            //@ts-ignore
                            loadOptions={loadInterview}
                            additional={{page: 0}}
                        />
                    </label>
                    <label className="w-full">
                        <div className="label">
                            <span className="label-text">Password:</span>
                        </div>
                        <div className="flex items-center justify-between relative">
                            <input {...register("password")} type={showPassword ? "text" : "password"}
                                   placeholder="********"
                                   className="input input-bordered w-full bg-white pr-8 "/>
                            <button type="button" onClick={toggleShowPassword}
                                    className="absolute right-3 flex items-center text-gray-700">
                                {showPassword ? <BsEyeSlashFill color="#686868"/> :
                                    <BsEyeFill color="#686868"/>}
                            </button>
                        </div>
                        {errors.password && (
                            <div className="text-red-500 text-sm mt-1">{errors.password.message}</div>
                        )}
                    </label>
                    <label className="w-full">
                        <div className="label">
                            <span className="label-text">Re-Password:</span>
                        </div>
                        <div className="flex items-center justify-between relative">
                            <input {...register("repeat_password")}
                                   type={showRepeatPassword ? "text" : "password"} placeholder="********"
                                   className="input input-bordered w-full bg-white pr-8"/>
                            <button type="button" onClick={toggleShowRepeatPassword}
                                    className="absolute right-3 flex items-center text-gray-700">
                                {showRepeatPassword ? <BsEyeSlashFill color="#686868"/> :
                                    <BsEyeFill color="#686868"/>}
                            </button>
                        </div>
                        {errors.repeat_password && (
                            <div
                                className="text-red-500 text-sm mt-1">{errors.repeat_password.message}</div>
                        )}
                    </label>
                </div>
            </form>
            <div className='flex gap-x-2 mt-8'>
                <h4>Time Slot</h4>
                <span
                    className='bg-amber-400 flex items-center justify-center text-[22px] text-white w-6 h-6 rounded-full'>+</span>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 mt-4'>
                {timeCards.map(item => {
                    return (
                        <div key={item.id} className="relative bg-white rounded-lg card shadow-xl">
                            <div
                                className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 via-pink-500 to-[#F9A826] rounded-t-lg"></div>
                            <div className="card-body px-4 py-6 flex flex-col">
                                <div className={`flex ${item.repeat ==='no' ? 'flex-col':'flex-row'} ${item.repeat ==='no' && 'gap-y-3'} w-full justify-between items-center`}>
                                    <span>Start: {item.start}</span>
                                    <span>Duration: {item.duration}</span>
                                </div>
                                {item.repeat !== 'no' &&
                                    <div className='flex justify-between items-center mt-2 gap-x-2'>
                                        <span className='text-sm'>Repeat <span
                                            className='text-[1rem] text-gray-700'>{item.repeat}</span> in </span>
                                        <div className='flex gap-x-2 justify-start items-center w-[15rem]'>
                                            {item.days.map(daysItem => {
                                                return (
                                                    <div
                                                        key={daysItem}
                                                        className='flex items-center justify-center text-sm text-white w-8 h-8 rounded-full bg-[#F9A826]'>
                                                        {daysItem}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    )
                })}
            </div>

        </PanelContentChild>
    );
};

export default Profile;
