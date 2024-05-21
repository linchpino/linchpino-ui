'use client'
import HomeSectionLayout from "@/containers/home/HomeSectionLayout";

export default function DonateNow() {
    return (
        <HomeSectionLayout
            isLtr={false}
            imageSource='/home/DonateNow.svg'
            title='Do you know what is the best nation in the world?'
            description="DoNation! Join us in creating a world where potential knows no bounds. Your donation, no matter how
                    small, amplifies the impact of our initiative. Together, let's build a community where everyone has
                    the tools they need to succeed."
            buttonText="Donate now"
            onClick={()=> console.log(1)}
        />
    )
}
