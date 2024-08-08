import React, { FC } from "react";
import moment from 'moment';
import Countdown from "../../components/Countdown";

interface InterviewsItemProp {
    data: any;
    isPast : boolean,
    role:string
}

const InterviewsItem: FC<InterviewsItemProp> = (props) => {
    const calculateDuration = (fromTime: string, toTime: string) => {
        const from = moment(fromTime);
        const to = moment(toTime);
        const duration = moment.duration(to.diff(from));

        return {
            hours: Math.floor(duration.asHours()),
            minutes: duration.minutes(),
            seconds: duration.seconds(),
        };
    };

    const duration = calculateDuration(props.data.fromTime, props.data.toTime);

    const renderDuration = () => {
        const { hours, minutes, seconds } = duration;
        let durationString = '';

        if (hours > 0) {
            durationString += `${hours} hours `;
        }
        if (minutes > 0) {
            durationString += `${minutes} minutes `;
        }
        if (seconds > 0) {
            durationString += `${seconds} seconds`;
        }

        return durationString.trim();
    };

    return (
        <div className='rounded-md border-l-2 border-[#F9A826] shadow-lg flex flex-col mt-4 p-3 gap-y-2'>
            <span>{props.role ==="MENTOR" ? 'Jobseeker ':'Mentor '}: {props.data.intervieweeName}</span>
            <div>
                {props.isPast ?
                    <span className='flex gap-x-2'>From: {moment(props.data.fromTime).format('MMMM D, YYYY h:mm A')}</span>
                    :
                    <span className='flex gap-x-2'>From: <Countdown targetDate={props.data.fromTime} startDate={props.data.fromTime} endDate={props.data.toTime} /></span>
                }
            </div>
            <div>
                <span>Duration: {renderDuration()}</span>
            </div>
            <span>Position: {props.data.interviewType}</span>
        </div>
    );
};

export default InterviewsItem;
