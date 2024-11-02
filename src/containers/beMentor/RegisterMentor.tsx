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


interface Interview {
    value: number;
    label: string;
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
        password: z.string().min(6, t("Forms.passwordCharacterLength")).regex(passwordPattern, t("Forms.passwordPattern")),
        repeatPassword: z.string().min(6, t("Forms.passwordCharacterLength")).regex(passwordPattern, t("Forms.passwordPattern")),
    }).refine((data) => data.password === data.repeatPassword, {
        message: t("Form.matchPassword"),
        path: ["repeatPassword"],
    });


    const {mentorInformation, setMentorInformation} = useStore();
    const {register, handleSubmit, watch, control, formState: {errors}} = useForm<Inputs>({
        resolver: zodResolver(schema),
        defaultValues: {
            firstName: mentorInformation.firstName,
            lastName: mentorInformation.lastName,
            password: mentorInformation.password,
            repeatPassword: "",
        },
    });
    const [state, setState] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);

    const toggleShowPassword = () => setShowPassword(prev => !prev);
    const toggleShowRepeatPassword = () => setShowRepeatPassword(prev => !prev);

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        setMentorInformation({
            firstName: data.firstName,
            lastName: data.lastName,
            password: data.password,
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

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='w-full max-w-xs'>
            <label className="form-control w-full">
                <div className="label">
                    <span className="label-text ">{t("Forms.firstName")}</span>
                </div>
                <input {...register("firstName")} type="text" className="input input-bordered w-full bg-white"/>
                {errors?.firstName && <p className='text-red-500 mt-1 text-left'>{errors.firstName.message}</p>}
            </label>
            <label className="form-control w-full">
                <div className="label">
                    <span className="label-text ">{t("Forms.lastName")}</span>
                </div>
                <input {...register("lastName")} type="text" className="input input-bordered w-full bg-white"/>
                {errors?.lastName && <p className='text-red-500 mt-1 text-left'>{errors.lastName.message}</p>}
            </label>
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
                        control: () => "border border-gray-300 w-full rounded-md min-h-[48px] mt-1 text-sm px-3 me-2 py-2",
                        container: () => "text-sm rounded w-full text-[#000000] text-dir",
                        menu: () => "bg-gray-100 rounded border py-2",
                        option: ({isSelected, isFocused}) => isSelected
                            ? "dark:bg-base-content dark:text-base-200 bg-gray-400 text-gray-50 px-4 py-2"
                            : isFocused
                                ? "bg-gray-200 px-4 py-2"
                                : "px-4 py-2",
                        multiValue: () => "bg-[#F9A82699] rounded border p-1 mx-1 truncate my-1 max-w-40",
                    }}
                    value={mentorInformation.interviewTypeIDs}
                    //@ts-ignore
                    onChange={handleInterviewChange}
                    isMulti
                    placeholder={t("BeMentor.interviewPlaceholder")}
                    //@ts-ignore
                    loadOptions={loadInterview}
                    additional={{page: 0}}
                />
            </label>
            <button
                type="submit"
                disabled={empty(watch('firstName')) || empty(watch('lastName')) || empty(mentorInformation.interviewTypeIDs.length) || empty(watch('password')) || empty(watch('repeatPassword'))}
                className='btn btn-warning w-52 bg-[#F9A826] text-white rounded-md shadow-md mt-8 py-2 px-3'>
                {t("BeMentor.nextButton")}
            </button>
        </form>
    );
};

export default RegisterMentor;
