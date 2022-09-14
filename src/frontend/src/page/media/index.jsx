//import { Link }     from 'react-router-dom';
import MUtil from "util/mm.jsx";
import { VueInReact } from "vuera";

const _mm = new MUtil();

import React, { useEffect, useState } from "react";
import "./index.scss";
import ReactPlayer from "react-player/youtube";
import { number } from "prop-types";
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


  // const apiCall = JSON.parse(
  //   '[{"start": 0, "end": 184, "type": "normal", "content": "", "next": 184}, {"start": 184, "end": 289, "type": "walk", "content": "7 + 3 = 10\\n__ + __ = 10\\n\\n5 x 4 = 20\\n__ x __ = 20", "next": 289}, {"start": 289, "end": 313, "type": "assess", "content": "6 + 2 =\\n__ + __ =\\n\\n8 x 3 =\\n__ x __ =", "pass": 315, "fail": 405, "answer": ["2", "6", "3", "8"]}, {"start": 315, "end": 404, "type": "normal", "content": "", "next": 576}, {"start": 405, "end": 576, "type": "normal", "content": "", "next": 576}, {"start": 576, "end": 585, "type": "assess", "content": "4 + 9 = __\\n__ + __ = __\\n\\n7 x 2 = __\\n__ x __ = __\\n\\n5 + 15 = __\\n__ + __ = __", "pass": 0, "fail": 0, "answer": ["13", "9", "4", "13", "14", "2", "7", "14", "20", "15", "5", "20"]}]'
  // );


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
  // const list = currentQuestion.map((number) =>
  // {
  //     if(isNaN(number))
  //       // console.log(number.includes("__"));
  //       if(number.includes("__"))
  //       return <input value={currentAnswer} onChange={handleChange}/> 
  //       else
  //         return<text>{number}</text>
  //     else{
  //       return(<text>{number}</text>)
  //     }
  //   }
  // );

  const split_list = currentQuestion.split("__");
  console.log(split_list);
  let i = 0; 
  const list = split_list.map((number) =>{
    i = i+1;
    if (number.length != 0 && i != split_list.length)
    return(
    <div style={{whiteSpace: "pre-line"}}>
    <text style={{color: "white", fontSize: "larger"}} >{number}</text>
    <input value={currentAnswer} onChange={handleChange}/>
    </div>
    )
    else
    return(<div><text style={{color: "white", fontSize: "larger"}}>{number}</text></div>)
  }
  );

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
        {/* <div>Questions</div> */}
        <div className="right-questions">{list}</div>
      </div>
    </div>
  );
}
