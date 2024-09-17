'use client';

import React, {useState, useEffect, useCallback} from 'react';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import axios from 'axios';
import {BASE_URL_API} from "@/utils/system";
import useStore from "@/store/store";
import {toastError, toastSuccess} from '@/components/CustomToast';
import {AiOutlineEdit, AiOutlineDelete} from 'react-icons/ai';
import Spinner from "@/components/Spinner";
import PulseLoader from "react-spinners/PulseLoader";
import {AsyncPaginate} from "react-select-async-paginate";
import {useLoadJob} from "@/utils/hooks/useLoadJob";
import {empty} from "@/utils/helper";
import {ToastContainer} from "react-toastify";
import ProtectedPage from "@/app/(main)/panel/ProtectedPage";

interface InterviewType {
    id: number;
    jobPositionId: number;
    title: string;
}

const fetchInterviewTypes = async (token: string | null, page: number, name: string): Promise<{
    content: InterviewType[],
    totalPages: number,
    last: boolean
}> => {
    const params: any = {
        page,
        sort: 'createdOn,desc'
    };
    if (name) {
        params.name = name;
    }
    const {data} = await axios.get(`${BASE_URL_API}interviewtypes/search`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        params,
    });
    return data;
};
const addInterviewType = async (newInterviewType: { jobPositionId: number, name: string }, token: string | null) => {
    const {data} = await axios.post(`${BASE_URL_API}admin/interviewtypes`, newInterviewType, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return data;
};
const editInterviewType = async (updatedInterviewType: {
    id: number;
    jobPositionId: number;
    name: string
}, token: string | null) => {
    const {data} = await axios.put(`${BASE_URL_API}admin/interviewtypes/${updatedInterviewType.id.toString()}`, {name: updatedInterviewType.name}, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return data;
};
const deleteInterviewType = async (id: number, token: string | null) => {
    const {data} = await axios.delete(`${BASE_URL_API}admin/interviewtypes/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return data;
};

const InterviewType = () => {
    const queryClient = useQueryClient();

    const [selectedInterviewType, setSelectedInterviewType] = useState<InterviewType | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteMode, setIsDeleteMode] = useState(false);
    const [newName, setNewName] = useState('');
    const [selectedJobPositionId, setSelectedJobPositionId] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLastPage, setIsLastPage] = useState(false);
    const [isLoadingAction, setIsLoadingAction] = useState(false);
    const [isOpenJobBox, setIsOpenJobBox] = useState(false);

    const inputRef = useCallback((node: HTMLInputElement) => {
        if (node !== null && isModalOpen && !isDeleteMode) {
            node.focus();
        }
    }, [isModalOpen, isDeleteMode]);

    const {token} = useStore(state => ({
        token: state.token,
    }));
    const {loadJobOptions, jobValue, setJobValue} = useLoadJob();
    const {data: interviewTypesData, isLoading} = useQuery({
        queryKey: ['interviewTypes', currentPage, searchTerm],
        queryFn: () => fetchInterviewTypes(token, currentPage, searchTerm),
        //@ts-ignore
        onSuccess: (data) => {
            setIsLastPage(data.last);
        },
        onError: (error: any) => {
            toastError({message: error.message || 'Failed to fetch interview types'});
        }
    });

    const addMutation = useMutation({
        mutationFn: (newInterviewType: {
            jobPositionId: number,
            name: string
        }) => addInterviewType(newInterviewType, token),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['interviewTypes']});
            setJobValue(null);
            toastSuccess({message: 'Interview Type added successfully'});
            closeModal();
        },
        onError: (error: any) => {
            const errorMessage = error.response?.data?.error || 'Failed to add interview type';
            toastError({message: errorMessage});
        }
    });
    const editMutation = useMutation({
        mutationFn: (updatedInterviewType: {
            id: number;
            jobPositionId: number;
            name: string
        }) => editInterviewType(updatedInterviewType, token),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['interviewTypes']});
            toastSuccess({message: 'Interview Type updated successfully'});
            closeModal();
        },
        onError: (error: any) => {
            const errorMessage = error.response?.data?.error || 'Failed to update interview type';
            toastError({message: errorMessage});
        }
    });
    const deleteMutation = useMutation({
        mutationFn: () => deleteInterviewType(selectedInterviewType!.id, token),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['interviewTypes']});
            closeModal();
            toastSuccess({message: 'Interview Type deleted successfully'});
        },
        onError: (error: any) => {
            const errorMessage = error.response?.data?.error || 'Failed to delete interview type';
            toastError({message: errorMessage});
        }
    });

    const fetchInterviewTypeById = async (id: number, token: string | null) => {
        try {
            const {data} = await axios.get(`${BASE_URL_API}admin/interviewtypes/${id}`, {
                headers: {Authorization: `Bearer ${token}`},
            });
            return data;
        } catch (error) {
            console.error("Failed to fetch interview type:", error);
            // @ts-ignore
            toastError({message: error.response?.data?.error || 'Failed to fetch interview type'});
            return null;
        }
    };
    const handleAddOrEdit = () => {
        setIsLoadingAction(true);
        if (selectedInterviewType) {
            editMutation.mutate({id: selectedInterviewType.id, jobPositionId: selectedJobPositionId!, name: newName}, {
                onSuccess: () => {
                    queryClient.invalidateQueries({queryKey: ['interviewTypes']});
                    closeModal();
                    setIsLoadingAction(false);
                },
                onError: () => setIsLoadingAction(false)
            });
        } else {
            addMutation.mutate({jobPositionId: jobValue?.value!, name: newName}, {
                onSuccess: () => {
                    queryClient.invalidateQueries({queryKey: ['interviewTypes']});
                    closeModal();
                    setIsLoadingAction(false);
                },
                onError: () => setIsLoadingAction(false)
            });
        }
    };
    const handleDelete = () => {
        setIsLoadingAction(true);
        deleteMutation.mutate(undefined, {
            onSuccess: () => {
                queryClient.invalidateQueries({queryKey: ['interviewTypes']});
                closeModal();
                setIsLoadingAction(false);
            },
            onError: () => setIsLoadingAction(false)
        });
    };
    const fetchJobPositions = async () => {
        try {
            const response = await axios.get(`${BASE_URL_API}jobposition/search`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data.content
        } catch (error) {
            console.error("Failed to fetch job positions:", error);
            toastError({message: 'Failed to fetch job positions'});
            return [];
        }
    };

    const openModal = async (interviewType: InterviewType | null = null, deleteMode: boolean = false) => {
        setIsDeleteMode(deleteMode);
        if (interviewType) {
            const fetchedData = await fetchInterviewTypeById(interviewType.id, token);
            const allJobs = await fetchJobPositions();
            if (fetchedData) {
                setSelectedInterviewType(interviewType);
                setNewName(fetchedData.title);
                const matchedJob = allJobs.find((job: { id: number; }) => job.id === fetchedData.jobPositionId);
                if (matchedJob) {
                    setJobValue({value: matchedJob.id, label: matchedJob.name});
                }
                setIsModalOpen(true);
            } else {
                setNewName('');
                setSelectedJobPositionId(null);
                setJobValue(null);
            }
        } else {
            setSelectedInterviewType(null);
            setNewName('');
            setSelectedJobPositionId(null);
            setJobValue(null);
            setIsModalOpen(true);
        }
    };
    const closeModal = () => {
        setSelectedInterviewType(null);
        setNewName('');
        setSelectedJobPositionId(null);
        setIsModalOpen(false);
        setIsDeleteMode(false);
    };
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(0);
    };

    useEffect(() => {
        if (isLastPage && currentPage > interviewTypesData?.totalPages) {
            setCurrentPage(interviewTypesData?.totalPages);
        }
    }, [isLastPage, currentPage, interviewTypesData]);

    const totalPages = interviewTypesData?.totalPages || 0;

    return (
        <ProtectedPage>
            <div className="mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                    <h1 className="text-md font-bold">Interview Types</h1>
                    <div className="flex flex-col md:flex-row items-center mt-2 md:mt-0 gap-y-4">
                        <input
                            type="text"
                            placeholder="Search by name"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="input input-bordered w-full max-w-xs h-8 text-sm bg-white"
                        />
                        <button
                            className="btn btn-sm w-full md:w-24 bg-[#F9A826] text-white border-none md:ml-4 font-medium text-xs"
                            onClick={() => openModal()}
                        >
                            Add New
                        </button>
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
                                <th className="w-16 text-center rounded-tl-none rounded-tr-xl">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {interviewTypesData?.content.map((interviewType, index) => (
                                <tr key={interviewType.id}
                                    className={`${index % 2 === 0 ? 'bg-gray-100 text-[#111B47]' : 'bg-white text-[#111B47]'}`}>
                                    <td>{(currentPage) * itemsPerPage + index + 1}</td>
                                    <td>{interviewType.title}</td>
                                    <td className="flex justify-center">
                                        <button
                                            className="btn btn-ghost text-blue-500 text-lg p-1 px-3"
                                            onClick={() => openModal(interviewType)}
                                            aria-label="Edit"
                                        >
                                            <AiOutlineEdit/>
                                        </button>
                                        <button
                                            className="btn btn-ghost text-red-500 text-lg p-1 ml-1 px-3"
                                            onClick={() => openModal(interviewType, true)}
                                            aria-label="Delete"
                                        >
                                            <AiOutlineDelete/>
                                        </button>
                                    </td>
                                </tr>
                            ))}
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
                                    className={`btn ${currentPage === index ? 'bg-[#111B47] border-none text-white' : 'hover:text-white text-[#111B47] border-[#111B47] border-[.1px] bg-white'}`}
                                    onClick={() => setCurrentPage(index)}
                                    disabled={isLastPage && index + 1 > totalPages}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                {isModalOpen && (
                    <div className={`modal modal-open`} data-theme="light">
                        <div className={`modal-box ${isOpenJobBox && 'h-[450px]'}`}>
                            <button onClick={closeModal}
                                    className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕
                            </button>
                            {!isDeleteMode ? (
                                <>
                                    <h3 className="text-lg text-center mt-3">
                                        {selectedInterviewType ? 'Edit Interview Type' : 'Add Interview Type'}
                                    </h3>

                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            handleAddOrEdit();
                                        }}
                                    >
                                        <AsyncPaginate
                                            classNames={{
                                                control: () => "border border-gray-300 w-full rounded-lg h-[40px] mt-5 text-[1rem] px-3 mr-2",
                                                container: () => "text-sm rounded w-full text-gray-400 ",
                                                menu: () => "bg-gray-100 rounded border py-2",
                                                option: ({isSelected, isFocused}) =>
                                                    isSelected
                                                        ? "dark:bg-base-content dark:text-base-200 bg-gray-400 text-gray-50 px-4 py-2"
                                                        : isFocused
                                                            ? "bg-gray-200 px-4 py-2"
                                                            : "px-4 py-2",
                                            }}
                                            value={jobValue}
                                            onChange={(e) => setJobValue(e)}
                                            //@ts-ignore
                                            loadOptions={loadJobOptions}
                                            unstyled
                                            placeholder="Job Position"
                                            //@ts-ignore
                                            additional={{page: 0}}
                                            onMenuOpen={() => setIsOpenJobBox(true)}
                                            onMenuClose={() => setIsOpenJobBox(false)}
                                        />
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            placeholder="Interview Type Name"
                                            value={newName}
                                            onChange={(e) => setNewName(e.target.value)}
                                            className="input input-bordered w-full my-4 h-10"
                                        />
                                        <div className="modal-action">
                                            <button
                                                type="button"
                                                className="w-20 btn btn-sm btn-outline btn-ghost font-light text-[.9rem] border-[.1px] hover:bg-transparent hover:border-gray-400 hover:text-gray-400"
                                                onClick={closeModal}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="w-20 btn btn-sm bg-[#F9A826] text-white font-light text-[.9rem]"
                                                disabled={selectedInterviewType ? isLoadingAction || empty(newName) : isLoadingAction || !jobValue || empty(newName)}
                                            >
                                                {isLoadingAction ? (
                                                    <PulseLoader color="#FFFFFF" size={5}/>
                                                ) : (
                                                    (selectedInterviewType ? 'Save' : 'Add')
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </>
                            ) : (
                                <>
                                    <h3 className="text-center text-lg mt-4">
                                        Are you sure you want to delete this interview type?
                                    </h3>
                                    <div className="modal-action">
                                        <button
                                            className="w-20 btn btn-sm btn-outline btn-ghost font-light text-[.9rem] border-[.1px] hover:bg-transparent hover:border-gray-400 hover:text-gray-400"
                                            onClick={closeModal}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            className="w-20 btn btn-error btn-sm font-light text-[.9rem] text-white"
                                            onClick={handleDelete}
                                            disabled={isLoadingAction}
                                        >
                                            {isLoadingAction ? (
                                                <PulseLoader color="#FFFFFF" size={5}/>
                                            ) : (
                                                'Delete'
                                            )}
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}
                <ToastContainer/>

            </div>
        </ProtectedPage>
    )
}

export default InterviewType;
