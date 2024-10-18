import React, {useState} from "react";
import {ValidateEmailPattern} from "@/utils/helper";
import axios from "axios";
import {BASE_URL_API} from "@/utils/system";
import {toastError, toastSuccess} from "@/components/CustomToast";
import {SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import '../../../app/globals.css'
import useStore from "@/store/store";
import {ClipLoader} from "react-spinners";

const passwordPattern = /^(?=.*[A-Za-z\d@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
const schema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    detailsOfExpertise: z.string(),
    iban: z.string(),
    min: z.string(),
    max: z.string(),
    fixPrice: z.string(),
})
type UpdateFields = z.infer<typeof schema>;

interface Interview {
    value: number;
    label: string;
}

interface PaymentRequest {
    type: string | null,
    min?: string | number,
    max?: string | number,
    fixPrice?: string | number
}

interface ProfileInformationProps {
    firstName?: string;
    lastName?: string;
    email?: string;
    detailsOfExpertise?: string
    iban?: string | null,
    paymentMethodRequest?: PaymentRequest | null,
}

const ProfileInformation: React.FC<ProfileInformationProps> = ({
                                                                   firstName,
                                                                   lastName,
                                                                   email,
                                                                   detailsOfExpertise,
                                                                   iban,
                                                                   paymentMethodRequest
                                                               }) => {
    const {register, handleSubmit, formState: {errors}, setValue} = useForm<UpdateFields>({
        resolver: zodResolver(schema)
    });
    React.useEffect(() => {
        if (firstName) setValue("firstName", firstName);
        if (lastName) setValue("lastName", lastName);
        if (email) setValue("email", email);
        if (iban) setValue("iban", iban);
        if (paymentMethodRequest) { // @ts-ignore
            setValue("min", paymentMethodRequest.min);
        }
        if (paymentMethodRequest) { // @ts-ignore
            setValue("max", paymentMethodRequest.max);
        }
        if (paymentMethodRequest) { // @ts-ignore
            setValue("fixPrice", paymentMethodRequest.fixPrice);
        }
    }, [firstName, lastName, email, detailsOfExpertise, iban, paymentMethodRequest, setValue]);

    const {userRoles, token} = useStore(state => ({
        userRoles: state.userRoles,
        token: state.token,
    }));

    const isMentor = userRoles.includes("MENTOR");

    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingChanges, setIsLoadingChanges] = useState(false);

    const sendUpdateForm = async (data: {
        firstName: string;
        lastName: string;
        email: string;
        detailsOfExpertise: string;
        iban: string;
        min: string;
        max: string;
        fixPrice: string;
    }) => {
        setIsLoading(true);
        try {
            const response = await axios.put(`${BASE_URL_API}accounts/profile`, data);
            toastSuccess({message: 'Update successful!'});
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

    const onSubmit: SubmitHandler<UpdateFields> = async (data) => {
        console.log(data)
        try {
            // await sendUpdateForm(data);
        } catch (error) {
            console.error('Signup failed', error);
        }
    };

    return (
        <>
            <div className="flex text-left mt-8">
                <h1 className="text-md font-bold">Your Information</h1>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="gap-y-5 flex flex-col justify-center items-center mt-2">
                <div data-theme="light" className="grid grid-cols-1 md:grid-cols-2 gap-x-6 w-full gap-y-5">
                    <label className="w-full">
                        <div className="label">
                            <span className="label-text">First Name:</span>
                        </div>
                        <input {...register("firstName")} type="text" placeholder="Your first name"
                               className="input input-bordered w-full bg-white"/>
                        {errors.firstName && (
                            <div className="text-red-500 text-sm mt-1">{errors.firstName.message}</div>
                        )}
                    </label>
                    <label className="w-full ">
                        <div className="label">
                            <span className="label-text">Last Name:</span>
                        </div>
                        <input {...register("lastName")} type="text" placeholder="Your last name"
                               className="input input-bordered w-full bg-white"/>
                        {errors.lastName && (
                            <div className="text-red-500 text-sm mt-1">{errors.lastName.message}</div>
                        )}
                    </label>
                    <label className="w-full md:col-span-2">
                        <div className="label">
                            <span className="label-text">Email:</span>
                        </div>
                        <input disabled {...register("email", {
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
                    {isMentor &&
                        <>
                            <label className="w-full md:col-span-2">
                                <div className="label">
                                    <span className="label-text">Sheba:</span>
                                </div>
                                <input {...register("iban")} type="text" placeholder="Your sheba number"
                                       className="input input-bordered w-full bg-white"/>
                                {errors.iban && (
                                    <div className="text-red-500 text-sm mt-1">{errors.iban.message}</div>
                                )}
                            </label>
                            {paymentMethodRequest && paymentMethodRequest.type === "PAY_AS_YOU_GO" &&
                                <>
                                    <label className="w-full">
                                        <div className="label">
                                            <span className="label-text">Sheba:</span>
                                        </div>
                                        <input {...register("iban")} type="text" placeholder="Your sheba number"
                                               className="input input-bordered w-full bg-white"/>
                                        {errors.iban && (
                                            <div className="text-red-500 text-sm mt-1">{errors.iban.message}</div>
                                        )}
                                    </label>
                                    <label className="w-full">
                                        <div className="label">
                                            <span className="label-text">Sheba:</span>
                                        </div>
                                        <input {...register("iban")} type="text" placeholder="Your sheba number"
                                               className="input input-bordered w-full bg-white"/>
                                        {errors.iban && (
                                            <div className="text-red-500 text-sm mt-1">{errors.iban.message}</div>
                                        )}
                                    </label>
                                </>
                            }
                            {paymentMethodRequest && paymentMethodRequest.type === "FIX_PRICE" &&
                                <label className="w-full">
                                    <div className="label">
                                        <span className="label-text">Sheba:</span>
                                    </div>
                                    <input {...register("iban")} type="text" placeholder="Your sheba number"
                                           className="input input-bordered w-full bg-white"/>
                                    {errors.iban && (
                                        <div className="text-red-500 text-sm mt-1">{errors.iban.message}</div>
                                    )}
                                </label>
                            }

                        </>
                    }


                    <label className="w-full md:col-span-2">
                        <div className="label">
                            <span className="label-text">Bio:</span>
                        </div>
                        <textarea className="textarea textarea-bordered w-full bg-white"
                                  placeholder="Your Details ..." {...register("detailsOfExpertise")}/>

                    </label>
                </div>
                <button type='submit'
                        className='btn btn-warning w-full max-w-xs bg-[#F9A826] text-white rounded-md shadow-md mt-6 py-2 px-3'
                        disabled={isLoadingChanges}>
                    {isLoadingChanges ? <ClipLoader size={24} color={"#fff"}/> : 'Save Changes'}
                </button>
            </form>
        </>
    )
}
export default ProfileInformation
