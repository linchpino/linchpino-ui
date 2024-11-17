'use client'
import HomeSectionLayout from "@/containers/home/HomeSectionLayout";
import {useTranslations} from "next-intl";

export default function MasterArt() {
    const t = useTranslations()
    return (
        <HomeSectionLayout
            isLtr={true}
            imageSource='/home/MasterArt.webp'
            title={t('Home.masterTitle')}
            description={t("Home.masterDescription")}
            buttonText={t("Home.masterButton")}
            onClick={() => console.log(1)}
            clickable={false}
        />
    )
}
