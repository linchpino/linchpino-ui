import { StateCreator } from 'zustand';

export interface MentorInformation {
    email: string;
    firstName: string;
    lastName: string;
    interviewTypeIDs: { value: number; label: string }[];
    password: string;
}

export interface MentorInformationState {
    mentorInformation: MentorInformation;
    setMentorInformation: (info: Partial<MentorInformation>) => void;
}

const createMentorInformationSlice: StateCreator<MentorInformationState> = (set) => ({
    mentorInformation: {
        email: '',
        firstName: '',
        lastName: '',
        interviewTypeIDs: [],
        password: '',
    },
    setMentorInformation: (info) => set((state) => ({
        mentorInformation: {
            ...state.mentorInformation,
            ...info,
        },
    })),
});

export default createMentorInformationSlice;
