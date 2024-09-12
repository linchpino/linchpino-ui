import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { toastError } from '@/components/CustomToast';

const useFetchData = (url: string, token: string | null, queryKey: string) => {
    const fetchData = async () => {
        try {
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                const { status, data } = error.response;
                const errorMessage = data.error || "An error occurred";
                toastError({
                    message: `Error ${errorMessage}`,
                });
            } else {
                toastError({
                    message: "An unknown error occurred",
                });
            }
            throw error;
        }
    };

    const { data, isLoading, error } = useQuery({
        queryKey: [queryKey],
        queryFn: fetchData,
        enabled: !!token,
    });

    return { data, isLoading, error };
};

export default useFetchData;
