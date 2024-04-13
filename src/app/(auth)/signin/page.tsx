import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function SignIn() {
    return (
        <>
            <Header/>
            <div className='bg-white container'>
                <div className="flex flex-col items-center justify-center gap-y-8 mt-14">
                    <h1 className='text-black text-3xl'>Sign In</h1>
                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text">Email Address:</span>
                        </div>
                        <input type="text" placeholder="Your registered email address"
                               className="input input-bordered w-full max-w-xs bg-white"/>
                    </label>
                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text">Password:</span>
                        </div>
                        <input type="password" placeholder="********"
                               className="input input-bordered w-full max-w-xs bg-white"/>
                    </label>
                    <Link href='/'
                          className='btn btn-warning w-full max-w-xs bg-[#F9A826] text-white rounded-md shadow-md mt-6 py-2 px-3'>
                        Login
                    </Link>
                    <div className='flex items-center'>
                        <Link href='/' className='text-[#F9A826] text-sm'>
                            Register
                        </Link>
                        /
                        <Link href='/' className='text-[#F9A826] text-sm'>
                            Forgot Password
                        </Link>
                    </div>
                </div>
            </div>
            <Footer/>
        </>
    );
}
