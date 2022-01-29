var steps = 1000;
var paths = 1;
var dt = 0.015;
var spread = 0.1;
var curState = {end: steps};

Plotly.register({
  moduleType: 'transform',
  name: 'truncate',
  supplyDefaults: function(transformIn, fullData, layout) {
    return transformIn;
  },
  transform: function (data, state) {
    var data0 = data[0];
    var start = state.transform.start;
    var end = state.transform.end;
    var newData = Object.assign({}, data0);
    newData.x = data0.x.slice(start, end);
    newData.y = data0.y.slice(start, end);
    newData.z = data0.z.slice(start, end);
    var ret = [newData];
    if (state.transform.endpoint || state.transforms.startpoint) {
      var newTrace = {
        x: [],
        y: [],
        z: [],
        type: 'scatter3d',
        mode: 'markers',
        marker: {
          color: data0.line.color,
          size: 4,
        },
        showlegend: false,
      };
      if (state.transform.startpoint) {
        newTrace.x.push(data0.x[start]);
        newTrace.y.push(data0.y[start]);
        newTrace.z.push(data0.z[start]);
      }
      if (state.transform.endpoint) {
        newTrace.x.push(data0.x[end - 1]);
        newTrace.y.push(data0.y[end - 1]);
        newTrace.z.push(data0.z[end - 1]);
      }
      ret.push(newTrace);
    }
    return ret;
  }
});

function createTrace (n, dt, j) {
  var x = [1 + (Math.random() * 2 - 1) * spread];
  var y = [(Math.random() * 2 - 1) * spread];
  var z = [30 + (Math.random() * 2 - 1) * spread];
  var s = 10, b = 8/3, r = 28;
  var dx, dy, dz;
  var xh, yh, zh;
  for (var i = 1; i < n; i++) {
    dx = s * (y[i - 1] - x[i - 1]);
    dy = x[i - 1] * (r - z[i - 1]) - y[i - 1];
    dz = x[i - 1] * y[i - 1] - b * z[i - 1];

    xh = x[i - 1] + dx * dt * 0.5;
    yh = y[i - 1] + dy * dt * 0.5;
    zh = z[i - 1] + dz * dt * 0.5;

    dx = s * (yh - xh);
    dy = xh * (r - zh) - yh;
    dz = xh * yh - b * zh;

    x[i] = x[i - 1] + dx * dt;
    y[i] = y[i - 1] + dy * dt;
    z[i] = z[i - 1] + dz * dt;
  }
  return {
    x: x,
    y: y,
    z: z,
    type: 'scatter3d',
    mode: 'lines',
    showlegend: false,
    line: {
      width: 4
    },
    opacity: 0.5,
    transforms: [{
      type: 'truncate',
      start: 0,
      end: steps,
      endpoint: true,
      startpoint: true,
    }]
  };
}

var traces = [];
for (var i = 0; i < paths; i++) {
  traces.push(createTrace(steps, dt, i));
}

var theta = 0
var margin = {t: 10, r: 10, b: 60, l: 30};
Plotly.plot('graph', traces, {
  scene: {
    xaxis: {
      autorange: false,
      range: [-20, 20],
      tickmode: 'linear',
      tick0: 0,
      dtick: 5
    },
    yaxis: {
      autorange: false,
      range: [-30, 30],
      tickmode: 'linear',
      tick0: 0,
      dtick: 5
    },
    zaxis: {
      autorange: false,
      range: [0, 50],
      tickmode: 'linear',
      tick0: 0,
      dtick: 5
    },
    camera: {
      eye: cameraXYZ(curState.end / steps)
    }
  },
  margin: margin,
  height: window.innerHeight,
  width: window.innerWidth,
});

function resize () {
  Plotly.relayout('graph', {
    width: window.innerWidth,
    height: window.innerHeight
  })
}

window.addEventListener('resize', resize);

var truncateCtrl = document.getElementById('truncate');
var dirty = false;

truncateCtrl.max = steps;
truncateCtrl.value = steps;
truncateCtrl.addEventListener('input', function () {
  var end = parseInt(this.value);
  if (curState.end !== end) {
    curState.end = end;
    dirty = true;
  }
});

function cameraXYZ (t) {
  var theta = -t * Math.PI * 2 * 0.5;
  var dist = 1.75;
  return {
    x: Math.cos(theta) * dist,
    y: Math.sin(theta) * dist,
    z: 0.7 * dist
  };
}

function update () {
  if (dirty) {
    dirty = false;
    
    var gd = document.getElementById('graph');
    var scene = gd._fullLayout.scene._scene;
    var camera = scene.getCamera();
    camera.eye = cameraXYZ(curState.end / steps);
    scene.setCamera(camera);
    
    Plotly.restyle('graph', {
      'transforms.0.end': curState.end
    });
  }
  requestAnimationFrame(update);
}

requestAnimationFrame(update);