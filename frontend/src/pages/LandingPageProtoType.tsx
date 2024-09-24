import FullPageScroll from "@components/landingpage/FullPageScroll";
import LandingHeader from "@components/landingpage/LandingHeader";

const LandingPage = () => {
  return (
    <>
      <LandingHeader />
      <FullPageScroll>
        <div style={{ backgroundColor: "black", height: "100vh" }}></div>
        <div style={{ backgroundColor: "red", height: "100vh" }}></div>
        <div style={{ backgroundColor: "blue", height: "100vh" }}></div>
        <div style={{ backgroundColor: "yellow", height: "100vh" }}></div>
      </FullPageScroll>
    </>
  );
};

export default LandingPage;
