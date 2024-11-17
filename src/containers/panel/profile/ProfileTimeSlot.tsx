import React, {useRef, useState} from "react";
import DatePicker from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import Select, {MultiValue, SingleValue} from "react-select";
import "react-multi-date-picker/styles/colors/yellow.css";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toastError, toastSuccess} from "@/components/CustomToast";
import axios from "axios";
import useStore from "@/store/store";
import {empty, formatDateTime} from "@/utils/helper";
import PulseLoader from "react-spinners/PulseLoader";
import {BASE_URL_API} from "@/utils/system";
import {BsPencilFill, BsPlus, BsTrashFill} from 'react-icons/bs'
import moment from "moment/moment";
import {useTranslations} from "next-intl";
import axiosInstance from "@/utils/axiosInstance";

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

const deleteSchedule = async (token: string | null) => {
    const {data} = await axiosInstance.delete(`${BASE_URL_API}accounts/mentors/schedule`);
    return data;
};

const ProfileTimeSlot: React.FC<ProfileTimeSlotProps> = ({
                                                             startTime,
                                                             endTime,
                                                             durationTime,
                                                             accountId,
                                                             recurrenceType,
                                                             interval,
                                                             weekDays,
                                                             monthDays
                                                         }) => {
    const t = useTranslations();

    const formattedStartTime = moment(startTime).format('YYYY-MM-DD HH:mm:ss');
    const formattedEndTime = moment(endTime).format('YYYY-MM-DD HH:mm:ss');
    const queryClient = useQueryClient();

    const timee = new Date();
    const currentDate = moment().format('YYYY-MM-DD');
    const nextMonth = moment().add(1, 'months');
    const nextMonthDate = nextMonth.format('YYYY-MM-DD');

    const duration: DurationOption[] = [
        {id: 1, time: 15},
        {id: 2, time: 20},
        {id: 3, time: 30},
        {id: 4, time: 45},
        {id: 5, time: 60},
    ];
    const days: DayOption[] = [
        {id: 1, day: t("Profile.Days.sunday.abbr"), value: "SUNDAY"},
        {id: 2, day: t("Profile.Days.monday.abbr"), value: "MONDAY"},
        {id: 3, day: t("Profile.Days.tuesday.abbr"), value: "TUESDAY"},
        {id: 4, day: t("Profile.Days.wednesday.abbr"), value: "WEDNESDAY"},
        {id: 5, day: t("Profile.Days.thursday.abbr"), value: "THURSDAY"},
        {id: 6, day: t("Profile.Days.friday.abbr"), value: "FRIDAY"},
        {id: 7, day: t("Profile.Days.saturday.abbr"), value: "SATURDAY"}
    ];

    const repeatOptions: RepeatOption[] = [
        {value: "DAILY", label: t("Profile.RepeatOptions.daily")},
        {value: "WEEKLY", label: t("Profile.RepeatOptions.weekly")},
        {value: "MONTHLY", label: t("Profile.RepeatOptions.monthly")}
    ];
    const [selectedStart, setSelectedStart] = useState<Date | string | null>(currentDate);
    const [selectedStartTime, setSelectedStartTime] = useState<Date | string | null>(timee);
    // @ts-ignore
    const [selectedEnd, setSelectedEnd] = useState<Date | string | null>(nextMonthDate);
    // @ts-ignore
    const [selectedEndTime, setSelectedEndTime] = useState<Date | string | null>(timee);
    const [selectedDuration, setSelectedDuration] = useState<number>(15);
    const [selectedDay, setSelectedDay] = useState<string[]>([]);
    const [selectedInterval, setSelectedInterval] = useState("1");
    const [selectedRepeat, setSelectedRepeat] = useState<SingleValue<RepeatOption>>(repeatOptions[0]);
    const [selectedDaysOfMonth, setSelectedDaysOfMonth] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);
    const [isFirstStart, setIsFirstStart] = useState(true);
    const [isFirstEnd, setIsFirstEnd] = useState(true);
    const [isFirstStartEdit, setIsFirstStartEdit] = useState(true);
    const [isFirstEndEdit, setIsFirstEndEdit] = useState(true);


    const [selectedStartEdit, setSelectedStartEdit] = useState<Date | null>(null);
    const [selectedStartTimeEdit, setSelectedStartTimeEdit] = useState<Date | null>(null);
    const [selectedEndEdit, setSelectedEndEdit] = useState<Date | null>(null);
    const [selectedEndTimeEdit, setSelectedEndTimeEdit] = useState<Date | null>(null);
    const [selectedDurationEdit, setSelectedDurationEdit] = useState<number>(0);
    const [selectedDayEdit, setSelectedDayEdit] = useState<string[]>([]);
    const [selectedIntervalEdit, setSelectedIntervalEdit] = useState("");
    const [selectedRepeatEdit, setSelectedRepeatEdit] = useState<SingleValue<RepeatOption>>(repeatOptions[0]);
    const [selectedDaysOfMonthEdit, setSelectedDaysOfMonthEdit] = useState<number[]>([]);

    const [isOpenAddModal, setIsOpenAddModal] = useState<boolean>(false);
    const [isModalEdit, setIsModalEdit] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);


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
            setIsOpenAddModal(false)
            // @ts-ignore
            modalRef.current.close()
            toastSuccess({message: t("Profile.success")});
            setIsOpenAddModal(false)
        },
        onError: (error: any) => {
            console.log(error)
            toastError({message: error.response.data.error || t("Profile.error")});
        },
        onSettled: () => {
            setLoading(false);
        },

    });

    const sendTimeSlot = () => {
        setLoading(true);
        // @ts-ignore
        let sendStart = ''
        let sendEnd = ''
        let formattedStart = selectedStartTime
        let formattedEnd = selectedEndTime
        let formattedStartDate = selectedStart
        let formattedEndDate = selectedEnd

        if (typeof selectedStartTime === "object" && isFirstStart) {
            // @ts-ignore
            let sHour = selectedStartTime?.getHours()
            // @ts-ignore
            let sMin = selectedStartTime?.getMinutes()
            formattedStart = `${sHour}:${sMin}:${sMin}Z`
        }
        if (typeof selectedEndTime === "object" && isFirstEnd) {
            // @ts-ignore
            let eHour = selectedEndTime?.getHours()
            // @ts-ignore
            let eMin = selectedEndTime?.getMinutes()
            formattedEnd = `${eHour}:${eMin}:${eMin}Z`
        }

        if (typeof selectedStart === "object") {

            // @ts-ignore
            formattedStartDate = moment(selectedStart).format("YYYY-MM-DD")
        }
        if (typeof selectedEnd === "object") {

            // @ts-ignore
            formattedEndDate =  moment(selectedStart).format("YYYY-MM-DD")
        }
        sendStart = `${formattedStartDate}T${formattedStart}`;
        sendEnd = `${formattedEndDate}T${formattedEnd}`;

        let timeSlotData: any = {
            startTime: sendStart+"",
            duration: selectedDuration,
            recurrenceType: selectedRepeat?.value,
            interval: +selectedInterval,
            endTime: sendEnd+"",
        };
        if (selectedRepeat?.value === "WEEKLY") {
            timeSlotData.weekDays = selectedDay;
        } else if (selectedRepeat?.value === "MONTHLY") {
            timeSlotData.monthDays = selectedDaysOfMonth;
        }
        mutation.mutate(timeSlotData);
    };


    const editTimeSlotFunction = async (timeSlotData: any) => {
        const response = await axios.put(`${BASE_URL_API}accounts/mentors/schedule`, timeSlotData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    };
    const editMutation = useMutation({
        mutationFn: editTimeSlotFunction,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['profileData']});
            setIsOpenAddModal(false)
            // @ts-ignore
            modalRef.current.close()
            toastSuccess({message: t("Profile.success")});
            setIsModalEdit(false)
        },
        onError: (error: any) => {
            console.log(error)
            toastError({message: error.response.data.error || t("Profile.error")});
        },
        onSettled: () => {
            setLoading(false);
        },

    });
    const editTimeSlot = () => {
        setLoading(true);
        // @ts-ignore
        let sendStart = ''
        let sendEnd = ''
        let formattedStart = selectedStartTimeEdit
        let formattedEnd = selectedEndTimeEdit
        let formattedStartDate = selectedStartEdit
        let formattedEndDate = selectedEnd

        if (typeof selectedStartTimeEdit === "object" && isFirstStartEdit) {
            // @ts-ignore
            let sHour = selectedStartTime?.getHours()
            // @ts-ignore
            let sMin = selectedStartTime?.getMinutes()
            // @ts-ignore
            formattedStart = `${sHour}:${sMin}:${sMin}Z`
        }
        if (typeof selectedEndTimeEdit === "object" && isFirstEndEdit) {
            // @ts-ignore
            let eHour = selectedEndTime?.getHours()
            // @ts-ignore
            let eMin = selectedEndTime?.getMinutes()
            // @ts-ignore
            formattedEnd = `${eHour}:${eMin}:${eMin}Z`
        }

        if (typeof selectedStart === "object") {

            // @ts-ignore
            formattedStartDate = moment(selectedStart).format("YYYY-MM-DD")
        }
        if (typeof selectedEnd === "object") {

            // @ts-ignore
            formattedEndDate =  moment(selectedStart).format("YYYY-MM-DD")
        }
        sendStart = `${formattedStartDate}T${formattedStart}`;
        sendEnd = `${formattedEndDate}T${formattedEnd}`;

        let timeSlotData: any = {
            startTime: sendStart+"",
            duration: selectedDurationEdit,
            recurrenceType: selectedRepeatEdit?.value,
            interval: +selectedIntervalEdit,
            endTime: sendEnd+"",
        };
        if (selectedRepeat?.value === "WEEKLY") {
            timeSlotData.weekDays = selectedDay;
        } else if (selectedRepeat?.value === "MONTHLY") {
            timeSlotData.monthDays = selectedDaysOfMonth;
        }
        mutation.mutate(timeSlotData);
    };


    const deleteMutation = useMutation({
        mutationFn: () => deleteSchedule(token),
        onSuccess: () => {
            toastSuccess({message: t("Profile.DeleteScheduleModal")});
            queryClient.invalidateQueries({queryKey: ['profileData']});
            closeDeleteModal();
        },
        onError: (error: any) => {
            const errorMessage = error.response?.data?.error || t("Errors.unknowServerError");
            toastError({message: errorMessage});
        }
    });
    const handleDelete = () => {
        setLoading(true);
        deleteMutation.mutate(undefined, {
            onSuccess: () => {
                queryClient.invalidateQueries({queryKey: ['profileData']});
                closeDeleteModal();
                setLoading(false);
            },
            onError: () => setLoading(false)
        });
    };
    const openDeleteModal = () => {
        setIsDeleteModalOpen(true);
    };
    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
    };
    const openEditModal = () => {
        if (startTime) {
            const startDate = new Date(startTime);
            setSelectedStartEdit(startDate);
            setSelectedStartTimeEdit(new Date(startDate.setMinutes(startDate.getMinutes() - startDate.getTimezoneOffset())));
        }

        if (endTime) {
            const endDate = new Date(endTime);
            setSelectedEndEdit(endDate);
            setSelectedEndTimeEdit(new Date(endDate.setMinutes(endDate.getMinutes() - endDate.getTimezoneOffset())));
        }
        if (durationTime) {
            setSelectedDurationEdit(durationTime)
        }
        if (recurrenceType) {
            setSelectedRepeatEdit({value: recurrenceType, label: recurrenceType})
        }
        if (interval) {
            //@ts-ignore
            setSelectedIntervalEdit(interval)
        }
        if (monthDays && !empty(monthDays.length)) {
            setSelectedDaysOfMonthEdit(monthDays)
        }
        if (weekDays && !empty(weekDays.length)) {
            setSelectedDaysOfMonthEdit(monthDays)
        }
        setIsModalEdit(true);
    };
    return (
        <>
            <div className="flex gap-x-2 mt-8">
                <h1 className="text-md font-bold">{t("Profile.scheduleTitle")}</h1>
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
                        <h1 className="text-xl text-center text-[#000]">{t("Profile.AddScheduleModal.header")}</h1>
                        <div
                            className={`flex flex-col items-center justify-center mt-5 ${selectedRepeat?.value === "week" ? 'gap-y-6' : 'gap-y-8'}`}>
                            <div className="flex flex-col sm:flex-row items-center w-full gap-y-2 gap-x-2">
                                <span className="text-sm">{t("Profile.AddScheduleModal.start")}: </span>
                                <DatePicker
                                    containerClassName="w-full sm:w-1/2"
                                    inputClass="profile-calendar w-full"
                                    className="yellow z-20"
                                    value={selectedStart}
                                    format={"YYYY-MM-DD"}
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
                                    format="HH:mm:ss"
                                    placeholder="Time"
                                    value={selectedStartTime}
                                    //@ts-ignore
                                    onChange={(e)=> {
                                        // @ts-ignore
                                        setSelectedStartTime(e)
                                        setIsFirstStart(false)
                                    }}
                                    plugins={[<TimePicker hideSeconds mStep={5}/>]}
                                    calendar={gregorian}
                                    locale={gregorian_en}
                                    calendarPosition="bottom-right"
                                />
                            </div>
                            <div className="flex flex-col sm:flex-row items-center w-full gap-y-2 gap-x-2">
                                <span className="text-sm">{t("Profile.AddScheduleModal.end")}:</span>
                                <DatePicker
                                    containerClassName="w-full sm:w-1/2"
                                    inputClass="profile-calendar w-full"
                                    className="yellow z-20"
                                    format={"YYYY-MM-DD"}
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
                                    format="HH:mm:ss"
                                    placeholder="Time"
                                    value={selectedEndTime}
                                    //@ts-ignore
                                    //@ts-ignore
                                    onChange={(e)=> {
                                        // @ts-ignore
                                        setSelectedEndTime(e)
                                        setIsFirstEnd(false)
                                    }}
                                    plugins={[<TimePicker hideSeconds mStep={5}/>]}
                                    calendar={gregorian}
                                    locale={gregorian_en}
                                    calendarPosition="bottom-right"
                                />
                            </div>

                            <div className="flex items-center w-full flex-col sm:flex-row">
                                <span className="text-sm">{t("Profile.AddScheduleModal.duration")}:</span>
                                <div className="flex gap-x-2 ms-2 flex-wrap justify-center gap-y-3 mt-2 sm:mt-0">
                                    {duration.map(durationItem => (
                                        <button
                                            onClick={() => setSelectedDuration(durationItem.time)}
                                            key={durationItem.id}
                                            className={`p-2 min-w-[3.9rem] text-xs rounded-3xl flex items-center justify-center border-[.1px] ${selectedDuration === durationItem.time && 'text-[#F2A926] border-[#F2A926]'}`}
                                        >
                                            {durationItem.time} {t("Profile.scheduleInfo.min")}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center w-full gap-x-2 flex-col sm:flex-row gap-y-3">
                                <span className="text-sm">{t("Profile.scheduleInfo.interval")}:</span>
                                <input value={selectedInterval}
                                       onChange={(e) => setSelectedInterval(e.target.value)}
                                       type='number'
                                       inputMode='numeric'
                                       placeholder={t("Profile.AddScheduleModal.numberOf")}
                                       className="input input-bordered w-full sm:w-1/2 input-sm h-[2.4rem] text-xs bg-white"/>
                                <Select
                                    unstyled
                                    classNames={{
                                        control: () => "border border-gray-300 w-full rounded-lg h-[20px] text-xs px-3 me-2",
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
                                    <span className="text-sm">{t("Profile.scheduleInfo.on")}:</span>
                                    <div className="flex gap-x-2 ms-2 justify-center flex-wrap mt-2 sm:mt-0 gap-y-2">
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
                                    <span className="text-sm">{t("Profile.scheduleInfo.daysOfMonth")}:</span>
                                    <Select
                                        isMulti
                                        unstyled
                                        classNames={{
                                            control: () => "border border-gray-300 w-full rounded-md min-h-[48px] mt-1 text-sm px-3 me-2 py-2",
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
                                    t("Profile.AddScheduleModal.addButton")
                                )}
                            </button>
                        </div>

                    </div>
                </div>
            </dialog>
            {!empty(startTime) && !empty(endTime) &&
                <div className="grid grid-cols-1 gap-6 mt-4 relative">
                    <div className="relative bg-white rounded-lg shadow-xl text-xs sm:text-sm md:text-base lg:text-sm">
                        <div className="absolute top-4 left-2 flex  gap-1">
                            <button onClick={openEditModal}
                                    data-tip={t("ProfileTimeSlot.editButton")}
                                    className="tooltip rounded-full bg-blue-500 text-white hover:bg-blue-600 w-5 h-5 md:w-7 md:h-7 flex items-center justify-center">
                                <BsPencilFill/>
                            </button>
                            <button onClick={() => setIsDeleteModalOpen(true)}
                                    data-tip={t("ProfileTimeSlot.deleteButton")}
                                    className="tooltip p-1 rounded-full bg-red-500 text-white hover:bg-red-600 w-5 h-5 md:w-7 md:h-7 flex items-center justify-center">
                                <BsTrashFill/>
                            </button>
                        </div>

                        <div
                            className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 via-pink-500 to-[#F9A826] rounded-t-lg"></div>
                        <div className="card-body px-4 sm:px-6 py-6 flex flex-col">
                            {/*<h3 className="text-sm sm:text-lg font-semibold text-gray-800 mb-4">Schedule Information</h3>*/}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 space-y-3 text-gray-600">
                                <p className="flex flex-col sm:flex-row items-start sm:items-center">
                                    <span
                                        className="font-medium text-gray-700">{t("Profile.scheduleInfo.startTime")}:</span>
                                    <span className="ms-0 sm:ms-2">{formattedStartTime}</span>
                                </p>
                                <p className="flex flex-col sm:flex-row items-start sm:items-center">
                                    <span
                                        className="font-medium text-gray-700">{t("Profile.scheduleInfo.endTime")}:</span>
                                    <span className="ms-0 sm:ms-2">{formattedEndTime}</span>
                                </p>
                                <p className="flex flex-col sm:flex-row items-start sm:items-center">
                                    <span
                                        className="font-medium text-gray-700">{t("Profile.scheduleInfo.duration")}:</span>
                                    <span
                                        className="ms-0 sm:ms-2">{durationTime} {t("Profile.scheduleInfo.minutes")}</span>
                                </p>
                                {/*<p className="flex flex-col sm:flex-row items-start sm:items-center">*/}
                                {/*    <span className="font-medium text-gray-700">Account ID:</span>*/}
                                {/*    <span className="ml-0 sm:ml-2">{accountId}</span>*/}
                                {/*</p>*/}
                                <p className="flex flex-col sm:flex-row items-start sm:items-center">
                                    <span
                                        className="font-medium text-gray-700">{t("Profile.scheduleInfo.recurrenceType")}:</span>
                                    <span className="ms-0 sm:ms-2">{recurrenceType}</span>
                                </p>
                                <p className="flex flex-col sm:flex-row items-start sm:items-center">
                                    <span
                                        className="font-medium text-gray-700">{t("Profile.scheduleInfo.interval")}:</span>
                                    <span className="ms-0 sm:ms-2">{interval}</span>
                                </p>
                                {weekDays.length > 0 && (
                                    <p className="flex flex-col sm:flex-row items-start sm:items-center">
                                        <span
                                            className="font-medium text-gray-700">{t("Profile.scheduleInfo.weekDays")}:</span>
                                        <span className="ms-0 sm:ms-2">{weekDays.join(', ')}</span>
                                    </p>
                                )}
                                {monthDays.length > 0 && (
                                    <p className="flex flex-col sm:flex-row items-start sm:items-center">
                                        <span
                                            className="font-medium text-gray-700">{t("Profile.scheduleInfo.monthDays")}:</span>
                                        <span className="ms-0 sm:ms-2">{monthDays.join(', ')}</span>
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            }
            {isModalEdit && (
                <dialog ref={modalRef} id="modal" className={`modal modal-open`}>
                    <div
                        className={`modal-box min-h-[65%] pb-8 max-w-lg bg-white flex flex-col items-center`}>
                        <form>
                            <button onClick={() => setIsModalEdit(false)}
                                    className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕
                            </button>
                        </form>
                        <div
                            className="flex flex-col pb-3 lg:pb-6 items-center justify-center w-full rounded-md mt-2 mb-4 lg:mb-0 container p-3">
                            <h1 className="text-xl text-center text-[#000]">{t("Profile.AddScheduleModal.headerEdit")}</h1>
                            <div
                                className={`flex flex-col items-center justify-center mt-5 ${selectedRepeat?.value === "week" ? 'gap-y-6' : 'gap-y-8'}`}>
                                <div className="flex flex-col sm:flex-row items-center w-full gap-y-2 gap-x-2">
                                    <span className="text-sm">{t("Profile.AddScheduleModal.start")}: </span>
                                    <DatePicker
                                        containerClassName="w-full sm:w-1/2"
                                        inputClass="profile-calendar w-full"
                                        className="yellow z-20"
                                        value={selectedStartEdit}
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
                                        value={selectedStartTimeEdit}
                                        //@ts-ignore
                                        onChange={setSelectedStartTime}
                                        plugins={[<TimePicker hideSeconds hStep={1} mStep={5}/>]}
                                        calendar={gregorian}
                                        locale={gregorian_en}
                                        calendarPosition="bottom-right"
                                    />
                                </div>
                                <div className="flex flex-col sm:flex-row items-center w-full gap-y-2 gap-x-2">
                                    <span className="text-sm">{t("Profile.AddScheduleModal.end")}:</span>
                                    <DatePicker
                                        containerClassName="w-full sm:w-1/2"
                                        inputClass="profile-calendar w-full"
                                        className="yellow z-20"
                                        value={selectedEndEdit}
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
                                        value={selectedEndTimeEdit}
                                        //@ts-ignore
                                        onChange={setSelectedEndTimeEdit}
                                        plugins={[<TimePicker hideSeconds hStep={1} mStep={5}/>]}
                                        calendar={gregorian}
                                        locale={gregorian_en}
                                        calendarPosition="bottom-right"
                                    />
                                </div>

                                <div className="flex items-center w-full flex-col sm:flex-row">
                                    <span className="text-sm">{t("Profile.AddScheduleModal.duration")}:</span>
                                    <div className="flex gap-x-2 ms-2 flex-wrap justify-center gap-y-3 mt-2 sm:mt-0">
                                        {duration.map(durationItem => (
                                            <button
                                                onClick={() => setSelectedDuration(durationItem.time)}
                                                key={durationItem.id}
                                                className={`p-2 min-w-[3.9rem] text-xs rounded-3xl flex items-center justify-center border-[.1px] ${selectedDuration === durationItem.time && 'text-[#F2A926] border-[#F2A926]'}`}
                                            >
                                                {durationItem.time} {t("Profile.scheduleInfo.min")}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-center w-full gap-x-2 flex-col sm:flex-row gap-y-3">
                                    <span className="text-sm">{t("Profile.scheduleInfo.interval")}:</span>
                                    <input value={selectedInterval}
                                           onChange={(e) => setSelectedInterval(e.target.value)}
                                           type='number'
                                           inputMode='numeric'
                                           placeholder={t("Profile.AddScheduleModal.numberOf")}
                                           className="input input-bordered w-full sm:w-1/2 input-sm h-[2.4rem] text-xs bg-white"/>
                                    <Select
                                        unstyled
                                        classNames={{
                                            control: () => "border border-gray-300 w-full rounded-lg h-[20px] text-xs px-3 me-2",
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
                                        <span className="text-sm">{t("Profile.scheduleInfo.on")}:</span>
                                        <div
                                            className="flex gap-x-2 ms-2 justify-center flex-wrap mt-2 sm:mt-0 gap-y-2">
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
                                        <span className="text-sm">{t("Profile.scheduleInfo.daysOfMonth")}:</span>
                                        <Select
                                            isMulti
                                            unstyled
                                            classNames={{
                                                control: () => "border border-gray-300 w-full rounded-md min-h-[48px] mt-1 text-sm px-3 me-2 py-2",
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
                                        t("Profile.AddScheduleModal.editButton")
                                    )}
                                </button>
                            </div>

                        </div>
                    </div>
                </dialog>

            )}
            {isDeleteModalOpen && (
                <div className={`modal modal-open`} data-theme="light">
                    <div className={`modal-box `}>
                        <button onClick={() => setIsDeleteModalOpen(false)}
                                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕
                        </button>
                        <h3 className="text-center text-lg mt-4">
                            {t("ProfileTimeSlot.deleteMessageTitle")}
                        </h3>
                        <div className="modal-action gap-x-2 justify-start">
                            <button
                                className="w-20 btn btn-error btn-sm text-[.9rem] text-white"
                                onClick={handleDelete}
                            >
                                {loading ? (
                                    <PulseLoader color="#FFFFFF" size={5}/>
                                ) : (
                                    t("InterviewType.delete")
                                )}
                            </button>
                            <button
                                className="w-20 btn btn-sm btn-outline btn-ghost text-[.9rem] border-[.1px] hover:bg-transparent hover:border-gray-400 hover:text-gray-400"
                                onClick={() => setIsDeleteModalOpen(false)}
                                disabled={loading}
                            >
                                {t("ProfileTimeSlot.cancelButton")}
                            </button>

                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
export default ProfileTimeSlot
