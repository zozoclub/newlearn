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
        } else {
          if (onReject) onReject();
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
