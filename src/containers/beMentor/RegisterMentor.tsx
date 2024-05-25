"use client"
import {empty} from "@/utils/helper";
import React, {useState} from "react";
import {SubmitHandler, useForm} from "react-hook-form";
import {AsyncPaginate} from "react-select-async-paginate";
import axios from "axios";
import {BASE_URL_API} from "@/utils/system";

type Inputs = {
    firstName: string
    lastName: string
    firstNameRequired: string
    lastNameRequired: string
}

interface Interview {
    id: number;
    title: string;
}
const RegisterMentor = () => {
    const [interviewValue, setInterviewValue] = useState<Interview | null>(null);

    const {
        register,
        handleSubmit,
        watch,
        formState: {errors},
    } = useForm<Inputs>()
    const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data)
    const loadInterview = async (search: string, loadedOptions: unknown[], {page}: { page: number }): Promise<{
        additional: {
            page: number
        };
        options: Interview[];
        hasMore: boolean
    }> => {
        try {
            // @ts-ignore
            const response = await axios.get(`${BASE_URL_API}jobposition/1/interviewtype`, {
                params: {
                    page,
                },
            });
            const options: Interview[] = response.data.content.map((item: any) => ({
                value: item.id,
                label: item.title,
            }));
            return {
                options,
                hasMore: !response.data.last,
                additional: {
                    page: page + 1,
                },
            };
        } catch (error) {
            console.error("Error loading interviews:", error);
            // @ts-ignore
            return Promise.resolve({options: [], additional: {page: page + 1}});
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='w-full max-w-xs'>
            <label className="form-control w-full ">
                <div className="label">
                    <span className="label-text text-[#3F3D56]"><span className='text-[#F9A826]'>*</span>First Name:</span>
                </div>
                <input {...register("firstName")} type="text"
                       placeholder=""
                       className="input input-bordered w-full  bg-white"/>
                {errors?.firstName && <p className='text-red-500 mt-1 text-left'>{errors.firstName.message}</p>}

            </label>
            <label className="form-control w-full ">
                <div className="label">
                    <span className="label-text text-[#3F3D56]"><span className='text-[#F9A826]'>*</span>Last Name:</span>
                </div>
                <input {...register("lastName")} type="text"
                       placeholder=""
                       className="input input-bordered w-full  bg-white"/>
                {errors?.lastName && <p className='text-red-500 mt-1 text-left'>{errors.lastName.message}</p>}

            </label>
            <label className="form-control w-full ">
                <div className="label">
                    <span className="label-text text-[#3F3D56]"><span className='text-[#F9A826]'>*</span>Field of expertise:</span>
                </div>
                <AsyncPaginate
                    classNames={{
                        control: () => " border border-gray-300 w-full rounded-md min-h-[48px] mt-1 text-sm px-3 mr-2 py-2",
                        container: () => "text-sm rounded w-full text-[#000000] text-left",
                        menu: () => " bg-gray-100 rounded border py-2",
                        option: ({isSelected, isFocused}) =>
                            isSelected
                                ? "dark:bg-base-content dark:text-base-200 bg-gray-400 text-gray-50 px-4 py-2"
                                : isFocused
                                    ? "bg-gray-200 px-4 py-2"
                                    : "px-4 py-2",
                        multiValue: () => " bg-[#F9A82699] rounded border p-1 mx-1 truncate my-1 max-w-40",
                    }}
                    value={interviewValue}
                    //@ts-ignore
                    onChange={setInterviewValue}
                    unstyled
                    isMulti
                    placeholder="Interview Type"
                    //@ts-ignore
                    loadOptions={loadInterview}
                    additional={{
                        page: 0,
                    }}
                />

            </label>

            <button disabled={empty(watch("firstName")) || empty(watch("lastName")) ||empty(interviewValue)} onClick={() => console.log(1)}
                    className='btn btn-warning w-52 bg-[#F9A826] text-white rounded-md shadow-md mt-8 py-2 px-3'>
                Next
            </button>
        </form>
    )
}
// @ts-ignore
export default RegisterMentor;
