import Link from "next/link";

const ConfirmationMentor = () => {
    return (
        <div className="w-full max-w-4xl">
            <p className='text-[#3F3D56]'>
                Registration successfully completed. Confirmation sent via email.
            </p>
            <Link href='/' className='btn btn-warning w-52 bg-[#F9A826] text-white rounded-md shadow-md mt-8 py-2 px-3'>
                Back To Home
            </Link>
        </div>
    )
}
export default ConfirmationMentor
