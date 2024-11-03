import {StateCreator} from 'zustand';

export interface PaymentMethodRequest {
    type: {
        value: string,
        label: string
    };
    min?: string;
    max?: string;
    fixRate?: string;
}

export interface MentorInformation {
    email: string;
    firstName: string;
    lastName: string;
    interviewTypeIDs: { value: number; label: string }[];
    password: string;
    paymentMethodRequest: PaymentMethodRequest;
    sheba: string
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
        sheba: '',
        paymentMethodRequest: {
            type: {
                value: 'FREE',
                label: "Free"
            }
        },
    },
    setMentorInformation: (info) => set((state) => {
        return {
            mentorInformation: {
                email: info.email ?? state.mentorInformation.email,
                firstName: info.firstName ?? state.mentorInformation.firstName,
                lastName: info.lastName ?? state.mentorInformation.lastName,
                interviewTypeIDs: info.interviewTypeIDs ?? state.mentorInformation.interviewTypeIDs,
                password: info.password ?? state.mentorInformation.password,
                sheba: info.sheba ?? state.mentorInformation.sheba,
                paymentMethodRequest: {
                    ...state.mentorInformation.paymentMethodRequest,
                    type: info.paymentMethodRequest?.type ?? state.mentorInformation.paymentMethodRequest?.type,
                    min: info.paymentMethodRequest?.min ?? state.mentorInformation.paymentMethodRequest?.min,
                    max: info.paymentMethodRequest?.max ?? state.mentorInformation.paymentMethodRequest?.max,
                    fixRate: info.paymentMethodRequest?.fixRate ?? state.mentorInformation.paymentMethodRequest?.fixRate,
                },
            },
        };
    }),
});

export default createMentorInformationSlice;
