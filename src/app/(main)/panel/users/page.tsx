'use client'
import React, {useState, useEffect} from 'react';
import {useQuery} from '@tanstack/react-query';
import axios from 'axios';
import Select from 'react-select';
import {BASE_URL_API} from "@/utils/system";
import useStore from "@/store/store";
import Spinner from "@/components/Spinner";
import ProtectedPage from "@/app/(main)/panel/ProtectedPage";

interface UserType {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    roles: string[];
}


const fetchUsers = async (token: string | null, page: number, name: string, role: number | null): Promise<{
    content: UserType[],
    totalPages: number,
    last: boolean
}> => {
    const params: any = {
        page,
        sort: 'desc'
    };
    if (name) {
        params.name = name;
    }
    if (role !== null) {
        params.role = role;
    }
    const {data} = await axios.get(`${BASE_URL_API}accounts/search`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        params,
    });
    return data;
};

const User = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage] = useState(20);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRole, setSelectedRole] = useState<number | null>(null);
    const [isLastPage, setIsLastPage] = useState(false);

    const {token,} = useStore(state => ({
        token: state.token,
    }));

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
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(0);
    };
    const handleRoleChange = (selectedOption: any) => {
        setSelectedRole(selectedOption ? selectedOption.value : null);
        setCurrentPage(0);
    };
    const roleOptions = [
        {value: "", label: "All"},
        {value: 1, label: "GUEST"},
        {value: 2, label: "JOBSEEKER"},
        {value: 3, label: "MENTOR"},
        {value: 4, label: "ADMIN"}
    ];

    useEffect(() => {
        if (isLastPage && currentPage > usersData?.totalPages) {
            setCurrentPage(usersData?.totalPages);
        }
    }, [isLastPage, currentPage, usersData]);

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
                                <th className='w-20 rounded-tl-none rounded-tr-xl'>Role</th>
                            </tr>
                            </thead>
                            <tbody>
                            {usersData?.content?.map((user: UserType, index: number) => {
                                const fullName = `${user.firstName} ${user.lastName}`;
                                return (
                                    <tr key={user.id}
                                        className={`${index % 2 === 0 ? 'bg-gray-100 text-[#111B47]' : 'bg-white text-[#111B47]'}`}>
                                        <td>{currentPage * itemsPerPage + index + 1}</td>
                                        <td>{fullName}</td>
                                        <td>{user.email}</td>
                                        <td>{user.roles[0]}</td>
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
