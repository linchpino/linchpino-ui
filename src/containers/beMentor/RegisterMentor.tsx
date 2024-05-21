import {empty} from "@/helper/helper";
import React from "react";
import {SubmitHandler, useForm} from "react-hook-form";
import {AsyncPaginate} from "react-select-async-paginate";

type Inputs = {
    firstName: string
    lastName: string
    firstNameRequired: string
    lastNameRequired: string
}

const RegisterMentor = () => {
    const {
        register,
        handleSubmit,
        watch,
        formState: {errors},
    } = useForm<Inputs>()
    const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data)
    async function loadOptions() {
        const response = await fetch(`https://jsonplaceholder.typicode.com/todos/1`);
        const responseJSON = await response.json();

        return {
            options: responseJSON.results,
            hasMore: responseJSON.has_more,
        };
    }
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
                    <span className="label-text text-[#3F3D56]"><span className='text-[#F9A826]'>*</span>Last Name:</span>
                </div>
                <AsyncPaginate
                    classNames={{
                        control: () =>
                            'border border-gray-300 w-full rounded-md h-[48px] mt-1 text-sm px-3 mr-2 ',
                        container: () => 'text-sm rounded w-full',
                        menu: () => 'bg-withe border py-2',
                        option: ({isSelected}) =>
                            isSelected ? "dark:bg-base-content dark:text-base-200 bg-gray-400 text-gray-50 px-4 py-2" : "px-4 py-2",
                    }}
                    value={''}
                    onChange={(e: any) => console.log(e.target.value)}
                    unstyled
                    placeholder="Field of proficiency"
                    loadOptions={loadOptions}/>

            </label>

            <button disabled={empty(watch("firstName"))} onClick={() => console.log(1)}
                    className='btn btn-warning w-52 bg-[#F9A826] text-white rounded-md shadow-md mt-8 py-2 px-3'>
                Next
            </button>
        </form>
    )
}
export default RegisterMentor
