import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import tzLookup from 'tz-lookup';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

const useDateTimeFormatter = () => {
  const pad2 = (n) => String(n).padStart(2, '0');

  const formatEventDateTime = (dateInput, timeInput, lng, lat) => {
    if (!dateInput || !timeInput) return null;
    if (typeof lng !== 'number' || typeof lat !== 'number') return null;

    let year; let monthIndex; let day;
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

    let hours = 0; let minutes = 0; let seconds = 0;
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

    let timeZone;
    try {
      // tz-lookup expects (lat, lng)
      timeZone = tzLookup(lat, lng);
    } catch (err) {
      return null;
    }

    const localString = `${year}-${pad2(monthIndex + 1)}-${pad2(day)} ${pad2(hours)}:${pad2(minutes)}:${pad2(seconds)}`;
    const dt = dayjs.tz(localString, 'YYYY-MM-DD HH:mm:ss', timeZone);
    if (!dt.isValid()) return null;

    return dt.toISOString();
  };

  const toLocalDateTimeParts = (utcISOString, lng, lat) => {
    if (!utcISOString) return { date: null, time: null };
    if (typeof lng !== 'number' || typeof lat !== 'number') return { date: null, time: null };

    let timeZone;
    try {
      timeZone = tzLookup(lat, lng);
    } catch {
      return { date: null, time: null };
    }

    // Interpret UTC instant, then represent in target time zone
    const dt = dayjs.utc(utcISOString).tz(timeZone);
    if (!dt.isValid()) return { date: null, time: null };

    return {
      date: dt.format('YYYY-MM-DD'),
      time: dt.format('HH:mm:ss'),
    };
  };

  return { formatEventDateTime, toLocalDateTimeParts };
};

export default useDateTimeFormatter;