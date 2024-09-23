import { themeState } from "@store/themeState";
import { useRecoilState } from "recoil";
import styled from "styled-components";

const DarkModeButton = () => {
  const [theme, setTheme] = useRecoilState(themeState);

  const clickHandler = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <ToggleButtonWrapper>
      <ToggleButton>
        <div className={theme === "dark" ? "col col--dark" : "col col--light"}>
          <label>
            <span
              className={`switch ${
                theme === "dark" ? "switch--dark" : "switch--light"
              }`}
            >
              <input
                className="switch__input"
                type="checkbox"
                role="switch"
                checked={theme === "dark"}
                onChange={clickHandler}
              />
              <span className="switch__surface">
                <span className="switch__surface-glare"></span>
              </span>
              <span className="switch__inner-shadow"></span>
              <span className="switch__inner">
                <span className="switch__inner-glare"></span>
              </span>
              <span className="switch__rocker-shadow"></span>
              <span className="switch__rocker-sides">
                <span className="switch__rocker-sides-glare"></span>
              </span>
              <span className="switch__rocker">
                <span className="switch__rocker-glare"></span>
              </span>
              <span className="switch__light">
                <span className="switch__light-inner"></span>
              </span>
            </span>
            <span className="sr">
              {theme === "dark" ? "Dark" : "Light"} Switch
            </span>
          </label>
        </div>
      </ToggleButton>
    </ToggleButtonWrapper>
  );
};

const ToggleButtonWrapper = styled.div`
  margin: 0 1rem;
  --hue: 223;
  --fg: hsl(var(--hue), 10%, 10%);
  --trans-dur: 0.3s;
  --trans-timing: cubic-bezier(0.83, 0, 0.17, 1);
  font-size: 15px;
`;

const ToggleButton = styled.div`
  :root {
    --hue: 223;
    --fg: hsl(var(--hue), 10%, 10%);
    --trans-dur: 0.3s;
    --trans-timing: cubic-bezier(0.83, 0, 0.17, 1);
    font-size: calc(30px + (60 - 30) * (100vw - 320px) / (2560 - 320));
  }
  body,
  input {
    color: var(--fg);
    font: 1em/1.5 sans-serif;
  }
  body {
    display: flex;
    height: 100vh;
  }
  main,
  label,
  .col {
    display: flex;
  }
  main {
    flex-direction: column;
    width: 100%;
  }
  label {
    align-items: center;
    margin: auto;
    -webkit-tap-highlight-color: transparent;
  }
  .sr {
    overflow: hidden;
    position: absolute;
    width: 1px;
    height: 1px;
  }

  /* Light theme */
  .switch,
  .switch__input {
    display: block;
  }
  .switch {
    border-radius: 1.5em;
    box-shadow: 0 0.125em 0.25em hsla(0, 0%, 0%, 0.4);
    position: relative;
    width: 4.5em;
    height: 3em;
    perspective: 10em;
  }
  .switch span {
    display: block;
  }
  .switch > span {
    border-radius: inherit;
    z-index: 1;
  }
  .switch__surface-glare,
  .switch__inner,
  .switch__inner-glare,
  .switch__rocker-sides,
  .switch__rocker-sides-glare,
  .switch__rocker,
  .switch__rocker-glare,
  .switch__light {
    transition: transform var(--trans-dur) var(--trans-timing);
  }
  .switch__surface {
    background-color: hsl(var(--hue), 10%, 83%);
    overflow: hidden;
    width: 100%;
    height: 100%;
  }
  .switch > .switch__surface {
    z-index: 0;
  }
  .switch__surface-glare {
    background-image: radial-gradient(
      50% 50% at center,
      hsla(var(--hue), 10%, 90%, 1),
      hsla(var(--hue), 10%, 90%, 0)
    );
    width: 3em;
    height: 3em;
    transform: translate(0, 0.125em);
  }
  .switch__input {
    background-color: hsl(var(--hue), 10%, 80%);
    border-radius: 1.5em;
    box-shadow: 0 0 0 0.125em hsla(var(--hue), 90%, 50%, 0);
    outline: transparent;
    position: absolute;
    top: 0.0625em;
    left: 0.0625em;
    width: calc(100% - 0.125em);
    height: calc(100% - 0.125em);
    transition: box-shadow 0.15s linear;
    z-index: 1;
    -webkit-appearance: none;
    appearance: none;
    -webkit-tap-highlight-color: transparent;
  }
  .switch__input:focus-visible {
    box-shadow: 0 0 0 0.125em hsla(var(--hue), 90%, 50%, 1);
  }
  .switch__inner {
    background-color: hsl(var(--hue), 10%, 83%);
    overflow: hidden;
    position: absolute;
    inset: 0.5em;
    transform: translate(0.125em, 0);
  }
  .switch__inner-glare {
    background-image: radial-gradient(
      50% 50% at center,
      hsla(var(--hue), 10%, 90%, 1),
      hsla(var(--hue), 10%, 90%, 0)
    );
    position: absolute;
    width: 2em;
    height: 2em;
    transform: translate(100%, -0.5em);
  }
  .switch__inner-shadow {
    box-shadow: 0 0.125em 0.25em hsla(0, 0%, 0%, 0.4);
    position: absolute;
    inset: 0.5em;
  }
  .switch__rocker-shadow {
    box-shadow: 0 0.125em 0.25em hsla(0, 0%, 0%, 0.15);
    position: absolute;
    top: 0.5625em;
    right: 0.5625em;
    bottom: 0.5625em;
    left: 0.75em;
  }
  .switch__rocker-sides {
    background-color: hsl(var(--hue), 10%, 80%);
    overflow: hidden;
    position: absolute;
    inset: 0.5em;
    transform: rotateY(-20deg) translateZ(0.5em);
    transform-style: preserve-3d;
  }
  .switch__rocker-sides-glare {
    background-image: linear-gradient(
      90deg,
      hsla(var(--hue), 10%, 85%, 0),
      hsla(var(--hue), 10%, 85%, 1),
      hsla(var(--hue), 10%, 85%, 0)
    );
    position: absolute;
    width: 200%;
    height: 100%;
  }
  .switch__rocker {
    background-color: hsl(var(--hue), 10%, 80%);
    overflow: hidden;
    position: absolute;
    inset: 0.5625em;
    transform: rotateY(-20deg) translateZ(0.5em);
    transform-style: preserve-3d;
  }
  .switch__rocker-glare {
    background-image: linear-gradient(
      120deg,
      hsla(var(--hue), 10%, 85%, 0) 25%,
      hsla(var(--hue), 10%, 85%, 1) 50%,
      hsla(var(--hue), 10%, 85%, 0) 75%
    );
    position: absolute;
    width: 100%;
    height: 100%;
    transform: translateX(-33%);
  }
  .switch__light {
    background-image: linear-gradient(
      -45deg,
      hsl(var(--hue), 10%, 60%) 30%,
      hsl(var(--hue), 10%, 80%)
    );
    box-shadow: 0 0 max(1px, 0.05em) hsla(var(--hue), 10%, 10%, 0.3) inset;
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0.5em;
    height: 0.5em;
    transform: translate(-50%, -50%) rotateY(-20deg) translateX(1.125em)
      translateZ(0.51em);
  }
  .switch__light-inner {
    background-color: ${(props) => props.theme.colors.primary + "BF"};
    box-shadow: 0 0 max(1px, 0.05em) hsla(var(--hue), 10%, 10%, 0.3) inset,
      0 0 0.25em ${(props) => props.theme.colors.primary + "BF"};
    border-radius: 50%;
    opacity: 0;
    width: 100%;
    height: 100%;
    transition: opacity var(--trans-dur) var(--trans-timing);
  }

  /* Dark theme */
  .col--dark .switch__surface {
    background-color: hsl(var(--hue), 10%, 22%);
  }
  .col--dark .switch__surface-glare {
    background-image: radial-gradient(
      50% 50% at center,
      hsla(var(--hue), 10%, 45%, 1),
      hsla(var(--hue), 10%, 45%, 0)
    );
  }
  .col--dark .switch__input {
    background-color: hsl(var(--hue), 10%, 20%);
  }
  .col--dark .switch__inner {
    background-color: hsl(var(--hue), 10%, 22%);
  }
  .col--dark .switch__inner-glare {
    background-image: radial-gradient(
      50% 50% at center,
      hsla(var(--hue), 10%, 45%, 1),
      hsla(var(--hue), 10%, 45%, 0)
    );
  }
  .col--dark .switch__rocker-shadow {
    box-shadow: 0 0.125em 0.25em hsla(0, 0%, 0%, 0.5);
  }
  .col--dark .switch__rocker-sides {
    background-color: hsl(var(--hue), 10%, 20%);
  }
  .col--dark .switch__rocker-sides-glare {
    background-image: linear-gradient(
      90deg,
      hsla(var(--hue), 10%, 35%, 0),
      hsla(var(--hue), 10%, 35%, 1),
      hsla(var(--hue), 10%, 35%, 0)
    );
  }
  .col--dark .switch__rocker {
    background-color: hsl(var(--hue), 10%, 20%);
  }
  .col--dark .switch__rocker-glare {
    background-image: linear-gradient(
      120deg,
      hsla(var(--hue), 10%, 25%, 0) 25%,
      hsla(var(--hue), 10%, 25%, 1) 50%,
      hsla(var(--hue), 10%, 25%, 0) 75%
    );
  }
  .col--dark .switch__light {
    background-image: linear-gradient(
      -45deg,
      hsl(var(--hue), 10%, 30%) 30%,
      hsl(var(--hue), 10%, 50%)
    );
  }

  /* “On” state */
  .switch__input:checked ~ .switch__surface .switch__surface-glare {
    transform: translate(3em, 0.125em);
  }
  .switch__input:checked ~ .switch__inner {
    transform: translate(-0.125em, 0);
  }
  .switch__input:checked ~ .switch__inner .switch__inner-glare {
    transform: translate(0, -0.5em);
  }
  .switch__input:checked ~ .switch__rocker {
    transform: rotateY(20deg) translateZ(0.5em);
  }
  .switch__input:checked ~ .switch__rocker .switch__rocker-glare {
    transform: translateX(33%);
  }
  .switch__input:checked ~ .switch__rocker-sides {
    transform: rotateY(20deg) translateZ(0.5em);
  }
  .switch__input:checked ~ .switch__rocker-sides .switch__rocker-sides-glare {
    transform: translateX(-50%);
  }
  .switch__input:checked ~ .switch__light {
    transform: translate(-50%, -50%) rotateY(20deg) translateX(1.125em)
      translateZ(0.51em);
  }
  .switch__input:checked ~ .switch__light .switch__light-inner {
    opacity: 1;
  }

  /* Viewports beyond mobile */
  @media (min-width: 768px) {
    main {
      flex-direction: row;
    }
  }
`;

export default DarkModeButton;
