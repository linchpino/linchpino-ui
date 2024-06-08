"use client"
import {SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from '@hookform/resolvers/zod'
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import {z} from "zod"
import axios from "axios";
import {BASE_URL_API} from "@/utils/system";
import {useMutation} from "@tanstack/react-query";

const schema = z.object({
    first_name: z.string().min(1),
    last_name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(8),
    repeat_password: z.string().min(8),
})

type SignUpFields = z.infer<typeof schema>

export default function SignUp() {
    const {register, handleSubmit, formState: {errors}} = useForm<SignUpFields>({
        resolver: zodResolver(schema)
    })
    const onSubmit: SubmitHandler<SignUpFields> = data => {
        //@ts-ignore
        data.type = 1
        //@ts-ignore
        delete data.repeat_password
        mutation.mutate(data)
    }

    const sendForm: SubmitHandler<SignUpFields> = async (data) => {
        console.log(data)
        const response = await axios.post(`${BASE_URL_API}accounts`, data)
        return response.data;
    };

    const mutation = useMutation({
        //@ts-ignore
        mutationFn: sendForm,
        onSuccess: () => {
            console.log('s')
        },
        onError: (error) => {
            console.log(error)
        }
    })


    return (
        <>
            <Header/>
            <div className='bg-white container pb-5 lg:pb-0'>
                <div className="flex flex-col items-center justify-center gap-y-8 mt-14">
                    <h1 className='text-black text-3xl'>Sign Up</h1>
                    <form onSubmit={handleSubmit(onSubmit)} className="gap-y-5 flex flex-col justify-center">
                        <div className="flex flex-col md:flex-row flex-nowrap md:flex-wrap gap-x-2 w-full gap-y-5">
                            <label className="w-full lg:w-[20rem]">
                                <div className="label">
                                    <span className="label-text">First Name:</span>
                                </div>
                                <input {...register("first_name")} type="text" placeholder="Your first name"
                                       className="input input-bordered w-full bg-white"/>
                                {errors.first_name && (
                                    <div className="text-red-500">First name is required!</div>
                                )}
                            </label>
                            <label className="w-full lg:w-[20rem]">
                                <div className="label">
                                    <span className="label-text">Last Name:</span>
                                </div>
                                <input {...register("last_name")} type="text" placeholder="Your last name"
                                       className="input input-bordered w-full bg-white"/>
                                {errors.last_name && (
                                    <div className="text-red-500">Last name is required!</div>
                                )}
                            </label>
                        </div>
                        <label className="w-full lg:w-full">
                            <div className="label">
                                <span className="label-text">Email:</span>
                            </div>
                            <input {...register("email")} type="email" placeholder="***@gmail.com"
                                   className="input input-bordered w-full bg-white"/>
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
                                       className="input input-bordered w-full bg-white"/>
                                {errors.password && (
                                    <div className="text-red-500">Password must contain at least 8 character(s)</div>
                                )}
                            </label>
                            <label className="w-full lg:w-[20rem]">
                                <div className="label">
                                    <span className="label-text">Re-Password:</span>
                                </div>
                                <input {...register("repeat_password")} type="password" placeholder="********"
                                       className="input input-bordered w-full  bg-white"/>
                                {errors.repeat_password && (
                                    <div className="text-red-500">Re-Password must contain at least 8 character(s)</div>
                                )}
                            </label>
                        </div>
                        <button type="submit"
                                className='btn btn-warning w-full max-w-xs bg-[#F9A826] text-white rounded-md shadow-md mt-6 py-2 px-3 self-center'>
                            Register
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
            <Footer/>
        </>
    );
}
