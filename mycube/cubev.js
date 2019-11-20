"use strict";
var canvas;
var gl;
var program;

var numVertices;

var axis = 0;
var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var theta = [0, 0, 0];
var thetaLoc;

//-------------------------------------//surface
var surface_1 = vec4(1.5, 1.0, 0.04, 1.0);
var surface_1_vertice = [];
var surface_index = [];

var surface_2 = vec4(1.5, 0.5, 0.01, 1.0);
var surface_2_vertice = [];

var surface_3 = 0.005
var surface_3_vertice = [];
//*****************************************//surface

var cylinderVertices = []
var circularVertices=[]//球顶点
var Vertices=[
    vec3(0, 1, 0),
    vec3(0.95, 0.31, 0),
    vec3(0.59, -0.81, 0),
    vec3(-0.59, -0.81, 0),
    vec3(-0.95, 0.31, 0),
    vec3(0, 0, 0.3),
    vec3(0, 0, -0.3),
    vec3(0, -0.38, 0),
    vec3(-0.36, -0.12, 0),
    vec3(-0.22, 0.31, 0),
    vec3(0.22, 0.31, 0),
    vec3(0.36, 0.12, 0)
];
var indices=[
    5, 0, 10,
    5, 10, 1,
    5, 1, 11,
    5, 11, 2,
    5, 2, 7,
    5, 7, 3,
    5, 3, 8,
    5, 8, 4,
    5, 4, 9,
    5, 9, 0,
    6, 10, 0,
    6, 0, 9,
    6, 9, 4,
    6, 4, 8,
    6, 8, 3,
    6, 3, 7,
    6, 7, 2,
    6, 2, 11,
    6, 11, 1,
    6, 1, 10
]

function proindices(divideNum) {
    for (var i = 0; i < 2*divideNum; i++)//制作索引，在0到divideNum-1上
    {
        for (var j = 0; j < divideNum; j++) {
            if (j == 0)
                indices.push(i * (divideNum+1) + j, (i + 1) %(2*divideNum) * (divideNum+1) + j + 1, i * (divideNum+1) + j + 1);
            else if (j == divideNum - 1)
                indices.push(i * (divideNum+1) + j, (i + 1) %(2*divideNum) * (divideNum+1) + j, i * (divideNum+1) + j + 1);
            else {
                indices.push(i * (divideNum+1) + j, (i + 1) %(2*divideNum) * (divideNum+1) + j, i * (divideNum+1) + j + 1);
                indices.push((i + 1) %(2*divideNum) * (divideNum+1) + j, (i + 1) %(2*divideNum) * (divideNum+1) + j + 1, i * (divideNum+1) + j + 1);
            }

        }
    }
}


function get_surface_1_vertice(alpha) { 
	surface_1_vertice.push(vec3(-surface_1[0] / 2, -surface_1[1] / 2, -surface_1[2] / 2));
	surface_1_vertice.push(vec3(-surface_1[0] / 2, -surface_1[1] / 2, surface_1[2] / 2));
	surface_1_vertice.push(vec3(-surface_1[0] / 2, surface_1[1] / 2, -surface_1[2] / 2));
	surface_1_vertice.push(vec3(-surface_1[0] / 2, surface_1[1] / 2, surface_1[2] / 2));
	surface_1_vertice.push(vec3(surface_1[0] / 2, -surface_1[1] / 2, -surface_1[2] / 2));
	surface_1_vertice.push(vec3(surface_1[0] / 2, -surface_1[1] / 2, surface_1[2] / 2));
	surface_1_vertice.push(vec3(surface_1[0] / 2, surface_1[1] / 2, -surface_1[2] / 2));
	surface_1_vertice.push(vec3(surface_1[0] / 2, surface_1[1] / 2, surface_1[2] / 2));
///////////////////////////
	surface_index.push(0, 2, 1);
	surface_index.push(2, 3, 1);
	surface_index.push(4, 6, 5);
	surface_index.push(6, 7, 5);
	surface_index.push(0, 4, 6);
	surface_index.push(6, 2, 0);
	surface_index.push(1, 7, 5);
	surface_index.push(1, 3, 7);
	surface_index.push(0, 1, 4);
	surface_index.push(1, 5, 4);
	surface_index.push(2, 6, 3);
    surface_index.push(3, 6, 7);
////////////////////////////
    var a = alpha * Math.PI / 180.0;
    var c = Math.cos( a );
    var s = Math.sin( a );
    var y,z;
    for(var i=0;i<surface_1_vertice.length;i++){
        y=surface_1_vertice[i][1];
        z=surface_1_vertice[i][2];
        surface_1_vertice[i][1]=c*y+s*z;
        surface_1_vertice[i][2]=-s*y+c*z;
    }


}

function get_surface_2_vertice(alpha) {
	surface_2_vertice.push(vec3(-surface_2[0] / 2, -surface_2[1], -surface_2[2] - surface_1[2] / 2));
	surface_2_vertice.push(vec3(-surface_2[0] / 2, -surface_2[1], -surface_1[2] / 2));
	surface_2_vertice.push(vec3(-surface_2[0] / 2, 0, -surface_2[2] - surface_1[2] / 2));
	surface_2_vertice.push(vec3(-surface_2[0] / 2, 0, -surface_1[2] / 2));
	surface_2_vertice.push(vec3(surface_2[0] / 2, -surface_2[1], -surface_2[2] - surface_1[2] / 2));
	surface_2_vertice.push(vec3(surface_2[0] / 2, -surface_2[1], -surface_1[2] / 2));
	surface_2_vertice.push(vec3(surface_2[0] / 2, 0, -surface_2[2] - surface_1[2] / 2));
    surface_2_vertice.push(vec3(surface_2[0] / 2, 0, -surface_1[2] / 2));
    alpha=-alpha;
    var a = alpha * Math.PI / 180.0;
    var c = Math.cos( a );
    var s = Math.sin( a );
    var y,z;
    for(var i=0;i<surface_2_vertice.length;i++){
        y=surface_2_vertice[i][1];
        z=surface_2_vertice[i][2];
        surface_2_vertice[i][1]=c*y+s*z;
        surface_2_vertice[i][2]=-s*y+c*z;
    }
}

function get_surface_3_vertice(alpha) {
    var a=surface_1[1]/8;
    var l=Math.sqrt(a*a*Math.sin(alpha)*Math.sin(alpha)+48*a*a)-a*Math.sin(alpha);
    surface_3_vertice.push(vec3(surface_1_vertice[1][0]*7/8+surface_1_vertice[3][0]/8,surface_1_vertice[1][1]*7/8+surface_1_vertice[3][1]/8,surface_1_vertice[1][2]*7/8+surface_1_vertice[3][2]/8));
	surface_3_vertice.push(vec3(surface_3_vertice[0][0],surface_3_vertice[0][1]-surface_3,surface_3_vertice[0][2]));
	surface_3_vertice.push(vec3(surface_3_vertice[0][0], surface_1_vertice[0][1]+surface_3, surface_1_vertice[0][2]+l));
	surface_3_vertice.push(vec3(surface_3_vertice[0][0], surface_1_vertice[0][1], surface_1_vertice[0][2]+l));
	surface_3_vertice.push(vec3(surface_1_vertice[5][0]*7/8+surface_1_vertice[7][0]/8,surface_1_vertice[5][1]*7/8+surface_1_vertice[7][1]/8,surface_1_vertice[5][2]*7/8+surface_1_vertice[7][2]/8));
	surface_3_vertice.push(vec3(surface_3_vertice[4][0],surface_3_vertice[4][1]-surface_3,surface_3_vertice[4][2]));
	surface_3_vertice.push(vec3(surface_3_vertice[4][0], surface_1_vertice[0][1]+surface_3, surface_1_vertice[0][2]+l));
    surface_3_vertice.push(vec3(surface_3_vertice[4][0], surface_1_vertice[0][1], surface_1_vertice[0][2]+l));
}

//draw circular
function divideCir(centerPosition,r, divideNum) {
    if (divideNum <= 0)
    throw "the number divided should not be negative";
    numVertices = (divideNum - 1) * 12 * divideNum;
    for (var i = 0; i <2*divideNum; i++){//经度
        circularVertices.push(centerPosition+position(r,i * Math.PI / divideNum,0));
        circularVertices.push(centerPosition+position(r,(i+1)%(2*divideNum) * Math.PI / divideNum,Math.PI / divideNum));
        circularVertices.push(centerPosition+position(r, i * Math.PI / divideNum,Math.PI / divideNum));
        for (var j = 1; j < divideNum-1; j++){
            var temp=[]
            temp.push(centerPosition+position(r, i * Math.PI / divideNum, j * Math.PI / divideNum))
            temp.push(centerPosition+position(r, (i+1)%(2*divideNum) * Math.PI / divideNum, j * Math.PI / divideNum))
            temp.push(centerPosition+position(r,i * Math.PI / divideNum,(j+1)* Math.PI / divideNum))
            temp.push(centerPosition+position(r, (i+1)%(2*divideNum) * Math.PI / divideNum, (j+1) * Math.PI / divideNum))
            circularVertices.push(temp[0],temp[1],temp[2])
            circularVertices.push(temp[1],temp[3],temp[2])
        }
        circularVertices.push(centerPosition+position(r,i * Math.PI / divideNum,(divideNum-1)* Math.PI / divideNum))
        circularVertices.push(centerPosition+position(r,(i+1)%(2*divideNum) * Math.PI / divideNum,(divideNum-1)* Math.PI / divideNum))
        circularVertices.push(centerPosition+position(r,i * Math.PI / divideNum,Math.PI))
    }
}

function position(r, longtitude, latitude) {
    return vec3(r * Math.sin(latitude) * Math.cos(longtitude),
        r * Math.sin(latitude) * Math.sin(longtitude),
        r * Math.cos(latitude));
}

function cylinder(divideNum,height,r){
	var temp1=[]
	var temp2=[]
	numVertices=divideNum*12
    for(var i=0;i<divideNum;i++)
    {
		temp1.push(vec3(r*Math.cos(i*2*Math.PI/divideNum),r*Math.sin(i*2*Math.PI/divideNum),0))
		temp2.push(vec3(r*Math.cos(i*2*Math.PI/divideNum),r*Math.sin(i*2*Math.PI/divideNum),height))
	}
	for(var i=0;i<divideNum;i++){
		cylinderVertices.push(temp1[i],temp2[i],temp2[(i+1)%divideNum])
		cylinderVertices.push(temp2[(i+1)%divideNum],temp1[(i+1)%divideNum],temp1[i])
		cylinderVertices.push(vec3(0,0,0),temp1[i],temp1[(i+1)%divideNum])
		cylinderVertices.push(vec3(0,0,height),temp2[i],temp2[(i+1)%divideNum])
	}
}

/////////////////////////////////////****************************************/
////////////////////////////////////////////////////////////////////////////main
window.onload = function init() {
    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    gl.enable(gl.DEPTH_TEST)

    //
    //  Load shaders and initialize attribute buffers
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // array element buffer
    //    proindices(20);
    this.get_surface_1_vertice(30);
    this.get_surface_2_vertice(30);
    this.get_surface_3_vertice(30);

    // var iBuffer = gl.createBuffer();
    // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
    // gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(this.surface_index), gl.STATIC_DRAW);

    // var vBuffer = gl.createBuffer();
    // gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    // gl.bufferData(gl.ARRAY_BUFFER, flatten(surface_1_vertice), gl.STATIC_DRAW);

    // var vPosition = gl.getAttribLocation(program, "vPosition");
    // gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    // gl.enableVertexAttribArray(vPosition);
    

    thetaLoc = gl.getUniformLocation(program, "theta");

    //event listeners for buttons

    document.getElementById("xButton").onclick = function () {
        axis = xAxis;
        theta[axis] += 4.0;
    };
    document.getElementById("yButton").onclick = function () {
        axis = yAxis;
        theta[axis] += 4.0;
    };
    document.getElementById("zButton").onclick = function () {
        axis = zAxis;
        theta[axis] += 4.0;
    };


    render();
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    /////////////////////////////
    var iBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(surface_index), gl.STATIC_DRAW);
    /////////////////////
    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(surface_1_vertice), gl.STATIC_DRAW);
    ////////////////////
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    var vcolor=gl.getUniformLocation(program,"vcolor");
    gl.uniform4fv(vcolor, vec4(0.91,0.91,0.84,1.0));
    gl.drawElements(gl.TRIANGLES, 36,gl.UNSIGNED_BYTE,0);
////////////////////////////////////////////////////
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(surface_index), gl.STATIC_DRAW);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(surface_2_vertice), gl.STATIC_DRAW);
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.uniform4fv(vcolor, vec4(0.75,0.75,0.75,1.0));
    gl.drawElements(gl.TRIANGLES, 36,gl.UNSIGNED_BYTE,0);
/////////////////////////////////////////////////
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(surface_index), gl.STATIC_DRAW);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(surface_3_vertice), gl.STATIC_DRAW);
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.uniform4fv(vcolor, vec4(0.11,0.11,0.11,1.0));
    gl.drawElements(gl.TRIANGLES, 36,gl.UNSIGNED_BYTE,0);   

    gl.uniform3fv(thetaLoc, theta);
    requestAnimFrame(render);
}
