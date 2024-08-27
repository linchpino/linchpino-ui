import { toast, Bounce, ToastOptions } from 'react-toastify';

type CustomToastProps = {
    message: string;
    position?: ToastOptions['position'];
    autoClose?: ToastOptions['autoClose'];
    hideProgressBar?: ToastOptions['hideProgressBar'];
    closeOnClick?: ToastOptions['closeOnClick'];
    pauseOnHover?: ToastOptions['pauseOnHover'];
    draggable?: ToastOptions['draggable'];
    theme?: ToastOptions['theme'];
};

export const toastError = ({
                               message,
                               position = "top-right",
                               autoClose = 5000,
                               hideProgressBar = false,
                               closeOnClick = true,
                               pauseOnHover = true,
                               draggable = true,
                               theme = "light",
                           }: CustomToastProps): void => {
    toast.error(message, {
        position,
        autoClose,
        hideProgressBar,
        closeOnClick,
        pauseOnHover,
        draggable,
        theme,
        transition: Bounce,
    });
};

export const toastSuccess = ({
                                 message,
                                 position = "top-right",
                                 autoClose = 5000,
                                 hideProgressBar = false,
                                 closeOnClick = true,
                                 pauseOnHover = true,
                                 draggable = true,
                                 theme = "light",
                             }: CustomToastProps): void => {
    toast.success(message, {
        position,
        autoClose,
        hideProgressBar,
        closeOnClick,
        pauseOnHover,
        draggable,
        theme,
        transition: Bounce,
    });
};

export const toastInfo = ({
                              message,
                              position = "top-right",
                              autoClose = 5000,
                              hideProgressBar = false,
                              closeOnClick = true,
                              pauseOnHover = true,
                              draggable = true,
                              theme = "light",
                          }: CustomToastProps): void => {
    toast.info(message, {
        position,
        autoClose,
        hideProgressBar,
        closeOnClick,
        pauseOnHover,
        draggable,
        theme,
        transition: Bounce,
    });
};

const CustomToast = ({ message, position, autoClose, hideProgressBar, closeOnClick, pauseOnHover, draggable, theme }: CustomToastProps) => {
    return null;
};

export default CustomToast;
