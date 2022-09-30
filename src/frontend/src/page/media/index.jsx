//import { Link }     from 'react-router-dom';
import MUtil from "util/mm.jsx";
import { VueInReact } from "vuera";

const _mm = new MUtil();

import React, { useCallback, useEffect, useState, useRef } from "react";
import "./index.scss";
import ReactPlayer from "react-player/youtube";
import { number } from "prop-types";
// import { set } from "vue/types/umd";

export default function App() {
  const [elapsed, setElapsed] = useState(0);
  const [currentTS, setCurrentTS] = useState();
  const [currentContent, setCurrentContent] = useState(""); // split-screen content
  const [currentAnswer, setCurrentAnswer] = useState({}); // userinput
  const [currentNext, setCurrentNext] = useState();
  const [cont, setCont] = useState(false); // true - show continue button
  const [check, setCheck] = useState(false); // true - show check button
  const [playing, setPlaying] = useState(true);

  // segment jumps work best when both the TS end and next TS start are not the same
  const apiCall = JSON.parse(
    '[{"start": 0, "end": 182, "type": "normal", "content": "", "next": 183}, {"start": 183, "end": 288, "type": "walk", "content": "7 + 3 = 10\\n__ + __ = 10\\n\\n5 x 4 = 20\\n__ x __ = 20", "next": 289}, {"start": 289, "end": 313, "type": "assess", "content": "6 + 2 =\\n__ + __ =\\n\\n8 x 3 =\\n__ x __ =", "pass": 315, "fail": 405, "answer": ["2", "6", "3", "8"]}, {"start": 315, "end": 404, "type": "normal", "content": "", "next": 576}, {"start": 405, "end": 575, "type": "normal", "content": "", "next": 576}, {"start": 576, "end": 585, "type": "assess", "content": "4 + 9 = __\\n__ + __ = __\\n\\n7 x 2 = __\\n__ x __ = __\\n\\n5 + 15 = __\\n__ + __ = __", "pass": 0, "fail": 0, "answer": ["13", "9", "4", "13", "14", "2", "7", "14", "20", "15", "5", "20"], "next": 184}]'
  );

  const player = useRef(null);

  // pauses the video at the end of segment, triggers the button
  useEffect(() => {
    if (currentTS) {
      if (elapsed >= currentTS["end"] && elapsed <= currentTS["end"] + 1) {
        setPlaying(false);
        if (!cont && currentTS["type"] != "normal") {
          setCheck(true);
        } else {
          setCont(true);
          setCurrentNext(currentTS["next"]);
        }
      }
    }
  }, [elapsed]);

  useEffect(() => {
    apiCall.forEach((ts) => {
      if (ts["start"] <= elapsed && elapsed < ts["end"]) {
        if (currentTS) {
          if (currentTS["end"] != ts["end"]) {
            setCheck(false);
            setCont(false);
          }
        }

        setCurrentTS(ts);
      }
    });
  }, [elapsed]);

  const handleChange = useCallback((event) => {
    setCurrentAnswer((currentAnswer) => ({
      ...currentAnswer,
      [event.target.name]: event.target.value,
    }));
  });

  const handleCheckClick = () => {
    alert("Great answers!");
    if ("pass" in currentTS) {
      setCurrentNext(currentTS["pass"]);
    } else {
      setCurrentNext(currentTS["next"]);
    }
    setCont(true);
    setCheck(false);
  };

  const handleContClick = () => {
    player.current.seekTo(currentNext, "seconds");
    setPlaying(true);
    setCont(false);
  };

  useEffect(() => {
    if (currentTS) {
      const split_list = currentTS["content"].split("__");
      let i = 0;
      const list = split_list.map((number) => {
        i = i + 1;
        if (number.length != 0 && i != split_list.length)
          return (
            <form style={{ whiteSpace: "pre-line", display: "inline" }}>
              <text style={{ color: "white", fontSize: "larger" }}>
                {number}
              </text>
              <input name={i.toString()} type="text" onChange={handleChange} />
            </form>
          );
        else
          return (
            <form style={{ display: "inline" }}>
              <text style={{ color: "white", fontSize: "larger" }}>
                {number}
              </text>
            </form>
          );
      });
      setCurrentContent(list);
    }
  }, [currentTS]);

  const handleProgress = (state) => {
    setElapsed(state.playedSeconds);
  };

  return (
    <div className="App">
      <div className="left">
        <ReactPlayer
          url="https://www.youtube.com/watch?v=EQKATpGKyKM"
          ref={player}
          onProgress={handleProgress}
          controls={true}
          playing={playing}
          onPlay={() => {
            setPlaying(true);
          }}
          onPause={() => {
            setPlaying(false);
          }}
        />
      </div>
      <div className="right">
        <div className="right-questions">
          Questions<br></br>
          {currentContent}
        </div>
        {check && (
          <button className="videoButton" onClick={() => handleCheckClick()}>
            Check Answer
          </button>
        )}
        {cont && (
          <button className="videoButton" onClick={() => handleContClick()}>
            Continue
          </button>
        )}
      </div>
    </div>
  );
}
