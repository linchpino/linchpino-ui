import {StateCreator} from 'zustand';

export type ScheduleInterviewDetails = {
    jobPositionId: number | string | null;
    interviewTypeId: number | string | null;
    startTime: string | null;
    endTime: string | null;
    mentorAccountId: number | string | null;
    jobSeekerEmail: string | null;
    mentorName: string | null;
    isoDate: string | null;
    avatar: string | null;
};

export type SetScheduleInterviewDetails = (key: keyof ScheduleInterviewDetails, value: string | number | null) => void;

export interface ScheduleInterviewState {
    scheduleInterview: ScheduleInterviewDetails;
    setScheduleInterviewItem: SetScheduleInterviewDetails;
    resetScheduleInterview: () => void;
}

const createScheduleInterviewSlice: StateCreator<ScheduleInterviewState> = (set) => ({
    scheduleInterview: {
        jobPositionId: null,
        interviewTypeId: null,
        startTime: null,
        endTime: null,
        mentorAccountId: null,
        jobSeekerEmail: null,
        mentorName: null,
        isoDate: null,
        avatar: null,
    },
    setScheduleInterviewItem: (key, value) =>
        set((state) => ({
            scheduleInterview: {
                ...state.scheduleInterview,
                [key]: value,
            },
        })),
    resetScheduleInterview: () =>
        set({
            scheduleInterview: {
                jobPositionId: null,
                interviewTypeId: null,
                startTime: null,
                endTime: null,
                mentorAccountId: null,
                jobSeekerEmail: null,
                mentorName: null,
                isoDate: null,
                avatar: null,
            },
        }),
});

export default createScheduleInterviewSlice;
