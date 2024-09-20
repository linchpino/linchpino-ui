import React, { FC, useEffect, useState } from "react";
import Image from "next/image";
import moment from "moment/moment";
import { empty } from "@/utils/helper";
import { BASE_URL_API } from "@/utils/system";
import axios from "axios";
import PulseLoader from "react-spinners/PulseLoader";

interface MentorListItemProps {
    title: string;
    availableTimeFrom: string;
    availableTimeTo: string;
    avatar: string;
    onSelect(): void;
}

const MentorListItem: FC<MentorListItemProps> = (props) => {
    const { availableTimeFrom, availableTimeTo, title, avatar, onSelect } = props;

    const [imageUrl, setImageUrl] = useState<string>('/logo-sm.svg');
    const [avatarLoading, setAvatarLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchAvatar = async () => {
            if (!empty(avatar)) {
                try {
                    const response = await axios.get(`${BASE_URL_API}files/image/${avatar}`, {
                        responseType: "blob",
                    });
                    const url = URL.createObjectURL(response.data);
                    setImageUrl(url);
                } catch (error) {
                    console.error("Error fetching avatar:", error);
                    setImageUrl("/logo-sm.svg");
                } finally {
                    setAvatarLoading(false);
                }
            } else {
                setImageUrl("/logo-sm.svg");
                setAvatarLoading(false);
            }
        };

        fetchAvatar();
    }, [avatar]);

    return (
        <div className="relative w-full rounded-md flex flex-col m-4 shadow-lg h-[310px] justify-between items-center px-2 py-4">
            <div className='h-[97px] bg-[#F9A826] rounded-tr-md rounded-tl-md absolute top-0 z-10 w-full' />
            {avatarLoading ? (
                <div className="absolute top-10 z-20 w-28 h-28 flex justify-center items-center bg-white rounded-full">
                    <PulseLoader size={8} color='#F9A826'/>
                </div>
            ) : (
                <Image
                    className="top-10 absolute w-28 h-28 z-20 rounded-full border-8 border-[#fff] bg-white "
                    src={imageUrl}
                    alt="avatar"
                    width={112}
                    height={112}
                    onLoad={() => setAvatarLoading(false)}
                    onError={() => setAvatarLoading(false)}
                />
            )}

            <h6 className='text-[#F9A826] mt-[135px] text-[14px]'>{title}</h6>
            <p className="text-[#4B4141] text-[12px]">
                From: {!empty(availableTimeFrom) ? moment(availableTimeFrom).format('ddd, D MMMM YYYY, HH:mm') : ""}
            </p>
            <p className="text-[#4B4141] text-[12px]">
                To: {!empty(availableTimeTo) ? moment(availableTimeTo).format('ddd, D MMMM YYYY, HH:mm') : ""}
            </p>
            <button
                onClick={onSelect}
                className='btn btn-sm w-2/3 border-none px-2 bg-[#3F3D56] text-[#F9A826] rounded-md shadow-md text-xs'
            >
                Select
            </button>
        </div>
    );
};

export default MentorListItem;
