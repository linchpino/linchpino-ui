import { StateCreator } from 'zustand';

interface InterviewType {
    id: number;
    title: string;
}

export interface MentorInformation {
    email: string;
    firstName: string;
    lastName: string;
    interviewTypes: InterviewType[];
    password: string;
}

export interface MentorInformationState {
    mentorInformation: MentorInformation;
    setMentorInformation: (info: Partial<MentorInformation>) => void;
    removeInterviewType: (id: number) => void;
}

const createMentorInformationSlice: StateCreator<MentorInformationState> = (set) => ({
    mentorInformation: {
        email: '',
        firstName: '',
        lastName: '',
        interviewTypes: [],
        password: '',
    },
    setMentorInformation: (info) => set((state) => ({
        mentorInformation: {
            ...state.mentorInformation,
            ...info,
        },
    })),
    removeInterviewType: (id) => set((state) => ({
        mentorInformation: {
            ...state.mentorInformation,
            interviewTypes: state.mentorInformation.interviewTypes.filter((item) => item.id !== id),
        },
    })),
})

export default createMentorInformationSlice;
