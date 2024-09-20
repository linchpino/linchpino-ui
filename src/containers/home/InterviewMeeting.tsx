'use client'
import HomeSectionLayout from "@/containers/home/HomeSectionLayout";

export default function InterviewMeeting() {
    return (
        <HomeSectionLayout
            isLtr={false}
            imageSource='/home/InterviewMeeting.svg'
            title='Start the interview meeting!'
            description="If you have already scheduled an interview appointment and received confirmation, please click here
                    to join your interview. You will also find the joining link in your email."
            buttonText="Attend the interview"
            onClick={()=> console.log(1)}
            clickable={false}
        />
    )
}
