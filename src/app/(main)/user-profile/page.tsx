//@ts-nocheck
'use client'
import React, {useState} from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Rating from "@mui/material/Rating";
import {BsInstagram, BsLinkedin, BsMailbox, BsClock, BsFillPersonFill} from "react-icons/bs";
import {empty} from "@/utils/helper";

const UserProfile = () => {
    const [timeData, setTimeData] = useState([{id: 1, available: "12:00 - 12:30"}, {
        id: 2,
        available: "16:00 - 16:30"
    }, {id: 3, available: "18:30 - 19:00"}])
    const fakeInterviewData = [
        {
            id: 1,
            title: "Mock Interview",
            time: "30 min",
            timeslot: [
                {
                    id: 1,
                    mounth: 'June',
                    day: '4',
                    time: [{id: 1, available: "12:00 - 12:30"}, {id: 2, available: "16:00 - 16:30"}]
                },
                {
                    id: 2,
                    mounth: 'June',
                    day: '5',
                    time: [ {id: 2, available: "13:00 - 13:30"}]
                },
                {
                    id: 3,
                    mounth: 'June',
                    day: '7',
                    time: [{id: 2, available: "17:00 - 17:30"}]
                },
                {
                    id: 4,
                    mounth: 'June',
                    day: '9',
                    time: [{id: 4, available: "12:00 - 12:30"}, {id: 2, available: "18:00 - 18:30"}]
                },


            ]
        },
        {
            id: 2,
            title: "Consultation",
            time: "30 min",
            timeslot: [
                {
                    id: 1,
                    mounth: 'June',
                    day: '4',
                    time: [{id: 1, available: "12:00 - 12:30"}, {id: 2, available: "16:00 - 16:30"}]
                },
                {
                    id: 2,
                    mounth: 'June',
                    day: '5',
                    time: [{id: 1, available: "12:00 - 12:30"}, {id: 2, available: "16:00 - 16:30"}]
                },
            ]
        },
        {
            id: 3,
            title: "Java",
            time: "30 min",
            timeslot: [
                {
                    id: 1,
                    mounth: 'June',
                    day: '4',
                    time: [{id: 1, available: "12:00 - 12:30"}, {id: 2, available: "16:00 - 16:30"}]
                },
                {
                    id: 2,
                    mounth: 'June',
                    day: '5',
                    time: [{id: 1, available: "12:00 - 12:30"}, {id: 2, available: "16:00 - 16:30"}]
                },
                {
                    id: 3,
                    mounth: 'June',
                    day: '7',
                    time: [{id: 1, available: "12:00 - 12:30"}, {id: 2, available: "16:00 - 16:30"}]
                },


            ]
        },
    ]
    const [activeDate , setActiveDate]=useState(null)
    const [activeTime, setActiveTime] = useState(null);
    console.log(activeDate)
    console.log(timeData)
    return (
        <div>
            <div
                className='flex flex-col relative gap-x-12 lg:flex-row justify-between items-start bg-white container py-28'>
                <div
                    className="card lg:sticky lg:top-[90px] items-center w-full lg:w-1/3 shadow-[0px_10px_25px_-5px_rgba(0,0,0,0.3)] p-0 sm:p-5 ">
                    <div className="avatar mt-[-75px]">
                        <div
                            className="w-40 rounded-full ring ring-[#F9A826] ring-offset-base-content/60 ring-offset-1">
                            <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"/>
                        </div>
                    </div>
                    <div className="card-body pt-3 items-center text-center">
                        <h2 className="card-title">Linchpino Mentor <div
                            className="badge badge-info bg-[#F9A826] text-[#ffffff]">18</div></h2>
                        <p>Senior Java Developer</p>
                        <Rating name="half-rating-read" defaultValue={2.5} precision={0.5} readOnly/>
                        <div className='flex py-7'>
                            <div className="flex flex-col w-full ">
                                <div className="flex items-center">
                                    <BsInstagram className='w-6 h-6' color="#F9A826"/>
                                    <p className='ml-2'>linchpino</p>
                                </div>
                                <div className="divider "></div>
                                <div className="flex items-center">
                                    <BsLinkedin className='w-6 h-6' color="#F9A826"/>
                                    <p className='ml-2'>linchpino</p>
                                </div>
                                <div className="divider "></div>
                                <div className="flex items-center">
                                    <BsMailbox className='w-6 h-6' color="#F9A826"/>
                                    <p className='ml-2'>linchpino</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    className="card items-center w-full lg:w-2/3 shadow-[0px_10px_25px_-5px_rgba(0,0,0,0.3)] p-0 sm:p-5  mt-10 lg:mt-0">
                    <div className="card-body w-full pt-3 items-center text-center">
                        <div className="divider divider-warning">About Me</div>
                        <p className="text-left font-light text-gray-500">
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
                            been the industry's standard dummy text ever since the 1500s, when an unknown printer took a
                            galley of type and scrambled it to make a type specimen book. It has survived not only five
                            centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
                            It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum
                            passages, and more recently with desktop publishing software like Aldus PageMaker including
                            versions of Lorem Ipsum.
                        </p>
                        <div
                            className="divider divider-warning mt-9 w-full flex items-center justify-between">Statistics
                        </div>
                        <div className='w-full flex flex-col sm:flex-row items-center justify-evenly'>
                            <div className="flex items-center">
                                <div className='rounded-md flex items-center justify-center w-9 h-9 bg-[#F9A826]'>
                                    <BsClock className='w-6 h-6' color="#FFF"/>
                                </div>
                                <div className='ml-2 flex flex-col items-start'>
                                    <p className="font-bold text-gray-900">1845 mins</p>
                                    <p className="font-medium text-gray-500 text-[.9rem]">total time</p>
                                </div>
                            </div>
                            <div className="divider sm:divider-horizontal"></div>
                            <div className="flex items-center">
                                <div className='rounded-md flex items-center justify-center w-9 h-9 bg-[#F9A826]'>
                                    <BsFillPersonFill className='w-6 h-6' color="#FFF"/>
                                </div>
                                <div className='ml-2 flex flex-col items-start'>
                                    <p className="font-bold text-gray-900">105 user</p>
                                    <p className="font-medium text-gray-500 text-[.9rem]">total session</p>
                                </div>
                            </div>
                        </div>
                        <div className="divider divider-warning mt-8">Book a session</div>
                        <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5'>
                            {fakeInterviewData.map((interViewDataItem, interViewDataIndex) => (
                                <div className="flex flex-col sm:flex-row items-center justify-between w-full" key={interViewDataIndex}>
                                    <div className='ml-2 flex flex-col items=center sm:items-start'>
                                        <p className="font-bold text-gray-900 ">{interViewDataItem.title}</p>
                                        <p className="font-medium text-gray-500 text-[.9rem]">{interViewDataItem.time}</p>
                                    </div>
                                    <button
                                        onClick={() => document.getElementById(`modal${interViewDataItem.id}`).showModal()}
                                        className="btn btn-sm w-32 sm:w-16 bg-[#F9A826] text-[#FFFFFF] border-none mt-2 sm:mt-0">Book
                                    </button>
                                    <dialog id={`modal${interViewDataItem.id}`}
                                            className="modal">
                                        <div className="modal-box max-w-sm bg-white flex flex-col items-center">
                                            <form method="dialog">
                                                <button
                                                    className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕
                                                </button>
                                            </form>
                                            <h3 className="font-bold text-lg">Choose date and select time</h3>
                                            <div className='flex flex-col w-full'>
                                                <div
                                                    className='flex py-3 gap-x-3'>
                                                    {interViewDataItem.timeslot.map((timeslotItem, timeslotIndex) => (
                                                        <buttom className='relative' key={timeslotIndex}>
                                                            {timeslotItem.id === activeDate ?
                                                                <img
                                                                    className='xs:w-[74px] xs:h-[74px] w-[64px] h-[64px]'
                                                                    src='calendar.png'/>
                                                                :
                                                                <img
                                                                    className='xs:w-[74px] xs:h-[74px] w-[64px] h-[64px]'
                                                                    src='calendar-disable.png'/>
                                                            }
                                                            <button onClick={() => {
                                                                setActiveDate(timeslotItem.id)
                                                                setTimeData(timeslotItem.time)
                                                                setActiveTime(null)
                                                            }}
                                                                 className="flex flex-col items-center justify-center text-center m-auto left-0 right-0 top-4 bottom-0 absolute h-12">
                                                                <span className={`text-xs xs:text-sm ${timeslotItem.id === activeDate ? 'text-black' : 'text-gray-400'}`}>{timeslotItem.mounth}</span>
                                                                <span className={`text-sm xs:text-md mt-1 ${timeslotItem.id === activeDate ? 'text-black' : 'text-gray-400'}`}>{timeslotItem.day}</span>
                                                            </button>
                                                        </buttom>
                                                    ))}
                                                </div>
                                                <p className='mt-5 text-gray-700'>Available time for 4 June : </p>
                                                <div className='grid grid-cols-1 xs:grid-cols-2 mt-5 gap-y-5 gap-x-4'>
                                                    {timeData.map((timeDataItem, timeDataIndex) => (
                                                        <button onClick={() => setActiveTime(timeDataItem.id)} key={timeDataItem.id}
                                                             className={`${timeDataItem.id === activeTime ? 'bg-[#fff1db]' : 'bg-white'} shadow-lg ring-1 ring-black/5 rounded-md flex items-center p-3 ${timeDataItem.id === activeTime && 'border-black border-[1px]'}`}>
                                                            <BsClock
                                                                color={`${timeDataItem.id === activeTime ? '#000000' : '#cacaca'}`}
                                                                className="w-5 h-5"/>
                                                            <p className={`${timeDataItem.id === activeTime ? 'text-gray-900' : 'text-gray-400'} text-md xs:text-sm`}>{timeDataItem.available}</p>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className='flex items-center justify-between w-full mt-8'>
                                                <form method="dialog">
                                                    <button
                                                            className='btn btn-sm w-28 xs:w-36 border-none px-2 bg-[#3F3D56] text-[#F9A826] rounded-md shadow-md text-xs'>
                                                        Cancel
                                                    </button>
                                                </form>
                                                <button
                                                    className={`btn btn-sm w-28 xs:w-36 border-none px-2 bg-[#F9A826] text-[#FFFFFF] rounded-md shadow-md text-xs hover:bg-[#F9A945]`}>
                                                    Continue
                                                </button>
                                            </div>
                                        </div>
                                    </dialog>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}
export default UserProfile
