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
import {useEffect, useState} from "react";
import {ValidateEmailPattern} from "@/utils/helper";
import useStore from "@/store/store";
import {useRouter, useSearchParams} from "next/navigation";
import {BsLinkedin} from "react-icons/bs";

interface SignInForm {
    email: string;
    password: string;
}

export default function SignIn() {
    const router = useRouter()
    const searchParams = useSearchParams();

    const {register, handleSubmit, formState: {errors}} = useForm<SignInForm>();
    const [isLoading, setIsLoading] = useState(false);
    const {setToken} = useStore(state => ({
        setToken: state.setToken,
    }));
    const [isLoadingLinkedin, setIsLoadingLinkedin] = useState(false);

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
            setToken(response.data.token)
            router.push('/panel/interviews')
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
    // const linkedinLogin = () => {
    //     setIsLoadingLinkedin(true)
    //     const clientId ="77ealfulm14qfu";
    //     const redirectUri = 'http://localhost:3000/signin';
    //     const linkedinAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=foobar&scope=openid%20profile%20w_member_social%20email`;
    //     window.location.href = linkedinAuthUrl;
    //     setTimeout(()=>{
    //         setIsLoadingLinkedin(false)
    //     },2500)
    // };
    useEffect(() => {
        const code = searchParams.get('code');

        if (code) {
            setIsLoadingLinkedin(true);
            fetchAccessToken(code);
        }
    }, [searchParams]);

    const fetchAccessToken = async (code: string) => {
        try {
            const response = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', null, {
                params: {
                    grant_type: 'authorization_code',
                    code: code,
                    redirect_uri:"https://ui-dev.linchpino.com/signin",
                    client_id: "77ealfulm14qfu",
                    client_secret: "WPL_AP1.FflBvLK8JH8AQuDf.qdttHQ==",
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
                    'mode': 'no-cors'
                },
            });
            console.log('Access Token:', response.data.access_token);
        } catch (error) {
            console.error('Failed to get access token', error);
            toast.error('LinkedIn login failed!', {
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
        } finally {
            setIsLoadingLinkedin(false);
        }
    };
    // const fetchAccessToken = async (code: string) => {
    //     try {
    //         const response = await axios.get('/api/linkedin-token', {
    //             params: { code },
    //         });
    //         console.log('Access Token:', response.data.access_token);
    //     } catch (error) {
    //         console.error('Failed to get access token', error);
    //         toast.error('LinkedIn login failed!', {
    //             position: "top-right",
    //             autoClose: 5000,
    //             hideProgressBar: false,
    //             closeOnClick: true,
    //             pauseOnHover: true,
    //             draggable: true,
    //             progress: undefined,
    //             theme: "light",
    //             transition: Bounce,
    //         });
    //     }
    // };
    const linkedinLogin = () => {
        const linkedinAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=77ealfulm14qfu&redirect_uri=http://localhost:3000/signin&state=foobar&scope=openid%20profile%20w_member_social%20email`;
        window.location.href = linkedinAuthUrl;
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
                <div className='flex flex-col items-center justify-center mt-8 w-full max-w-xs'>
                    <div className="divider w-full ">OR</div>
                    <button disabled={isLoadingLinkedin} onClick={linkedinLogin} className="btn btn-primary w-full max-w-xs text-white">
                        <BsLinkedin/>
                        {isLoadingLinkedin ? <ClipLoader size={24} color={"#fff"}/> : 'Login Via Linkedin'}

                    </button>
                </div>
            </div>
            <Footer/>
            <ToastContainer />
        </>
    );
}
