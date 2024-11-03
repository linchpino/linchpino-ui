'use client';
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import moment from 'moment';
import {useTranslations} from "next-intl";

type CountdownProps = {
    targetDate: string;
    startDate: string;
    endDate: string;
};

type TimeRemaining = {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    totalDays: number;
};

const Countdown: React.FC<CountdownProps> = ({ targetDate, startDate, endDate }) => {
    const t = useTranslations()
    const [isClient, setIsClient] = useState(false);
    const calculateTimeRemaining = useCallback((): TimeRemaining => {
        const now = moment();
        const target = moment(targetDate);
        const duration = moment.duration(target.diff(now));

        return {
            days: Math.floor(duration.asDays()),
            hours: duration.hours(),
            minutes: duration.minutes(),
            seconds: duration.seconds(),
            totalDays: duration.asDays(),
        };
    }, [targetDate]);

    const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>(calculateTimeRemaining);

    useEffect(() => {
        setIsClient(true);
        const interval = setInterval(() => {
            setTimeRemaining(calculateTimeRemaining());
        }, 1000);

        return () => clearInterval(interval);
    }, [calculateTimeRemaining]);

    useEffect(() => {
        setTimeRemaining(calculateTimeRemaining());
    }, [calculateTimeRemaining]);

    const memoizedTimeRemaining = useMemo(() => timeRemaining, [timeRemaining]);

    const isBetweenDates = useCallback((): boolean => {
        const now = moment();
        const start = moment(startDate);
        const end = moment(endDate);
        return now.isBetween(start, end, null, '[]');
    }, [startDate, endDate]);

    const formatDate = (date: string) => {
        return <div>{t('Countdown.targetDate', { date: moment(date).format('YYYY-MM-DD HH:mm:ss') })}</div>;
    };
    const formatNow = () => {
        return <div className="font-bold text-green-500">{t('Countdown.now')}</div>;
    };
    const formatTimeRemaining = (days: number, hours: number, minutes: number, seconds: number, textColor: string) => {
        const displayParts: string[] = [];

        if (days > 0) displayParts.push(t('Countdown.days', { days }));
        if (hours > 0) displayParts.push(t('Countdown.hours', { hours }));
        if (minutes > 0) displayParts.push(t('Countdown.minutes', { minutes }));
        if (seconds > 0) displayParts.push(t('Countdown.seconds', { seconds }));

        return (
            <div className={textColor}>
                {displayParts.join(', ').trim()}
            </div>
        );
    };

    const determineTextColor = (days: number, hours: number): string => {
        let textColor = 'text-gray-500 text-center';

        if (hours < 24) textColor = 'text-orange-400 text-center';
        if (hours < 2) textColor = 'text-orange-500 text-center';
        if (hours < 1) textColor = 'text-red-600 text-center';

        return textColor;
    };

    const renderDisplayContent = () => {
        if (!isClient) return null;

        const { days, hours, minutes, seconds, totalDays } = memoizedTimeRemaining;

        if (totalDays > 5) {
            return formatDate(targetDate);
        }

        if (isBetweenDates()) {
            return formatNow();
        }

        if (days === 0 && hours === 0 && minutes === 0 && seconds === 0) {
            return <div>{t('Countdown.noTimeRemaining')}</div>;
        }

        const textColor = determineTextColor(days, hours);

        return formatTimeRemaining(days, hours, minutes, seconds, textColor);
    };

    return <div> {renderDisplayContent()}</div>;
};

export default Countdown;
