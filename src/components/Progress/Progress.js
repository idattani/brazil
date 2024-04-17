import React, { useState, useEffect, useRef } from 'react';


const Progress = () => {

    const canvas = useRef();
    console.log(canvas);
    const img = useRef();
    const tick = useRef();

    useEffect(() => {
        const ctx = canvas.current.getContext('2d');
        console.log('canvas', canvas);
        ctx.drawImage(img.current, 0, 18);
        ctx.drawImage(tick.current, 48.48, 0);
        console.log('inside useEffect');
        // do something here with the canvas
      }, [])

    return(
        <div>
            <img id="risk" ref={img} width="524.8" height="32" src="./risk graphic.png" alt="Risk" style="display: none;" />
            <img id="tick" ref={tick} width="20" height="20" src="./tick-symbol.png" alt="Tick Symbol" style="display: none;" />
            <canvas id="progressCanvas" width="526" height="50" ref={canvas}>
            Your browser does not support the HTML5 canvas tag.
            </canvas>
        </div>
    )
};
export default Progress;
