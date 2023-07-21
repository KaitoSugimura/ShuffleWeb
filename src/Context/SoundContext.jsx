import { createContext, useCallback, useEffect, useRef, useState } from "react";
// Music
import titleMusic from "/Sound/Music/titleMusic.mp3";
import BattleMusic1 from "/Sound/Music/BattleMusic1.mp3";
import EndMusic from "/Sound/Music/EndMusic.mp3";
// Sound
import Select from "/Sound/SFX/Select.mp3";
import Hit from "/Sound/SFX/Hit.mp3";
import Death from "/Sound/SFX/Death.mp3";
import Roll from "/Sound/SFX/Roll.mp3";

const soundList = {
  Select: Select,
  Hit: Hit,
  Death: Death,
  Roll: Roll,
};

export const SoundContext = createContext();

export const SoundContextProvider = ({ children }) => {
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef(null);
  const SFXRef = useRef(null);
  const currentTimeRef = useRef(0);
  const currentThemeRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      SFXRef.current.volume = volume;
      audioRef.current.currentTime = currentTimeRef.current;
      if (volume == 0) audioRef.current.pause();
      else audioRef.current.play();
    }
  }, [volume]);

  const handleTimeUpdate = () => {
    currentTimeRef.current = audioRef.current.currentTime;
  };

  const playSFX = useCallback(
    (sfxName) => {
      if (volume == 0) return;
      const playPath = soundList[sfxName];
      if (playPath) {
        SFXRef.current.src = playPath;
        SFXRef.current.play();
      }
    },
    [volume]
  );

  const playMusic = useCallback(
    (musicName) => {
      if (musicName == null || audioRef.current == null || volume == 0) {
        return;
      }
      if (musicName === "resume") {
        audioRef.current.currentTime = currentTimeRef.current;
        audioRef.current.play();
        return;
      }
      switch (musicName) {
        case "title":
          audioRef.current.src = titleMusic;
          break;
        case "stage1":
          audioRef.current.src = BattleMusic1;
          break;
        case "end":
          audioRef.current.src = EndMusic;
          break;
      }

      audioRef.current.play();
    },
    [volume]
  );

  const stopMusic = () => {
    if (audioRef.current == null) {
      return;
    }
    audioRef.current.pause();
  };

  return (
    <SoundContext.Provider
      value={{
        volume,
        setVolume,
        playMusic,
        stopMusic,
        playSFX,
      }}
    >
      <audio
        ref={audioRef}
        loop="loop"
        onTimeUpdate={handleTimeUpdate}
        src={titleMusic}
      />
      <audio ref={SFXRef} />
      {children}
    </SoundContext.Provider>
  );
};
