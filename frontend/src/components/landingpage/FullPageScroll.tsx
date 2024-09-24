import { PropsWithChildren, useEffect, useRef, useState } from "react";
import styled from "styled-components";

type PFullPageScroll = {
  onPageChange?: (page: number) => void;
  onLoad?: (limit: number) => void;
} & PropsWithChildren;

const FullPageScroll: React.FC<PFullPageScroll> = ({
  children,
  onLoad = () => {},
  onPageChange = () => {},
}) => {
  const outerDivRef = useRef<HTMLDivElement>(null);
  const currentPage = useRef<number>(0);
  const canScroll = useRef<boolean>(true);
  const oldTouchY = useRef<number>(0);
  const [_, refresh] = useState<number>(0);

  const scrollDown = () => {
    const pageHeight = outerDivRef.current?.children.item(0)?.clientHeight; // 화면 세로 길이 100vh
    if (outerDivRef.current && pageHeight) {
      outerDivRef.current.scrollTo({
        top: pageHeight * (currentPage.current + 1),
        left: 0,
        behavior: "smooth",
      });
      canScroll.current = false;
      setTimeout(() => {
        canScroll.current = true;
      }, 500);
      if (outerDivRef.current.childElementCount - 1 > currentPage.current) {
        currentPage.current++;
      }
    }
    console.log(currentPage.current);
    onPageChange(currentPage.current);
    refresh((v) => v + 1);
  };

  const scrollUp = () => {
    const pageHeight = outerDivRef.current?.children.item(0)?.clientHeight; // 화면 세로 길이 100vh
    if (outerDivRef.current && pageHeight) {
      outerDivRef.current.scrollTo({
        top: pageHeight * (currentPage.current - 1),
        left: 0,
        behavior: "smooth",
      });
      canScroll.current = false;
      setTimeout(() => {
        canScroll.current = true;
      }, 500);
      if (currentPage.current > 0) {
        currentPage.current--;
      }
    }
    console.log(currentPage.current);
    onPageChange(currentPage.current);
    refresh((v) => v + 1);
  };

  const wheelHandler = (event: WheelEvent) => {
    event.preventDefault();
    if (!canScroll.current) return;
    const { deltaY } = event; // 스크롤 위 아래를 양수, 음수 여부로 구분
    console.log("Scroll to", outerDivRef.current?.scrollHeight);
    if (deltaY > 0 && outerDivRef.current) {
      scrollDown();
    } else if (deltaY < 0 && outerDivRef.current) {
      scrollUp();
    }
  };

  const scrollHandler = (event: Event) => {
    event.preventDefault();
  };

  const onTouchDown = (event: TouchEvent) => {
    oldTouchY.current = event.changedTouches.item(0)?.clientY || 0;
  };

  const onTouchUp = (event: TouchEvent) => {
    const currentTouchY = event.changedTouches.item(0)?.clientY || 0;
    const isScrollDown: boolean =
      oldTouchY.current - currentTouchY > 0 ? true : false;
    if (isScrollDown) {
      scrollDown();
    } else {
      scrollUp();
    }
  };

  useEffect(() => {
    const outer = outerDivRef.current;
    if (!outer) return;
    onLoad(outerDivRef.current.childElementCount);
    refresh((v) => v + 1);
    outer.addEventListener("wheel", wheelHandler);
    outer.addEventListener("scroll", scrollHandler);
    outer.addEventListener("touchmove", scrollHandler);
    outer.addEventListener("touchstart", onTouchDown);
    outer.addEventListener("touchend", onTouchUp);
    return () => {
      outer.removeEventListener("wheel", wheelHandler);
      outer.removeEventListener("scroll", scrollHandler);
      outer.removeEventListener("touchmove", scrollHandler);
      outer.removeEventListener("touchstart", onTouchDown);
      outer.removeEventListener("touchend", onTouchUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Container
        ref={outerDivRef}
        style={{ height: "100vh", width: "100%", overflowY: "hidden" }}
      >
        {children}
      </Container>
    </>
  );
};

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100%;
`;

export default FullPageScroll;
