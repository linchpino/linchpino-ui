import moment from 'moment-timezone';

export const empty = (value) => {
    return (value === undefined || value === null || value === "-" || value === 0 || value === "" || value === "NULL" || value === "null" || value === "0" || value === "NaN");
};
export const ValidateEmailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i

export const formatDateTime = (date) => {
    const userTimeZone = moment.tz.guess();
    return moment(date).tz(userTimeZone).format('YYYY-MM-DDTHH:mm:ssZ');
};
