import { create } from 'zustand';
import createMentorInformationSlice, { MentorInformationState } from './mentorInformationSlice';
import createScheduleInterviewSlice, { ScheduleInterviewState } from './scheduleInterviewSlice';
import createUserSlice, {UserState} from "./userSlice";

export type CombinedState = MentorInformationState & ScheduleInterviewState & UserState ;

const useStore = create<CombinedState>((set, get, api) => ({
    ...createMentorInformationSlice(set, get, api),
    ...createScheduleInterviewSlice(set, get, api),
    ...createUserSlice(set, get, api),
}));

export default useStore;
