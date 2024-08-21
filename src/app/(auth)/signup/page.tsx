"use client"
import {SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from '@hookform/resolvers/zod'
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import {z} from "zod";
import axios from "axios";
import {ToastContainer} from "react-toastify";
import {ClipLoader} from 'react-spinners';
import {useEffect, useRef, useState} from 'react';
import 'react-toastify/dist/ReactToastify.css';
import {BASE_URL_API} from "@/utils/system";
import {toastError, toastInfo, toastSuccess} from "@/components/CustomToast";
import {BsEyeFill, BsEyeSlashFill, BsLinkedin} from "react-icons/bs"
import {ValidateEmailPattern} from "@/utils/helper";
import {useRouter, useSearchParams} from "next/navigation";
import useStore from "@/store/store";

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

export default function SignUp() {
    const {register, handleSubmit, formState: {errors}} = useForm<SignUpFields>({
        resolver: zodResolver(schema)
    });

    const router = useRouter();
    const searchParams = useSearchParams();
    const tokenFetchedRef = useRef(false);

    const [isLoadingLinkedin, setIsLoadingLinkedin] = useState(false);
    const [isFetchingToken, setIsFetchingToken] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);

    const {setToken} = useStore((state: { setToken: any; }) => ({
        setToken: state.setToken,
    }));
    const {setUser} = useStore((state: { setUser: any }) => ({
        setUser: state.setUser,
    }));

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

    useEffect(() => {
        const redirectURL = String(process.env.NEXT_PUBLIC_LINKEDIN_REDIRECT_URI_SIGNUP || '');
        const code = searchParams.get('code');
        if (code && !tokenFetchedRef.current) {
            setIsFetchingToken(true);
            setIsLoadingLinkedin(true);
            fetchAccessToken(code,redirectURL);
            tokenFetchedRef.current = true;
        }
    }, [searchParams]);

    const fetchAccessToken = async (code: string, redirectUri:string) => {
        toastInfo({message: 'Your authentication process with LinkedIn is in progress. Please be patient...'});
        try {
            const tokenResponse = await fetch(`/api/linkedin-token?code=${code}&redirect_uri=${encodeURIComponent(redirectUri)}`);
            const tokenData = await tokenResponse.json();
            const accessToken = tokenData.access_token;
            setToken(accessToken);
            await fetchUserProfile(accessToken);
        } catch (error) {
            if (error instanceof Error) {
                const message = error.message || 'LinkedIn authentication failed. Please try again.';
                toastError({message});
            } else {
                toastError({message: 'An unexpected error occurred. Please try again.'});
            }
        } finally {
            setIsFetchingToken(false);
            setIsLoadingLinkedin(false);
        }
    };
    const fetchUserProfile = async (accessToken: string) => {
        try {
            const response = await axios.get(`${BASE_URL_API}accounts/profile`, {
                headers: {Authorization: `Bearer ${accessToken}`},
            });
            setUser(response.data);
            toastSuccess({message: 'LinkedIn authentication successful.'});
            router.push('/panel/profile');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 400 && error.response?.data?.error) {
                    toastError({message: error.response.data.error});
                } else if (error.response?.status === 500) {
                    toastError({message: 'An error occurred. Please try again.'});
                } else {
                    toastError({message: 'Failed to fetch user profile. Please try again.'});
                }
            } else if (error instanceof Error) {
                toastError({message: error.message || 'An unexpected error occurred. Please try again.'});
            } else {
                toastError({message: 'An unexpected error occurred. Please try again.'});
            }
        }
    }

    const linkedinSignup = () => {
        if (!isLoadingLinkedin) {
            const linkedinAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_LINKEDIN_REDIRECT_URI_SIGNUP}&state=foobar&scope=openid%20profile%20w_member_social%20email`;
            window.location.href = linkedinAuthUrl;
        }
    };

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
                                <input {...register("firstName")} type="text" placeholder="Your first name"
                                       className="input input-bordered w-full bg-white"/>
                                {errors.firstName && (
                                    <div className="text-red-500 text-sm mt-1">{errors.firstName.message}</div>
                                )}
                            </label>
                            <label className="w-full lg:w-[20rem]">
                                <div className="label">
                                    <span className="label-text">Last Name:</span>
                                </div>
                                <input {...register("lastName")} type="text" placeholder="Your last name"
                                       className="input input-bordered w-full bg-white"/>
                                {errors.lastName && (
                                    <div className="text-red-500 text-sm mt-1">{errors.lastName.message}</div>
                                )}
                            </label>
                        </div>
                        <label className="w-full lg:w-full">
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
                        <div className="flex flex-col md:flex-row flex-nowrap md:flex-wrap gap-x-2 w-full gap-y-5">

                            <label className="w-full lg:w-[20rem]">
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
                            <label className="w-full lg:w-[20rem]">
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
                        <button type="submit"
                                className='btn btn-warning w-full max-w-xs bg-[#F9A826] text-white rounded-md shadow-md mt-6 py-2 px-3 self-center'
                                disabled={isLoading}>
                            {isLoading ? <ClipLoader size={24} color={"#fff"}/> : 'Register'}
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
                    <div className='flex flex-col items-center justify-center mt-2 w-full max-w-xs'>
                        <div className="divider w-full ">OR</div>
                        <button disabled={isLoadingLinkedin} onClick={linkedinSignup}
                                className="btn btn-primary w-full max-w-xs text-white">
                            <BsLinkedin/>
                            {isLoadingLinkedin ? <ClipLoader size={24} color={"#fff"}/> : 'Signup Via Linkedin'}

                        </button>
                    </div>
                </div>
            </div>
            {isFetchingToken &&
                <div className=" fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className=" flex flex-col items-center justify-center">
                        <ClipLoader size={60} color={"#fff"}/>
                        <p className="text-white mt-4">Processing your LinkedIn authentication...</p>
                    </div>
                </div>
            }
            <ToastContainer/>
            <Footer/>
        </>
    );
}
