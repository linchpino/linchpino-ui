import React, {FC} from "react";

interface InterviewsItemProp {
    data: any;
}

const InterviewsItem: FC<InterviewsItemProp> = (props) => {
    return(
        <div className='rounded-md border-l-2 border-[#F9A826] shadow-lg flex flex-col mt-4 p-3 gap-y-2'>
            <span>Mentor: {props.data.mentorName}</span>
            <span>From: {props.data.dateFrom}</span>
            <span>To: {props.data.dateTo}</span>
            <span>Position: {props.data.jobPosition}</span>
        </div>
    )
}
export default InterviewsItem
