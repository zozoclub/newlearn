import { useState } from "react";
import styled from "styled-components";
import ProfileWidget from "./Profile";
import { logout } from "@services/userService";
import { usePageTransition } from "@hooks/usePageTransition";

const UserProfile = () => {
  const [isOpened, setIsOpened] = useState(false);
  const translateTo = usePageTransition();

  async function handleLogoutButton() {
    try {
      await logout();
      sessionStorage.removeItem("accessToken");
      history.pushState(null, "", location.href);
      window.onpopstate = function () {
        history.go(-2);
      };
      translateTo("/login");
    } catch (error) {
      console.error("logout failed: ", error);
    }
  }

  return (
    <Container>
      <ProfileAvatar onClick={() => setIsOpened(!isOpened)}>
        하이 ㅎ
      </ProfileAvatar>
      <UserProfileModal $isOpened={isOpened}>
        <div className="tail"></div>
        <ProfileWidget />
        <div className="logout" onClick={handleLogoutButton}>
          로그아웃
        </div>
      </UserProfileModal>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  text-align: center;
  align-items: center;
  position: relative;
  width: 2.5rem;
  height: 2.5rem;
  border: solid 0.125rem ${(props) => props.theme.colors.placeholder};
  border-radius: 100%;
`;

const ProfileAvatar = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 100%;
  background-color: blue;
`;

const UserProfileModal = styled.div<{ $isOpened: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  z-index: 2;
  top: 3.5rem;
  right: 0;
  width: 18rem;
  height: 17rem;
  padding: 2rem 1rem 1rem 1rem;
  background-color: ${(props) => props.theme.colors.cardBackground};
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 0.75rem 0 0.75rem 0.75rem;
  opacity: ${(props) => (props.$isOpened ? 1 : 0)};
  visibility: ${(props) => (props.$isOpened ? "visible" : "hidden")};
  transform: translateY(${(props) => (props.$isOpened ? "0" : "-10px")});
  transition: opacity 0.3s ease, visibility 0.3s ease, transform 0.3s ease;

  .tail {
    position: absolute;
    right: 0;
    top: -2rem;
    width: 0;
    height: 0;
    border-bottom: 1rem solid ${(props) => props.theme.colors.cardBackground};
    border-top: 1rem solid transparent;
    border-left: 0.5rem solid transparent;
    border-right: 0.5rem solid transparent;
  }
  .logout {
    position: absolute;
    top: 1rem;
    right: 1rem;
    cursor: pointer;
  }
`;

export default UserProfile;
