import React from "react";
import { useTheme } from "styled-components";

const profileIcon: React.FC = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const theme = useTheme()
    return <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4.51807 20.708C4.51807 19.5145 4.99217 18.3699 5.83609 17.526C6.68 16.6821 7.82459 16.208 9.01807 16.208H18.0181C19.2115 16.208 20.3561 16.6821 21.2 17.526C22.044 18.3699 22.5181 19.5145 22.5181 20.708C22.5181 21.3047 22.281 21.877 21.8591 22.299C21.4371 22.721 20.8648 22.958 20.2681 22.958H6.76807C6.17133 22.958 5.59903 22.721 5.17708 22.299C4.75512 21.877 4.51807 21.3047 4.51807 20.708Z" stroke={theme.colors.text} stroke-width="1.625" stroke-linejoin="round" />
        <path d="M13.5181 11.708C15.382 11.708 16.8931 10.197 16.8931 8.33301C16.8931 6.46905 15.382 4.95801 13.5181 4.95801C11.6541 4.95801 10.1431 6.46905 10.1431 8.33301C10.1431 10.197 11.6541 11.708 13.5181 11.708Z" stroke={theme.colors.text} stroke-width="1.625" />
    </svg>
        ;
};

export default profileIcon;
