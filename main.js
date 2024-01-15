const canvas = document.getElementById("myCanvas")
const ctx = canvas.getContext("2d");

const width = canvas.width;
const height = canvas.height;
const totalParticle = 100;
const constG = 6.67428e-11   //m³kg-¹s-²

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

for (let i = 0; i < totalParticle; i++) {
    ball[i] = new particle();
}
//initialiser
for(let i=0; i<totalParticle; i++){
    ball[i].position = new vector2(Math.floor(Math.random() * (width)),
                            Math.floor(Math.random() * (height)));
    ball[i].velocity = new vector2(0,0);
    ball[i].mass = 1;  //Math.floor(Math.random()*2);
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
planet.mass = 14e13;
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
    }
    
    //rendring
    ctx.clearRect(0,0,width,height);
    ctx.beginPath();
    ctx.fillStyle = "green";
    ctx.arc(planet.position.x,planet.position.y,6,0,2*Math.PI
    );
    ctx.fill();
    ctx.fillStyle = "red";
    for(let j=0; j<totalParticle; j++){
        ctx.beginPath();
        ctx.arc(ball[j].position.x,ball[j].position.y,2,0,2*Math.PI);
        ctx.fill();
    }
    
    requestAnimationFrame(render);
}
//starts the animation
requestAnimationFrame(render);

