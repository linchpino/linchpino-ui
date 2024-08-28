import { useState } from 'react';
import axios from 'axios';
import { BASE_URL_API } from '@/utils/system';

interface OptionsType {
    value: number;
    label: string;
}

interface UseLoadJobReturn {
    loadJobOptions: (search: string, loadedOptions: OptionsType[], page: number) => Promise<{
        options: OptionsType[];
        hasMore: boolean;
        additional: {
            page: number;
        };
    }>;
    jobValue: OptionsType | null;
    setJobValue: (value: OptionsType | null) => void;
}

export const useLoadJob = (): UseLoadJobReturn => {
    const [jobValue, setJobValue] = useState<OptionsType | null>(null);

    const loadJobOptions = async (search: string, loadedOptions: OptionsType[], page: number) => {
        try {
            const response = await axios.get(`${BASE_URL_API}jobposition/search`, {
                params: {
                    page,
                    name: search,
                },
            });

            const options: OptionsType[] = response.data.content.map((item: any) => ({
                value: item.id,
                label: item.title,
            }));

            return {
                options,
                hasMore: !response.data.last,
                additional: {
                    page: page + 1,
                },
            };
        } catch (error) {
            console.error("Error loading jobs:", error);
            return {
                options: [],
                hasMore: false,
                additional: {
                    page: page + 1,
                },
            };
        }
    };

    return {
        loadJobOptions,
        jobValue,
        setJobValue,
    };
};
