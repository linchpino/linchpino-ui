//@ts-nocheck
import React, {FC, useEffect} from "react";
import {Calendar, DateObject} from "react-multi-date-picker"
import MentorListItem from "@/containers/scheduleInteview/MentorListItem";
import '../../app/globals.css'
import "react-multi-date-picker/styles/colors/yellow.css"
import {empty} from "@/utils/helper";
import type {Value} from "react-multi-date-picker"
import {useQuery} from "@tanstack/react-query";
import moment from "moment/moment";
import {BASE_URL_API} from "@/utils/system";
import Spinner from "@/components/Spinner";
import axios from "axios";
import 'moment-timezone';
import useStore from "@/store/store";

interface ChooseMentorProp {
    calendarValue: Value;
    setCalendarValue: React.Dispatch<React.SetStateAction<Value>>;
    activeStep: number,
    setActiveStep: React.Dispatch<React.SetStateAction<number>>;
}

const ChooseMentor: FC<ChooseMentorProp> = (props) => {
    const {scheduleInterview, setScheduleInterviewItem} = useStore();
    const interviewId = scheduleInterview.interviewTypeId
    const {calendarValue, setCalendarValue, activeStep, setActiveStep} = props
    const now = new DateObject()
    const fetchMetnor = async () => {
        let selectedDate = ""
        if (empty(calendarValue)) {
            selectedDate = moment().tz('GMT').format('YYYY-MM-DDTHH:mm:ss%2B00:00');
        } else {
            const strDate = calendarValue.toDate?.()
            selectedDate = moment(strDate).tz('GMT').format('YYYY-MM-DDTHH:mm:ss%2B00:00');
        }
        const response = await axios(`${BASE_URL_API}accounts/mentors/search?interviewTypeId=${interviewId}&date=${selectedDate}`)
        return response.data
    }
    const {data = [], refetch, isLoading, isRefetching} = useQuery({
        queryKey: ['mentor'],
        queryFn: fetchMetnor,
    })
    useEffect(() => {
        refetch()
    }, [calendarValue]);
    const renderList = () => {
        if (isLoading || isRefetching) {
            return <Spinner loading={isLoading || isRefetching}/>
        } else if (empty(data.length)) {
            return <p className='text-[#F9A826] mt-8'>For this time not slot available</p>
        } else {
            return (
                <div
                    className={`mentor-scroll-bar overflow-scroll overflow-x-hidden bg-scroll w-full lg:w-4/5 max-h-[800px] grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 justify-items-center gap-5 mt-10 px-4`}>
                    {
                        !empty(data) && !empty(data.length) &&
                        data.map((mentorItem, index) => {
                            const mentorFullName = mentorItem.mentorFirstName + " " + mentorItem.mentorLastName
                            const isoDate=!empty(mentorItem.from) ?  moment(mentorItem.from).format('ddd, D MMMM YYYY, HH:mm') : ""
                            return <MentorListItem
                                key={mentorItem.mentorId}
                                availableTimeFrom={mentorItem.validWindow?.start}
                                availableTimeTo={mentorItem.validWindow?.end}
                                title={mentorFullName}
                                avatar={mentorItem.avatar}
                                onSelect={() => {
                                    setScheduleInterviewItem('startTime', mentorItem.validWindow?.start);
                                    setScheduleInterviewItem('endTime', mentorItem.validWindow?.end);
                                    setScheduleInterviewItem('mentorAccountId', mentorItem.mentorId);
                                    setScheduleInterviewItem('mentorName', mentorFullName);
                                    setScheduleInterviewItem('isoDate', isoDate);
                                    setScheduleInterviewItem('avatar', mentorItem.avatar);
                                    setActiveStep(activeStep + 1)
                                }}
                            />
                        })
                    }
                </div>
            )
        }
    }
    return (
        <div className='flex flex-col justify-center w-full items-center'>
            <p className="text-[20px] text-[#F9A826]">{!empty(calendarValue) ? calendarValue.format("dddd DD MMMM YYYY") : now.format("dddd DD MMMM YYYY")}</p>
            <Calendar minDate={new Date().toISOString().split('T')[0]}
                      className='yellow mt-3' value={calendarValue} onChange={setCalendarValue}/>
            {renderList()}
        </div>
    )
}
export default ChooseMentor
