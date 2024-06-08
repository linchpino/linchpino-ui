'use client'
import {SubmitHandler, useForm} from 'react-hook-form';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import {useMutation} from "@tanstack/react-query";
import axios from "axios";
import {BASE_URL} from "@/utils/system";
import {Bounce, toast, ToastContainer} from "react-toastify";
import {ClipLoader} from 'react-spinners';
import 'react-toastify/dist/ReactToastify.css';
import {useState} from "react";

interface SignInForm {
    email: string;
    password: string;
}

export default function SignIn() {
    const {register, handleSubmit, formState: { errors }} = useForm<SignInForm>();
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit: SubmitHandler<SignInForm> = data => {
        signinMutation.mutate(data);
    };

    const sendSigninForm = async (data: SignInForm) => {
        setIsLoading(true);
        try {
            const response = await axios.post(
                `${BASE_URL}login`,
                {},
                {
                    auth: {
                        username: data.email,
                        password: data.password,
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error('Login failed', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const signinMutation = useMutation({
        mutationFn: sendSigninForm,
        onSuccess: () => {
            toast.success('Yes! You are logged in.', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
        },
        onError: () => {
            toast.error('Login failed. Please check your credentials.', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
        }
    });

    return (
        <>
            <Header/>
            <div className='bg-white container pb-5 lg:pb-0'>
                <form onSubmit={handleSubmit(onSubmit)}
                      className="flex flex-col items-center justify-center gap-y-8 mt-14">
                    <h1 className='text-black text-3xl'>Sign In</h1>
                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text">Email Address:</span>
                        </div>
                        <input type="text" placeholder="Your registered email address"
                               className={`input input-bordered w-full max-w-xs bg-white ${errors.email ? 'input-error' : ''}`}
                               {...register('email', { required: "Email is required" })} />
                        {errors.email && <p className="text-red-500 text-xs mt-2">{errors.email.message}</p>}
                    </label>
                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text">Password:</span>
                        </div>
                        <input type="password" placeholder="********"
                               className={`input input-bordered w-full max-w-xs bg-white ${errors.password ? 'input-error' : ''}`}
                               {...register('password', { required: "Password is required" })} />
                        {errors.password && <p className="text-red-500 text-xs mt-2">{errors.password.message}</p>}
                    </label>
                    <button type='submit'
                            className='btn btn-warning w-full max-w-xs bg-[#F9A826] text-white rounded-md shadow-md mt-6 py-2 px-3'
                            disabled={isLoading}>
                        {isLoading ? <ClipLoader size={24} color={"#fff"} /> : 'Login'}
                    </button>
                    <div className='flex items-center'>
                        <Link href='/signup' className='text-[#F9A826] text-sm'>
                            Register
                        </Link>
                        /
                        <Link href='/' className='text-[#F9A826] text-sm'>
                            Forgot Password
                        </Link>
                    </div>
                </form>
            </div>
            <Footer/>
            <ToastContainer />
        </>
    );
}
