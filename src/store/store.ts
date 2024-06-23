import { create } from 'zustand';
import createScheduleInterviewSlice, { ScheduleInterviewState } from './scheduleInterviewSlice';

export type CombinedState = ScheduleInterviewState;

const useStore = create<CombinedState>((set,get,api) => ({
    ...createScheduleInterviewSlice(set, get, api),
}));

export default useStore;
