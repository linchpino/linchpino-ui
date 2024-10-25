'use client'
import React, {useState} from "react";
import {SubmitHandler, useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {BsEyeFill, BsEyeSlashFill} from "react-icons/bs";
import ProtectedPage from "@/app/[locale]/panel/ProtectedPage";
import {toastError, toastSuccess} from "@/components/CustomToast";
import axiosInstance from '../../../../utils/axiosInstance';
import {useMutation} from "@tanstack/react-query";
import {BASE_URL_API} from "@/utils/system";
import axios, {AxiosError} from 'axios';
import {ClipLoader} from "react-spinners";
import {empty} from "@/utils/helper";
import {useTranslations} from "next-intl";

interface ErrorResponse {
    error?: string;
}

const isAxiosError = (error: unknown): error is AxiosError<ErrorResponse> => {
    return axios.isAxiosError(error);
};



const ChangePasswrod = () => {
    const t = useTranslations()

    const passwordPattern = /^(?=.*[A-Za-z\d@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

    const schema = z.object({
        currentPassword: z.string().min(6, t("Forms.currentPasswordCharacterLength")).regex(passwordPattern, t("Forms.currentPasswordPattern")),
        newPassword: z.string().min(6, t("Forms.newPasswordCharacterLength")).regex(passwordPattern, t("Forms.newPasswordPattern")),
        repeatNewPassword: z.string().min(6, t("Forms.repeatNewPasswordCharacterLength")).regex(passwordPattern, t("Forms.repeatNewPasswordPattern")),
    }).refine((data) => data.newPassword === data.repeatNewPassword, {
        message: t("Forms.passwordMatch"),
        path: ["repeatNewPassword"],
    });
    type FormData = z.infer<typeof schema>;

    const [isLoading, setIsLoading] = useState(false);

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showRepeatNewPassword, setShowRepeatNewPassword] = useState(false);

    const toggleShowCurrentPassword = () => setShowCurrentPassword(!showCurrentPassword);
    const toggleShowNewPassword = () => setShowNewPassword(!showNewPassword);
    const toggleShowRepeatNewPassword = () => setShowRepeatNewPassword(!showRepeatNewPassword);

    const {
        register,
        handleSubmit,
        formState: {errors},
        watch
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    });


    const changePasswordMutation = useMutation({
        mutationFn: async (data: FormData) => {
            setIsLoading(true);
            try {
                const { currentPassword, newPassword } = data;
                const response = await axiosInstance.put(`${BASE_URL_API}accounts/profile/change-password`, {
                    currentPassword,
                    newPassword
                });
                return response.data;
            } finally {
                setIsLoading(false);
            }
        },
        onSuccess: () => {
            toastSuccess({ message: t("ChangePassword.changeSuccess") });
            setIsLoading(false);
        },
        onError: (error) => {
            setIsLoading(false);
            if (isAxiosError(error)) {
                const errorMessage = error.response?.data?.error || t("Errors.internalServerError");
                toastError({ message: errorMessage });
            } else {
                toastError({ message: t("Errors.internalServerError")});
            }
        }
    });

    const onSubmit: SubmitHandler<FormData> = (data) => {
        changePasswordMutation.mutate(data);
    };


    return (
        <ProtectedPage>
            <div className="mx-auto w-full">
                <div className="flex text-left">
                    <h1 className="text-md font-bold">{t("ChangePassword.title")}</h1>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}
                      className="gap-y-6 mt-6 w-full flex flex-col justify-center items-center ">
                    <label className="w-full max-w-[28rem]">
                        <div className="label">
                            <span className="label-text">{t("Forms.currentPassword")}</span>
                        </div>
                        <div className="flex items-center justify-between relative">
                            <input
                                {...register("currentPassword")}
                                type={showCurrentPassword ? "text" : "password"}
                                placeholder="********"
                                className="input input-bordered w-full bg-white pr-8"
                            />
                            <button
                                type="button"
                                onClick={toggleShowCurrentPassword}
                                className="absolute right-3 flex items-center text-gray-700"
                            >
                                {showCurrentPassword ? <BsEyeSlashFill color="#686868"/> :
                                    <BsEyeFill color="#686868"/>}
                            </button>
                        </div>
                        {errors.currentPassword && (
                            <div className="text-red-500 text-sm mt-1">
                                {errors.currentPassword.message}
                            </div>
                        )}
                    </label>

                    <label className="w-full max-w-[28rem]">
                        <div className="label">
                            <span className="label-text">{t("Forms.newPassword")}</span>
                        </div>
                        <div className="flex items-center justify-between relative">
                            <input
                                {...register("newPassword")}
                                type={showNewPassword ? "text" : "password"}
                                placeholder="********"
                                className="input input-bordered w-full bg-white pr-8"
                            />
                            <button
                                type="button"
                                onClick={toggleShowNewPassword}
                                className="absolute right-3 flex items-center text-gray-700"
                            >
                                {showNewPassword ? <BsEyeSlashFill color="#686868"/> : <BsEyeFill color="#686868"/>}
                            </button>
                        </div>
                        {errors.newPassword && (
                            <div className="text-red-500 text-sm mt-1">
                                {errors.newPassword.message}
                            </div>
                        )}
                    </label>

                    <label className="w-full max-w-[28rem]">
                        <div className="label">
                            <span className="label-text">{t("Forms.repeatNewPassword")}</span>
                        </div>
                        <div className="flex items-center justify-between relative">
                            <input
                                {...register("repeatNewPassword")}
                                type={showRepeatNewPassword ? "text" : "password"}
                                placeholder="********"
                                className="input input-bordered w-full bg-white pr-8"
                            />
                            <button
                                type="button"
                                onClick={toggleShowRepeatNewPassword}
                                className="absolute right-3 flex items-center text-gray-700"
                            >
                                {showRepeatNewPassword ? <BsEyeSlashFill color="#686868"/> :
                                    <BsEyeFill color="#686868"/>}
                            </button>
                        </div>
                        {errors.repeatNewPassword && (
                            <div className="text-red-500 text-sm mt-1">
                                {errors.repeatNewPassword.message}
                            </div>
                        )}
                    </label>
                    <button
                        disabled={isLoading || empty(watch('currentPassword'))|| empty(watch('newPassword'))|| empty(watch('repeatNewPassword'))}
                        type="submit"
                        className="btn btn-primary bg-[#F9A826] text-white border-none px-6 py-2 mt-5 hover:bg-[#e39620] w-full max-w-[28rem]"
                    >
                        {isLoading ? <ClipLoader size={24} color={"#fff"} /> : t("ChangePassword.title")}
                    </button>

                </form>
            </div>
        </ProtectedPage>
    );
};

export default ChangePasswrod;
