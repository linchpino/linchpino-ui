import Sidebar from "@/containers/panel/Sidebar";
import {ReactNode} from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PanelLayout = ({ children }: { children: ReactNode }) => {
    return(
      <div >
          <Header />
          <div className='flex flex-col md:flex-row gap-x-8 gap-y-6 md:gap-y-0 container mt-10 relative items-center md:items-start'>
              <Sidebar />
             <div className='shadow-[0px_10px_25px_-5px_rgba(0,0,0,0.3)] w-full md:w-2/3 rounded-md'>
                 {children}
             </div>
          </div>
          <Footer />
      </div>
    )
}
export default PanelLayout
