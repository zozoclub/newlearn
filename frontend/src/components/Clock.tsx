import calculateTime from "@utils/calculateTime";
import { useEffect, useState } from "react";
import styled from "styled-components";

const Container = styled.div``;
const FormattedTime = styled.div`
  margin-bottom: 0.5rem;
  font-size: 2rem;
`;

const Clock = () => {
  const [time, setTime] = useState<string[]>([]);

  useEffect(() => {
    setTime(calculateTime(new Date()));

    const id = setInterval(() => {
      setTime(calculateTime(new Date()));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <Container>
      <FormattedTime>{time[0]}</FormattedTime>
      <div>{time[1]}</div>
    </Container>
  );
};

export default Clock;
