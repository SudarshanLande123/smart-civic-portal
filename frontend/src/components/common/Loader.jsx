import "./Loaderr.css";

// Plays the ring "build-up" intro only the first time the app loads
// per browser tab/session. Later mounts (e.g. navigating between
// pages that each show the loader) skip straight to spinning.
const hasPlayedIntro = () => {
  try {
    return sessionStorage.getItem("shieldLoaderIntroPlayed") === "true";
  } catch {
    return false;
  }
};

const markIntroPlayed = () => {
  try {
    sessionStorage.setItem("shieldLoaderIntroPlayed", "true");
  } catch {
    // sessionStorage unavailable (e.g. private mode) — fine, just replays intro
  }
};

const Loader = () => {
  const skipIntro = hasPlayedIntro();

  if (!skipIntro) {
    markIntroPlayed();
  }

  return (
    <div className="shield-loader-wrap">
      <div className={`shield-loader${skipIntro ? " no-intro" : ""}`}>
        <div className="ring outer"></div>
        <div className="ring middle"></div>
        <div className="ring inner"></div>
        <div className="center-circle">
          <div className="star">★</div>
        </div>
      </div>
    </div>
  );
};

export default Loader;