import { BrowserRouter, Routes, Route } from "react-router-dom";
import MenuPage from "./pages/Menu";
import GamePage from "./pages/Game";
import { useEffect, useRef } from "react";

export default function App() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = true;
    audio.volume = 1;

    const startAudio = () => {
      audio
        .play()
        .then(() => {
          setTimeout(() => {
            audio.muted = false;
            audio.volume = 1;
          }, 300);
        })
        .catch(() => {});
    };

    audio.oncanplaythrough = () => {
      startAudio();
    };

    const handleInteraction = () => {
      startAudio();
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("touchstart", handleInteraction);
    };

    document.addEventListener("click", handleInteraction);
    document.addEventListener("touchstart", handleInteraction);

    return () => {
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("touchstart", handleInteraction);
    };
  }, []);

  return (
    <BrowserRouter>
      <audio ref={audioRef} src="/sounds/bgsong.mp3" loop muted autoPlay />

      <Routes>
        <Route path="/" element={<MenuPage />} />
        <Route path="/game" element={<GamePage />} />
      </Routes>
    </BrowserRouter>
  );
}
