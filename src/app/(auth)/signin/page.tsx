import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function Home() {
    return (
        <>
            <div className='bg-white container'>
                <Header/>
                <div className="flex flex-col items-center justify-center gap-y-8 mt-14">
                    <h1 className='text-black text-3xl'>Sign In</h1>
                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text">Email Address:</span>
                        </div>
                        <input type="text" placeholder="Your registered email address" className="input input-bordered w-full max-w-xs bg-white"/>
                    </label>
                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text">Password:</span>
                        </div>
                        <input type="password" placeholder="********" className="input input-bordered w-full max-w-xs bg-white"/>
                    </label>
                    <Link href='/' className='btn btn-warning py-3 px-5 bg-[#F9A826] text-white w-full max-w-[15%] rounded-md shadow-md'>
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
