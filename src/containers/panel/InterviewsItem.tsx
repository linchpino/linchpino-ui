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
            <p className="flex flex-col sm:flex-row items-start sm:items-center">
                <span className="font-medium text-gray-700">{props.role ==="MENTOR" ? 'Jobseeker ':'Mentor '}:</span>
                <span className="ml-0 sm:ml-2"> {props.data.intervieweeName}</span>
            </p>
            <div>
                {props.isPast ?
                    <p className="flex flex-col sm:flex-row items-start sm:items-center">
                        <span className="font-medium text-gray-700">From: </span>
                        <span className="ml-0 sm:ml-2"> {moment(props.data.fromTime).format('MMMM D, YYYY h:mm A')}</span>
                    </p>
                    :
                    <p className="flex flex-col sm:flex-row items-start sm:items-center">
                        <span className="font-medium text-gray-700">From: </span>
                        <Countdown targetDate={props.data.fromTime} startDate={props.data.fromTime} endDate={props.data.toTime} />
                    </p>
                }
            </div>
            <div>
                <p className="flex flex-col sm:flex-row items-start sm:items-center">
                    <span className="font-medium text-gray-700">Duration: </span>
                    <span className="ml-0 sm:ml-2"> {renderDuration()}</span>
                </p>
            </div>
            <p className="flex flex-col sm:flex-row items-start sm:items-center">
                <span className="font-medium text-gray-700">Interview Type: </span>
                <span className="ml-0 sm:ml-2"> {props.data.interviewType}</span>
            </p>
        </div>
    );
};

export default InterviewsItem;
