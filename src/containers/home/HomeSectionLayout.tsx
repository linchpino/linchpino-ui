'use client'
import {FC} from "react";
import Image from "next/image";

interface HomeLayoutProps {
    imageSource: string,
    title: string,
    description: string,
    buttonText: string,
    isLtr: boolean,
    onClick:() => void,
}

const HomeSectionLayout: FC<HomeLayoutProps> = (props) => {
    const {imageSource, title, description, buttonText, isLtr = false,onClick} = props
    return (
        <div className='lg:flex items-center mt-14'>
            <Image className={`flex ${isLtr ? "order-2 lg:order-2" : "order-1 lg:order-1"}`} src={imageSource}
                   alt='logo' width={480} height={364}/>

            <div
                className={`flex flex-col items-start lg:px-20 ${isLtr ? "order-1 lg:order-1" : "order-2 lg:order-2"} `}>
                <h2 className="font-bold mt-4 lg:mt-0">{title}</h2>
                <p className='whitespace-pre-line text-[#6F7CB2] mt-6'>{description}</p>
                <button onClick={onClick} className='btn btn-warning w-52 bg-[#F9A826] text-white rounded-md shadow-md mt-6 py-2 px-3'>
                    {buttonText}
                </button>
            </div>

        </div>
    )
}
export default HomeSectionLayout
