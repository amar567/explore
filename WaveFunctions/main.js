var pointCount = 500;
var i, r;

var x = [];
var y = [];
var z = [];
var c = [];
let t = 0

for (i = -1 * pointCount; i < pointCount; i++) {
    r = Math.E ** (-1 * ((i / 100) ** 2));
    r2 = 0.5 * Math.E ** (-1 * (((i + 40) / 100) ** 2));
    e2 = 10
    x.push(i / 100);
    // y.push(0);
    // z.push(0);
    y.push(r * Math.cos(t) + r2 * Math.cos(e2 * t));
    z.push(r * Math.sin(t) + r2 * Math.sin(e2 * t));
    c.push(i)
}

const config = {
    displaylogo: false
};

var frames = [
    // {
    //     name: 'frame1',
    //     data: [{x: [2, 3, 4], y: [5, 6, 7], z: [8, 9, 10]}]
    // },
];

for (let t = 1; t < 1000; t++) {
    var x_frame = [];
    var y_frame = [];
    var z_frame = [];
    var c_frame = [];

    for (i = -1 * pointCount; i < pointCount; i++) {
        r = Math.E ** (-1 * ((i / 100) ** 2));
        r2 = 0.5 * Math.E ** (-1 * (((i + 40) / 100) ** 2));
        e2 = 10
        x_frame.push(i / 100);
        // y_frame.push(0);
        // z_frame.push(0);
        y_frame.push(r * Math.cos(t / 100) + r2 * Math.cos(e2 * t / 100));
        z_frame.push(r * Math.sin(t / 100) + r2 * Math.sin(e2 * t / 100));
        c_frame.push(i)
    }

    frames.push({
        name: 'frame' + t.toString(),
        data: [{ x: x_frame, y: y_frame, z: z_frame }]
    })
}

var animationSettings = {
    frame: { duration: 10 },
    transition: { duration: 5 }
};


Plotly.newPlot(

    'myDiv',
    [{
        type: 'scatter3d',
        mode: 'lines',
        x: x,
        y: y,
        z: z,
        opacity: 0.7,
        line: {
            width: 10,
            color: c,
            colorscale: 'Viridis'
        }
    }],
    {
        width: 1900,
        height: 1000,

        scene: {
            aspectmode: "manual",
            aspectratio: {
                x: 1, y: 0.7, z: 1,
            },
            xaxis: {
                nticks: 9,
                range: [-5, 5],
            },
            yaxis: {
                nticks: 7,
                range: [-1.5, +1.5],
            },
            zaxis: {
                nticks: 10,
                range: [-1.5, +1.5],
            },
            camera: {
                eye: { x: 1.25, y: 0.5, z: 0.5 },
                center: { x: 0, y: 0, z: 0 },
                up: { x: 0, y: 0, z: 1 }
            }
        },
    },
    config
)
    .then(function () {
        Plotly.addFrames('myDiv', frames);
        Plotly.animate('myDiv', frames.map(f => f.name), animationSettings);
    });