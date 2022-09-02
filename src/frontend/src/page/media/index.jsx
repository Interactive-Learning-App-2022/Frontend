//import { Link }     from 'react-router-dom';
import MUtil from "util/mm.jsx";
import { VueInReact } from "vuera";

const _mm = new MUtil();

import React, { useRef, useState } from "react";
import "./index.scss";
// import YouTube from 'react-youtube';
import ReactPlayer from "react-player/youtube";

//opt variables for the Youtube player.
const opt = {
  playerVars: {
    //Disable keyboard input for video player
    disablekb: 1,
    // Disable full screen icon/button
    fs: 0,
    // Disables Youtube logo
    modestbranding: 1,
    //Allows video to play on mobile without fullscreening
    playsinline: 1,
    //Disables suggested videos
    rel: 0,
    //Enables manipulating video player through iframe api
    enablejsapi: 1,
  },
};

export default function App() {
  const [elapsed, setElapsed] = useState(0);
  // const [seeking, setSeeking] = useState(false);

  const playerRef = useRef();

  const handleProgress = (state) => {
    console.log("onProgress", state);
    setElapsed(state.playedSeconds);
  };

  return (
    <div className="App">
      <div className="left">
        <ReactPlayer
          url="https://www.youtube.com/watch?v=EQKATpGKyKM"
          controls={true}
          onProgress={handleProgress}
        />
      </div>
      <div className="right">
        <div className="right-questions">Questions</div>
      </div>
    </div>
  );
}

const checkElapsedTime = (e) => {
  const duration = e.target.getDuration();
  const currentTime = e.target.getCurrentTime();
  console.log(currentTime);
};
