"use client"
import React from "react";
import ProfilePicture from "@/containers/panel/profile/ProfilePicture";
import ProfileInformation from "@/containers/panel/profile/ProfileInformation";
import ProfileTimeSlot from "@/containers/panel/profile/ProfileTimeSlot";
import ProtectedPage from "@/app/(main)/panel/ProtectedPage";

const Profile = () => {

    return (
        <ProtectedPage>
            <ProfilePicture/>
            <ProfileInformation/>
            <ProfileTimeSlot/>
        </ProtectedPage>
    );
};

export default Profile;
