import {ReactNode} from "react";

const PanelContentChild = ({ children }: { children: ReactNode }) =>{
    return(
        <div className='p-10 relative'>
            {children}
        </div>
    )
}
export default PanelContentChild
