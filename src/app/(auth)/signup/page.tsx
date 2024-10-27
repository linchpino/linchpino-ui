"use client"
import {SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from '@hookform/resolvers/zod'
import Link from "next/link";
import {z} from "zod";
import axios from "axios";
import {ClipLoader} from 'react-spinners';
import {useState} from 'react';
import {BASE_URL_API} from "@/utils/system";
import {toastError, toastSuccess} from "@/components/CustomToast";
import {BsEyeFill, BsEyeSlashFill} from "react-icons/bs"
import {ValidateEmailPattern} from "@/utils/helper";
import {useTranslations} from "next-intl";

export default function SignUp() {
    const t = useTranslations()
    const passwordPattern = /^(?=.*[A-Za-z\d@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    const schema = z.object({
        firstName: z.string().min(1, t("Forms.firstNameRequired")),
        lastName: z.string().min(1, t("Forms.lastNameRequired")),
        email: z.string().email(t("Forms.emailRequired")),
        password: z.string().min(6, t("Forms.passwordCharacterLength")).regex(passwordPattern, t("Errors.passwordPattern")),
        repeat_password: z.string().min(6, t("Forms.repeatPasswordCharacterLength")).regex(passwordPattern, t("Forms.repeatPasswordCharacterLength")),
    }).refine((data) => data.password === data.repeat_password, {
        message: t("Forms.passwordMatch"),
        path: ["repeat_password"],
    });
    type SignUpFields = z.infer<typeof schema>;


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
                    toastError({message: t("Errors.internalServerError")});
                }
            } else {
                toastError({message: t("SignUp.success")});
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
            console.error(t("SignUp.error"), error);
        }
    };
    return (
            <div className='bg-white container pb-5 lg:pb-0'>
                <div className="flex flex-col items-center justify-center gap-y-8 mt-14">
                    <h1 className='text-black text-3xl'>{t("SignUp.title")}</h1>
                    <form onSubmit={handleSubmit(onSubmit)} className="gap-y-5 flex flex-col justify-center">
                        <div className="flex flex-col md:flex-row flex-nowrap md:flex-wrap gap-x-2 w-full gap-y-5">
                            <label className="w-full lg:w-[20rem]">
                                <div className="label">
                                    <span className="label-text">{t("Forms.firstName")}</span>
                                </div>
                                <input {...register("firstName")} type="text" placeholder={t("Forms.firstNamePlaceholder")}
                                       className="input input-bordered w-full bg-white"/>
                                {errors.firstName && (
                                    <div className="text-red-500 text-sm mt-1">{errors.firstName.message}</div>
                                )}
                            </label>
                            <label className="w-full lg:w-[20rem]">
                                <div className="label">
                                    <span className="label-text">{t("Forms.lastName")}</span>
                                </div>
                                <input {...register("lastName")} type="text" placeholder={t("Forms.lastNamePlaceholder")}
                                       className="input input-bordered w-full bg-white"/>
                                {errors.lastName && (
                                    <div className="text-red-500 text-sm mt-1">{errors.lastName.message}</div>
                                )}
                            </label>
                        </div>
                        <label className="w-full lg:w-full">
                            <div className="label">
                                <span className="label-text">{t("Forms.email")}</span>
                            </div>
                            <input {...register("email", {
                                required: t("Forms.emailRequired"),
                                pattern: {
                                    value: ValidateEmailPattern,
                                    message: t("Forms.emailInvalid")
                                }
                            })} type="email" placeholder={t("Forms.emailPlaceholder")}
                                   className="input input-bordered w-full bg-white"/>
                            {errors.email && (
                                <div className="text-red-500 text-sm mt-1">{errors.email.message}</div>
                            )}
                        </label>
                        <div className="flex flex-col md:flex-row flex-nowrap md:flex-wrap gap-x-2 w-full gap-y-5">

                            <label className="w-full lg:w-[20rem]">
                                <div className="label">
                                    <span className="label-text">{t("Forms.password")}</span>
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
                                    <span className="label-text">{t("Forms.repeatPassword")}</span>
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
                            {isLoading ? <ClipLoader size={24} color={"#fff"}/> : t("SignUp.register")}
                        </button>
                    </form>

                    <div className='flex items-center'>
                        <Link href='/signin' className='text-[#F9A826] text-sm'>
                            {t("SignUp.signIn")}
                        </Link>
                        /
                        <Link href='/public' className='text-[#F9A826] text-sm'>
                            {t("SignUp.forgetPassword")}
                        </Link>
                    </div>
                </div>
            </div>
    );
}
