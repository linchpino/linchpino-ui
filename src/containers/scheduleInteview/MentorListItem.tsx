import {FC} from "react";
import Image from "next/image";
import Rating from '@mui/material/Rating';
import Link from "next/link";

interface MentorListItemProps {
    title: string
}

const MentorListItem: FC<MentorListItemProps> = (props) => {
    const {title} = props
    return (
        <div className="relative w-full rounded-md flex flex-col m-4 shadow-lg h-[335px] justify-between items-center px-2 py-4">
            <div className='h-[97px] bg-[#F9A826] rounded-tr-md rounded-tl-md absolute top-0 z-10 w-full' />
            <Image className='top-10 absolute w-28 h-28 z-20 rounded-full border-8 border-[#fff]'
                 src={require('../../../public/home/2.jpg')}  alt='logo'/>
            <h6 className='text-[#F9A826] mt-[135px] text-[14px]'>{title}</h6>
            <Rating name="half-rating-read" defaultValue={2.5} precision={0.5} readOnly />

            <p className="text-[#4B4141] text-[12px]">Wed, 9 December 2022,  14:15</p>
            <Link href="/"
                  className='btn btn-sm w-2/3 border-none px-2 bg-[#3F3D56] text-[#F9A826] rounded-md shadow-md text-xs'>
                Select
            </Link>
        </div>
    )
}
export default MentorListItem
