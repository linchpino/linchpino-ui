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
import Select from "react-select";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from "@/utils/axiosInstance";


const schema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    detailsOfExpertise: z.string(),
    iban: z.string(),
    // iban: z.string().regex(ibanPattern, "Invalid iban format"),
    paymentMethodRequest: z.object({
        minPayment: z.string().optional(),
        maxPayment: z.string().optional(),
        fixRate: z.string().optional(),
        type: z.string().optional(),
    }).optional()
})
type UpdateFields = z.infer<typeof schema>;

export interface PaymentMethodRequest {
    type: string | null,
    minPayment?: string | number;
    maxPayment?: string | number;
    fixRate?: string | number
}

interface ProfileInformationProps {
    firstName?: string;
    lastName?: string;
    email?: string;
    detailsOfExpertise?: string
    iban?: string | null,
    paymentMethodRequest?: PaymentMethodRequest | null,
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
    const paymentOptions = [
        {value: "PAY_AS_YOU_GO", label: "Pay As You Go"},
        {value: "FIX_PRICE", label: "Fix Price"},
        {value: "FREE", label: "Free"},
    ]
    const [paymentMethod, setPaymentMethod] = useState(paymentOptions[2]);

    React.useEffect(() => {
        if (firstName) setValue("firstName", firstName);
        if (lastName) setValue("lastName", lastName);
        if (detailsOfExpertise) setValue("detailsOfExpertise", detailsOfExpertise);
        if (email) setValue("email", email);
        if (iban) {
            const fixIban = iban.slice(2, iban.length)
            setValue("iban", fixIban);
        }
        if (paymentMethodRequest) {
            const matchedPaymentOption = paymentOptions.find(option => option.value === paymentMethodRequest.type);
            if (matchedPaymentOption) {
                setPaymentMethod(matchedPaymentOption);
            }
            if (paymentMethodRequest.type === "PAY_AS_YOU_GO") {
                setValue("paymentMethodRequest.minPayment", paymentMethodRequest?.minPayment + "");
                setValue("paymentMethodRequest.maxPayment", paymentMethodRequest?.maxPayment + "");
            }
            if (paymentMethodRequest.type === "FIX_PRICE") {
                setValue("paymentMethodRequest.fixRate", paymentMethodRequest?.fixRate + "");
            }
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
        paymentMethodRequest: PaymentMethodRequest
    }) => {
        setIsLoadingChanges(true);
        try {
            const response = await axiosInstance.put(`${BASE_URL_API}accounts/profile`, data);
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
            setIsLoadingChanges(false);
        }
    };

    const onSubmit: SubmitHandler<UpdateFields> = async (data) => {
        data.iban = `IR${data.iban}`
        data.paymentMethodRequest = {
            ...data.paymentMethodRequest,
            type: paymentMethod?.value
        };
        // if (validateNumericIBAN(data.iban)) {
        //     toastError({message: "IBAN is not valid"})
        //     return
        // }
        if (paymentMethod?.value === "FREE") {
            delete data.paymentMethodRequest?.minPayment;
            delete data.paymentMethodRequest?.maxPayment;
            delete data.paymentMethodRequest?.fixRate;
        } else if (paymentMethod?.value === "PAY_AS_YOU_GO") {
            delete data.paymentMethodRequest?.fixRate;
        } else if (paymentMethod?.value === "FIX_PRICE") {
            delete data.paymentMethodRequest?.minPayment;
            delete data.paymentMethodRequest?.maxPayment;
        }
        try {
            // @ts-ignore
            await sendUpdateForm(data);
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
                            <div
                                className={`w-full ${paymentMethod.value === "FREE" && "md:col-span-2"} ${paymentMethod.value === "PAY_AS_YOU_GO" && "md:col-span-2"} `}>
                                <div className="label">
                                    <span className="label-text text-[#3F3D56]">Payment Method:</span>
                                </div>
                                <Select
                                    options={paymentOptions}
                                    placeholder="Select payment method"
                                    unstyled
                                    isSearchable={false}
                                    //@ts-ignore
                                    onChange={setPaymentMethod}
                                    classNames={{
                                        control: () => "border border-gray-200 w-full rounded-lg h-[48px] mt-1 text-sm px-3 mr-2 text-left",
                                        container: () => "text-sm rounded w-full text-gray-500 ",
                                        menu: () => "bg-gray-50 rounded border py-2 text-left",
                                        option: ({isSelected, isFocused}) =>
                                            isSelected
                                                ? " bg-gray-200 px-4 py-2"
                                                : isFocused
                                                    ? "bg-gray-100 px-4 py-2"
                                                    : "px-4 py-2",
                                    }}
                                    value={paymentMethod}
                                    // defaultValue={mentorInformation.paymentMethodRequest.type}
                                />
                            </div>
                            {paymentMethod.value === "FIX_PRICE" &&
                                <label className="w-full">
                                    <div className="label">
                                        <span className="label-text">Fix Price:</span>
                                    </div>
                                    <input {...register("paymentMethodRequest.fixRate")} inputMode="numeric" type="number"
                                           placeholder="Enter Price"
                                           className="input input-bordered w-full bg-white"/>
                                    {errors.paymentMethodRequest?.fixRate && (
                                        <div
                                            className="text-red-500 text-sm mt-1">{errors.paymentMethodRequest.fixRate.message}</div>
                                    )}
                                </label>
                            }
                            {paymentMethod.value === "PAY_AS_YOU_GO" &&
                                <>
                                    <label className="w-full">
                                        <div className="label">
                                            <span className="label-text">Min Payment:</span>
                                        </div>
                                        <input inputMode="numeric" type="number" {...register("paymentMethodRequest.minPayment")}
                                               placeholder="Min Payment"
                                               className="input input-bordered w-full bg-white"/>
                                        {errors.paymentMethodRequest?.minPayment && (
                                            <div
                                                className="text-red-500 text-sm mt-1">{errors.paymentMethodRequest.minPayment.message}</div>
                                        )}
                                    </label>
                                    <label className="w-full">
                                        <div className="label">
                                            <span className="label-text">Max Payment:</span>
                                        </div>
                                        <input inputMode="numeric" {...register("paymentMethodRequest.maxPayment")} type="number"
                                               placeholder="Max Payment"
                                               className="input input-bordered w-full bg-white"/>
                                        {errors.paymentMethodRequest?.maxPayment && (
                                            <div
                                                className="text-red-500 text-sm mt-1">{errors.paymentMethodRequest.maxPayment.message}</div>
                                        )}
                                    </label>
                                </>
                            }
                            <div className="w-full md:col-span-2 mt-2 relative">
                                <div className="label">
                                    <span className="label-text text-[#3F3D56]">IBAN:</span>
                                    <span
                                        className={`absolute ${errors?.iban ? "top-[48px]" : "top-[48px]"} left-4 text-[#F9A826]`}>DE</span>
                                </div>
                                <input maxLength={24} {...register("iban")} inputMode="numeric" type="number"
                                       className="input input-bordered w-full bg-white pl-10"/>
                                {errors?.iban &&
                                    <p className='text-red-500 mt-1 text-left'>{errors.iban.message}</p>}
                            </div>
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
            <ToastContainer/>

        </>
    )
}
export default ProfileInformation
