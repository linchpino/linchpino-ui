'use client'
import HomeSectionLayout from "@/containers/home/HomeSectionLayout";
import {useRouter} from 'nextjs-progressloader'
import {useTranslations} from "next-intl";

export default function BeMentor() {
    const router = useRouter()
    const t = useTranslations()
    return (
        <HomeSectionLayout
            isLtr={false}
            imageSource='/home/BeMentor.webp'
            title={t('Home.beMentorTitle')}
            description={t("Home.beMentorDescription")}
            buttonText={t("Home.beMentorButtonText")}
            onClick={() => router.push('/be-mentor')}
            clickable
        />
    )
}
