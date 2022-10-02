//import { Link }     from 'react-router-dom';
import MUtil from "util/mm.jsx";
import { VueInReact } from "vuera";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faVolumeHigh, faVolumeMute, faPause, faPlay, faVolumeLow} from '@fortawesome/free-solid-svg-icons'

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
  const [actualAnswer, setActualAnswer] = useState("");
  const [volume, setVolume] = useState(); 
  const apiCall = JSON.parse(
    '[{"start": 0, "end": 184, "type": "normal", "content": "", "next": 184}, {"start": 184, "end": 289, "type": "walk", "content": "7 + 3 = 10\\n__ + __ = 10\\n\\n5 x 4 = 20\\n__ x __ = 20", "next": 289, "answer": ["3", "7", "4", "5"]}, {"start": 289, "end": 313, "type": "assess", "content": "6 + 2 =\\n__ + __ =\\n\\n8 x 3 =\\n__ x __ =", "pass": 315, "fail": 405, "answer": ["2", "6", "3", "8"]}, {"start": 315, "end": 404, "type": "normal", "content": "", "next": 576}, {"start": 405, "end": 576, "type": "normal", "content": "", "next": 576}, {"start": 576, "end": 585, "type": "assess", "content": "4 + 9 = __\\n__ + __ = __\\n\\n7 x 2 = __\\n__ x __ = __\\n\\n5 + 15 = __\\n__ + __ = __", "pass": 0, "fail": 0, "answer": ["13", "9", "4", "13", "14", "2", "7", "14", "20", "15", "5", "20"], "next": 184}]'
  );

  // pauses the video at the end of segment, triggers the button
  useEffect(() => {
    if (currentTS) {
      console.log("current end time", currentTS["end"]);
      if (elapsed > currentTS["end"]) {
        setPlaying(false);
        setCheck(true);
      }
    }
  }, [elapsed]);

  useEffect(() => {
    apiCall.forEach((ts) => {
      if (ts["start"] <= elapsed && elapsed < ts["end"]) {
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
    //if result is zero, at least one of the values are incorrect/blank
    const [result, results] = evaluate();
    var string = "";
    var i = 0;
    while(i<results.length){
      string = string + "\n" + (i+1).toString() + ": " + results[i];
      i = i + 1;
    }
    alert(string);
    if ("pass" in currentTS) {
      setCurrentNext(currentTS["pass"]);
    } else {
      setCurrentNext(currentTS["next"]);
    }
    setCont(true);
    setCheck(false);
    // clear();
  };

  const handleContClick = () => {
    setElapsed(currentNext);
    setPlaying(true);
    setCont(false);
  };

  const handlePlaybutton = () => {
    setPlaying(!playing); 
  }

  const handleVolume = e => {
    setVolume(parseFloat(e.target.value)); 
  }
  // function clear(){
  //   console.log("current", currentAnswer);
  //   const len = actualAnswer.length; 
  //   var i = 0;
  //   while(i<len){
  //     if(currentAnswer[(i+1).toString()]){
  //       console.log("yes");
  //       setCurrentAnswer((currentAnswer) => ({
  //         ...currentAnswer,
  //         [(i+1).toString()]: "",
  //       }));
  //     }
  //     i = i+1;
  //   }
  //   console.log("after", currentAnswer);
  // }

  function evaluate(){
    const len = actualAnswer.length; 
    var i = 0;
    var incorrect = 1;
    const results = [];
    while(i<len){
      if(currentAnswer[(i+1).toString()]){
        if (currentAnswer[(i+1).toString()] === actualAnswer[i]){
          results.push("Correct 🙂");
        }
        else{
          results.push("Incorrect ☹️");
          incorrect = 0;
        }
      }
      else{
        results.push( "Left blank ☹️");
        incorrect = 0;
      }
      i = i+1;
    }
    return [incorrect, results];
  }


  useEffect(() => {
    // setCurrentAnswer({});
    if (currentTS) {
      if(currentTS["answer"]){
        setActualAnswer(currentTS["answer"])
      }
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
          onProgress={handleProgress}
          controls={true}
          playing={playing}
        />
      </div>
      <div className="right">
        <div className="right-questions">
          Questions<br></br>
          {currentContent}
        </div>
        {check && (
          <button onClick={() => handleCheckClick()}>Check Answer</button>
        )}
        {cont && <button onClick={() => handleContClick()}>continue</button>}
      <div className="controls">
        <button className="playbutton" onClick={handlePlaybutton}>
          {playing ? <FontAwesomeIcon icon={faPause}/>: <FontAwesomeIcon icon={faPlay} />}
          </button> 
        <div className="volume-slider"> 
        <FontAwesomeIcon icon={faVolumeLow}/> 
        <input className="volumeslider"type="range" min={0} max={1} step="any" value={volume} onChange={handleVolume}/>
        <FontAwesomeIcon icon={faVolumeHigh}/>
        </div> 
        </div>
      </div>
    </div>
  );
}