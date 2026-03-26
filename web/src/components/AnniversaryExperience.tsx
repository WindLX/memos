import { useEffect, useState } from "react";
import AnniversaryBanner from "@/components/AnniversaryBanner";
import CelebrationFireworks from "@/components/CelebrationFireworks";

const AnniversaryExperience = () => {
  const [isActive, setIsActive] = useState(() => document.documentElement.getAttribute("data-theme") === "anniversary");
  const [fireworksReplayNonce, setFireworksReplayNonce] = useState(0);

  useEffect(() => {
    const html = document.documentElement;
    const syncThemeState = () => {
      setIsActive(html.getAttribute("data-theme") === "anniversary");
    };

    const observer = new MutationObserver(syncThemeState);
    observer.observe(html, { attributes: true, attributeFilter: ["data-theme"] });

    return () => observer.disconnect();
  }, []);

  if (!isActive) {
    return null;
  }

  return (
    <>
      <AnniversaryBanner onReplayFireworks={() => setFireworksReplayNonce((nonce) => nonce + 1)} />
      <CelebrationFireworks enabled replayNonce={fireworksReplayNonce} />
    </>
  );
};

export default AnniversaryExperience;
