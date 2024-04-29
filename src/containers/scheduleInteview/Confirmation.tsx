import Link from "next/link";

const Confirmation = () => {
    return (
        <div className="w-full max-w-4xl">
            <p className='text-[#3F3D56]'>
                Your interview is confirmed! Scheduled for Wed, 9 December 2022,  16:00 with Mentor Name.
                Check your email for immediate confirmation details. In a few minutes, you'll also receive the interview link.
                We look forward to connecting with you!
            </p>
            <Link href='/' className='btn btn-warning w-52 bg-[#F9A826] text-white rounded-md shadow-md mt-8 py-2 px-3'>
                Back To Home
            </Link>
        </div>
    )
}
export default Confirmation
