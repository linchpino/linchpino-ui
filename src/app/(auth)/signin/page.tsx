'use client'
import {SubmitHandler, useForm} from 'react-hook-form';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import {useMutation} from "@tanstack/react-query";
import axios from "axios";
import {BASE_URL, BASE_URL_API} from "@/utils/system";
import {ToastContainer} from "react-toastify";
import {ClipLoader} from 'react-spinners';
import 'react-toastify/dist/ReactToastify.css';
import {useEffect, useRef, useState} from "react";
import {ValidateEmailPattern} from "@/utils/helper";
import useStore from "@/store/store";
import {useRouter, useSearchParams} from "next/navigation";
import {BsLinkedin} from "react-icons/bs";
import {toastError, toastSuccess, toastInfo} from "@/components/CustomToast";

interface SignInForm {
    email: string;
    password: string;
}

export default function SignIn() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const tokenFetchedRef = useRef(false);

    const [isLoadingLinkedin, setIsLoadingLinkedin] = useState(false);
    const [isFetchingToken, setIsFetchingToken] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const {register, handleSubmit, formState: {errors}} = useForm<SignInForm>();
    const {token} = useStore((state: { token: any; }) => ({
        token: state.token,
    }));
    const {setToken} = useStore((state: { setToken: any; }) => ({
        setToken: state.setToken,
    }));
    const {setUser} = useStore((state: { setUser: any }) => ({
        setUser: state.setUser,
    }));
    const {clearToken} = useStore((state: { clearToken: any }) => ({
        clearToken: state.clearToken,
    }));
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
            setToken(response.data.token);
            router.push('/panel/interviews');
            return response.data;
        } catch (error) {
            toastError({message: 'Login failed. Please check your credentials.'});
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const signinMutation = useMutation({
        mutationFn: sendSigninForm,
        onSuccess: () => {
            toastSuccess({message: 'Yes! You are logged in.'});
        },
        onError: () => {
            toastError({message: 'Login failed. Please check your credentials.'});
        }
    });

    useEffect( () => {
        const code = searchParams.get('code');
        if (code && !tokenFetchedRef.current) {
            setIsFetchingToken(true);
            setIsLoadingLinkedin(true);
            tokenFetchedRef.current = true;
            fetchAccessToken(code);
        }
    }, [searchParams]);
    const fetchAccessToken = async (code: string) => {
        toastInfo({message: 'Your authentication process with LinkedIn is in progress. Please be patient...'});
        try {
            const tokenResponse = await fetch(`/api/linkedin-token?code=${code}`);
            const tokenData = await tokenResponse.json();
            const accessToken = tokenData.access_token;
            setToken(accessToken)
            setTimeout(() => {
                fetchUserProfile(accessToken);
            }, 1000)

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
            const userProfileResponse = await axios.get(`${BASE_URL_API}accounts/profile`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });
            setUser(userProfileResponse.data);
            toastSuccess({message: 'LinkedIn authentication successful.'});
            router.push('/panel/profile');
        } catch (error) {
            //@ts-ignore
            toastError({message: error.message || 'An unexpected error occurred. Please try again.'});
        }
    };

    const linkedinLogin = () => {
        if (!isLoadingLinkedin) {
            const linkedinAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_LINKEDIN_REDIRECT_URI}&state=foobar&scope=openid%20profile%20w_member_social%20email`;
            window.location.href = linkedinAuthUrl;
        }
    };

    return (
        <>
            <Header/>
            <div className='flex flex-col items-center bg-white container pb-5 lg:pb-0'>
                <form onSubmit={handleSubmit(onSubmit)}
                      className="flex flex-col items-center justify-center gap-y-8 mt-14 w-full max-w-xs">
                    <h1 className='text-black text-3xl'>Sign In</h1>
                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text">Email Address:</span>
                        </div>
                        <input type="text" placeholder="Your registered email address"
                               className={`input input-bordered w-full max-w-xs bg-white ${errors.email ? 'input-error' : ''}`}
                               {...register('email', {
                                   required: "Email is required",
                                   pattern: {
                                       value: ValidateEmailPattern,
                                       message: "Invalid email address"
                                   }
                               })} />
                        {errors.email && <p className="text-red-500 text-xs mt-2">{errors.email.message}</p>}
                    </label>
                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text">Password:</span>
                        </div>
                        <input type="password" placeholder="********"
                               className={`input input-bordered w-full max-w-xs bg-white ${errors.password ? 'input-error' : ''}`}
                               {...register('password', {required: "Password is required"})} />
                        {errors.password && <p className="text-red-500 text-xs mt-2">{errors.password.message}</p>}
                    </label>
                    <button type='submit'
                            className='btn btn-warning w-full max-w-xs bg-[#F9A826] text-white rounded-md shadow-md mt-6 py-2 px-3'
                            disabled={isLoading}>
                        {isLoading ? <ClipLoader size={24} color={"#fff"}/> : 'Login'}
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
                <div className='flex flex-col items-center justify-center mt-8 w-full max-w-xs'>
                    <div className="divider w-full ">OR</div>
                    <button disabled={isLoadingLinkedin} onClick={linkedinLogin}
                            className="btn btn-primary w-full max-w-xs text-white">
                        <BsLinkedin/>
                        {isLoadingLinkedin ? <ClipLoader size={24} color={"#fff"}/> : 'Login Via Linkedin'}

                    </button>
                </div>
            </div>
            <Footer/>
            {isFetchingToken &&
                <div className=" fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className=" flex flex-col items-center justify-center">
                        <ClipLoader size={60} color={"#fff"}/>
                        <p className="text-white mt-4">Processing your LinkedIn authentication...</p>
                    </div>
                </div>
            }
            <ToastContainer/>
        </>
    )
}
