import { create } from 'zustand';
import createMentorInformationSlice, { MentorInformationState } from './mentorInformationSlice';
import createScheduleInterviewSlice, { ScheduleInterviewState } from './scheduleInterviewSlice';

export type CombinedState = MentorInformationState & ScheduleInterviewState;

const useStore = create<CombinedState>((set, get, api) => ({
    ...createMentorInformationSlice(set, get, api),
    ...createScheduleInterviewSlice(set, get, api),
}));

export default useStore;
