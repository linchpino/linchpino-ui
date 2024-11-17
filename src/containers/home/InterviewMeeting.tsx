'use client'
import HomeSectionLayout from "@/containers/home/HomeSectionLayout";
import {useTranslations} from "next-intl";

export default function InterviewMeeting() {
    const t = useTranslations()
    return (
        <HomeSectionLayout
            isLtr={false}
            imageSource='/home/InterviewMeeting.webp'
            title={t('Home.attendTitle')}
            description={t("Home.attendDescription")}
            buttonText={t("Home.attendButton")}
            onClick={()=> console.log(1)}
            clickable={false}
        />
    )
}
