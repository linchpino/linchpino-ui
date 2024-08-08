'use client'
import React, {useState} from 'react';
import PanelContentChild from "@/containers/panel/PanelContentChild";
import InterviewsItem from "@/containers/panel/InterviewsItem";
import {useQuery} from '@tanstack/react-query';
import axios from 'axios';
import {BASE_URL_API} from "@/utils/system";
import useStore from "@/store/store";
import Spinner from "@/components/Spinner";

type Interview = {
    intervieweeId: number;
    intervieweeName: string;
    fromTime: string;
    toTime: string;
    interviewType: string;
};
const Interviews: React.FC = () => {
    const fakeData = [
        {intervieweeId:1,interviewType : 'Java',toTime:'2024-07-21 23:45:00',fromTime:'2024-07-21 23:15:00', intervieweeName:'Mahdi Tilab'},
        {intervieweeId:2,interviewType : 'Java',toTime:'2024-07-21 23:45:00',fromTime:'2024-07-21 23:15:00', intervieweeName:'Mahdi Tilab'},
        {intervieweeId:3,interviewType : 'Java',toTime:'2024-07-21 23:45:00',fromTime:'2024-07-21 23:15:00', intervieweeName:'Mahdi Tilab'},
        {intervieweeId:4,interviewType : 'Java',toTime:'2024-07-21 23:45:00',fromTime:'2024-07-21 23:15:00', intervieweeName:'Mahdi Tilab'},
        {intervieweeId:5,interviewType : 'Java',toTime:'2024-07-21 23:45:00',fromTime:'2024-07-21 23:15:00', intervieweeName:'Mahdi Tilab'},
        {intervieweeId:6,interviewType : 'Java',toTime:'2024-07-21 23:45:00',fromTime:'2024-07-21 23:15:00', intervieweeName:'Mahdi Tilab'},

    ]

    return (
        <PanelContentChild>
            <div className='flex flex-col gap-x-8 gap-y-5 lg:gap-y-0 relative'>
                <div className='mt-10'>
                    <span className='text-[#F9A826]'>Past Interviews</span>
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-4'>
                        {fakeData.map((interview: Interview) => (
                            <InterviewsItem key={interview.intervieweeId} data={interview} isPast={true}/>
                        ))}

                    </div>

                </div>
            </div>
        </PanelContentChild>
    );
};

export default Interviews;
