  
  Plotly.newPlot('myDiv', [{
        y: [0],
        mode: 'lines',
        width: 800,
        height: 600,
        bargap: 0.05, 
        line: {color: '#80CAF6'}
    }],
    {
        yaxis: {title: 'Energy'},
        xsaxis: {title: 'Frame No'}
    });

  function rand() {
    return Math.random();
  }

  // let va = (flock)=>{
  //   let sum = createVector(0,0)
  //   for (let i = 0; i < flock.length; i++) {
  //       sum.add(flock[i].velocity)        
  //   }
  //   let v_a = Math.sqrt(sum.x**2,sum.y**2)
  //   return Math.round(v_a*10000000000000/(N*SPEED))/10000000000000
  // }

  let updatePlot = ()=>{
    let E = calculateEnergy()
    Plotly.extendTraces('myDiv', {
        y: [[E]]
      }, [0])
      console.log(E);
    // return E
  }

//   setInterval(updatePlot(flock),100) // flock is an array in render.js