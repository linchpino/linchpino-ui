//@ts-nocheck
'use client'
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Image from "next/image";
import {useState} from "react";

export default function Feedback() {
    const [activeRate, setActiveRate] = useState(4)
    const [comment, setComment] = useState('')
    const rateData = [
        {id: 1, rate: 'very-bad', image: '/emoji/very-bad.png', disableImage: '/emoji/very-bad-disable.png'},
        {id: 2, rate: 'bad', image: '/emoji/bad.png', disableImage: '/emoji/bad-disable.png'},
        {id: 3, rate: 'normal', image: '/emoji/normal.png', disableImage: '/emoji/normal-disable.png'},
        {id: 4, rate: 'good', image: '/emoji/good.png', disableImage: '/emoji/good-disable.png'},
        {id: 5, rate: 'very-good', image: '/emoji/very-good.png', disableImage: '/emoji/very-good-disable.png'},
    ]
    return (
        <>
            <Header/>
            <div className="flex flex-col py-6 items-center justify-center w-[90%] md:w-[60%] lg:w-[40%] max-w-sm border-[.6px] rounded-md mt-10 mb-10 lg:mb-0 container p-3">
                <h1 className='text-xl text-center text-[#000]'>Thank you for attending to the interview</h1>
                <div className='flex flex-col text-center w-full max-w-xs' >
                    <span className='mt-10'>What is your feeling?</span>
                    <div className="flex mt-3 justify-between">
                        {rateData.map((item => {
                            return (
                                <div key={item.id} className="tooltip tooltip-bottom" data-tip={item.rate}>
                                    <button onClick={() => setActiveRate(item.id)}>
                                        {item.id === activeRate
                                            ?
                                            <Image  width={40} height={40} src={item.image} key={item.id}
                                                   alt='Rate'/>
                                            :
                                            <Image  width={40} height={40} src={item.disableImage}
                                                   key={item.id} alt='Rate'/>
                                        }
                                    </button>
                                </div>
                            )
                        }))}
                    </div>
                    <span className='mt-10'>Tell us what do you want?</span>
                    <textarea maxLength={300} value={comment} onChange={(e) => setComment(e.target.value)} className="textarea textarea-bordered bg-white mt-2 w-full max-w-sm"
                              placeholder="Write something..."></textarea>
                    <span className="text-xs text-left ml-1 mt-1">{comment.length} / 300</span>
                    <button
                        className='btn btn-sm btn-warning w-32 bg-[#F9A826] text-white rounded-md shadow-md mt-6 py-2 px-3'>
                        Send
                    </button>
                </div>

            </div>
            <Footer/>
        </>
    )
}
