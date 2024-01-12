const canvas = document.getElementById("myCanvas")
const ctx = canvas.getContext("2d");

const width = canvas.width;
const height = canvas.height;
const totalParticle = 1;

function vector2(x,y) {
    this.x = x || 0;
    this.y = y || 0 ;
};

function particle(velocity,position,mass){
    this.velocity = velocity || new vector2();
    this.position = position || new vector2();
    this.mass = mass || 1;
}

let ball = new particle();

//initialiser
for(let i=0; i<totalParticle; i++){
    ball.position = new vector2(Math.floor(Math.random() * (width)),
                            Math.floor(Math.random() * (height)));
    ball.veloctity = new vector2(0,0);
    ball.mass = 1;
}

//runtime function
function render(){    
    console.log(ball.position.x);
    console.log(ball.position.y);
    
    
    
    //rendring
    ctx.clearRect(0,0,width,height);
    ctx.fillStyle = "red";
    for(let j=0; j<totalParticle; j++){
        ctx.beginPath();
        ctx.arc(ball.position.x,ball.position.y,4,0,2*Math.PI);
        ctx.fill();
    }
    
    ball.position.x += 0.1;
    requestAnimationFrame(render);
}
//starts the animation
requestAnimationFrame(render);

