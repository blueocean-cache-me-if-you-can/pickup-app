const useDateTimeFormatter = () => {
    const formatEventDateTime = (dateInput, timeInput) => {
      const date = new Date(dateInput);
      const time = new Date(timeInput);
  
      const dateString = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      const timeString = time.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
  
      return `${dateString} ${timeString}`;
    };
  
    return { formatEventDateTime };
  };
  
  export default useDateTimeFormatter;