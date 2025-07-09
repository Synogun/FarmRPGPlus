
class TimeControl {

    static getLocaleTimeStringOnCT(timestamp) {
        let parsedTimestamp = timestamp ? TimeControl.getLocaleTimeOnCT(timestamp) : 'Invalid Timestamp';

        parsedTimestamp = parsedTimestamp.toLocaleString('en-US', {
            day: 'numeric',
            month: 'short',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true,
        });

        return parsedTimestamp;
    }

    static getLocaleTimeOnCT(timestamp) {
    // If a timestamp is provided, use it; otherwise, use the current time
        const now = timestamp ? new Date(timestamp) : new Date;
        const utcOffset = now.getTimezoneOffset() * 60000;
        const centralTime = new Date(now.getTime() + utcOffset - (3600000 * 5));
        return centralTime;
    }

    /**
     * Determines if the current time (in Central Time, UTC-5) falls within specific reset periods.
     *
     * The function checks two reset windows:
     * 1. Between 11:30 and 11:35 PM CT (inclusive).
     * 2. Between 12:00 and 12:04 AM CT (inclusive).
     *
     * @returns {number} Returns 1 if the current time is within backup period, 2 if is within reset period, otherwise 0.
     */
    static isResetTime() {
        const nowOnCT = TimeControl.getLocaleTimeOnCT();

        if (
            nowOnCT.getHours() === 23 &&
            nowOnCT.getMinutes() >= 29 &&
            nowOnCT.getMinutes() <= 36
        ) {
            return 1;
        }

        if (
            nowOnCT.getHours() === 0 &&
            nowOnCT.getMinutes() >= 0 &&
            nowOnCT.getMinutes() <= 6
        ) {
            return 2;
        }

        return 0;
    }
}

export default TimeControl;
