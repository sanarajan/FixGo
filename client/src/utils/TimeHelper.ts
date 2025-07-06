const timeOptions = [
  "10:00 AM",
  "12:00 PM",
  "2:00 PM",
  "4:00 PM",
  "6:00 PM",
];

const parseTime = (timeStr: string) => {
  const [time, modifier] = timeStr.split(" ");
  let [hours, minutes] = time.split(":").map(Number);
  if (modifier === "PM" && hours < 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;
  return { hours, minutes };
};

const isFutureTime = (timeStr: string, currentDateTime: Date) => {
  const { hours, minutes } = parseTime(timeStr);
  const timeDate = new Date(currentDateTime);
  timeDate.setHours(hours, minutes, 0, 0);
  return timeDate > currentDateTime;
};

export const getFilteredTimeOptions = (selectedDate: string) => {
  const todayStr = new Date().toISOString().split("T")[0];
  const now = new Date();

  if (!selectedDate) return [];

  if (selectedDate === todayStr) {
    return timeOptions.filter((time) => isFutureTime(time, now));
  }

  return timeOptions;
};
