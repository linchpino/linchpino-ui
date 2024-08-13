import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const useFetchData = (url: string, token: string | null, queryKey: string) => {
    const fetchData = async () => {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    };

    const { data, isLoading, error } = useQuery({
        queryKey: [queryKey],
        queryFn: fetchData,
        enabled: !!token,
    });

    return { data, isLoading, error };
};

export default useFetchData;
