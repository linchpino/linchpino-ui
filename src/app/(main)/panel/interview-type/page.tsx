'use client'
import React, {useState, useEffect} from 'react';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import axios from 'axios';
import PanelContentChild from "@/containers/panel/PanelContentChild";
import {BASE_URL_API} from "@/utils/system";
import useStore from "@/store/store";
import {toastError, toastSuccess} from '@/components/CustomToast';
import {AiOutlineEdit, AiOutlineDelete} from 'react-icons/ai';
import Spinner from "@/components/Spinner";
import PulseLoader from "react-spinners/PulseLoader";
import {AsyncPaginate, LoadOptions} from "react-select-async-paginate";
import { useLoadJob } from '@/utils/hooks/useLoadJob';

interface InterviewType {
    id: number;
    title: string;
}

const fetchInterviewType = async (token: string | null, page: number, name: string): Promise<{
    content: InterviewType[],
    totalPages: number,
    last: boolean
}> => {
    const params: any = {
        page,
    };
    if (name) {
        params.name = name;
    }
    const {data} = await axios.get(`${BASE_URL_API}/interviewtypes/search`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        params,
    });
    return data;
};

const addInterviewType = async (newInterviewType: { title: string }, token: string | null) => {
    const {data} = await axios.post(`${BASE_URL_API}admin/interviewtypes`, newInterviewType, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return data;
};
const editInterviewType = async (updatedInterviewType: { id: number; title: string }, token: string | null) => {
    const {data} = await axios.put(`${BASE_URL_API}admin/interviewtypes/${updatedInterviewType.id}`, {title: updatedInterviewType.title}, {
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
    const [newTitle, setNewTitle] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLastPage, setIsLastPage] = useState(false);
    const [isLoadingAction, setIsLoadingAction] = useState(false);

    const {token} = useStore(state => ({
        token: state.token,
    }));

    const { loadJobOptions, jobValue, setJobValue } = useLoadJob();

    const {data: interviewTypeData, isLoading} = useQuery({
        queryKey: ['interviewType', currentPage, searchTerm],
        queryFn: () => fetchInterviewType(token, currentPage, searchTerm),
        //@ts-ignore
        onSuccess: (data) => {
            setIsLastPage(data.last);
        },
        onError: (error: any) => {
            toastError({message: error.message || 'Failed to fetch interview type'});
        }
    });
    const addMutation = useMutation({
        mutationFn: (newJobPosition: { title: string }) => addInterviewType(newJobPosition, token),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['interviewType']});
            closeModal();
            toastSuccess({message: 'Interview type added successfully'});
        },
        onError: (error: any) => {
            toastError({message: error.message || 'Failed to add interview type'});
        }
    });
    const editMutation = useMutation({
        mutationFn: (updatedJobPosition: { id: number; title: string }) => editInterviewType(updatedJobPosition, token),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['jobPositions']});
            closeModal();
            toastSuccess({message: 'Job Position updated successfully'});
        },
        onError: (error: any) => {
            toastError({message: error.message || 'Failed to update job position'});
        }
    });
    const deleteMutation = useMutation({
        mutationFn: () => deleteInterviewType(selectedInterviewType!.id, token),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['jobPositions']});
            closeModal();
            toastSuccess({message: 'Job Position deleted successfully'});
        },
        onError: (error: any) => {
            toastError({message: error.message || 'Failed to delete job position'});
        }
    });

    const handleAddOrEdit = () => {
        setIsLoadingAction(true);
        if (selectedInterviewType) {
            editMutation.mutate({ id: selectedInterviewType.id, title: newTitle }, {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ['jobPositions'] });
                    closeModal();
                    setIsLoadingAction(false);
                },
                onError: () => setIsLoadingAction(false)
            });
        } else {
            addMutation.mutate({ title: newTitle }, {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ['jobPositions'] });
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
                queryClient.invalidateQueries({ queryKey: ['jobPositions'] });
                closeModal();
                setIsLoadingAction(false);
            },
            onError: () => setIsLoadingAction(false)
        });
    };
    const openModal = (jobPosition: InterviewType | null = null, deleteMode: boolean = false) => {
        setSelectedInterviewType(jobPosition);
        setNewTitle(jobPosition ? jobPosition.title : '');
        setIsDeleteMode(deleteMode);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedInterviewType(null);
        setNewTitle('');
        setIsModalOpen(false);
        setIsDeleteMode(false);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(0);
    };

    useEffect(() => {
        if (isLastPage && currentPage > interviewTypeData?.totalPages) {
            setCurrentPage(interviewTypeData?.totalPages);
        }
    }, [isLastPage, currentPage, interviewTypeData]);

    const totalPages = interviewTypeData?.totalPages || 0;

    return (
        <PanelContentChild>
            <div className="mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                    <h1 className="text-md font-bold">Job Positions</h1>
                    <div className="flex flex-col md:flex-row items-center mt-2 md:mt-0 gap-y-4">
                        <input
                            type="text"
                            placeholder="Search by title"
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
                            <tr className='text-[.9rem] font-medium border-b-0 bg-[#111B47] text-white'>
                                <th className="w-12 rounded-tr-none rounded-tl-xl">#</th>
                                <th>Title</th>
                                <th className="w-16 rounded-tl-none rounded-tr-xl ">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {interviewTypeData?.content.map((interviewItem, index) => {
                                return(
                                    <tr key={interviewItem.id}
                                        className={`${index % 2 === 0 ? 'bg-gray-100 text-[#111B47]' : 'bg-white text-[#111B47]'}`}>
                                        <td>{(currentPage) * itemsPerPage + index + 1}</td>
                                        <td>{interviewItem.title}</td>
                                        <td className="flex justify-center">
                                            <button
                                                className="btn btn-ghost text-blue-500 text-lg p-1"
                                                onClick={() => openModal(interviewItem)}
                                                aria-label="Edit"
                                            >
                                                <AiOutlineEdit/>
                                            </button>
                                            <button
                                                className="btn btn-ghost text-red-500 text-lg p-1 ml-2"
                                                onClick={() => openModal(interviewItem, true)}
                                                aria-label="Delete"
                                            >
                                                <AiOutlineDelete/>
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </table>

                    )}
                </div>

                {!isLoading &&
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
                }

                {isModalOpen && (
                    <div className="modal modal-open" data-theme="light">
                        <div className="modal-box">
                            {!isDeleteMode ? (
                                <>
                                    <h3 className="text-lg text-center">
                                        {selectedInterviewType ? 'Edit Job Position' : 'Add Job Position'}
                                    </h3>
                                    <AsyncPaginate
                                        classNames={{
                                            control: () => "border border-gray-300 w-full rounded-md h-[48px] mt-1 text-sm px-3 mr-2",
                                            container: () => "text-sm rounded w-full text-[#000000]",
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
                                    />
                                    <input
                                        type="text"
                                        placeholder="Job Title"
                                        value={newTitle}
                                        onChange={(e) => setNewTitle(e.target.value)}
                                        className="input input-bordered w-full my-4 h-10"
                                    />
                                    <div className="modal-action">
                                        <button
                                            className="btn btn-sm bg-[#F9A826] text-white font-light text-[.9rem]"
                                            onClick={handleAddOrEdit}
                                            disabled={isLoadingAction}
                                        >
                                            {isLoadingAction ? (
                                                <PulseLoader  color="#FFFFFF" size={5} />
                                            ) : (
                                                (selectedInterviewType ? 'Save' : 'Add')
                                            )}
                                        </button>
                                        <button
                                            className="btn btn-sm btn-outline btn-ghost font-light text-[.9rem] border-[.1px] hover:bg-transparent hover:border-gray-400 hover:text-gray-400"
                                            onClick={closeModal}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <h3 className="text-center text-lg">
                                        Are you sure you want to delete this job position?
                                    </h3>
                                    <div className="modal-action">
                                        <button
                                            className="btn btn-error btn-sm font-light text-[.9rem] "
                                            onClick={handleDelete}
                                            disabled={isLoadingAction}
                                        >
                                            {isLoadingAction ? (
                                                <PulseLoader  color="#FFFFFF" size={5} />
                                            ) : (
                                                'Delete'
                                            )}
                                        </button>
                                        <button
                                            className="btn btn-sm btn-outline btn-ghost font-light text-[.9rem] border-[.1px] hover:bg-transparent hover:border-gray-400 hover:text-gray-400"
                                            onClick={closeModal}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}

            </div>
        </PanelContentChild>
    );
};

export default InterviewType;
