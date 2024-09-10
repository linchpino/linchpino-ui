"use client"
import React from "react";
import ProfilePicture from "@/containers/panel/profile/ProfilePicture";
import ProfileInformation from "@/containers/panel/profile/ProfileInformation";
import ProfileTimeSlot from "@/containers/panel/profile/ProfileTimeSlot";
import ProtectedPage from "@/app/(main)/panel/ProtectedPage";
import useStore from "@/store/store";

const Profile = () => {
    const {userRoles} = useStore(state => ({
        userRoles: state.userRoles,
    }));
    return (
        <ProtectedPage>
            <ProfilePicture/>
            <ProfileInformation/>
            {
                // @ts-ignore
                userRoles.some(() => userRoles.includes("MENTOR")) &&
                <ProfileTimeSlot/>
            }
        </ProtectedPage>
    );
};

export default Profile;
