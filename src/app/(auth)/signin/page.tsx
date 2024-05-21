'use client'
import { SubmitHandler,useForm } from 'react-hook-form';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

interface SignInForm {
    email: string;
    password: string;
}

export default function SignIn() {
    const { register, handleSubmit } = useForm<SignInForm>();

    const onSubmit: SubmitHandler<SignInForm> = data => {
        console.log(data);
    };

    return (
        <>
            <Header/>
            <div className='bg-white container pb-5 lg:pb-0'>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center justify-center gap-y-8 mt-14">
                    <h1 className='text-black text-3xl'>Sign In</h1>
                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text">Email Address:</span>
                        </div>
                        <input type="text" placeholder="Your registered email address"
                               className="input input-bordered w-full max-w-xs bg-white" {...register('email')} />
                    </label>
                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text">Password:</span>
                        </div>
                        <input type="password" placeholder="********"
                               className="input input-bordered w-full max-w-xs bg-white" {...register('password')} />
                    </label>
                    <Link href='/'
                          className='btn btn-warning w-full max-w-xs bg-[#F9A826] text-white rounded-md shadow-md mt-6 py-2 px-3'>
                        Login
                    </Link>
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
        </>
    );
}
