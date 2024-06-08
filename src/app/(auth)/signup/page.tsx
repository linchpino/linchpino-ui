'use client'
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { z } from "zod";
import axios from "axios";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { ClipLoader } from 'react-spinners';
import { useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { BASE_URL_API } from "@/utils/system";
import CustomToast, { toastError, toastSuccess } from "@/components/CustomToast";

const schema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must contain at least 8 character(s)"),
    repeat_password: z.string().min(8, "Re-Password must contain at least 8 character(s)"),
}).refine((data) => data.password === data.repeat_password, {
    message: "Passwords don't match",
    path: ["repeat_password"],
});

type SignUpFields = z.infer<typeof schema>;

export default function SignUp() {
    const { register, handleSubmit, formState: { errors } } = useForm<SignUpFields>({
        resolver: zodResolver(schema)
    });
    const [isLoading, setIsLoading] = useState(false);

    const sendSignupForm = async (data: Omit<SignUpFields, 'repeat_password'> & { type: number }) => {
        setIsLoading(true);
        try {
            const response = await axios.post(`${BASE_URL_API}accounts`, data);
            toastSuccess({ message: 'Registration successful!' });
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 400 && error.response?.data?.error === "Unique email violation") {
                    toastError({ message: 'Email is already in use. Please use a different email.'});
                } else if (error.response?.status === 400 && error.response?.data?.message === "bad request") {
                    toastError({ message: 'Please enter your information correctly.'});
                } else if (error.response?.status === 500) {
                    toastError({ message: 'An error occurred. Please try again.'});
                }
            } else {
                toastError({ message: 'Registration failed. Please try again.'});
            }
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmit: SubmitHandler<SignUpFields> = async (data) => {
        const { repeat_password, ...dataToSubmit } = data;
        try {
            await sendSignupForm({ ...dataToSubmit, type: 1 });
        } catch (error) {
            console.error('Signup failed', error);
        }
    };
    return (
        <>
            <Header />
            <div className='bg-white container pb-5 lg:pb-0'>
                <div className="flex flex-col items-center justify-center gap-y-8 mt-14">
                    <h1 className='text-black text-3xl'>Sign Up</h1>
                    <form onSubmit={handleSubmit(onSubmit)} className="gap-y-5 flex flex-col justify-center">
                        <div className="flex flex-col md:flex-row flex-nowrap md:flex-wrap gap-x-2 w-full gap-y-5">
                            <label className="w-full lg:w-[20rem]">
                                <div className="label">
                                    <span className="label-text">First Name:</span>
                                </div>
                                <input {...register("firstName")} type="text" placeholder="Your first name"
                                       className="input input-bordered w-full bg-white" />
                                {errors.firstName && (
                                    <div className="text-red-500">{errors.firstName.message}</div>
                                )}
                            </label>
                            <label className="w-full lg:w-[20rem]">
                                <div className="label">
                                    <span className="label-text">Last Name:</span>
                                </div>
                                <input {...register("lastName")} type="text" placeholder="Your last name"
                                       className="input input-bordered w-full bg-white" />
                                {errors.lastName && (
                                    <div className="text-red-500">{errors.lastName.message}</div>
                                )}
                            </label>
                        </div>
                        <label className="w-full lg:w-full">
                            <div className="label">
                                <span className="label-text">Email:</span>
                            </div>
                            <input {...register("email")} type="email" placeholder="***@gmail.com"
                                   className="input input-bordered w-full bg-white" />
                            {errors.email && (
                                <div className="text-red-500">{errors.email.message}</div>
                            )}
                        </label>
                        <div className="flex flex-col md:flex-row flex-nowrap md:flex-wrap gap-x-2 w-full gap-y-5">
                            <label className="w-full lg:w-[20rem]">
                                <div className="label">
                                    <span className="label-text">Password:</span>
                                </div>
                                <input {...register("password")} type="password" placeholder="********"
                                       className="input input-bordered w-full bg-white" />
                                {errors.password && (
                                    <div className="text-red-500">{errors.password.message}</div>
                                )}
                            </label>
                            <label className="w-full lg:w-[20rem]">
                                <div className="label">
                                    <span className="label-text">Re-Password:</span>
                                </div>
                                <input {...register("repeat_password")} type="password" placeholder="********"
                                       className="input input-bordered w-full bg-white" />
                                {errors.repeat_password && (
                                    <div className="text-red-500">{errors.repeat_password.message}</div>
                                )}
                            </label>
                        </div>
                        <button type="submit"
                                className='btn btn-warning w-full max-w-xs bg-[#F9A826] text-white rounded-md shadow-md mt-6 py-2 px-3 self-center'
                                disabled={isLoading}>
                            {isLoading ? <ClipLoader size={24} color={"#fff"} /> : 'Register'}
                        </button>
                    </form>

                    <div className='flex items-center'>
                        <Link href='/signin' className='text-[#F9A826] text-sm'>
                            Login
                        </Link>
                        /
                        <Link href='/' className='text-[#F9A826] text-sm'>
                            Forgot Password
                        </Link>
                    </div>
                </div>
            </div>
            <Footer />
            <ToastContainer />
        </>
    );
}
