import React from 'react';
import useStore from '@/store/store';
import {useRouter} from 'next/navigation';

interface LogoutModalProps {
    onClose: () => void;
    isOpen: boolean
}

const LogoutModal: React.FC<LogoutModalProps> = ({isOpen, onClose}) => {
    const router = useRouter();
    const {setToken, setUserInfo} = useStore(state => ({
        setToken: state.setToken,
        setUserInfo: state.setUserInfo,
    }));


    const handleLogout = () => {
        router.push('/');
        setToken(null, null);
        setUserInfo(null);
    };

    if (!isOpen) return null;

    return (
        <div className="modal modal-open z-100 fixed" data-theme="light">
            <div className="modal-box">
                <form method="dialog">
                    <button
                        onClick={onClose}
                        className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                    >
                        ✕
                    </button>
                </form>
                <h2 className="text-lg font-bold mb-4">Confirm Logout</h2>
                <p className="mb-4">Are you sure you want to log out?</p>
                <div className="modal-action">
                    <button
                        className="w-20 btn btn-sm btn-outline btn-ghost font-medium text-[.9rem] border-[.1px] hover:bg-transparent hover:border-gray-400 hover:text-gray-400"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="w-20 btn btn-error btn-sm font-medium text-[.9rem] text-white"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LogoutModal;
