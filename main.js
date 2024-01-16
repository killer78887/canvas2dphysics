const canvas = document.getElementById("myCanvas")
const ctx = canvas.getContext("2d");

const width = canvas.width;
const height = canvas.height;
const totalParticle = 100;
const constG = 6.67428e-11   //m³kg-¹s-²
const velCap = 200;
const stifness = 5; //perfect bounce(1)->(increase) bounce less
const trailLength = 9; 

function vector2(x,y) {
    this.x = x || 0;
    this.y = y || 0 ;
};

function particle(velocity,position,mass){
    this.velocity = velocity || new vector2();
    this.position = position || new vector2();
    this.mass = mass || 1;
}

let ball = new Array(totalParticle);
let trailData = new Array(trailLength);

for (let i = 0; i < totalParticle; i++) {
    ball[i] = new particle();
}

for(let i=0; i<trailLength; i++){
    trailData[i] = new Array(totalParticle);
    for(let j = 0; j<totalParticle; j++){
        trailData[i][j] = new vector2();
    }
}
//initialiser
for(let i=0; i<totalParticle; i++){
    ball[i].position = new vector2(Math.floor(Math.random() * (width)),
                            Math.floor(Math.random() * (height)));
    ball[i].velocity = new vector2(0,0);
    ball[i].mass = 1;  //Math.floor(Math.random()*2);
    for(let j = 0; j<trailLength; j++){
        trailData[j][i].x =ball[i].position.x;
        trailData[j][i].y =ball[i].position.y;
    }
}

// Handle the touch event
function handleTouchStart(event) {
    event.preventDefault();
    var touchX = event.touches[0].clientX - canvas.getBoundingClientRect().left;
    var touchY = event.touches[0].clientY - canvas.getBoundingClientRect().top;
    planet.position = new vector2(touchX,touchY);
    console.log("Touch Position: ", touchX, touchY);
}
canvas.addEventListener("touchstart", handleTouchStart, false);

let Time = new Date();
let currentTime;
let lastTime = Time.getTime();
let dtime;

let planet = new particle();
planet.position = new vector2(width/2,height/2);
planet.mass = 14e14;

//runtime function
function render(){
    //delta time calculation
    Time = new Date();
    currentTime = Time.getTime();
    dtime = currentTime-lastTime; //in ms
    lastTime = currentTime;
    
    //physics calculation
    for(let i= 0; i<totalParticle; i++){
        
        //force calculation
        let delta = new vector2(planet.position.x-ball[i].position.x,planet.position.y-ball[i].position.y);
        
        let distance = Math.sqrt(Math.pow(delta.x, 2) + Math.pow(delta.y, 2));
        
        let smallg = (constG * planet.mass * ball[i].mass) / Math.pow(distance,2);
        
        let normal = new vector2(delta.x/distance,delta.y/distance);
        
        let xforce = normal.x*smallg;
        let yforce = normal.y*smallg;
        //console.log(xforce,yforce,delta.x,delta.y);
        
        //velocity and position update
        ball[i].velocity = new vector2(ball[i].velocity.x + (xforce/ball[i].mass)*(dtime/1000),ball[i].velocity.y + (yforce/ball[i].mass)*(dtime/1000));
        ball[i].position = new vector2((dtime/1000)*ball[i].velocity.x+ball[i].position.x,(dtime/1000)*ball[i].velocity.y+ball[i].position.y);
        
        //celocity cap
        ball[i].velocity.x = Math.min(velCap,Math.max(ball[i].velocity.x,-velCap));
        ball[i].velocity.y = Math.min(velCap,Math.max(ball[i].velocity.y,-velCap));
        
        //boundry wall
        ball[i].position.x = Math.min(width,Math.max(ball[i].position.x,0));
        ball[i].position.y = Math.min(height,Math.max(ball[i].position.y,0));
        //bouncefromwall
        if(ball[i].position.x<=0 || ball[i].position.x>=width){
            ball[i].velocity.x = (ball[i].velocity.x*-1)/stifness;
        }
        if(ball[i].position.y<=0 || ball[i].position.y>=height){
            ball[i].velocity.y = (ball[i].velocity.y*-1)/stifness;
        }
        //console.log(ball[i].velocity.x);
    }
    //rendring
    ctx.clearRect(0,0,width,height);
    ctx.beginPath();
    ctx.fillStyle = "green";
    ctx.arc(planet.position.x,planet.position.y,6,0,2*Math.PI
    );
    ctx.fill();
    
    for(let i=0; i<totalParticle; i++){
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(ball[i].position.x,ball[i].position.y,3,0,2*Math.PI);
        ctx.fill();
        for(let j=0; j<trailLength; j++){
            ctx.fillStyle = "#fff00"
            ctx.beginPath();
            ctx.arc(trailData[j][i].x,trailData[j][i].y,1,0,2*Math.PI);
            ctx.fill();
        }
    }
    
    //moves the 2nd last trail postition to last and so on
    for (let i=0; i<totalParticle; i++){
        for(let j=trailLength-1; j>0; j--){
            trailData[j][i].x = trailData[j-1][i].x;  
            trailData[j][i].y = trailData[j-1][i].y;
        }
    }
    //the 1st most trail position filled with current position
    for (let i=0; i<totalParticle; i++){
        trailData[0][i].x = ball[i].position.x;
        trailData[0][i].y = ball[i].position.y;
    }
    requestAnimationFrame(render);
}
//starts the animation
requestAnimationFrame(render);

