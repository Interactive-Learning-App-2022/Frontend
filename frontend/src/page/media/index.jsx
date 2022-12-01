//import { Link }     from 'react-router-dom';
import MUtil from "util/mm.jsx";
import { VueInReact } from "vuera";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faVolumeHigh,
  faVolumeMute,
  faPause,
  faPlay,
  faVolumeLow,
  faL,
} from "@fortawesome/free-solid-svg-icons";
import swal from "sweetalert";

const _mm = new MUtil();

import React, { useCallback, useEffect, useState, useRef } from "react";
import "./index.scss";
import ReactPlayer from "react-player/youtube";
import { number } from "prop-types";
// import { set } from "vue/types/umd";

// import useSound from "use-sound";
import goodJobSfx from "../../resources/Goodjob.mp3";
import definitionsSfx from "../../resources/Definitions.mp3";
import needHelpSfx from "../../resources/Needhelp.mp3";

export default function App() {
  const [elapsed, setElapsed] = useState(0);
  const [currentTS, setCurrentTS] = useState();
  const [currentContent, setCurrentContent] = useState(""); // split-screen content
  const [currentAnswer, setCurrentAnswer] = useState({}); // userinput
  const [currentNext, setCurrentNext] = useState(); // next timestamp
  const [cont, setCont] = useState(false); // true - show continue button
  const [check, setCheck] = useState(false); // true - show check button
  const [actualAnswer, setActualAnswer] = useState("");
  const [volume, setVolume] = useState();
  const [playing, setPlaying] = useState(false);
  const [finish, setFinish] = useState(false); //True - show finished button
  const [finishbool, setFinishBool] = useState(false);
  const [subject, setSubject] = useState("Math");
  // const [url, setUrl] = useState("https://www.youtube.com/watch?v=EQKATpGKyKM")
  //const [url, setUrl] = useState("http://www.youtube.com/watch?v=HjvuZ56Q9g")
  const [url, setUrl] = useState("https://youtu.be/HJzvuZ56Q9g");
  const [course, setCourse] = useState("Math");
  // segment jumps work best when both the TS end and next TS start are not the same
  const [apiCall, setapiCall] = useState(
    JSON.parse(
      '[{"start": 0, "end": 183, "type": "normal", "content": "", "next": 187}, {"start": 187, "end": 294, "type": "assess", "content": "7 + 3 = 10\\n__ + __ = 10\\n\\n5 x 4 = 20\\n__ x __ = 20", "next": 297, "pass":297, "fail": 187, "answer": ["3", "7", "4", "5"]}, {"start": 297, "end": 323, "type": "assess", "content": "6 + 2 =\\n__ + __ =\\n\\n8 x 3 =\\n__ x __ =", "pass": 414, "fail": 423, "answer": ["2", "6", "3", "8"]}, {"start": 414, "end": 417, "type": "normal", "content": "", "next": 598}, {"start": 423, "end": 593, "type": "normal", "content": "", "next": 598 }, {"start": 598, "end": 606, "type": "assess", "content": "4 + 9 = __\\n__ + __ = __\\n\\n7 x 2 = __\\n__ x __ = __\\n\\n5 + 15 = __\\n__ + __ = __", "pass": 414, "fail": 423, "answer": ["13", "9", "4", "13", "14", "2", "7", "14", "20", "15", "5", "20"], "next": 423}]'
    )
  );

  const player = useRef(null);

  // to play audio, use method .play()
  // goodJob.play(), needHelp.play() ...
  const goodJob = new Audio(goodJobSfx);
  const needHelp = new Audio(needHelpSfx);
  const definitions = new Audio(definitionsSfx);

  // pauses the video at the end of segment, triggers the button
  useEffect(() => {
    if (currentTS) {
      if (elapsed >= currentTS["end"] && elapsed <= currentTS["end"] + 1) {
        setPlaying(false);
        if (!cont && currentTS["type"] != "normal") {
          setCheck(true);
        } else {
          if (finishbool == true) {
            console.log("finishbool==true if statement");
            //setCont(false);
            setFinish(true);
          } else {
            setCont(true);
            setCurrentNext(currentTS["next"]);
          }
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

  //taking user input boxes
  const handleChange = useCallback((event) => {
    setCurrentAnswer((currentAnswer) => ({
      ...currentAnswer,
      [event.target.name]: event.target.value,
    }));
  });

  const handleCheckClick = () => {
    //if result is zero, at least one of the values are incorrect/blank
    const [result, results] = evaluate();
    var string = "";
    var i = 0;
    while (i < results.length) {
      string = string + "\n" + (i + 1).toString() + ": " + results[i];
      i = i + 1;
    }
    if (result) {
      swal({
        title: "Good job!",
        text: "All your answers are correct!",
        icon: "success",
      });
    } else {
      swal("Evaluation Complete", string);
    }
    if ("pass" in currentTS && currentTS["type"] == "assess") {
      if (result) {
        if (subject == "English") {
          goodJob.play();
        }
        setCurrentNext(currentTS["pass"]);
        //Put in the start fin
        if (currentTS["start"] == "598" && subject == "Math") {
          console.log("Finish bool true");
          setFinishBool(true);
          console.log(finishbool);
        }
      } else {
        // setCurrentNext(currentTS["fail"]);
        if (subject == "English" && currentTS["tried"] == 0) {
          needHelp.play();
          setCurrentNext(currentTS["fail"]);
          currentTS["tried"] = 1;
        } else if (subject == "English" && currentTS["tried"] == 1) {
          setCurrentNext(currentTS["pass"]);
        } else {
          setCurrentNext(currentTS["fail"]);
        }
      }
    } else {
      //for the walkthroughs
      setCurrentNext(currentTS["next"]);
    }
    setCont(true);
    setCheck(false);
  };

  const handleContClick = () => {
    //to say "Now pick the best definitions next to me" in the english video
    if (subject == "English") {
      if (currentTS["type"] == "normal") {
        definitions.play();
        setPlaying(false);
      }
    }
    player.current.seekTo(currentNext, "seconds");
    setPlaying(true);
    setCont(false);
    clear();
  };

  //Handles the end of the module
  const handleFinClick = () => {
    console.log("working");
    var string2 = "Good work! Let's move on to the next module. ";
    alert(string2);
    setFinish(false);
    setFinishBool(false);
    clear();
  };
  const handlePlaybutton = () => {
    setPlaying(!playing);
  };

  const handleVolume = (e) => {
    setVolume(parseFloat(e.target.value));
  };

  //switch videos
  const handleCourseClick = () => {
    if (url == "https://youtu.be/HJzvuZ56Q9g") {
      setUrl("https://youtu.be/Kd1WOEqiOnQ");
      setSubject("English");
      setapiCall(
        JSON.parse(
          '[{"start": 0, "end": 223, "type": "normal", "content": "", "next": 224}, {"tried": 0, "start": 224, "end": 226, "type": "assess", "content": "Which of the following definitions describes the word runt?\\nA) Very small and weak\\nB)Never amount to anything\\nC)To do away with\\n\\nType either A, B or C\\n__", "pass": 227, "fail": 146, "answer": ["A"]}, \
          {"start": 227, "end": 304, "type": "normal", "content": "", "next": 305}, {"tried": 0, "start": 305, "end": 307, "type": "assess", "content": "Which of the following definitions describes the word injustice?\\nA) Different\\nB)Unfair\\nC)Hanging on\\n\\nType either A, B or C\\n__", "pass": 308, "fail": 285, "answer": ["B"]}, \
          {"start": 308, "end": 409, "type": "normal", "content": "", "next": 410 }, {"tried": 0, "start": 410, "end": 411, "type": "assess", "content": "Which of the following definitions describes the word promptly?\\nA) Distribute\\nB)Injustice\\nC)Early or quickly\\n\\nType either A, B or C\\n__", "pass": 412, "fail": 345, "answer": ["C"]}, \
          {"start": 412, "end": 491, "type": "normal", "content": "", "next": 492 }, {"tried": 0, "start": 492, "end": 493, "type": "assess", "content": "Which of the following definitions describes the word vanished?\\nA) Waited\\nB)Disappeared\\nC)Stand and watch\\n\\nType either A, B or C\\n__", "pass": 494, "fail": 460, "answer": ["B"]}, \
          {"start": 494, "end": 589, "type": "normal", "content": "", "next": 590 }, {"tried": 0, "start": 590, "end": 592, "type": "assess", "content": "Which of the following definitions describes the word stool?\\nA) Pen\\nB)Type of goose\\nC)Chair\\n\\nType either A, B or C\\n__", "pass": 593, "fail": 560, "answer": ["C"]}, \
          {"start": 593, "end": 705, "type": "normal", "content": "", "next": 706 }, {"tried": 0, "start": 706, "end": 707, "type": "assess", "content": "Which of the following definitions describes the word squeezed?\\nA) Pushed through\\nB)Standing\\nC)Walking\\n\\nType either A, B or C\\n__", "pass": 708, "fail": 625, "answer": ["A"]}, \
          {"start": 708, "end": 783, "type": "normal", "content": "", "next": 784 }, {"tried": 0, "start": 784, "end": 785, "type": "assess", "content": "Which of the following definitions describes the word appetizing?\\nA) Smelly\\nB)Yummy\\nC)Ugly\\n\\nType either A, B or C\\n__", "pass": 791, "fail": 724, "answer": ["B"]}, \
          {"start": 791, "end": 793, "type": "normal", "content": ""}\
          ]'
        )
      );
    } else {
      setUrl("https://youtu.be/HJzvuZ56Q9g");
      setSubject("Math");
      setapiCall(
        JSON.parse(
          '[{"start": 0, "end": 183, "type": "normal", "content": "", "next": 187}, {"start": 187, "end": 294, "type": "walk", "content": "7 + 3 = 10\\n__ + __ = 10\\n\\n5 x 4 = 20\\n__ x __ = 20", "next": 297, "answer": ["3", "7", "4", "5"]}, {"start": 297, "end": 323, "type": "assess", "content": "6 + 2 =\\n__ + __ =\\n\\n8 x 3 =\\n__ x __ =", "pass": 414, "fail": 423, "answer": ["2", "6", "3", "8"]}, \
        {"start": 414, "end": 418, "type": "normal", "content": "", "next": 598}, {"start": 423, "end": 593, "type": "normal", "content": "", "next": 598 }, {"start": 598, "end": 606, "type": "assess", "content": "4 + 9 = __\\n__ + __ = __\\n\\n7 x 2 = __\\n__ x __ = __\\n\\n5 + 15 = __\\n__ + __ = __", "pass": 414, "fail": 423, "answer": ["13", "9", "4", "13", "14", "2", "7", "14", "20", "15", "5", "20"], "next": 423}]'
        )
      );
    }
  };

  function evaluate() {
    const len = currentTS["answer"].length;
    var i = 0;
    var incorrect = 1;
    const results = [];
    while (i < len) {
      if (currentAnswer[(i + 1).toString()]) {
        let temp = currentAnswer[(i + 1).toString()];
        //to ignore whitespaces from user input
        temp = temp.replace(/\s+/g, "");
        if (
          temp == currentTS["answer"][i] ||
          temp.toUpperCase() == currentTS["answer"][i]
        ) {
          results.push(currentAnswer[(i + 1).toString()] + " is Correct ✅");
        } else {
          results.push(currentAnswer[(i + 1).toString()] + " is incorrect ❎");
          incorrect = 0;
        }
      } else {
        results.push("Left blank 🔵");
        incorrect = 0;
      }
      i = i + 1;
    }
    return [incorrect, results];
  }

  function clear() {
    var i = 1;
    const len = currentTS["answer"].length;
    while (i <= len) {
      if (currentAnswer[i.toString()]) {
        var elemt = document.getElementById(i.toString());
        elemt.value = "";
        console.log("yes");
      }
      i = i + 1;
    }
    setCurrentAnswer({});
  }

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
              <input
                name={i.toString()}
                id={i.toString()}
                type="text"
                onChange={handleChange}
              />
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
        <div className="video">
          <ReactPlayer
            url={url}
            ref={player}
            onProgress={handleProgress}
            controls={false}
            // controls={true}
            playing={playing}
            onPlay={() => {
              setPlaying(true);
            }}
            onPause={() => {
              setPlaying(false);
            }}
            volume={volume}
            pip={false}
            config={{
              youtube: {
                playerVars: {
                  disablekb: 1,
                  modestbranding: 1,
                  rel: 0,
                },
              },
            }}
          />
        </div>
        <div className="controls">
          <button className="playbutton" onClick={handlePlaybutton}>
            {playing ? (
              <FontAwesomeIcon icon={faPause} />
            ) : (
              <FontAwesomeIcon icon={faPlay} />
            )}
          </button>
          <div className="volume-slider">
            <FontAwesomeIcon className="volumelow" icon={faVolumeLow} />
            <input
              className="volumeslider"
              type="range"
              min={0}
              max={1}
              step="any"
              value={volume}
              onChange={handleVolume}
            />
            <FontAwesomeIcon className="volumehigh" icon={faVolumeHigh} />
          </div>
        </div>
        <div className="courseButton">
          <button onClick={() => handleCourseClick()}>Change courses</button>
        </div>
      </div>{" "}
      {/*End of left side */}
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
        {finish && (
          <button className="videoButton" onClick={() => handleFinClick()}>
            Next Module!
          </button>
        )}
      </div>
    </div>
  );
}
