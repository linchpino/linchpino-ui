import HomeSectionLayout from "@/containers/home/HomeSectionLayout";

export default function BeMentor() {
    return (
        <HomeSectionLayout
            isLtr={false}
            imageSource='/home/BeMentor.svg'
            title='Mentorship magic'
            description="Join our platform as a potential mentor and contribute to shaping future talent. Sign up! Your
                application will be reviewed and endorsed by our community of established mentors, ensuring quality
                and expertise in guiding aspiring professionals."
            buttonText="Be a mentor"
       />
    )
}
