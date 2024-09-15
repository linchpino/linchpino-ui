import React, { FC } from "react";
import Image from "next/image";
import Rating from '@mui/material/Rating';
import { empty } from "@/utils/helper";
import moment from "moment/moment";
import defaultAvatar from '../../../public/logo.svg';

interface MentorListItemProps {
    title: string;
    availableTimeFrom: string;
    availableTimeTo: string;
    avatar: string;
    onSelect(): void;
}

const MentorListItem: FC<MentorListItemProps> = (props) => {
    const { availableTimeFrom, availableTimeTo, title, avatar, onSelect } = props;

    const imageUrl = !empty(avatar) ? avatar : defaultAvatar;

    return (
        <div className="relative w-full rounded-md flex flex-col m-4 shadow-lg h-[310px] justify-between items-center px-2 py-4">
            <div className='h-[97px] bg-[#F9A826] rounded-tr-md rounded-tl-md absolute top-0 z-10 w-full' />
            <Image
                className='top-10 absolute w-28 h-28 z-20 rounded-full border-8 border-[#fff] bg-white'
                src={imageUrl}
                alt='avatar'
                width={112}
                height={112}
            />
            <h6 className='text-[#F9A826] mt-[135px] text-[14px]'>{title}</h6>
            {/*<Rating name="half-rating-read" defaultValue={2.5} precision={0.5} readOnly />*/}

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
