import React, {useState} from "react";
import {ValidateEmailPattern} from "@/utils/helper";
import {AsyncPaginate} from "react-select-async-paginate";
import {BsEyeFill, BsEyeSlashFill} from "react-icons/bs";
import axios from "axios";
import {BASE_URL_API} from "@/utils/system";
import {toastError, toastSuccess} from "@/components/CustomToast";
import {SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import '../../../app/globals.css'

const passwordPattern = /^(?=.*[A-Za-z\d@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
const schema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
})
type SignUpFields = z.infer<typeof schema>;

interface Interview {
    value: number;
    label: string;
}

const ProfileInformation = () => {
    const {register, handleSubmit, formState: {errors}} = useForm<SignUpFields>({
        resolver: zodResolver(schema)
    });
    const [isLoading, setIsLoading] = useState(false);

    const sendSignupForm = async (data: Omit<SignUpFields, 'repeat_password'> & { type: number }) => {
        setIsLoading(true);
        try {
            const response = await axios.post(`${BASE_URL_API}accounts`, data);
            toastSuccess({message: 'Registration successful!'});
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

    const onSubmit: SubmitHandler<SignUpFields> = async (data) => {
        const {...dataToSubmit} = data;
        try {
            await sendSignupForm({...dataToSubmit, type: 1});
        } catch (error) {
            console.error('Signup failed', error);
        }
    };

    const loadInterview = async (search: string, loadedOptions: unknown[], {page}: { page: number }) => {
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

    const handleInterviewChange = (selectedOptions: Interview[]) => {
        const selectedInterviews = selectedOptions.map(option => ({value: option.value, label: option.label}));
        console.log(selectedInterviews)
    };
    return (
        <>
            <h4 className='mt-8'>Your Information</h4>
            <form onSubmit={handleSubmit(onSubmit)} className="gap-y-5 flex flex-col justify-center mt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 w-full gap-y-5">
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
                    <label className="w-full">
                        <div className="label">
                            <span className="label-text">Last Name:</span>
                        </div>
                        <input {...register("lastName")} type="text" placeholder="Your last name"
                               className="input input-bordered w-full bg-white"/>
                        {errors.lastName && (
                            <div className="text-red-500 text-sm mt-1">{errors.lastName.message}</div>
                        )}
                    </label>
                    <label className="w-full">
                        <div className="label">
                            <span className="label-text">Email:</span>
                        </div>
                        <input {...register("email", {
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
                    <label className="w-full">
                        <div className="label">
                            <span className="label-text">Field of expertise:</span>
                        </div>
                        <AsyncPaginate
                            classNames={{
                                control: () => " w-full min-h-[48px] text-sm px-2 mr-2 py-1",
                                container: () => "text-sm w-full text-[#000000] text-left",
                                menu: () => "bg-gray-100 rounded border py-2",
                                option: ({isSelected, isFocused}) => isSelected
                                    ? " dark:bg-base-content dark:text-base-200 bg-gray-400 text-gray-50 px-4 py-2"
                                    : isFocused
                                        ? "bg-gray-200 px-4 py-2"
                                        : "px-4 py-2",
                                multiValue: () => "bg-[#F9A82699] rounded-lg border p-1 mx-1 truncate my-1 max-w-40",
                            }}
                            value={""}
                            //@ts-ignore
                            onChange={handleInterviewChange}
                            isMulti
                            placeholder="Interview Type"
                            //@ts-ignore
                            loadOptions={loadInterview}
                            additional={{page: 0}}
                        />
                    </label>
                    <label className="w-full md:col-span-2">
                        <div className="label">
                            <span className="label-text">Bio:</span>
                        </div>
                        <textarea className="textarea textarea-bordered w-full bg-white"
                                  placeholder="Your Details ..." {...register("firstName")}/>

                    </label>
                </div>
            </form>
        </>
    )
}
export default ProfileInformation
