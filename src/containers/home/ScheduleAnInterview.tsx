'use client'
import HomeSectionLayout from "@/containers/home/HomeSectionLayout";
import {useTranslations} from "next-intl";

interface ScheduleAnInterviewProps {
    onClick: () => void;
}

export default ({onClick}: Readonly<ScheduleAnInterviewProps>) => {
    const t = useTranslations()
    return (
        <HomeSectionLayout
            isLtr={true}
            imageSource='/home/ScheduleAnInterview.webp'
            title={t('Home.scheduleTitle')}
            description={t("Home.scheduleDescription")}
            buttonText={t("Home.scheduleButton")}
            onClick={onClick}
            clickable
        />
    )
}
