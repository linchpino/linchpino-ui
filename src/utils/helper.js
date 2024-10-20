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
function iso7064Mod97_10(iban) {
    let remainder = iban,
        block;

    while (remainder.length > 2){
        block = remainder.slice(0, 9);
        remainder = parseInt(block, 10) % 97 + remainder.slice(block.length);
    }

    return parseInt(remainder, 10) % 97;
}

export const validateIBAN= (str) => {
    let pattern = /[0-9]{24}/;

    if (str.length !== 24) {
        return false;
    }

    if (!pattern.test(str)) {
        return false;
    }

    let newStr = str.substr(4);
    let d1 = str.charCodeAt(0) - 65 + 10;
    let d2 = str.charCodeAt(1) - 65 + 10;
    newStr += d1.toString() + d2.toString() + str.substr(2, 2);

    let remainder = iso7064Mod97_10(newStr);
    return !(remainder !== 1);
};
