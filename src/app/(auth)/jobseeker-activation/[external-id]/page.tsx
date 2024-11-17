"use client"
import {SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from '@hookform/resolvers/zod'
import {z} from "zod";
import {useState} from 'react';
import {usePathname} from 'next/navigation'
import {useRouter} from 'nextjs-progressloader'
import 'react-toastify/dist/ReactToastify.css';
import {BsEyeFill, BsEyeSlashFill} from "react-icons/bs"
import axios from "axios";
import {BASE_URL_API} from "@/utils/system";
import {toastError, toastSuccess} from "@/components/CustomToast";
import {ClipLoader} from "react-spinners";
import {useTranslations} from "next-intl";


export default function JobseekerActivation() {
    const t = useTranslations()

    const passwordPattern = /^(?=.*[A-Za-z\d@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    const schema = z.object({
        firstName: z.string().min(1, t("Forms.firstNameRequired")),
        lastName: z.string().min(1, t("Forms.lastNameRequired")),
        password: z.string().min(6, t("Forms.passwordCharacterLength")).regex(passwordPattern, t("Errors.passwordPattern")),
        repeat_password: z.string().min(6, t("Forms.repeatPasswordCharacterLength")).regex(passwordPattern, t("Forms.repeatPasswordCharacterLength")),
    }).refine((data) => data.password === data.repeat_password, {
        message: t("Forms.passwordMatch"),
        path: ["repeat_password"],
    });
    type JobseekerActivationFields = z.infer<typeof schema>;


    const {register, handleSubmit, watch, formState: {errors}} = useForm<JobseekerActivationFields>({
        resolver: zodResolver(schema)
    });
    const activationPathname = usePathname()
    const router = useRouter();
    const externalId = activationPathname.split('/').pop();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);

    const toggleShowPassword = () => setShowPassword(prev => !prev);
    const toggleShowRepeatPassword = () => setShowRepeatPassword(prev => !prev);

    const sendActivateForm = async (data: Omit<JobseekerActivationFields, 'repeat_password'> & {
        externalId: string | undefined
    }) => {
        setIsLoading(true);
        try {
            const response = await axios.put(`${BASE_URL_API}accounts/jobseeker/activation`, data);
            toastSuccess({message: t("JobseekerActivation.registrationSuccessful")});
            router.push('/signin');
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 400 && error.response?.data?.error) {
                    toastError({message: error.response?.data?.error});
                } else if (error.response?.status === 500) {
                    toastError({message: t('Errors.internalServerError')});
                }
            } else {
                toastError({message: t("JobseekerActivation.registrationError")});
            }
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmit: SubmitHandler<JobseekerActivationFields> = async (data) => {
        const {repeat_password, ...dataToSubmit} = data;
        try {
            await sendActivateForm({...dataToSubmit, externalId});
        } catch (error) {
            console.error(t("JobseekerActivation.registrationError"), error);
        }
    };
    return (
        <>
            <div className='bg-white container pb-5 lg:pb-0'>
                <div className="flex flex-col items-center justify-center gap-y-6 mt-14">
                    <h1 className='text-black text-3xl text-center'>{t("JobseekerActivation.title")}</h1>
                    <form onSubmit={handleSubmit(onSubmit)}
                          className="gap-y-5 flex flex-col justify-center items-center [&>*]:w-full [&>*]:max-w-xs w-full">
                        <label>
                            <div className="label">
                                <span className="label-text">{t("Forms.firstName")}</span>
                            </div>
                            <input {...register("firstName")} type="text" placeholder={t("Forms.firstNamePlaceholder")}
                                   className="input input-bordered w-full bg-white"/>
                            {errors.firstName && (
                                <div className="text-red-500 text-sm mt-1">{errors.firstName.message}</div>
                            )}
                        </label>
                        <label>
                            <div className="label">
                                <span className="label-text">{t("Forms.lastName")}</span>
                            </div>
                            <input {...register("lastName")} type="text" placeholder={t("Forms.lastNamePlaceholder")}
                                   className="input input-bordered w-full bg-white"/>
                            {errors.lastName && (
                                <div className="text-red-500 text-sm mt-1">{errors.lastName.message}</div>
                            )}
                        </label>
                        <label>
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
                        <label>
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
                        <button type="submit"
                                className='btn btn-warning w-full max-w-xs bg-[#F9A826] text-white rounded-md shadow-md mt-4 py-2 px-3 self-center'
                                disabled={isLoading}>
                            {isLoading ?
                                <ClipLoader size={24} color={"#fff"}/> : t("JobseekerActivation.confirmButton")}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
