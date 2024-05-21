'use client'
import HomeSectionLayout from "@/containers/home/HomeSectionLayout";

export default function MasterArt() {
    return (
        <HomeSectionLayout
            isLtr={true}
            imageSource='/home/MasterArt.svg'
            title='Master the art!'
            description="Elevate your skills with our insightful blogs. Dive into expert tips for success and conquer your
                    next interview with confidence"
            buttonText="Explore techniques"
            onClick={()=> console.log(1)}

        />
    )
}
