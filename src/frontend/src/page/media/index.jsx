<<<<<<< HEAD
//import React        from 'react';
//import { Link }     from 'react-router-dom';
=======

>>>>>>> refs/remotes/origin/tilok
//import ReactPlayer from 'react-player';
import MUtil        from 'util/mm.jsx';
import { VueInReact } from 'vuera';

const _mm           = new MUtil();

<<<<<<< HEAD
import React, { useRef } from "react"; 
import './index.scss'
import YouTube from 'react-youtube'; 

export default function App() {
  return(
    <div className="App">
      <div className='left'>
        <YouTube
          videoId={"EQKATpGKyKM"}
          onStateChange={(e) => checkElapsedTime(e)}
          />
      </div>
      <div className='right'>
        box
      </div>
    </div>
  ); 
}

const checkElapsedTime = (e) => {
  const duration = e.target.getDuration(); 
  const currentTime = e.target.getCurrentTime(); 
  console.log(currentTime); 
}
=======
import React, { useRef} from "react";
import './index.scss'
import YouTube from 'react-youtube';


export default function App() {
  return (
    <div className="App">
      <div className= 'left'>
      <YouTube className= "left-video" id='video'
          videoId={"EQKATpGKyKM"}
          onStateChange={(e) => checkElapsedTime(e)}
      />
      </div>
      <div className='right' >
        <div className='right-questions'
        Questions></div>
      </div>
    </div>
  );
}

const checkElapsedTime = (e) => {
  const duration = e.target.getDuration();
  const currentTime = e.target.getCurrentTime();
  console.log(currentTime);
};
>>>>>>> refs/remotes/origin/tilok
