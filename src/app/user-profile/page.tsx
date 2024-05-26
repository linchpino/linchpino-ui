import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Rating from "@mui/material/Rating";
import {BsInstagram, BsLinkedin, BsMailbox} from "react-icons/bs";

const UserProfile = () => {
    return (
        <div>
            <Header/>
            <div
                className='flex flex-col gap-x-12 lg:flex-row justify-between relative items-start bg-white container py-28'>
                <div className="card sticky items-center w-full lg:w-1/3 shadow-[0px_10px_25px_-5px_rgba(0,0,0,0.3)]">
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
                <div className="card items-center w-full lg:w-2/3 shadow-[0px_10px_25px_-5px_rgba(0,0,0,0.3)]">
                    <div className="card-body w-full pt-3 items-center text-center">
                        <div className="divider divider-warning">About Me</div>
                        <textarea className="textarea textarea-ghost w-full " placeholder="Bio"></textarea>

                        <div className="divider divider-warning mt-6">Statistics</div>
                        <textarea className="textarea textarea-ghost w-full " placeholder="Bio"></textarea>

                        <div className="divider divider-warning mt-6">Book a session</div>
                        <textarea className="textarea textarea-ghost w-full " placeholder="Bio"></textarea>

                        <div className="card-actions mt-5">
                            <button className="btn bg-[#F9A826] text-[#FFFFFF] border-none">Save Changes</button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>

    )
}
export default UserProfile
