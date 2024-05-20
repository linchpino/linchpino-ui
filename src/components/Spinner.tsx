import ClockLoader from "react-spinners/ClockLoader";
import {FC} from "react";

interface SpinnerProps{
    loading : boolean
}

const Spinner : FC<SpinnerProps> = (props) => {
    const {loading} = props
    return (
        <ClockLoader
            className='text-center mt-10'
            color="#F9A826"
            loading={loading}
            size={58}
            aria-label="Please wait..."
            data-testid="loader"
        />
    );
}
export default Spinner
