import { useEffect, useMemo, useState } from "react";

type OwnProps = {
  onAccepted?: () => void;
  onReject?: () => void;
};

export const usePWAPrompt = ({ onAccepted, onReject }: OwnProps) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const isInstalled = useMemo(() => deferredPrompt === null, [deferredPrompt]);
  const isPWA = window.matchMedia("(display-mode: standalone)").matches;
  const isMobile = useMemo(() => {
    const userAgent = navigator.userAgent || navigator.vendor;
    return /android|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile/i.test(
      userAgent
    );
  }, []);

  useEffect(() => {
    const rejectedPwaInstall = localStorage.getItem("pwaInstallRejected");
    if (rejectedPwaInstall === "true") {
      // 사용자가 이전에 설치 거절했으면 프롬프트를 띄우지 않음
      return;
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleBeforeInstallPrompt = (event: Event) => {
    event.preventDefault();
    setDeferredPrompt(event);
  };

  const handleInstallClick = () => {
    if (!isInstalled) {
      deferredPrompt.prompt();

      deferredPrompt.userChoice.then((choiceResult: { outcome: string }) => {
        if (choiceResult.outcome === "accepted") {
          if (onAccepted) onAccepted();
          // PWA 설치 성공 시 로컬 스토리지에 저장할 필요는 없음
        } else {
          if (onReject) onReject();
          // PWA 설치 거절 시 로컬 스토리지에 거절 상태 저장
          localStorage.setItem("pwaInstallRejected", "true");
        }
        setDeferredPrompt(null);
      });
    }
  };

  const handleOpenAppClick = () => {
    if (isInstalled && !isPWA && isMobile) {
      window.open("https://j11d105.p.ssafy.io", "_blank");
    }
  };

  return [
    isInstalled,
    isPWA,
    isMobile,
    handleInstallClick,
    handleOpenAppClick,
  ] as const;
};
