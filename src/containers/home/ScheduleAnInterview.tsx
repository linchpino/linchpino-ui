'use client'
import HomeSectionLayout from "@/containers/home/HomeSectionLayout";

interface ScheduleAnInterviewProps {
    onClick: () => void;
}


export default ({onClick}: Readonly<ScheduleAnInterviewProps>) => (
    <HomeSectionLayout
        isLtr={true}
        imageSource='/home/ScheduleAnInterview.svg'
        title='Free mock interviews await!'
        description="Prepare for your next interview with confidence! Request a meeting with a mentor from our network.
                    Our
                    mentors will review your request, offering guidance and acceptance, ensuring you're well-prepared to
                    ace
                    your interview."
        buttonText="Schedule an interview"
        onClick={onClick}
        clickable
    />
)
