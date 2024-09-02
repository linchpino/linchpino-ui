"use client"
import PanelContentChild from "@/containers/panel/PanelContentChild";
import React from "react";
import ProfilePicture from "@/containers/panel/profile/ProfilePicture";
import ProfileInformation from "@/containers/panel/profile/ProfileInformation";
import ProfileTimeSlot from "@/containers/panel/profile/ProfileTimeSlot";

const Profile = () => {

    return (
        <>
            <ProfilePicture/>
            <ProfileInformation/>
            <ProfileTimeSlot/>
        </>
    );
};

export default Profile;
