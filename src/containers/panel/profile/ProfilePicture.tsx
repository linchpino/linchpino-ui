import React from "react";

const ProfilePicture = () =>{
    return(
        <>
            <h4 className='text-center md:text-left'>Profile Picture</h4>
            <div className='flex flex-col md:flex-row items-center gap-x-8'>
                <div className="avatar mt-3">
                    <div className="w-36 rounded-xl">
                        <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"/>
                    </div>
                </div>
                <button
                    className={`btn btn-sm xs:w-32 w-28 border-none px-2 bg-[#F9A826] text-[#FFFFFF] rounded-md shadow-md text-xs hover:bg-[#F9A945] mt-3 md:mt-0`}>
                    Choose Picture
                </button>
                <button
                    className={`btn btn-outline btn-error btn-sm xs:w-32 w-28 px-2 rounded-md shadow-md text-xs hover:bg-[#F9A945] mt-3 md:mt-0`}>
                    Remove Picture
                </button>
            </div>
        </>
    )
}
export default ProfilePicture
