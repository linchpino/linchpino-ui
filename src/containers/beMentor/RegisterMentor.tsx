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
import {useTranslations} from "next-intl";
import Select from "react-select";

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
    const t = useTranslations()

    type Inputs = z.infer<typeof schema>;

    const passwordPattern = /^(?=.*[A-Za-z\d@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    const schema = z.object({
        firstName: z.string().min(1, t("Forms.firstNameRequired")),
        lastName: z.string().min(1, t("Forms.lastNameRequired")),
        iban: z.string(),
        password: z.string().min(6, t("Forms.passwordCharacterLength")).regex(passwordPattern, t("Forms.passwordPattern")),
        repeatPassword: z.string().min(6, t("Forms.passwordCharacterLength")).regex(passwordPattern, t("Forms.passwordPattern")),
        min: z.string().optional(),
        max: z.string().optional(),
        fixPrice: z.string().optional(),
    }).refine((data) => data.password === data.repeatPassword, {
        message: t("Form.matchPassword"),
        path: ["repeatPassword"],
    });


    const paymentOptions = [
        {value: "PAY_AS_YOU_GO", label: t("BeMentor.payAsYouGo")},
        {value: "FIX_PRICE", label: t("BeMentor.fixPrice")},
        {value: "FREE", label: t("BeMentor.free")},
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
            console.error(error);
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
    // @ts-ignore
    return (
        <form onSubmit={handleSubmit(onSubmit)} className='w-full max-w-xs space-y-5'>
            <div className="w-full">
                <div className="label">
                    <span className="label-text">{t("Forms.firstName")}</span>
                </div>
                <input {...register("firstName")} type="text" className="input input-bordered w-full bg-white"/>
                {errors?.firstName && <p className='text-red-500 mt-1 text-left'>{errors.firstName.message}</p>}
            </div>
            <div className=" w-full">
                <div className="label">
                    <span className="label-text ">{t("Forms.lastName")}</span>
                </div>
                <input {...register("lastName")} type="text" className="input input-bordered w-full bg-white"/>
                {errors?.lastName && <p className='text-red-500 mt-1 text-left'>{errors.lastName.message}</p>}
            </div>
            <div className="flex flex-col md:flex-row flex-nowrap md:flex-wrap gap-x-2 w-full gap-y-5">
                <label className="w-full lg:w-[20rem]">
                    <div className="label">
                    <span className="label-text">{t("Forms.password")}</span>
                    </div>
                    <div className="flex items-center justify-between relative">
                        <input {...register("password")} type={showPassword ? "text" : "password"}
                               placeholder="********"
                               className="input input-bordered w-full bg-white pr-8 text-left"/>
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
                        <span className="label-text">{t("Forms.repeatPassword")}</span>
                    </div>
                    <div className="flex items-center justify-between relative">
                        <input {...register("repeatPassword")}
                               type={showRepeatPassword ? "text" : "password"} placeholder="********"
                               className="input input-bordered w-full bg-white pr-8 text-left"/>
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
            <label className="w-full ">
                <div className="label mt-4">
                    <span className="label-text ">{t("BeMentor.expertise")}</span>
                </div>
                <AsyncPaginate
                    classNames={{
                        control: () => "border border-gray-200 w-full rounded-lg h-[48px] mt-1 text-sm px-3 text-dir",
                        container: () => "text-sm rounded w-full text-gray-500 text-dir",
                        menu: () => "bg-gray-50 rounded border py-2 text-dir",
                        placeholder:() => "text-gray-400",
                        option: ({isSelected, isFocused}) => isSelected
                            ? "dark:bg-base-content dark:text-base-200 bg-gray-400 text-gray-50 px-4 py-2"
                            : isFocused
                                ? "bg-gray-200 px-4 py-2"
                                : "px-4 py-2",
                        multiValue: () => "bg-[#F9A82699] rounded border p-1 mx-1 truncate my-1 max-w-40",
                    }}
                    defaultValue={mentorInformation.interviewTypeIDs}
                    //@ts-ignore
                    onChange={handleInterviewChange}
                    isMulti
                    placeholder={t("BeMentor.interviewPlaceholder")}
                    //@ts-ignore
                    loadOptions={loadInterview}
                    additional={{page: 0}}
                    noOptionsMessage={() => t("Errors.selectNoOption")}
                    loadingMessage={() => t("Errors.selectLoading")}
                    unstyled
                />
            </label>
            <div className="w-full">
                <div className="label">
                    <span className="label-text">{t("BeMentor.paymentMethod")}</span>
                </div>
                <Select
                    //@ts-ignore
                    options={paymentOptions}
                    placeholder={t("BeMentor.paymentMethodPlaceholder")}
                    unstyled
                    isSearchable={false}
                    //@ts-ignore
                    onChange={setPaymentMethod}
                    classNames={{
                        control: () => "border border-gray-200 w-full rounded-lg h-[48px] mt-1 text-sm px-3 text-dir",
                        container: () => "text-sm rounded w-full text-gray-500 text-dir",
                        menu: () => "bg-gray-50 rounded border py-2 text-dir",
                        option: ({isSelected, isFocused}) =>
                            isSelected
                                ? " bg-gray-200 px-4 py-2"
                                : isFocused
                                    ? "bg-gray-100 px-4 py-2"
                                    : "px-4 py-2",
                    }}
                    defaultValue={mentorInformation.paymentMethodRequest.type.label}
                />
            </div>
            {paymentMethod?.value === "PAY_AS_YOU_GO" &&
                <div className=" w-full flex flex-col md:flex-row justify-between gap-x-3">

                    <input {...register("min")} type="text" className="input input-bordered w-full bg-white text-sm"
                           placeholder={t("BeMentor.min")}/>
                    {errors?.min && <p className='text-red-500 mt-1 text-left'>{errors.min.message}</p>}


                    <input {...register("max")} type="text" className="input input-bordered w-full bg-white text-sm"
                           placeholder={t("BeMentor.max")}/>
                    {errors?.max && <p className='text-red-500 mt-1 text-left'>{errors.max.message}</p>}

                </div>
            }
            {paymentMethod?.value === "FIX_PRICE" &&
                <div className="w-full text-xs">
                    <input {...register("fixPrice")} type="text" className="input input-bordered w-full bg-white text-sm"
                           placeholder={t("BeMentor.fixPrice")}/>
                    {errors?.fixPrice && <p className='text-red-500 mt-1 text-left'>{errors.fixPrice.message}</p>}
                </div>
            }
            <div className="w-full relative">
                <div className="label">
                    <span className="label-text">{t("BeMentor.iban")}</span>
                    <span
                        className={`absolute ${errors?.iban ? "top-[48px]" : "top-[48px]"} left-4 text-[#F9A826]`}>{t("BeMentor.ibanRegion")}</span>
                </div>
                <input {...register("iban")} type="text" className="input input-bordered w-full bg-white pl-10"/>
                {errors?.iban && <p className='text-red-500 mt-1 text-left'>{errors.iban.message}</p>}
            </div>
            <div className="flex items-center justify-between w-full max-w-xs py-5">
                <button
                    type="submit"
                    disabled={empty(watch('firstName')) || empty(watch('lastName')) || empty(mentorInformation.interviewTypeIDs.length) || empty(watch('password')) || empty(watch('repeatPassword'))}
                    className='btn btn-sm w-28 xs:w-36 border-none px-2 bg-[#F9A826] text-[#FFFFFF] rounded-md shadow-md text-xs'>
                    {t("BeMentor.nextButton")}
                </button>

                <button onClick={() => {
                    setActiveStep(activeStep - 1)
                }}
                        className='btn btn-sm w-28 xs:w-36 border-none px-2 bg-[#3F3D56] text-[#F9A826] rounded-md shadow-md text-xs'>
                    {t("BeMentor.backButton")}
                </button>
            </div>
        </form>
    );
};

export default RegisterMentor;
