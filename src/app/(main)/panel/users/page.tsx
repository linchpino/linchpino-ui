'use client'
import React, {useState, useEffect} from 'react';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import axios from 'axios';
import Select from 'react-select';
import {BASE_URL_API} from "@/utils/system";
import useStore from "@/store/store";
import Spinner from "@/components/Spinner";
import ProtectedPage from "@/app/(main)/panel/ProtectedPage";
import {textWithTooltip} from "@/utils/helper";
import {toastError, toastSuccess} from "@/components/CustomToast";

interface UserType {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    roles: string[];
    status: number;
}


const fetchUsers = async (token: string | null, page: number, name: string, role: number | null): Promise<{
    content: UserType[],
    totalPages: number,
    last: boolean
}> => {
    const params: any = {
        page,
        sort: 'firstName,desc',
        size: 10
    };
    if (name) {
        params.name = name;
    }
    if (role !== null) {
        params.role = role;
    }
    const {data} = await axios.get(`${BASE_URL_API}admin/accounts/search`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        params,
    });
    return data;
};
const updateUser = async (token: string | null, updatedData: {
    accountId: number,
    roles: number[],
    status: number
}) => {
    await axios.put(`${BASE_URL_API}admin/accounts/update`, updatedData, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
};

const User = () => {
    const queryClient = useQueryClient();
    const {token,} = useStore(state => ({
        token: state.token,
    }));
    const roleOptions = [
        {value: "", label: "All"},
        {value: 1, label: "GUEST"},
        {value: 2, label: "JOBSEEKER"},
        {value: 3, label: "MENTOR"},
        {value: 4, label: "ADMIN"}
    ];
    const statusOptions = [
        {value: 1, label: "Active"},
        {value: 2, label: "Deactivate"}
    ];
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRole, setSelectedRole] = useState<number | null>(null);
    const [isLastPage, setIsLastPage] = useState(false);

    const {data: usersData, isLoading} = useQuery({
        queryKey: ['users', currentPage, searchTerm, selectedRole],
        queryFn: () => fetchUsers(token, currentPage, searchTerm, selectedRole),
        //@ts-ignore
        onSuccess: (data) => {
            setIsLastPage(data.last);
        },
        onError: (error: any) => {
            console.error('Failed to fetch users:', error);
        }
    });

    const mutation = useMutation({
        mutationFn: (updatedData: {
            accountId: number,
            roles: number[],
            status: number
        }) => updateUser(token, {accountId:updatedData.accountId, roles: updatedData.roles, status: updatedData.status}),
        onSuccess: () => {
            toastSuccess({message: 'User updated successfully!'});
            queryClient.invalidateQueries({queryKey: ['users']});
        },
        onError: (error: any) => {
            console.error('Failed to update user:', error);
            toastError({message: 'Error updating user.'});
        }
    });
    const handleUserUpdate = (accountId: number, roles: (number)[], status: number) => {
        mutation.mutate({accountId, roles, status});
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(0);
    };
    const handleRoleChange = (selectedOption: any) => {
        setSelectedRole(selectedOption ? selectedOption.value : null);
        setCurrentPage(0);
    };

    useEffect(() => {
        if (isLastPage && currentPage > usersData?.totalPages) {
            setCurrentPage(usersData?.totalPages);
        }
    }, [isLastPage, currentPage, usersData]);

    const totalPages = usersData?.totalPages || 0;
    const ToggleSwitch = ({isActive, onToggle}: { isActive: boolean, onToggle: () => void }) => (
        <label className="relative inline-flex items-center cursor-pointer">
            <input
                type="checkbox"
                checked={isActive}
                onChange={onToggle}
                className="sr-only peer"
            />
            <div
                className={`w-11 h-6 rounded-full ${isActive ? 'bg-green-500' : 'bg-red-500'} peer-checked:bg-green-500 peer-focus:ring-4 peer-focus:ring-blue-300`}
            />
            <span
                className={`absolute left-1 top-[2px] w-5 h-5 bg-white rounded-full transition-transform duration-200 transform ${isActive ? 'translate-x-full' : ''}`}
            />
        </label>
    );
    return (
        <ProtectedPage>
            <div className="mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                    <h1 className="text-md font-bold">Users</h1>
                    <div className="flex flex-col md:flex-row items-center mt-2 md:mt-0 gap-y-4 gap-x-4">
                        <input
                            type="text"
                            placeholder="Search by name"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="input input-bordered border-[.1px] rounded-md text-gray-900 border-gray-300 w-full max-w-xs h-10 text-sm bg-white"
                        />
                        <Select
                            options={roleOptions}
                            isClearable
                            placeholder="Filter by role"
                            onChange={handleRoleChange}
                            classNames={{
                                control: () => "border border-gray-50 w-full rounded-lg h-8 text-sm px-1 text-gray-100",
                                container: () => "text-sm border-gray-50 rounded-lg w-full text-gray-500 text-left",
                                menu: () => "bg-gray-100 rounded border py-2 rounded-lg ",
                                option: ({isSelected, isFocused}) => isSelected
                                    ? "dark:bg-base-content dark:text-base-200 bg-gray-400 text-gray-50 px-4 py-2"
                                    : isFocused
                                        ? "bg-gray-200 px-4 py-2"
                                        : "px-4 py-2",
                            }}
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    {isLoading ? (
                        <div className="flex justify-center items-center">
                            <Spinner loading={isLoading}/>
                        </div>
                    ) : (
                        <table className="table w-full mt-4">
                            <thead>
                            <tr className='text-[.9rem] font-medium border-b-0 bg-[#111B47] text-white h-16'>
                                <th className="w-12 rounded-tr-none rounded-tl-xl">#</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Status</th>
                                <th className='w-20 rounded-tl-none rounded-tr-xl'>Role</th>
                            </tr>
                            </thead>
                            <tbody>
                            {usersData?.content?.map((user: UserType, index: number) => {
                                const isActive = user.status === 1;
                                const fullName = `${user.firstName} ${user.lastName}`;
                                return (
                                    <tr key={user.id}
                                        className={`${index % 2 === 0 ? 'bg-gray-100 text-[#111B47]' : 'bg-white text-[#111B47]'}`}>
                                        <td>{currentPage * itemsPerPage + index + 1}</td>
                                        <td>{textWithTooltip(fullName)}</td>
                                        <td>{textWithTooltip(user.email)}</td>
                                        <td>
                                            <input
                                                data-theme='light'
                                                type="checkbox"
                                                className="toggle toggle-success"
                                                defaultChecked={isActive}
                                                onChange={() => handleUserUpdate(user.id, user.roles.map(role => role), isActive ? 1 : 2)}
                                            />
                                        </td>
                                        <td>
                                            <select
                                                data-theme='light'
                                                defaultValue={user.roles[0]}
                                                className="select select-bordered w-full"
                                                onChange={(e) => handleUserUpdate(user.id, [parseInt(e.target.value)], user.status)}
                                            >
                                                {roleOptions.map((option) => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>

                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    )}
                </div>

                {!isLoading && (
                    <div className="flex justify-center mt-4">
                        <div className="flex gap-x-2">
                            {[...Array(totalPages)].map((_, index) => (
                                <button
                                    key={index}
                                    className={`btn  ${currentPage === index ? 'bg-[#111B47] border-none text-white' : 'hover:text-white text-[#111B47] border-[#111B47] border-[.1px] bg-white'}`}
                                    onClick={() => setCurrentPage(index)}
                                    disabled={isLastPage && index + 1 > totalPages}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </ProtectedPage>
    );
};

export default User;
