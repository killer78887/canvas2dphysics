function vector2(x,y){
    x = this.x || 0;
    y = this.y || 0;
}
function rigidBody(position,velocity,mass,totalVertex,vertices){
    position = position || new vector2();
    velocity = velocity || new vector2();
    mass = this.mass|| 0;
    totalVertex = totalVertex || this.totalVertex;
    vertices = new Array(4);
    for(let i=0; i<4; i++){
        vertices[i] =this.vertices[i] || new vector2();
        console.log("debug")
    }
}

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const width = canvas.width;
const height = canvas.height;
const totalRigidBody = 1;
const totalVertex = 4;
const baseVertices = [
    new vector2(1,1),
    new vector2(1,-1),
    new vector2(-1,-1),
    new vector2(-1,1)];
const scale = 10;   //1 pixel equal scale;                 
function shapeRender(totalVertex,vertices){
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.moveTo(vertices[totalVertex-1].x,vertices[totalVertex-1].y);
    for(let i=0 ; i<totalVertex; i++){
        ctx.lineTo(vertices[i].x,vertices[i].y);
        console.log(totalVertex,vertices[i].x);
    }
    ctx.stroke();
}
let obj = new Array(totalRigidBody);
//initialisation
for (let i=0; i<totalRigidBody; i++){
    obj[i] = new rigidBody();
    obj[i].position = new vector2(width/2,height/2);
    obj[i].velocity = new vector2(0,0);
    obj[i].totalVertex = totalVertex;
    obj[i].mass = 10;
    obj[i].vertices = new Array(obj[i].totalVertex);
    console.log(obj[i].vertices[0]);
    for (let j=0; j<totalVertex; j++){
        obj[i].vertices[j].x = baseVertices[j].x*scale+obj[i].position.x;
        obj[i].vertices[j].y = baseVertices[j].y*scale+obj[i].position.y;
        console.log(obj[i].vertices[j].x);
    }
}

shapeRender(totalVertex,obj[0].vertices);
