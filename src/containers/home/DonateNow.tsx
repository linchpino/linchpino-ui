'use client'
import HomeSectionLayout from "@/containers/home/HomeSectionLayout";
import {useTranslations} from "next-intl";

export default function DonateNow() {
    const t = useTranslations()
    return (
        <HomeSectionLayout
            isLtr={false}
            imageSource='/home/DonateNow.webp'
            title={t('Home.donateTitle')}
            description={t("Home.donateDescription")}
            buttonText={t("Home.donateButton")}
            onClick={()=> console.log(1)}
            clickable={false}
        />
    )
}
