
//import { Link }     from 'react-router-dom';
import MUtil        from 'util/mm.jsx';
import { VueInReact } from 'vuera';

const _mm           = new MUtil();

import React, { useRef} from "react";
import './index.scss'
import YouTube from 'react-youtube'; 

//opt variables for the Youtube player. 
    const opt = {
      playerVars:{
      //Disable keyboard input for video player
      disablekb: 1,  
      // Disable full screen icon/button
      fs: 0,
      // Disables Youtube logo
      modestbranding:1,
      //Allows video to play on mobile without fullscreening
      playsinline: 1,
      //Disables suggested videos
      rel: 0, 
      //Enables manipulating video player through iframe api
      enablejsapi: 1

      }
    }
  
export default function App() {
  return (
    <div className="App">
      <div className= 'left'> 
      <YouTube className= "left-video" id='video'
        videoId={"EQKATpGKyKM"}
        opts={opt}
        onStateChange={(e) => checkElapsedTime(e)}
    />
    </div>
        <div className='right' >
          <div className='right-questions'>
          Questions</div>
      </div>
      </div>
  );
  }
  
  const checkElapsedTime = (e) => { 
  const duration = e.target.getDuration();
  const currentTime = e.target.getCurrentTime(); 
  console.log(currentTime);
  }; 
