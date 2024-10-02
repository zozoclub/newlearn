import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import ProfileWidget from "@components/common/Profile";
import { logout } from "@services/userService";
import { usePageTransition } from "@hooks/usePageTransition";
import { useRecoilValue } from "recoil";
import userInfoState from "@store/userInfoState";
import Avatar, { AvatarType } from "./Avatar";

const UserProfile = () => {
  const [isOpened, setIsOpened] = useState(false);
  const translateTo = usePageTransition();
  const userInfoData = useRecoilValue(userInfoState);
  const isInitialized = userInfoData.isInitialized;
  const avatar: AvatarType = {
    skin: userInfoData.skin,
    eyes: userInfoData.eyes,
    mask: userInfoData.mask,
  };

  // 모달 외의 영역 클릭했을 때 모달 창 닫기
  const modalRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node) &&
        avatarRef.current &&
        !avatarRef.current.contains(event.target as Node)
      ) {
        setIsOpened(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  async function handleLogoutButton() {
    try {
      await logout();
      sessionStorage.removeItem("accessToken");
      setIsOpened(false);
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
      <ProfileAvatar
        $isInitialized={isInitialized}
        onClick={() => setIsOpened(!isOpened)}
        ref={avatarRef}
      >
        {isInitialized && <Avatar avatar={avatar} size={3} />}
      </ProfileAvatar>
      <UserProfileModal $isOpened={isOpened} ref={modalRef}>
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
  width: 3rem;
  height: 3rem;
  border: solid 0.125rem ${(props) => props.theme.colors.placeholder};
  border-radius: 100%;
`;

const ProfileAvatar = styled.div<{ $isInitialized: boolean }>`
  width: 3rem;
  height: 3rem;
  border-radius: 100%;
  background-color: ${(props) => props.theme.colors.text};
  cursor: pointer;
  overflow: hidden;
  opacity: ${(props) => (props.$isInitialized ? 1 : 0)};
  transition: opacity 0.5s;
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
