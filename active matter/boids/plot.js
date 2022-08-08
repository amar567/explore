  
  Plotly.newPlot('myDiv', [{
        y: [0],
        mode: 'lines',
        // width: 800,
        // height: 600,
        // bargap: 0.05, 
        line: {color: '#80CAF6'}
    }],
    {
        yaxis: {title: 'Average Normalised Velocity'},
        xsaxis: {title: 'Frame No'}
    });

  function rand() {
    return Math.random();
  }

  let va = (flock)=>{
    let sum = createVector(0,0)
    for (let i = 0; i < flock.length; i++) {
        sum.add(flock[i].velocity)        
    }
    let v_a = Math.sqrt(sum.x^2,sum.y^2)
    return Math.round(v_a/(N*SPEED)*1000000)/1000000
  }

  let updatePlot = (flock)=>{
    let v_a = va(flock)
    Plotly.extendTraces('myDiv', {
        y: [[v_a]]
      }, [0])
  }

//   setInterval(updatePlot(flock),100) // flock is an array in render.js