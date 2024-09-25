import calculateTime from "@utils/calculateTime";
import { useEffect, useState } from "react";
import styled from "styled-components";

const Clock = () => {
  const [time, setTime] = useState(() => calculateTime(new Date()));

  useEffect(() => {
    setTime(calculateTime(new Date()));

    const id = setInterval(() => {
      const newTime = calculateTime(new Date());
      // 시간과 분 단위가 변경될 때만 상태 업데이트
      if (newTime[0] !== time[0]) {
        setTime(newTime);
      }
    }, 1000);
    return () => clearInterval(id);
  }, [time]);

  return (
    <Container>
      <FormattedTime>
        {time[0]}
        <span>{time[1]}</span>
      </FormattedTime>
      <div>{time[2]}</div>
    </Container>
  );
};

const Container = styled.div`
  height: 7.5rem;
  font-size: 1.25rem;
  font-weight: 200;
`;

const FormattedTime = styled.div`
  margin-bottom: 0.5rem;
  font-size: 3rem;
  span {
    margin-left: 0.75rem;
    font-size: 1.5rem;
  }
`;

export default Clock;
