import React from "react";
import { RecoilRoot } from "recoil";
import "./App.css";
import MainPage from "@pages/MainPage";

function App() {
  return (
    <RecoilRoot>
      <MainPage />
    </RecoilRoot>
  );
}

export default App;
