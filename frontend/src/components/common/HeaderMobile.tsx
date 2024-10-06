import React from "react";
import BackArrow from "@assets/icons/BackArrow";
import styled from "styled-components";
type Props = {
    title: string
}

const HeaderMobile: React.FC<Props> = ({ title }) => {
    return (
        <MobileHeader>
            <BackArrow width={40} height={40}>
            </BackArrow>
            <Text>
                {title}
            </Text>
        </MobileHeader>)
};

export default HeaderMobile;

const MobileHeader = styled.div`
    display: flex;
    align-items: center;
    padding-top: 1rem;
    padding-bottom: 1rem;
    padding-left: 1rem;
    height: 40px;
`
const Text = styled.div`
margin-top: 0.25rem;
margin-left: 0.5rem;
font-size: 1.5rem;
font-weight: 700;
`