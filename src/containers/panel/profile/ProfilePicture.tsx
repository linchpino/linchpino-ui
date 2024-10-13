'use client'
import React, {useState, useRef, useEffect} from "react";
import axios from "axios";
import {BASE_URL_API} from "@/utils/system";
import useStore from "@/store/store";
import {toastSuccess, toastError} from "@/components/CustomToast";
import {FaCamera} from 'react-icons/fa';
import {empty} from "@/utils/helper";
import PulseLoader from "react-spinners/PulseLoader";

interface ProfilePictureProps {
    avatar: string | null;
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({avatar}) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [imageLoading, setImageLoading] = useState<boolean>(true);
    const {token} = useStore(state => ({
        token: state.token,
    }));

    useEffect(() => {
        if (avatar) {
            const fetchProfileImage = async () => {
                setImageLoading(true);
                try {
                    const response = await axios.get(`${BASE_URL_API}files/image/${avatar}`, {
                        headers: {
                            "Authorization": `Bearer ${token}`,
                        },
                        responseType: 'blob',
                    });
                    if (response.status === 200) {
                        const imageUrl = URL.createObjectURL(response.data);
                        setPreview(imageUrl);
                    }
                } catch (error) {
                    console.error("Error fetching profile image:", error);
                } finally {
                    setImageLoading(false);
                }
            };
            fetchProfileImage();
        } else {
            setPreview("");
            setImageLoading(false);
        }
    }, [avatar, token]);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
            await handleUpload(file);
        }
    };

    const handleUpload = async (file: File) => {
        setLoading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.post(`${BASE_URL_API}accounts/image`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${token}`,
                }
            });

            if (response.status === 200 || response.status === 201) {
                toastSuccess({message: "Upload successful!"});
            } else {
                const errorMessage = response.data.error || "Upload failed with unexpected status!";
                toastError({message: errorMessage});
                setPreview("");
                setSelectedFile(null);
            }
        } catch (error) {
            // @ts-ignore
            const errorMessage = error.response?.data?.error || error.message || "Upload failed!";
            toastError({message: errorMessage});
            setPreview("");
            setSelectedFile(null);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = () => {
        setSelectedFile(null);
        setPreview("");
        toastSuccess({message: "Picture removed successfully!"});
    };

    const handleChoosePicture = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <>
            <div className="flex text-left">
                <h1 className="text-md font-bold">Profile Picture</h1>
            </div>
            <div className='flex flex-col md:flex-row items-center gap-x-8'>
                <div className="avatar mt-3 relative w-36">
                    <div className="flex w-36 h-36 rounded-xl bg-gray-200 items-center justify-center">
                        {imageLoading ? (
                            <div className="flex items-center justify-center">
                                <PulseLoader size={5} color="#F9A826" className='mt-16'/>
                            </div>
                        ) : (
                            preview ? (
                                <img src={preview} alt="Profile" className="rounded-xl"/>
                            ) : (
                                <FaCamera className="text-gray-400 text-4xl mx-auto mt-12"/>
                            )
                        )}
                        {loading && (
                            <div className="absolute inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center rounded-xl">
                                <div className="w-10 h-10 border-4 border-gray-300 border-t-4 border-t-[#F9A826] rounded-full animate-spin"></div>
                            </div>
                        )}
                    </div>
                </div>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    ref={fileInputRef}
                />
                <button
                    onClick={handleChoosePicture}
                    disabled={loading}
                    className={`btn btn-sm xs:w-32 w-28 border-none px-2 bg-[#F9A826] text-[#FFFFFF] rounded-md shadow-md text-xs hover:bg-[#F9A945] mt-3 md:mt-0 ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
                >
                    Choose Picture
                </button>
                {!empty(selectedFile) &&
                    <button
                        onClick={handleRemove}
                        disabled={loading}
                        className={`btn btn-outline btn-error btn-sm xs:w-32 w-28 px-2 rounded-md shadow-md text-xs hover:bg-[#F9A945] mt-3 md:mt-0 ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
                    >
                        Remove Picture
                    </button>
                }
            </div>
        </>
    );
}

export default ProfilePicture;
