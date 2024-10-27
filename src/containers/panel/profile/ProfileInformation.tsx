import React, {useState} from "react";
import {ValidateEmailPattern} from "@/utils/helper";
import axios from "axios";
import {BASE_URL_API} from "@/utils/system";
import {toastError, toastSuccess} from "@/components/CustomToast";
import {SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import '../../../app/globals.css'
import {useTranslations} from "next-intl";

interface ProfileInformationProps {
    firstName?: string;
    lastName?: string;
    email?: string;
    detailsOfExpertise?: string
}

const ProfileInformation: React.FC<ProfileInformationProps> = ({ firstName, lastName, email,detailsOfExpertise }) => {
    const t = useTranslations()

    const schema = z.object({
        firstName: z.string().min(1, t("Forms.firstNameRequired")),
        lastName: z.string().min(1, t("Forms.lastNameRequired")),
        email: z.string().email(t("Forms.emailInvalid")),
        detailsOfExpertise: z.string()
    })
    type SignUpFields = z.infer<typeof schema>;


    const {register, handleSubmit, formState: {errors}, setValue} = useForm<SignUpFields>({
        resolver: zodResolver(schema)
    });
    React.useEffect(() => {
        if (firstName) setValue("firstName", firstName);
        if (lastName) setValue("lastName", lastName);
        if (email) setValue("email", email);
    }, [firstName, lastName, email,detailsOfExpertise, setValue]);
    const [isLoading, setIsLoading] = useState(false);

    const sendSignupForm = async (data: Omit<SignUpFields, 'repeat_password'> & { type: number }) => {
        setIsLoading(true);
        try {
            const response = await axios.post(`${BASE_URL_API}accounts`, data);
            toastSuccess({message: t("Profile.successSave")});
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 400 && error.response?.data?.error) {
                    toastError({message: error.response?.data?.error});
                } else if (error.response?.status === 500) {
                    toastError({message: t("Errors.internalServerError")});
                }
            } else {
                toastError({message: t("Profile.failedSaveInformation")});
            }
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmit: SubmitHandler<SignUpFields> = async (data) => {
        const {...dataToSubmit} = data;
        try {
            await sendSignupForm({...dataToSubmit, type: 1});
        } catch (error) {
            console.error(t("Errors.unexpectedError"), error);
        }
    };

    return (
        <>
            <div className="flex text-left mt-8">
                <h1 className="text-md font-bold">{t("Profile.informationTitle")}</h1>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="gap-y-5 flex flex-col justify-center mt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 w-full gap-y-5">
                    <label className="w-full">
                        <div className="label">
                            <span className="label-text">{t("Forms.firstName")}</span>
                        </div>
                        <input {...register("firstName")} type="text" placeholder={t("Forms.firstNamePlaceholder")}
                               className="input input-bordered w-full bg-white"/>
                        {errors.firstName && (
                            <div className="text-red-500 text-sm mt-1">{errors.firstName.message}</div>
                        )}
                    </label>
                    <label className="w-full ">
                        <div className="label">
                            <span className="label-text">{t("Forms.lastName")}</span>
                        </div>
                        <input {...register("lastName")} type="text" placeholder={t("Forms.lastNamePlaceholder")}
                               className="input input-bordered w-full bg-white"/>
                        {errors.lastName && (
                            <div className="text-red-500 text-sm mt-1">{errors.lastName.message}</div>
                        )}
                    </label>
                    <label className="w-full md:col-span-2">
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

                    <label className="w-full md:col-span-2">
                        <div className="label">
                            <span className="label-text">{t("Forms.bio")}</span>
                        </div>
                        <textarea className="textarea textarea-bordered w-full bg-white" placeholder={t("Forms.bioPlaceholder")} {...register("detailsOfExpertise")}/>

                    </label>
                </div>
            </form>
        </>
    )
}
export default ProfileInformation
