'use client'
import React, {useEffect, useState} from 'react';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import axios from 'axios';
import Select from 'react-select';
import {BASE_URL_API} from "@/utils/system";
import useStore from "@/store/store";
import Spinner from "@/components/Spinner";
import ProtectedPage from "@/app/(main)/panel/ProtectedPage";
import {textWithTooltip} from "@/utils/helper";
import {toastError, toastSuccess} from "@/components/CustomToast";
import PulseLoader from "react-spinners/PulseLoader";
interface UserType {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    roles: string[];
    status: string;
}
interface UsersData {
    totalPages: number;
    last: boolean;
    content: UserType[];
}

type StatusKeys = 'ACTIVATED' | 'DEACTIVATED';

const statusTextToNumber: Record<StatusKeys, number> = {
    ACTIVATED: 1,
    DEACTIVATED: 2,
};

const statusNumberToText = {
    1: "ACTIVATED",
    2: "DEACTIVATED"
};

const roleToNumberMap: {[key: string]: number} = {
    "GUEST": 1,
    "JOBSEEKER": 2,
    "MENTOR": 3,
    "ADMIN": 4
};

const mapRolesToNumbers = (roles: string[]): number[] => {
    return roles.map(role => roleToNumberMap[role] || 0);
};

const fetchUsers = async (token: string | null, page: number, name: string, role: number | null): Promise<{
    content: UserType[],
    totalPages: number,
    last: boolean
}> => {
    const params: any = {
        page,
        sort: 'firstName,asc',
        size: 10
    };
    if (name) params.name = name;
    if (role !== null) params.role = role;

    const {data} = await axios.get(`${BASE_URL_API}admin/accounts/search`, {
        headers: { Authorization: `Bearer ${token}` },
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
        headers: { Authorization: `Bearer ${token}` }
    });
};

const User = () => {
    const queryClient = useQueryClient();
    const {token} = useStore(state => ({ token: state.token }));
    const [itemsPerPage] = useState(10);

    const [currentPage, setCurrentPage] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRole, setSelectedRole] = useState<number | null>(null);
    const [isLastPage, setIsLastPage] = useState(false);
    const [loadingState, setLoadingState] = useState<{ [userId: number]: { role: boolean; status: boolean } }>({});

    const {data: usersData, isLoading} = useQuery<UsersData>({
        queryKey: ['users', currentPage, searchTerm, selectedRole],
        queryFn: () => fetchUsers(token, currentPage, searchTerm, selectedRole),
        //@ts-ignore
        onSuccess: (data:any) => {
            setIsLastPage(data.last);
        },
        onError: (error: unknown) => {
            console.error('Failed to fetch users:', error);
        },
    });

    const mutation = useMutation({
        mutationFn: (updatedData: {
            accountId: number,
            roles: number[],
            status: number
        }) => updateUser(token, updatedData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            toastSuccess({ message: 'User updated successfully!' });
        },
        onError: (error) => {
            console.error('Failed to update user:', error);
            toastError({ message: 'Error updating user.' });
        }
    });
    const handleUserUpdate = (accountId: number, roles: string[], status: string, type: 'role' | 'status') => {
        setLoadingState((prevState) => ({
            ...prevState,
            [accountId]: {
                ...prevState[accountId],
                [type]: true,
            },
        }));

        const roleNumbers = mapRolesToNumbers(roles);
        const statusNumber = statusTextToNumber[status as StatusKeys];

        mutation.mutate({
            accountId,
            roles: roleNumbers,
            status: statusNumber
        }, {
            onSuccess: () => {
                toastSuccess({ message: 'User updated successfully!' });
                queryClient.invalidateQueries({ queryKey: ['users'] });
            },
            onError: (error) => {
                console.error('Failed to update user:', error);
                toastError({ message: 'Error updating user.' });
            },
            onSettled: () => {
                setLoadingState((prevState) => ({
                    ...prevState,
                    [accountId]: {
                        ...prevState[accountId],
                        [type]: false,
                    },
                }));
            }
        });
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
        // @ts-ignore
        if (isLastPage && currentPage > usersData?.totalPages) {
            // @ts-ignore
            setCurrentPage(usersData?.totalPages);
        }
    }, [isLastPage, currentPage, usersData]);

    // @ts-ignore
    const totalPages = usersData?.totalPages || 0;
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
                            options={[
                                {value: "", label: "All"},
                                {value: 1, label: "GUEST"},
                                {value: 2, label: "JOBSEEKER"},
                                {value: 3, label: "MENTOR"},
                                {value: 4, label: "ADMIN"}
                            ]}
                            isClearable
                            unstyled
                            placeholder="Filter by role"
                            onChange={handleRoleChange}
                            classNames={{
                                control: () => "border border-gray-300 w-full rounded-md h-[40px] text-sm px-3 mr-2",
                                container: () => "text-sm rounded w-full",
                                menu: () => "bg-gray-100 rounded border py-2",
                                option: ({isSelected, isFocused}) =>
                                    isSelected
                                        ? "bg-gray-400 text-gray-50 px-4 py-2"
                                        : isFocused
                                            ? "bg-gray-200 px-4 py-2 text-gray-700 "
                                            : "px-4 py-2 text-gray-500 ",
                            }}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {isLoading ? (
                        <div className="flex justify-center items-center">
                            <Spinner loading={isLoading} />
                        </div>
                    ) : (
                        <table className="table w-full mt-4">
                            <thead>
                            <tr className='text-[.9rem] font-medium border-b-0 bg-[#111B47] text-white h-16'>
                                <th className='rounded-tr-none rounded-tl-xl '>#</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Status</th>
                                <th className='rounded-tl-none rounded-tr-xl w-60'>Role</th>
                            </tr>
                            </thead>
                            <tbody>
                            {/*@ts-ignore*/}
                            {usersData?.content?.map((user, index) => (
                                <tr key={user.id} className={`${index % 2 === 0 ? 'bg-gray-100 text-[#111B47]' : 'bg-white text-[#111B47]'}`}>
                                    <td>{currentPage * 10 + index + 1}</td>
                                    <td>{textWithTooltip(`${user.firstName} ${user.lastName}`)}</td>
                                    <td>{textWithTooltip(user.email)}</td>
                                    <td>
                                        {loadingState[user.id]?.status  ? (
                                            <PulseLoader size={8} color="#F9A826"/>
                                        ) : (
                                            <input
                                                data-theme="light"
                                                type="checkbox"
                                                className="toggle toggle-sm"
                                                checked={user.status === "ACTIVATED"}
                                                onChange={() => handleUserUpdate(user.id, user.roles, user.status === "ACTIVATED" ? "DEACTIVATED" : "ACTIVATED", 'status')}
                                            />
                                        )}

                                    </td>
                                    <td>
                                        {loadingState[user.id]?.role  ?
                                                <PulseLoader size={8} color="#F9A826"/>
                                            :
                                            <Select
                                                isMulti
                                                options={[
                                                    { value: "GUEST", label: "GUEST" },
                                                    { value: "JOBSEEKER", label: "JOBSEEKER" },
                                                    { value: "MENTOR", label: "MENTOR" },
                                                    { value: "ADMIN", label: "ADMIN" }
                                                ]}
                                                //@ts-ignore
                                                menuPortalTarget={document.body}
                                                styles={{
                                                    menuPortal: base => ({ ...base, zIndex: 9999 })
                                                }}
                                                //@ts-ignore
                                                value={user.roles.map(role => ({ value: role, label: role }))}
                                                onChange={(selectedOptions) => handleUserUpdate(user.id, selectedOptions.map(opt => opt.value), user.status, 'role')}
                                            />
                                        }

                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </div>
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
        </ProtectedPage>
    );
};

export default User;
