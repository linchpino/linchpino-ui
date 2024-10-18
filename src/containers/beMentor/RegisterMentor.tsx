'use client'
import React, {FC, useState} from "react";
import {SubmitHandler, useForm} from "react-hook-form";
import {AsyncPaginate} from "react-select-async-paginate";
import axios from "axios";
import {BASE_URL_API} from "@/utils/system";
import useStore from "../../store/store";
import {z} from "zod";
import {BsEyeFill, BsEyeSlashFill} from "react-icons/bs";
import {zodResolver} from "@hookform/resolvers/zod";
import {empty} from "@/utils/helper";
import Select from "react-select";

const passwordPattern = /^(?=.*[A-Za-z\d@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
const ibanPattern = /^\d{24}$/;

const schema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    password: z.string().min(6, "Password must contain at least 6 character(s)").regex(passwordPattern, "Password must include at least one letter, one number, or one special character"),
    repeatPassword: z.string().min(6, "Re-Password must contain at least 6 character(s)").regex(passwordPattern, "Re-Password must include at least one letter, one number, or one special character"),
    iban: z.string().regex(ibanPattern, "Invalid iban format"),
    min: z.string().optional(),
    max: z.string().optional(),
    fixPrice: z.string().optional(),

})
    .refine((data) => data.password === data.repeatPassword, {
        message: "Passwords don't match",
        path: ["repeatPassword"],
    })


type Inputs = z.infer<typeof schema>;

export interface PaymentMethodRequest {
    type: {
        value: string,
        label: string
    };
    min?: string;
    max?: string;
    fixRate?: string;
}

interface RegisterMentorProps {
    activeStep: number;
    setActiveStep: React.Dispatch<React.SetStateAction<number>>;
}

const RegisterMentor: FC<RegisterMentorProps> = ({activeStep, setActiveStep}) => {
    const paymentOptions = [
        {value: "PAY_AS_YOU_GO", label: "Pay As You Go"},
        {value: "FIX_PRICE", label: "Fix Price"},
        {value: "FREE", label: "Free"},
    ]
    const {mentorInformation, setMentorInformation} = useStore();
    const {register, handleSubmit, watch, control, formState: {errors}} = useForm<Inputs>({
        resolver: zodResolver(schema),
        defaultValues: {
            firstName: mentorInformation.firstName,
            lastName: mentorInformation.lastName,
            password: mentorInformation.password,
            repeatPassword: "",
            iban: mentorInformation.sheba,
            min: mentorInformation.paymentMethodRequest?.min,
            max: mentorInformation.paymentMethodRequest?.max,
            fixPrice: mentorInformation.paymentMethodRequest?.fixRate,
        },
    });
    const [state, setState] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);

    const [paymentMethod, setPaymentMethod] = useState(mentorInformation.paymentMethodRequest.type);

    const toggleShowPassword = () => setShowPassword(prev => !prev);
    const toggleShowRepeatPassword = () => setShowRepeatPassword(prev => !prev);

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        const paymentMethodRequest: Partial<PaymentMethodRequest> = {
            type: paymentMethod
        };

        if (paymentMethod?.value === "PAY_AS_YOU_GO") {
            paymentMethodRequest.min = data.min
            paymentMethodRequest.max = data.max
        }
        if (paymentMethod?.value === "FIX_PRICE") {
            paymentMethodRequest.fixRate = data.fixPrice
        }
        setMentorInformation({
            firstName: data.firstName,
            lastName: data.lastName,
            password: data.password,
            paymentMethodRequest: paymentMethodRequest as PaymentMethodRequest,
            sheba: data.iban
        });
        setActiveStep(activeStep + 1);
    };

    const loadInterview = async (search: string, loadedOptions: unknown[], {page}: {
        page: number
    }) => {
        try {
            const response = await axios.get(`${BASE_URL_API}interviewtypes/search`, {
                params: {
                    page,
                    name: search,
                },
            });
            const options = response.data.content.map((item: any) => ({
                value: item.id,
                label: item.title,
            }));
            return {
                options,
                hasMore: !response.data.last,
                additional: {page: page + 1},
            };
        } catch (error) {
            console.error("Error loading interviews:", error);
            return {options: [], additional: {page: page + 1}};
        }
    };

    const handleInterviewChange = (selectedOptions: {
        value: number;
        label: string
    }[]) => {
        setMentorInformation({
            interviewTypeIDs: selectedOptions
        });
        setState(!state);
    };
    console.log(paymentMethod)

    // @ts-ignore
    return (
        <form onSubmit={handleSubmit(onSubmit)} className='w-full max-w-xs space-y-5'>
            <div className="w-full">
                <div className="label">
                    <span className="label-text text-[#3F3D56]"><span
                        className='text-[#F9A826]'>*</span>First Name:</span>
                </div>
                <input {...register("firstName")} type="text" className="input input-bordered w-full bg-white"/>
                {errors?.firstName && <p className='text-red-500 mt-1 text-left'>{errors.firstName.message}</p>}
            </div>
            <div className=" w-full">
                <div className="label">
                    <span className="label-text text-[#3F3D56]"><span
                        className='text-[#F9A826]'>*</span>Last Name:</span>
                </div>
                <input {...register("lastName")} type="text" className="input input-bordered w-full bg-white"/>
                {errors?.lastName && <p className='text-red-500 mt-1 text-left'>{errors.lastName.message}</p>}
            </div>
            <div className="flex flex-col md:flex-row flex-nowrap md:flex-wrap gap-x-2 w-full gap-y-5">
                <label className="w-full lg:w-[20rem]">
                    <div className="label">
                    <span className="label-text text-[#3F3D56]"><span
                        className='text-[#F9A826]'>*</span>Password:</span>
                    </div>
                    <div className="flex items-center justify-between relative">
                        <input {...register("password")} type={showPassword ? "text" : "password"}
                               placeholder="********"
                               className="input input-bordered w-full bg-white pr-8"/>
                        <button type="button" onClick={toggleShowPassword}
                                className="absolute right-3 flex items-center text-gray-700">
                            {showPassword ? <BsEyeSlashFill color="#686868"/> :
                                <BsEyeFill color="#686868"/>}
                        </button>
                    </div>
                    {errors.password && (
                        <div className="text-red-500 text-sm mt-1 text-left">{errors.password.message}</div>
                    )}
                </label>
                <label className="w-full lg:w-[20rem]">
                    <div className="label">
                    <span className="label-text text-[#3F3D56]"><span
                        className='text-[#F9A826]'>*</span>Re-Password:</span>
                    </div>
                    <div className="flex items-center justify-between relative">
                        <input {...register("repeatPassword")}
                               type={showRepeatPassword ? "text" : "password"} placeholder="********"
                               className="input input-bordered w-full bg-white pr-8"/>
                        <button type="button" onClick={toggleShowRepeatPassword}
                                className="absolute right-3 flex items-center text-gray-700">
                            {showRepeatPassword ? <BsEyeSlashFill color="#686868"/> :
                                <BsEyeFill color="#686868"/>}
                        </button>
                    </div>
                    {errors.repeatPassword && (
                        <div className="text-red-500 text-sm mt-1 text-left">{errors.repeatPassword.message}</div>
                    )}
                </label>
            </div>
            <div className="w-full">
                <div className="label">
                    <span className="label-text text-[#3F3D56]"><span className='text-[#F9A826]'>*</span>Field of expertise:</span>
                </div>
                <AsyncPaginate
                    classNames={{
                        control: () => "border border-gray-200 w-full rounded-lg min-h-[48px] mt-1 text-sm px-3 mr-2 py-2",
                        container: () => "text-sm rounded w-full text-gray-500  text-left",
                        menu: () => "bg-gray-100 rounded border py-2",
                        option: ({isSelected, isFocused}) => isSelected
                            ? "dark:bg-base-content dark:text-base-200 bg-gray-400 text-gray-50 px-4 py-2"
                            : isFocused
                                ? "bg-gray-200 px-4 py-2"
                                : "px-4 py-2",
                        multiValue: () => "bg-[#F9A82699] text-black rounded border p-1 mx-1 truncate my-1 max-w-40",
                    }}
                    value={mentorInformation.interviewTypeIDs}
                    //@ts-ignore
                    onChange={handleInterviewChange}
                    isMulti
                    placeholder="Interview Type"
                    //@ts-ignore
                    loadOptions={loadInterview}
                    additional={{page: 0}}
                    unstyled
                />
            </div>
            <div className="w-full">
                <div className="label">
                    <span className="label-text text-[#3F3D56]"><span className='text-[#F9A826]'>*</span>Payment Method:</span>
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
                    defaultValue={mentorInformation.paymentMethodRequest.type}
                />
            </div>
            {paymentMethod?.value === "PAY_AS_YOU_GO" &&
                <div className=" w-full flex flex-col md:flex-row justify-between gap-x-3">

                        <input {...register("min")} type="text" className="input input-bordered w-full bg-white"
                               placeholder="Min"/>
                        {errors?.min && <p className='text-red-500 mt-1 text-left'>{errors.min.message}</p>}


                        <input {...register("max")} type="text" className="input input-bordered w-full bg-white"
                               placeholder="Max"/>
                        {errors?.max && <p className='text-red-500 mt-1 text-left'>{errors.max.message}</p>}

                </div>
            }
            {paymentMethod?.value === "FIX_PRICE" &&
                <div className="w-full">
                    <input {...register("fixPrice")} type="text" className="input input-bordered w-full bg-white"
                           placeholder="Fix price"/>
                    {errors?.fixPrice && <p className='text-red-500 mt-1 text-left'>{errors.fixPrice.message}</p>}
                </div>
            }
            <div className="w-full relative">
                <div className="label">
                    <span className="label-text text-[#3F3D56]"><span
                        className='text-[#F9A826]'>*</span>IBAN:</span>
                    <span className={`absolute ${errors?.iban ? "top-[48px]" : "top-[48px]"} left-4 text-[#F9A826]`}>IR</span>
                </div>
                <input {...register("iban")} type="text" className="input input-bordered w-full bg-white pl-10"/>
                {errors?.iban && <p className='text-red-500 mt-1 text-left'>{errors.iban.message}</p>}
            </div>
            <button
                type="submit"
                disabled={
                    empty(watch('firstName')) ||
                    empty(watch('lastName')) ||
                    empty(mentorInformation.interviewTypeIDs.length) ||
                    empty(watch('password')) ||
                    empty(watch('repeatPassword')) ||
                    empty(watch('iban')) ||
                    (paymentMethod?.value === "PAY_AS_YOU_GO" && (empty(watch('min')) || empty(watch('max')))) ||
                    (paymentMethod?.value === "FIX_PRICE" && empty(watch('fixPrice')))
                }
                className='btn btn-warning w-52 bg-[#F9A826] text-white rounded-md shadow-md mt-12 py-2 px-3'>
                Next
            </button>
        </form>
    );
};

export default RegisterMentor;
