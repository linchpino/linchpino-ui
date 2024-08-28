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

interface JobPosition {
    id: number;
    title: string;
}

const fetchJobPositions = async (token: string | null, page: number, name: string): Promise<{
    content: JobPosition[],
    totalPages: number,
    last: boolean
}> => {
    const params: any = {
        page,
    };
    if (name) {
        params.name = name;
    }
    const {data} = await axios.get(`${BASE_URL_API}jobposition/search`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        params,
    });
    return data;
};

const addJobPosition = async (newJobPosition: { title: string }, token: string | null) => {
    const {data} = await axios.post(`${BASE_URL_API}admin/jobposition`, newJobPosition, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return data;
};

const editJobPosition = async (updatedJobPosition: { id: number; title: string }, token: string | null) => {
    const {data} = await axios.put(`${BASE_URL_API}admin/jobposition/${updatedJobPosition.id}`, {title: updatedJobPosition.title}, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return data;
};

const deleteJobPosition = async (id: number, token: string | null) => {
    const {data} = await axios.delete(`${BASE_URL_API}admin/jobposition/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return data;
};

const JobPosition = () => {
    const queryClient = useQueryClient();

    const [selectedJobPosition, setSelectedJobPosition] = useState<JobPosition | null>(null);
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

    const {data: jobPositionsData, isLoading} = useQuery({
        queryKey: ['jobPositions', currentPage, searchTerm],
        queryFn: () => fetchJobPositions(token, currentPage, searchTerm),
        //@ts-ignore
        onSuccess: (data) => {
            setIsLastPage(data.last);
        },
        onError: (error: any) => {
            toastError({message: error.message || 'Failed to fetch job positions'});
        }
    });
    const addMutation = useMutation({
        mutationFn: (newJobPosition: { title: string }) => addJobPosition(newJobPosition, token),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['jobPositions']});
            closeModal();
            toastSuccess({message: 'Job Position added successfully'});
        },
        onError: (error: any) => {
            toastError({message: error.message || 'Failed to add job position'});
        }
    });
    const editMutation = useMutation({
        mutationFn: (updatedJobPosition: { id: number; title: string }) => editJobPosition(updatedJobPosition, token),
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
        mutationFn: () => deleteJobPosition(selectedJobPosition!.id, token),
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
        if (selectedJobPosition) {
            editMutation.mutate({ id: selectedJobPosition.id, title: newTitle }, {
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
    const openModal = (jobPosition: JobPosition | null = null, deleteMode: boolean = false) => {
        setSelectedJobPosition(jobPosition);
        setNewTitle(jobPosition ? jobPosition.title : '');
        setIsDeleteMode(deleteMode);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedJobPosition(null);
        setNewTitle('');
        setIsModalOpen(false);
        setIsDeleteMode(false);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(0);
    };

    useEffect(() => {
        if (isLastPage && currentPage > jobPositionsData?.totalPages) {
            setCurrentPage(jobPositionsData?.totalPages);
        }
    }, [isLastPage, currentPage, jobPositionsData]);

    const totalPages = jobPositionsData?.totalPages || 0;

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
                            {jobPositionsData?.content.map((jobPosition, index) => {
                                return(
                                    <tr key={jobPosition.id}
                                        className={`${index % 2 === 0 ? 'bg-gray-100 text-[#111B47]' : 'bg-white text-[#111B47]'}`}>
                                        <td>{(currentPage) * itemsPerPage + index + 1}</td>
                                        <td>{jobPosition.title}</td>
                                        <td className="flex justify-center">
                                            <button
                                                className="btn btn-ghost text-blue-500 text-lg p-1"
                                                onClick={() => openModal(jobPosition)}
                                                aria-label="Edit"
                                            >
                                                <AiOutlineEdit/>
                                            </button>
                                            <button
                                                className="btn btn-ghost text-red-500 text-lg p-1 ml-2"
                                                onClick={() => openModal(jobPosition, true)}
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
                                        {selectedJobPosition ? 'Edit Job Position' : 'Add Job Position'}
                                    </h3>
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
                                                (selectedJobPosition ? 'Save' : 'Add')
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

export default JobPosition;
