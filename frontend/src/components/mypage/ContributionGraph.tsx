import { lightTheme } from "@styles/theme/lightTheme";
import React from "react";
import styled from "styled-components";
import { useTheme } from "styled-components";
import { GrassType } from "@services/mypageService";
import { useMediaQuery } from "react-responsive";

type grassProps = {
  data: GrassType[];
};

const ContributionGraph: React.FC<grassProps> = ({ data }) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const weekCount = isMobile ? 13 : 25;
  const getStartDate = () => {
    const today = new Date();
    const daysSinceLastMonday = (today.getDay() + 6) % 7;
    const lastMonday = new Date(
      today.setDate(today.getDate() - daysSinceLastMonday)
    );
    const startDate = new Date(
      lastMonday.setDate(lastMonday.getDate() - weekCount * 7)
    );
    return startDate;
  };

  const startDate = getStartDate();
  const weeks = Array.from({ length: weekCount + 1 }, (_, i) => i);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const darkColors = [
    "#1A1925 ",
    "#0F3353 ",
    "#004D81 ",
    "#005994 ",
    "#0065A8 ",
    "#0075C2 ",
    "#0084DC ",
    "#008EED ",
    "#0099FF ",
  ];

  const lightColors = [
    "#DDDDDD",
    "#D4E5FF",
    "#B8D8FF",
    "#99CCFF",
    "#77BBFF",
    "#55AAFF",
    "#3399FF",
    "#1188FF",
    "#0066FF",
  ];

  const theme = useTheme();
  const colors = theme === lightTheme ? lightColors : darkColors;

  const getColor = (count: number) => {
    const index = Math.min(Math.ceil(count / 2), colors.length - 1);
    return colors[index];
  };

  const getContributionCount = (date: Date) => {
    const contribution = data.find((d) => isSameDay(new Date(d.date), date));
    return contribution ? contribution.count : 0;
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const formatMonth = (date: Date) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return months[date.getMonth()];
  };

  const formatDate = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  };

  const addDays = (date: Date, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  return (
    <>
      <GraphContent>
        <MonthRow>
          <WeekdayLabel />
          {weeks.map((week) => {
            const date = addDays(startDate, week * 7);
            return (
              <MonthLabel key={week}>
                {date.getDate() <= 7 ? formatMonth(date) : ""}
              </MonthLabel>
            );
          })}
        </MonthRow>
        {days.map((day, dayIndex) => (
          <WeekRow key={day}>
            <WeekdayLabel>{day}</WeekdayLabel>
            {weeks.map((week) => {
              const date = addDays(startDate, week * 7 + dayIndex);
              const count = getContributionCount(date);
              return (
                <Day
                  key={week}
                  color={getColor(count)}
                  title={`${formatDate(date)} : ${count}건`}
                />
              );
            })}
          </WeekRow>
        ))}
      </GraphContent>
      <ColorLegend>
        <LegendText>Less</LegendText>
        {colors.map((color, index) => (
          <LegendColor key={index} color={color} />
        ))}
        <LegendText>More</LegendText>
      </ColorLegend>
    </>
  );
};

export default ContributionGraph;

const GraphContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

// 월 표시
const MonthRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.25rem;
`;

const MonthLabel = styled.div`
  font-size: 1rem;
  width: 1.375rem;
  height: 1.375rem;
  margin: 0.125rem;
  text-align: center;
`;

// 요일 표시
const WeekRow = styled.div`
  display: flex;
  align-items: center;
`;

const WeekdayLabel = styled.span`
  font-size: 0.875rem;
  width: 2rem;
  margin-right: 0.5rem;
`;

// 일 표시 (잔디 각각)
const Day = styled.div<{ color: string }>`
  width: 1.375rem;
  height: 1.375rem;
  margin: 0.125rem;
  background-color: ${(props) => props.color};
  position: relative;
  border-radius: 0.25rem;

  &:hover::after {
    content: attr(title);
    position: absolute;
    top: -30px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #24292e;
    color: #c9d1d9;
    padding: 0.325rem;
    border-radius: 0.25rem;
    font-size: 1rem;
    white-space: nowrap;
    z-index: 1;
  }
`;

// 컬러 범례 표시
const ColorLegend = styled.div`
  display: flex;
  align-items: center;
  justify-content: end;
  margin-top: 1.5rem;
  @media (max-width: 768px) {
    display: none;
  }
`;

const LegendColor = styled.div<{ color: string }>`
  width: 1rem;
  height: 1rem;
  margin: 0 0.125rem;
  background-color: ${(props) => props.color};
`;

const LegendText = styled.span`
  font-size: 0.75rem;
  margin: 0 0.25rem;
`;
