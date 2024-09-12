'use client'
import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {BsEyeFill, BsEyeSlashFill} from "react-icons/bs";
import PanelContentChild from "../../../../containers/panel/PanelContentChild";
import ProtectedPage from "@/app/(main)/panel/ProtectedPage";

const passwordPattern = /^(?=.*[A-Za-z\d@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

const schema = z.object({
    currentPassword: z.string().min(6, "Current password must contain at least 6 character(s)").regex(passwordPattern, "Current password must include at least one letter, one number, or one special character"),
    newPassword: z.string().min(6, "New password must contain at least 6 character(s)").regex(passwordPattern, "New password must include at least one letter, one number, or one special character"),
    repeatNewPassword: z.string().min(6, "Repeat new password must contain at least 6 character(s)").regex(passwordPattern, "Repeat new password must include at least one letter, one number, or one special character"),
}).refine((data) => data.newPassword === data.repeatNewPassword, {
    message: "Passwords don't match",
    path: ["repeatNewPassword"],
});

type FormData = z.infer<typeof schema>;

const ChangePasswrod = () => {
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
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit = (data: FormData) => {
        console.log("Form Data: ", data);
    };

    return (
        <ProtectedPage>
            <div className="mx-auto w-full">
                <div className="flex text-left">
                    <h1 className="text-md font-bold">Change Password</h1>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-6 w-full flex flex-col justify-center items-center ">
                    <label className="w-full max-w-[28rem]">
                        <div className="label">
                            <span className="label-text">Current Password:</span>
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
                                {showCurrentPassword ? <BsEyeSlashFill color="#686868"/> : <BsEyeFill color="#686868"/>}
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
                                {showRepeatNewPassword ? <BsEyeSlashFill color="#686868"/> : <BsEyeFill color="#686868"/>}
                            </button>
                        </div>
                        {errors.repeatNewPassword && (
                            <div className="text-red-500 text-sm mt-1">
                                {errors.repeatNewPassword.message}
                            </div>
                        )}
                    </label>
                    <button
                        type="submit"
                        className="btn btn-primary bg-[#F9A826] text-white border-none px-6 py-2 mt-8 hover:bg-[#e39620] w-full max-w-[28rem]"
                    >
                        Change Password
                    </button>

                </form>
            </div>
        </ProtectedPage>
    );
};

export default ChangePasswrod;
