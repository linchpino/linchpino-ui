export const empty = (value) => {
    return (value === undefined || value === null || value === "-" || value === 0 || value === "" || value === "NULL" || value === "null" || value === "0" || value === "NaN");
};
