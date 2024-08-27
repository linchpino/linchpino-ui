import React, {useRef, useState} from "react";
import DatePicker from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import Select, {MultiValue, SingleValue} from "react-select";
import "react-multi-date-picker/styles/colors/yellow.css";

type TimeCard = {
    id: number;
    start: string;
    duration: string;
    repeat: string;
    days: string[];
};

type DurationOption = {
    id: number;
    time: string;
};

type DayOption = {
    id: number;
    day: string;
};

type RepeatOption = {
    value: string;
    label: string;
};

const ProfileTimeSlot: React.FC = () => {
    const timeCards: TimeCard[] = [
        {id: 1, start: "2024-08-10", duration: "30 min", repeat: "no", days: ["Su", "Mo", "Tu", "We", "Th"]},
        {id: 2, start: "2024-08-11", duration: "60 min", repeat: "1 week", days: ["Su", "Mo", "Tu", "We", "Th"]},
        {id: 3, start: "2024-08-13", duration: "15 min", repeat: "1 week", days: ["Su", "We", "Th"]},
        {id: 4, start: "2024-08-14", duration: "45 min", repeat: "2 week", days: ["Su"]},
    ];

    const duration: DurationOption[] = [
        {id: 1, time: "15 min"},
        {id: 2, time: "20 min"},
        {id: 3, time: "30 min"},
        {id: 4, time: "45 min"},
        {id: 5, time: "60 min"},
    ];

    const days: DayOption[] = [
        {id: 1, day: "Su"},
        {id: 2, day: "Mo"},
        {id: 3, day: "Tu"},
        {id: 4, day: "We"},
        {id: 5, day: "Th"},
        {id: 6, day: "Fr"},
        {id: 7, day: "Sa"},
    ];

    const repeatOptions: RepeatOption[] = [
        {value: "day", label: "Day"},
        {value: "week", label: "Week"},
        {value: "month", label: "Month"},
    ];

    const [selectedStart, setSelectedStart] = useState<Date | null>(null);
    const [selectedDuration, setSelectedDuration] = useState<string>("");
    const [selectedDay, setSelectedDay] = useState<string[]>([]);
    const [selectedRepeat, setSelectedRepeat] = useState<SingleValue<RepeatOption>>(null);
    const [selectedDaysOfMonth, setSelectedDaysOfMonth] = useState<number[]>([]);
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

    const modalRef = useRef<HTMLDialogElement>(null);


    const handleMenuOpen = () => {
        setIsMenuOpen(true);
    };

    const handleMenuClose = () => {
        setIsMenuOpen(false);
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

    return (
        <>
            <div className="flex gap-x-2 mt-8">
                <h4>Time Slot</h4>
                <button onClick={handleLoginClick}
                        className="bg-amber-400 flex items-center justify-center text-[22px] text-white w-6 h-6 rounded-full">+
                </button>
            </div>
            <dialog ref={modalRef} id="modal" className="modal">
                <div
                    className={`modal-box ${isMenuOpen && 'h-[100%]'} min-h-[65%] pb-8 max-w-lg bg-white flex flex-col items-center`}>
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <div
                        className="flex flex-col pb-3 lg:pb-6 items-center justify-center w-full rounded-md mt-2 mb-4 lg:mb-0 container p-3">
                        <h1 className="text-xl text-center text-[#000]">Add Time Slot</h1>
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
                                            {durationItem.time}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center w-full gap-x-2 flex-col sm:flex-row gap-y-3">
                                <span className="text-sm">Repeat every: </span>
                                <input type="text" placeholder="number of..."
                                       className="input input-bordered w-full sm:w-1/3 input-sm h-[2.4rem] text-xs bg-white"/>
                                <Select
                                    unstyled
                                    classNames={{
                                        control: () => "border border-gray-300 w-full rounded-lg h-[20px] text-xs px-3 mr-2",
                                        container: () => "text-xs rounded w-full sm:w-1/3 text-[#000000]",
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
                            {selectedRepeat?.value === "week" && (
                                <div className="flex items-center w-full flex-col sm:flex-row">
                                    <span className="text-sm">On: </span>
                                    <div className="flex gap-x-2 ml-2 justify-center flex-wrap mt-2 sm:mt-0 gap-y-2">
                                        {days.map(daysItem => {
                                            const isSelected = selectedDay.includes(daysItem.day);
                                            return (
                                                <button
                                                    className={`py-2 min-w-[3rem] text-xs rounded-3xl flex items-center justify-center border-[.1px] ${isSelected ? "border-[#F2A926] text-[#F2A926]" : ""}`}
                                                    onClick={() => handleSelectDay(daysItem.day)}
                                                    key={daysItem.id}
                                                >
                                                    {daysItem.day}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                            {selectedRepeat?.value === "month" && (
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
                                className={`btn btn-sm w-full md:w-2/3 border-none px-2 bg-[#F9A826] text-[#FFFFFF] rounded-md shadow-md text-xs hover:bg-[#F9A945]  ${selectedRepeat?.value !== "week" && 'mt-2'}`}>
                                Add
                            </button>
                        </div>

                    </div>
                </div>
            </dialog>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 mt-4 gap-y-6">
                {timeCards.map(item => {
                    return (
                        <div key={item.id} className="relative bg-white rounded-lg card shadow-xl text-xs lg:text-sm">
                            <div
                                className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 via-pink-500 to-[#F9A826] rounded-t-lg"></div>
                            <div className="card-body px-4 py-6 flex flex-col">
                                <div
                                    className={`flex ${item.repeat === 'no' ? 'flex-col' : 'flex-col md:flex-row'} ${item.repeat === 'no' && 'gap-y-3'} w-full justify-between items-center`}>
                                    <span>Start: {item.start}</span>
                                    <span>Duration: {item.duration}</span>
                                </div>
                                {item.repeat !== 'no' && (
                                    <div
                                        className='flex md:flex-row flex-col justify-between items-center mt-2 gap-x-2 gap-y-2'>
                                        <span className='text-sm'>Repeat <span
                                            className='text-[1rem] text-gray-700'>{item.repeat}</span> in </span>
                                        <div
                                            className='flex flex-wrap gap-x-2 justify-center md:justify-start items-center md:w-[15rem]'>
                                            {item.days.map(daysItem => (
                                                <div key={daysItem}
                                                     className='flex items-center justify-center text-sm font-light text-white w-8 h-8 rounded-full bg-[#F9A826]'>
                                                    {daysItem}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </>
    );
};

export default ProfileTimeSlot;

