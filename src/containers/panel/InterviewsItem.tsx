import React, { FC } from "react";
import moment from 'moment';
import Countdown from "../../components/Countdown";

interface InterviewsItemProp {
    data: any;
}

const InterviewsItem: FC<InterviewsItemProp> = (props) => {
    const calculateDuration = (dateFrom: string, dateTo: string) => {
        const from = moment(dateFrom);
        const to = moment(dateTo);
        const duration = moment.duration(to.diff(from));

        return {
            hours: Math.floor(duration.asHours()),
            minutes: duration.minutes(),
            seconds: duration.seconds(),
        };
    };

    const duration = calculateDuration(props.data.dateFrom, props.data.dateTo);

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
            <span>Mentor: {props.data.mentorName}</span>
            <div>
                <span className='flex gap-x-2'>From: <Countdown targetDate={props.data.dateFrom} startDate={props.data.dateFrom} endDate={props.data.dateTo} /></span>
            </div>
            <div>
                <span>To: {renderDuration()}</span>
            </div>
            <span>Position: {props.data.jobPosition}</span>
        </div>
    );
};

export default InterviewsItem;
