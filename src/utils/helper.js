import moment from 'moment-timezone';
import '../app/globals.css'

export const empty = (value) => {
    return (value === undefined || value === null || value === "-" || value === 0 || value === "" || value === "NULL" || value === "null" || value === "0" || value === "NaN");
};
export const ValidateEmailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i

export const formatDateTime = (date) => {
    const userTimeZone = moment.tz.guess();
    return moment(date).tz(userTimeZone).format('YYYY-MM-DDTHH:mm:ssZ');
};
export const textWithTooltip = (text, maxLength = 30) => {
    if (!text) return '';

    const truncatedText = text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;

    return text.length > maxLength ? (
        <div className="tooltip tooltip-right whitespace-pre-line " data-tip={text}>
            <span>{truncatedText}</span>
        </div>
    ) : (
        <span>{truncatedText}</span>
    );
};
