'use client'
import React, {useState} from "react";
import {SubmitHandler, useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {BsEyeFill, BsEyeSlashFill} from "react-icons/bs";
import ProtectedPage from "@/app/(main)/panel/ProtectedPage";
import {toastError, toastSuccess} from "@/components/CustomToast";
import axiosInstance from '../../../../utils/axiosInstance';
import {useMutation} from "@tanstack/react-query";
import {BASE_URL_API} from "@/utils/system";
import axios, {AxiosError} from 'axios';
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {ClipLoader} from "react-spinners";
import {AsyncPaginate, LoadOptions} from "react-select-async-paginate";
import '../../../globals.css'
import {empty} from "@/utils/helper";

interface ErrorResponse {
    error?: string;
}

const isAxiosError = (error: unknown): error is AxiosError<ErrorResponse> => {
    return axios.isAxiosError(error);
};
const passwordPattern = /^(?=.*[A-Za-z\d@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

const schema = z.object({
    newPassword: z.string().min(6, "New password must contain at least 6 character(s)").regex(passwordPattern, "New password must include at least one letter, one number, or one special character"),
    repeatNewPassword: z.string().min(6, "Repeat new password must contain at least 6 character(s)").regex(passwordPattern, "Repeat new password must include at least one letter, one number, or one special character"),
}).refine((data) => data.newPassword === data.repeatNewPassword, {
    message: "Passwords don't match",
    path: ["repeatNewPassword"],
});

type FormData = z.infer<typeof schema>;

interface Users {
    value: number;
    label: string;
}

const ResetPassword = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedUser, setSelectedUser] = useState<Users | null>(null);

    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showRepeatNewPassword, setShowRepeatNewPassword] = useState(false);

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

    const resetPasswordMutation = useMutation({
        mutationFn: async (data: FormData) => {
            setIsLoading(true);
            try {
                const {newPassword} = data;
                const response = await axiosInstance.put(`${BASE_URL_API}admin/accounts/reset-password`, {
                    accountId: selectedUser?.value,
                    newPassword
                });
                return response.data;
            } finally {
                setIsLoading(false);
            }
        },
        onSuccess: () => {
            toastSuccess({message: 'Password changed successfully!'});
            setIsLoading(false);
        },
        onError: (error) => {
            setIsLoading(false);
            if (isAxiosError(error)) {
                const errorMessage = error.response?.data?.error || 'There was an issue, please try again.';
                toastError({message: errorMessage});
            } else {
                toastError({message: 'There was an issue, please try again.'});
            }
        }
    });
    const onSubmit: SubmitHandler<FormData> = (data) => {
        resetPasswordMutation.mutate(data);
    };

    const loadUsers = async (search: string, loadedOptions: unknown[], {page}: { page: number }) => {
        try {
            const response = await axiosInstance.get(`${BASE_URL_API}admin/accounts/search`, {
                params: {
                    page,
                    name: search,
                    size:10,
                    sort:"firstName,desc"
                },
            });
            const options:Users[] = response.data.content.map((item: any) => ({
                value: item.id,
                label: `${item.firstName} ${item.lastName} - ${item.email}`
            }));
            return {
                options,
                hasMore: !response.data.last,
                additional: {page: page + 1},
            };
        } catch (error) {
            console.error("Error loading users:", error);
            return {options: [], additional: {page: page + 1}};
        }
    };

    return (
        <ProtectedPage>
            <div className="mx-auto w-full">
                <h1 className="text-md font-bold">Reset Password</h1>
                <div className="w-full flex flex-col justify-center items-center mt-6" >
                    <label className="w-full max-w-[28rem] ">
                        <div className="label">
                            <span className="label-text">User:</span>
                        </div>
                        <AsyncPaginate
                            value={selectedUser}
                            onChange={(e) => {
                                setSelectedUser(e);
                            }}
                            placeholder="Users List"
                            //@ts-ignore
                            loadOptions={loadUsers}
                            classNames={{
                                control: () => "border border-gray-300 w-full rounded-md h-[48px] mt-1 text-sm px-3 mr-2",
                                container: () => "text-sm rounded w-full text-gray-600",
                                placeholder:()=>"text-gray-400",
                                menu: () => "bg-gray-100 rounded border py-2",
                                option: ({isSelected, isFocused}) =>
                                    isSelected
                                        ? "dark:bg-base-content dark:text-base-200 bg-gray-400 text-gray-50 px-4 py-2"
                                        : isFocused
                                            ? "bg-gray-200 px-4 py-2"
                                            : "px-4 py-2",
                            }}

                            additional={{page: 0}}
                            unstyled
                        />
                    </label>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}
                      className="gap-y-6 mt-6 w-full flex flex-col justify-center items-center ">
                    <label className="w-full max-w-[28rem]">
                        <div className="label">
                            <span className="label-text">New Password:</span>
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
                            <span className="label-text">Repeat New Password:</span>
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
                        disabled={isLoading || empty(watch('newPassword'))|| empty(watch('repeatNewPassword'))|| !selectedUser}
                        type="submit"
                        className="btn btn-primary bg-[#F9A826] text-white border-none px-6 py-2 mt-5 hover:bg-[#e39620] w-full max-w-[28rem]"
                    >
                        {isLoading ? <ClipLoader size={24} color={"#fff"}/> : 'Reset Password'}
                    </button>

                </form>
            </div>
            <ToastContainer/>
        </ProtectedPage>
    );
};

export default ResetPassword;
