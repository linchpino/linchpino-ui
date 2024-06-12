"use client"
import {SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from '@hookform/resolvers/zod'
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import {z} from "zod";
import {useState} from 'react';
import 'react-toastify/dist/ReactToastify.css';
import {BsEyeFill, BsEyeSlashFill} from "react-icons/bs"

const passwordPattern = /^(?=.*[A-Za-z\d@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
const schema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    password: z.string().min(6, "Password must contain at least 6 character(s)").regex(passwordPattern, "Password must include at least one letter, one number, or one special character"),
    repeat_password: z.string().min(6, "Re-Password must contain at least 6 character(s)").regex(passwordPattern, "Re-Password must include at least one letter, one number, or one special character"),
}).refine((data) => data.password === data.repeat_password, {
    message: "Passwords don't match",
    path: ["repeat_password"],
});
type JobseekerActivationFields = z.infer<typeof schema>;

export default function JobseekerActivation() {
    const {register, handleSubmit, formState: {errors}} = useForm<JobseekerActivationFields>({
        resolver: zodResolver(schema)
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);

    const toggleShowPassword = () => setShowPassword(prev => !prev);
    const toggleShowRepeatPassword = () => setShowRepeatPassword(prev => !prev);

    const onSubmit: SubmitHandler<JobseekerActivationFields> = async (data) => {
        console.log(data)
    };
    return (
        <>
            <Header/>
            <div className='bg-white container pb-5 lg:pb-0'>
                <div className="flex flex-col items-center justify-center gap-y-6 mt-14">
                    <h1 className='text-black text-3xl text-center'>Activate Your Account</h1>
                    <form onSubmit={handleSubmit(onSubmit)} className="gap-y-5 flex flex-col justify-center items-center [&>*]:w-full [&>*]:max-w-xs w-full">
                        <label >
                            <div className="label">
                                <span className="label-text">First Name:</span>
                            </div>
                            <input {...register("firstName")} type="text" placeholder="Your first name"
                                   className="input input-bordered w-full bg-white"/>
                            {errors.firstName && (
                                <div className="text-red-500 text-sm mt-1">{errors.firstName.message}</div>
                            )}
                        </label>
                        <label >
                            <div className="label">
                                <span className="label-text">Last Name:</span>
                            </div>
                            <input {...register("lastName")} type="text" placeholder="Your last name"
                                   className="input input-bordered w-full bg-white"/>
                            {errors.lastName && (
                                <div className="text-red-500 text-sm mt-1">{errors.lastName.message}</div>
                            )}
                        </label>
                        <label >
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
                        <label >
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
                        <button type="submit"
                                className='btn btn-warning w-full max-w-xs bg-[#F9A826] text-white rounded-md shadow-md mt-4 py-2 px-3 self-center'>
                            Complete
                        </button>
                    </form>
                </div>
             </div>
            <Footer/>
        </>
    );
}
