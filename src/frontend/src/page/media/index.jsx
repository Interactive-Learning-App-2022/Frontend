//import { Link }     from 'react-router-dom';
import MUtil from "util/mm.jsx";
import { VueInReact } from "vuera";

const _mm = new MUtil();

import React, { useEffect, useState } from "react";
import "./index.scss";
import ReactPlayer from "react-player/youtube";
// import { set } from "vue/types/umd";

export default function App() {
  const [elapsed, setElapsed] = useState(0);
  const [nextTS, setNextTS] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [actualAnswer, setActualAnswer] = useState("");

  const apiCall = JSON.parse(
    '[[184, "7 + 3 = 10\\n__ + __ = 10\\n\\n5 x 4 = 20\\n__ x __ = 20", [3, 7, 4, 5]], [289, "6 + 2 =\\n__ + __ =\\n\\n8 x 3 =\\n__ x __ =", [2, 6, 3, 8]]]'
  );

  useEffect(() => {
    if (nextTS < apiCall.length) {
      if (elapsed >= apiCall[nextTS][0]) {
        setCurrentQuestion(apiCall[nextTS][1]);
        setCurrentAnswer("");
        setActualAnswer(apiCall[nextTS][2]);
        setNextTS(nextTS + 1);
      }
    }
  }, [elapsed]);

  const handleProgress = (state) => {
    setElapsed(state.playedSeconds);
  };

  const handleChange = (event) => {
    setCurrentAnswer(event.target.value);
  };

  return (
    <div className="App">
      <div className="left">
        <ReactPlayer
          url="https://www.youtube.com/watch?v=EQKATpGKyKM"
          onProgress={handleProgress}
          controls={true}
        />
      </div>
      <div className="right">
        <text className="right-questions">{currentQuestion}</text>
        <input value={currentAnswer} onChange={handleChange} />
      </div>
    </div>
  );
}
