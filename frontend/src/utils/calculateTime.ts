const calculateTime = (time: Date): string[] => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const month = months[time.getMonth()];
  const day = days[time.getDay()];
  const date = time.getDate();

  let hours = time.getHours();
  const minutes = time.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12; // 0시를 12시로 변경

  const formattedTime = `${hours}:${minutes}`;

  return [`${formattedTime}`, `${ampm}`, `${day}, ${month} ${date}`];
};

export default calculateTime;
