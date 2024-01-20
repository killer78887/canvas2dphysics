(function (){
    "use strict"

function vector2(x,y){
    this.x = x||0;
    this.y = y||0;
}
function rigidBody(posX,posY,velX,velY,mass,totalVertex,scale,angularVelocity){
    this.scale = scale
    this.position = new vector2(posX,posY);
    this.velocity = new vector2(velX,velY);
    this.angularVelocity = angularVelocity || 0;
    this.mass = mass || 0;
    this.rotation = 0;
    this.totalVertex = totalVertex;
    this.vertices = new Array(this.totalVertex||totalVertex);
    for(let i=0; i<this.totalVertex; i++){
        this.vertices[i] =this.vertices[i] || new vector2();
    }
    this.radius = Math.sqrt(Math.pow(scale,2)+Math.pow(scale,2))
    this.momentOfInertia = 0.5*this.mass*Math.pow(this.radius,2)*(1-(2/3)*Math.pow(Math.sin(Math.PI/this.totalVertex),2));
    
}

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const width = canvas.width;
const height = canvas.height;
const totalRigidBody = 1;
const totalVertex = 5;
const baseVertices = [
    new vector2(1,1),
    new vector2(1,-1),
    new vector2(-1,-1),
    new vector2(-1,1),
    new vector2(2,2)];
const scale = 10;   //1 pixel equal scale;
const velCap = 1000000;
const rotVelCap = 100;
const stifness = 5;
const constG = 6.1e-11;

function shapeRender(totalVertex,vertices){
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.moveTo(vertices[totalVertex-1].x,vertices[totalVertex-1].y);
    for(let i=0 ; i<totalVertex-1; i++){
        ctx.lineTo(vertices[i].x,vertices[i].y);
        //console.log(totalVertex,vertices[i].x);
    }
    ctx.fill();
}

function gForceCalc(posVector,planet,constG,mass){
    let delta = new vector2(planet.position.x-posVector.x,planet.position.y-posVector.y);
    let distance = Math.sqrt(Math.pow(delta.x, 2) + Math.pow(delta.y, 2));
    let smallg = (constG * planet.mass * mass) / Math.pow(distance,2);
            
    let normal = new vector2(delta.x/distance,delta.y/distance);
    
    let force = new vector2(normal.x*smallg,normal.y*smallg);
    return force;
}

function handleTouchStart(event) {
    event.preventDefault();
    var touchX = event.touches[0].clientX - canvas.getBoundingClientRect().left;
    var touchY = event.touches[0].clientY - canvas.getBoundingClientRect().top;
    planet.position = new vector2(touchX,touchY);
    console.log("Touch Position: ", touchX, touchY);
}
canvas.addEventListener("touchstart", handleTouchStart, false);

let planet = new rigidBody(100,100,0,0,10e15);
let obj = new Array(totalRigidBody);
let Time = new Date();
let currentTime = Time.getTime();
let dtime = 20;//in ms
let lastTime = currentTime;
//initialisation
for (let i=0; i<totalRigidBody; i++){
    obj[i] = new rigidBody(width/2,height/2,0,0,10,totalVertex,scale,0);
    for (let j=0; j<totalVertex; j++){
        obj[i].vertices[j].x = baseVertices[j].x*scale+obj[i].position.x;
        obj[i].vertices[j].y = baseVertices[j].y*scale+obj[i].position.y;
    }
}

function runTime(){
    ctx.clearRect(0,0,width,height);
    //delta time calculation
    Time = new Date();
    currentTime = Time.getTime();
    dtime = currentTime-lastTime; //in ms
    lastTime = currentTime;
    
    //physics calculation
    for(let i= 0; i<totalRigidBody; i++){
        
        //rotational calculations
        let totalTorque = 0;
        
        for (let j = 0; j < obj[i].totalVertex; j++) {
            let f = gForceCalc(obj[i].vertices[j],planet,constG,obj[i].mass);
            totalTorque += (obj[i].position.x-obj[i].vertices[j].x)*f.y - (obj[i].position.x-obj[i].vertices[j].x)*f.x;
        }
        
        obj[i].angularVelocity += (totalTorque/obj[i].momentOfInertia) * dtime/1000;
        obj[i].angularVelocity = Math.min(Math.max(obj[i].angularVelocity,-rotVelCap),rotVelCap)
        obj[i].rotation += obj[i].angularVelocity/2*dtime/1000;
        
        let force = gForceCalc(obj[i].position,planet,constG,obj[i].mass);    
        //velocity update
        obj[i].velocity = new vector2(obj[i].velocity.x + (force.x/obj[i].mass)*(dtime/1000),obj[i].velocity.y + (force.y/obj[i].mass)*(dtime/1000));
            
        //velocity cap
        obj[i].velocity.x = Math.min(velCap,Math.max(obj[i].velocity.x,-velCap));
        obj[i].velocity.y = Math.min(velCap,Math.max(obj[i].velocity.y,-velCap))
        
        //position update   
        obj[i].position = new vector2((dtime/1000)*obj[i].velocity.x+obj[i].position.x,(dtime/1000)*obj[i].velocity.y+obj[i].position.y);
        
        //boundry wall
        obj[i].position.x = Math.min(width,Math.max(obj[i].position.x,0));
        obj[i].position.y = Math.min(height,Math.max(obj[i].position.y,0));
        
        //bouncefromwall
        if(obj[i].position.x<=0 || obj[i].position.x>=width){
            obj[i].velocity.x = (obj[i].velocity.x*-1)/stifness;
            obj[i].angularVelocity = 0;
        }
        if(obj[i].position.y<=0 || obj[i].position.y>=height){
            obj[i].velocity.y = (obj[i].velocity.y*-1)/stifness;
            obj[i].angularVelocity = 0;
        }
        
        //vertices update based on new pos
        let tempRot = obj[i].rotation;
        for (let j = 0; j < obj[i].totalVertex; j++) {
            let tempV = obj[i].vertices[j];
            
            tempV.x = baseVertices[j].x * scale + obj[i].position.x;
            tempV.y = baseVertices[j].y * scale + obj[i].position.y;
            
            let rotatedX = ((tempV.x - obj[i].position.x) * Math.cos(tempRot)) - ((tempV.y - obj[i].position.y) * Math.sin(tempRot));
            let rotatedY = ((tempV.x - obj[i].position.x) * Math.sin(tempRot)) + ((tempV.y - obj[i].position.y) * Math.cos(tempRot));
            
            obj[i].vertices[j] = { x: rotatedX + obj[i].position.x, y: rotatedY + obj[i].position.y };
        }
        
        //rendering
        shapeRender(totalVertex,obj[i].vertices);
        ctx.fillStyle = "blue";
        ctx.beginPath();
        ctx.arc(planet.position.x,planet.position.y,4,0,2*Math.PI);
        ctx.fill();
    }
    
    
    requestAnimationFrame(runTime);
}
requestAnimationFrame(runTime);
})();