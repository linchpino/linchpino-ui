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
    setMentorInformation: (info) => set((state) => {
        return {
            mentorInformation: {
                email: info.email ?? state.mentorInformation.email,
                firstName: info.firstName ?? state.mentorInformation.firstName,
                lastName: info.lastName ?? state.mentorInformation.lastName,
                interviewTypeIDs: info.interviewTypeIDs ?? state.mentorInformation.interviewTypeIDs,
                password: info.password ?? state.mentorInformation.password,
            },
        };
    }),
});

export default createMentorInformationSlice;
