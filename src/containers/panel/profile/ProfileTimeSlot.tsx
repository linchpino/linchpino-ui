import React, {useRef, useState} from "react";
import DatePicker from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import Select, {MultiValue, SingleValue} from "react-select";
import "react-multi-date-picker/styles/colors/yellow.css";
import {useMutation,useQueryClient} from "@tanstack/react-query";
import {toastError, toastSuccess} from "@/components/CustomToast";
import axios from "axios";
import useStore from "@/store/store";
import {empty, formatDateTime} from "@/utils/helper";
import PulseLoader from "react-spinners/PulseLoader";
import {BASE_URL_API} from "@/utils/system";
import {BsPlus} from 'react-icons/bs'
import moment from "moment/moment";

type DurationOption = {
    id: number;
    time: number;
};
type DayOption = {
    id: number;
    day: string;
    value: string;
};
type RepeatOption = {
    value: string;
    label: string;
};
interface ProfileTimeSlotProps {
    startTime: string;
    endTime: string;
    durationTime: number;
    accountId: number;
    recurrenceType: string;
    interval: number;
    weekDays: string[];
    monthDays: number[];
}

const ProfileTimeSlot: React.FC<ProfileTimeSlotProps> = ({startTime, endTime, durationTime, accountId, recurrenceType, interval, weekDays, monthDays}) => {
    const formattedStartTime = moment(startTime).format('YYYY-MM-DD HH:mm:ss');
    const formattedEndTime = moment(endTime).format('YYYY-MM-DD HH:mm:ss');
    const queryClient = useQueryClient();

    const currentDate = new Date();
    const nextMonthDate = new Date(currentDate);
    nextMonthDate.setMonth(currentDate.getMonth() + 1);

    const duration: DurationOption[] = [
        {id: 1, time: 15},
        {id: 2, time: 20},
        {id: 3, time: 30},
        {id: 4, time: 45},
        {id: 5, time: 60},
    ];
    const days: DayOption[] = [
        {id: 1, day: "Su", value: "SUNDAY"},
        {id: 2, day: "Mo", value: "MONDAY"},
        {id: 3, day: "Tu", value: "TUESDAY"},
        {id: 4, day: "We", value: "WEDNESDAY"},
        {id: 5, day: "Th", value: "THURSDAY"},
        {id: 6, day: "Fr", value: "FRIDAY"},
        {id: 7, day: "Sa", value: "SATURDAY"},
    ];
    const repeatOptions: RepeatOption[] = [
        {value: "DAILY", label: "Day"},
        {value: "WEEKLY", label: "Week"},
        {value: "MONTHLY", label: "Month"},
    ];

    const [selectedStart, setSelectedStart] = useState<Date | null>(currentDate);
    const [selectedStartTime, setSelectedStartTime] = useState<Date | null>(currentDate);
    const [selectedEnd, setSelectedEnd] = useState<Date | null>(nextMonthDate);
    const [selectedEndTime, setSelectedEndTime] = useState<Date | null>(currentDate);
    const [selectedDuration, setSelectedDuration] = useState<number>(15);
    const [selectedDay, setSelectedDay] = useState<string[]>([]);
    const [selectedInterval, setSelectedInterval] = useState("");
    const [selectedRepeat, setSelectedRepeat] = useState<SingleValue<RepeatOption>>(repeatOptions[0]);
    const [selectedDaysOfMonth, setSelectedDaysOfMonth] = useState<number[]>([]);
    const [isOpenAddModal, setIsOpenAddModal] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);

    const modalRef = useRef<HTMLDialogElement>(null);

    const handleMenuOpen = () => {
        setIsOpenAddModal(true);
    };
    const handleMenuClose = () => {
        setIsOpenAddModal(false);
    };
    const handleLoginClick = () => {
        if (modalRef.current) {
            modalRef.current.showModal();
        }
    };
    const handleSelectDay = (day: string) => {
        const isDaySelected = selectedDay.includes(day);
        if (isDaySelected) {
            setSelectedDay(prevState => prevState.filter(selected => selected !== day));
        } else {
            setSelectedDay(prevState => [...prevState, day]);
        }
    };
    const handleSelectDaysOfMonth = (selectedOptions: MultiValue<{ value: number; label: string }>) => {
        setSelectedDaysOfMonth(selectedOptions.map(option => option.value));
    };

    const dayOfMonthOptions = Array.from({length: 31}, (_, i) => ({value: i + 1, label: `${i + 1}`}));

    const {token,} = useStore(state => ({
        token: state.token,
    }));
    const addTimeSlot = async (timeSlotData: any) => {
        const response = await axios.post(`${BASE_URL_API}accounts/mentors/schedule`, timeSlotData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    };
    const mutation = useMutation({
        mutationFn: addTimeSlot,

        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['profileData']});
            toastSuccess({message: "Time slot added successfully!"});
            setIsOpenAddModal(false)
        },
        onError: (error: any) => {
            console.log(error)
            toastError({message: error.response.data.error || 'Error adding time slot!'});
        },
        onSettled: () => {
            setLoading(false);
        },

    });
    const sendTimeSlot = () => {
        setLoading(true);

        const formattedStartTime = formatDateTime(selectedStart || currentDate);
        const formattedEndTime = formatDateTime(selectedEnd || currentDate);
        let timeSlotData: any = {
            startTime: formattedStartTime,
            duration: selectedDuration,
            recurrenceType: selectedRepeat?.value,
            interval: +selectedInterval,
            endTime: formattedEndTime,
        };
        if (selectedRepeat?.value === "WEEKLY") {
            timeSlotData.weekDays = selectedDay;
        } else if (selectedRepeat?.value === "MONTHLY") {
            timeSlotData.monthDays = selectedDaysOfMonth;
        }
        mutation.mutate(timeSlotData);
    };
    return (
        <>
            <div className="flex gap-x-2 mt-8">
                    <h1 className="text-md font-bold">Schedule</h1>
                {empty(startTime) && empty(endTime) &&
                    <button onClick={handleLoginClick}
                            className="bg-amber-400 flex items-center justify-center text-[22px] text-white w-6 h-6 rounded-full">
                        <BsPlus/>
                    </button>
                }
            </div>
            <dialog ref={modalRef} id="modal" className={`modal ${isOpenAddModal && 'h-screen'}`}>
                <div
                    className={`modal-box ${isOpenAddModal && 'h-[100%]'} min-h-[65%] pb-8 max-w-lg bg-white flex flex-col items-center`}>
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <div
                        className="flex flex-col pb-3 lg:pb-6 items-center justify-center w-full rounded-md mt-2 mb-4 lg:mb-0 container p-3">
                        <h1 className="text-xl text-center text-[#000]">Add Schedule</h1>
                        <div
                            className={`flex flex-col items-center justify-center mt-5 ${selectedRepeat?.value === "week" ? 'gap-y-6' : 'gap-y-8'}`}>
                            <div className="flex flex-col sm:flex-row items-center w-full gap-y-2 gap-x-2">
                                <span className="text-sm">Start: </span>
                                <DatePicker
                                    containerClassName="w-full sm:w-1/2"
                                    inputClass="profile-calendar w-full"
                                    className="yellow z-20"
                                    value={selectedStart}
                                    //@ts-ignore
                                    onChange={setSelectedStart}
                                    calendar={gregorian}
                                    locale={gregorian_en}
                                    calendarPosition="bottom-right"
                                    placeholder="Date"
                                />
                                <DatePicker
                                    containerClassName="w-full sm:w-1/2"
                                    inputClass="profile-timepicker w-full"
                                    disableDayPicker
                                    format="HH:mm"
                                    placeholder="Time"
                                    value={selectedStartTime}
                                    //@ts-ignore
                                    onChange={setSelectedStartTime}
                                    plugins={[<TimePicker hideSeconds/>]}
                                    calendar={gregorian}
                                    locale={gregorian_en}
                                    calendarPosition="bottom-right"
                                />
                            </div>
                            <div className="flex flex-col sm:flex-row items-center w-full gap-y-2 gap-x-2">
                                <span className="text-sm">End: </span>
                                <DatePicker
                                    containerClassName="w-full sm:w-1/2"
                                    inputClass="profile-calendar w-full"
                                    className="yellow z-20"
                                    value={selectedEnd}
                                    //@ts-ignore
                                    onChange={setSelectedEnd}
                                    calendar={gregorian}
                                    locale={gregorian_en}
                                    calendarPosition="bottom-right"
                                    placeholder="Date"
                                />
                                <DatePicker
                                    containerClassName="w-full sm:w-1/2"
                                    inputClass="profile-timepicker w-full"
                                    disableDayPicker
                                    format="HH:mm"
                                    placeholder="Time"
                                    value={selectedEndTime}
                                    //@ts-ignore
                                    onChange={setSelectedEndTime}
                                    plugins={[<TimePicker hideSeconds/>]}
                                    calendar={gregorian}
                                    locale={gregorian_en}
                                    calendarPosition="bottom-right"
                                />
                            </div>

                            <div className="flex items-center w-full flex-col sm:flex-row">
                                <span className="text-sm">Duration: </span>
                                <div className="flex gap-x-2 ml-2 flex-wrap justify-center gap-y-3 mt-2 sm:mt-0">
                                    {duration.map(durationItem => (
                                        <button
                                            onClick={() => setSelectedDuration(durationItem.time)}
                                            key={durationItem.id}
                                            className={`p-2 min-w-[3.9rem] text-xs rounded-3xl flex items-center justify-center border-[.1px] ${selectedDuration === durationItem.time && 'text-[#F2A926] border-[#F2A926]'}`}
                                        >
                                            {durationItem.time} min
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center w-full gap-x-2 flex-col sm:flex-row gap-y-3">
                                <span className="text-sm">Interval: </span>
                                <input value={selectedInterval}
                                       onChange={(e) => setSelectedInterval(e.target.value)}
                                       type='number'
                                       inputMode='numeric'
                                       placeholder="Number of..."
                                       className="input input-bordered w-full sm:w-1/2 input-sm h-[2.4rem] text-xs bg-white"/>
                                <Select
                                    unstyled
                                    classNames={{
                                        control: () => "border border-gray-300 w-full rounded-lg h-[20px] text-xs px-3 mr-2",
                                        container: () => "text-xs rounded w-full sm:w-1/2 text-[#000000]",
                                        menu: () => "bg-gray-100 rounded border py-2",
                                        option: ({isSelected, isFocused}) =>
                                            isSelected
                                                ? "dark:bg-base-content dark:text-base-200 bg-gray-400 text-gray-50 px-4 py-2"
                                                : isFocused
                                                    ? "bg-gray-200 px-4 py-2"
                                                    : "px-4 py-2",
                                    }}
                                    defaultValue={repeatOptions[0]}
                                    options={repeatOptions}
                                    onChange={setSelectedRepeat}
                                />
                            </div>
                            {selectedRepeat?.value === "WEEKLY" && (
                                <div className="flex items-center w-full flex-col sm:flex-row">
                                    <span className="text-sm">On: </span>
                                    <div className="flex gap-x-2 ml-2 justify-center flex-wrap mt-2 sm:mt-0 gap-y-2">
                                        {days.map(daysItem => {
                                            const isSelected = selectedDay.includes(daysItem.value);
                                            return (
                                                <button
                                                    className={`py-2 min-w-[3rem] text-xs rounded-3xl flex items-center justify-center border-[.1px] ${isSelected ? "border-[#F2A926] text-[#F2A926]" : ""}`}
                                                    onClick={() => handleSelectDay(daysItem.value)}
                                                    key={daysItem.id}
                                                >
                                                    {daysItem.day}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                            {selectedRepeat?.value === "MONTHLY" && (
                                <div className="flex items-center w-full flex-col sm:flex-row gap-y-3">
                                    <span className="text-sm">Days of month: </span>
                                    <Select
                                        isMulti
                                        unstyled
                                        classNames={{
                                            control: () => "border border-gray-300 w-full rounded-md min-h-[48px] mt-1 text-sm px-3 mr-2 py-2",
                                            container: () => "text-sm rounded w-full text-[#000000] text-left",
                                            menu: () => "bg-gray-100 rounded border py-2",
                                            option: ({isSelected, isFocused}) => isSelected
                                                ? "dark:bg-base-content dark:text-base-200 bg-gray-400 text-gray-50 px-4 py-2 "
                                                : isFocused
                                                    ? "bg-gray-200 px-4 py-2"
                                                    : "px-4 py-2 ",
                                            multiValue: () => "bg-[#F9A82699] rounded-full border px-2 py-1 mx-1 truncate my-1 relative w-[20%] h-7 flex justify-between",
                                        }}
                                        value={dayOfMonthOptions.filter(option => selectedDaysOfMonth.includes(option.value))}
                                        options={dayOfMonthOptions}
                                        onChange={handleSelectDaysOfMonth}
                                        onMenuOpen={handleMenuOpen}
                                        onMenuClose={handleMenuClose}
                                    />
                                </div>
                            )}
                            <button
                                disabled={loading}
                                onClick={sendTimeSlot}
                                className={`btn btn-sm w-full md:w-2/3 border-none px-2 bg-[#F9A826] text-[#FFFFFF] rounded-md shadow-md text-xs hover:bg-[#F9A945]  ${selectedRepeat?.value !== "week" && 'mt-2'}`}>
                                {loading ? (
                                    <PulseLoader color="#FFFFFF" size={5}/>
                                ) : (
                                    'Add'
                                )}
                            </button>
                        </div>

                    </div>
                </div>
            </dialog>
            {!empty(startTime)&&!empty(endTime) &&
                <div className="grid grid-cols-1 gap-x-6 mt-4 gap-y-6">
                    <div className="relative bg-white rounded-lg shadow-xl text-xs sm:text-sm md:text-base lg:text-sm">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 via-pink-500 to-[#F9A826] rounded-t-lg"></div>
                        <div className="card-body px-4 sm:px-6 py-6 flex flex-col">
                            {/*<h3 className="text-sm sm:text-lg font-semibold text-gray-800 mb-4">Schedule Information</h3>*/}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 space-y-3 text-gray-600">
                                <p className="flex flex-col sm:flex-row items-start sm:items-center">
                                    <span className="font-medium text-gray-700">Start Time:</span>
                                    <span className="ml-0 sm:ml-2">{formattedStartTime}</span>
                                </p>
                                <p className="flex flex-col sm:flex-row items-start sm:items-center">
                                    <span className="font-medium text-gray-700">End Time:</span>
                                    <span className="ml-0 sm:ml-2">{formattedEndTime}</span>
                                </p>
                                <p className="flex flex-col sm:flex-row items-start sm:items-center">
                                    <span className="font-medium text-gray-700">Duration:</span>
                                    <span className="ml-0 sm:ml-2">{durationTime} minutes</span>
                                </p>
                                {/*<p className="flex flex-col sm:flex-row items-start sm:items-center">*/}
                                {/*    <span className="font-medium text-gray-700">Account ID:</span>*/}
                                {/*    <span className="ml-0 sm:ml-2">{accountId}</span>*/}
                                {/*</p>*/}
                                <p className="flex flex-col sm:flex-row items-start sm:items-center">
                                    <span className="font-medium text-gray-700">Recurrence Type:</span>
                                    <span className="ml-0 sm:ml-2">{recurrenceType}</span>
                                </p>
                                <p className="flex flex-col sm:flex-row items-start sm:items-center">
                                    <span className="font-medium text-gray-700">Interval:</span>
                                    <span className="ml-0 sm:ml-2">{interval}</span>
                                </p>
                                {weekDays.length > 0 && (
                                    <p className="flex flex-col sm:flex-row items-start sm:items-center">
                                        <span className="font-medium text-gray-700">Week Days:</span>
                                        <span className="ml-0 sm:ml-2">{weekDays.join(', ')}</span>
                                    </p>
                                )}
                                {monthDays.length > 0 && (
                                    <p className="flex flex-col sm:flex-row items-start sm:items-center">
                                        <span className="font-medium text-gray-700">Month Days:</span>
                                        <span className="ml-0 sm:ml-2">{monthDays.join(', ')}</span>
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    );
};

export default ProfileTimeSlot;

