const useDateTimeFormatter = () => {
    const formatEventDateTime = (dateInput, timeInput) => {
        if (!dateInput || !timeInput) return null;

        let year, monthIndex, day;
        if (dateInput instanceof Date) {
            year = dateInput.getFullYear();
            monthIndex = dateInput.getMonth();
            day = dateInput.getDate();
        } else if (typeof dateInput === 'string') {
            const m = dateInput.match(/^(\d{4})-(\d{2})-(\d{2})$/);
            if (!m) return null;
            year = parseInt(m[1], 10);
            monthIndex = parseInt(m[2], 10) - 1;
            day = parseInt(m[3], 10);
        } else {
            return null;
        }

        let hours = 0, minutes = 0, seconds = 0;
        if (typeof timeInput === 'string') {
            const t = timeInput.match(/^(\d{2}):(\d{2})(?::(\d{2}))?$/);
            if (!t) return null;
            hours = parseInt(t[1], 10);
            minutes = parseInt(t[2], 10);
            seconds = t[3] ? parseInt(t[3], 10) : 0;
        } else if (timeInput instanceof Date) {
            hours = timeInput.getHours();
            minutes = timeInput.getMinutes();
            seconds = timeInput.getSeconds();
        } else {
            return null;
        }

        return new Date(Date.UTC(year, monthIndex, day, hours, minutes, seconds, 0)).toISOString();
    };

    return { formatEventDateTime };
  };
  
  export default useDateTimeFormatter;