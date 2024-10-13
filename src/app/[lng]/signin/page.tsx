'use client'
import {SubmitHandler, useForm} from 'react-hook-form';
import {useMutation} from "@tanstack/react-query";
import axios from "axios";
import {BASE_URL, BASE_URL_API} from "@/utils/system";
import {ClipLoader} from 'react-spinners';
import {useState} from "react";
import {ValidateEmailPattern} from "@/utils/helper";
import useStore from "@/store/store";
import {useRouter} from "next/navigation";
import {toastError, toastSuccess} from "@/components/CustomToast";
import Cookies from "js-cookie";
import { useTranslation } from '../../i18n';

interface SignInForm {
    email: string;
    password: string;
}

const fetchUserInfo = async (token: string) => {
    try {
        const response = await axios.get(`${BASE_URL_API}accounts/profile`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Failed to fetch user info", error);
        throw error;
    }
};


export default async function SignIn() {
    const router = useRouter()
    const {register, handleSubmit, formState: {errors}} = useForm<SignInForm>();
    const [isLoading, setIsLoading] = useState(false);
    const {setToken, setUserInfo, userInfo, setUserRoles} = useStore(state => ({
        setToken: state.setToken,
        setUserInfo: state.setUserInfo,
        setUserRoles: state.setUserRoles,
        userInfo: state.userInfo,
    }));

    const onSubmit: SubmitHandler<SignInForm> = (data, event) => {
        if (event) {
            event.preventDefault();
        }
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
            const {token, expiresAt, userInfo} = response.data;

            if (token && expiresAt) {
                Cookies.set('token', token, {expires: new Date(expiresAt), secure: true, sameSite: 'Strict'});
                Cookies.set('expiresAt', expiresAt, {expires: new Date(expiresAt), secure: true, sameSite: 'Strict'});
            } else {
                Cookies.remove('token');
                Cookies.remove('expiresAt');
            }


            setToken(token, expiresAt);
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
        onSuccess: async (data: { token: string }) => {
            toastSuccess({message: 'Yes! You are logged in.'});
            try {
                setIsLoading(true);
                const userInfo = await fetchUserInfo(data.token);
                if (userInfo) {
                    Cookies.set('userInfo', JSON.stringify(userInfo), {expires: 7, secure: true, sameSite: 'Strict'});
                } else {
                    Cookies.remove('userInfo');
                }
                setUserInfo({
                    id: userInfo?.id || null,
                    firstName: userInfo?.firstName || null,
                    lastName: userInfo?.lastName || null,
                    email: userInfo?.email || null,
                    type: userInfo?.type || null,
                    status: userInfo?.status || null,
                    externalId: userInfo?.externalId || null,
                    avatar: userInfo?.avatar || null,
                });
                setUserRoles(userInfo.type)
                router.push('/panel/profile');

            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    const status = error.response.status;
                    const errorMessage = error.response.data?.error || 'An unknown error occurred while fetching user info.';

                    if (status === 401) {
                        toastError({message: errorMessage});
                    } else if (status === 404) {
                        toastError({message: errorMessage});
                    } else if (status === 500) {
                        toastError({message: 'Server error. Please try again later.'});
                    } else {
                        toastError({message: errorMessage});
                    }
                } else {
                    console.error('An unexpected error occurred:', error);
                    toastError({message: 'An unexpected error occurred.'});
                }
            } finally {
                setIsLoading(false);
            }
        },
        onError: (error: unknown) => {
            if (axios.isAxiosError(error) && error.response) {
                const status = error.response.status;
                const errorMessage = error.response.data?.error || 'An unknown error occurred during login.';
                if (status === 401) {
                    toastError({message: errorMessage});
                } else if (status === 404) {
                    toastError({message: errorMessage});
                } else if (status === 500) {
                    toastError({message: 'Server error during login. Please try again.'});
                } else {
                    toastError({message: errorMessage});
                }
            } else {
                toastError({message: 'An unexpected error occurred.'});
            }
            setIsLoading(false);
        }
    });
    const { t } = await useTranslation('fa')

    return (
        <>
            <div className='bg-white container pb-5 lg:pb-0'>
                <form onSubmit={handleSubmit(onSubmit)}
                      className="flex flex-col items-center justify-center gap-y-8 mt-14"
                      method="post"
                >
                    <h1 className='text-black text-3xl'>{t('title')}</h1>
                    {/*<h1 className='text-black text-3xl'>Sign In</h1>*/}
                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text">Email:</span>
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
                        <button onClick={() =>router.push('/signup')} className='text-[#F9A826] text-sm'>
                            Register
                        </button>
                        /
                        <button onClick={() => router.push('/')} className='text-[#F9A826] text-sm'>
                            Forgot Password
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
