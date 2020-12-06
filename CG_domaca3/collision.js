
class Ball{
    constructor(x=context.canvas.width/2,y=context.canvas.height/2,radius=12){
        this.x=x;
        this.y=y;
        this.radius=radius;
        this.speedX=Math.random()*(3+7)-3;
        this.speedY=Math.random()*(3+7)-3;
        if(Math.floor(Math.random()*2) == 0){
            this.speedX*=-1;
        }
        if(Math.floor(Math.random()*2) == 0){
            this.speedY*=-1;;
        }
    }
    update(){
        this.x+=this.speedX;
        this.y+=this.speedY;
        if(this.x-(this.radius/2)<0 ){
            this.speedX*=-1;
        }
        if(this.x+(this.radius/2) > 900 ){
            this.speedX*=-1;
        }
        if(this.y-(this.radius/2) <0 ){
            this.speedY*=-1;
        }
        if(this.y+(this.radius/2) > 900){
            this.speedY*=-1;
        }
    }
    draw(context){
        //context.fillStyle="green";
        //context.fillRect(this.x-this.radius/2,this.y-this.radius/2,this.radius,this.radius);
        context.beginPath();
        context.arc(this.x,this.y,this.radius,0,2*Math.PI);
        context.stroke();
        context.closePath();
    }
}
class Menager{
    constructor(){
        this.lopte=[];
    }
    render(){
        
        for(let loptica of this.lopte){
            loptica.update();
            loptica.draw(context);
        }
    }
}
function update(){
    context.fillStyle="white";
    context.fillRect(0,0,canvas.width,canvas.height);
    for(loptica of lopte){
        loptica.x+=loptica.speedX;
        loptica.y+=loptica.speedY;
        if(loptica.x-(loptica.radius/2)<0 ){
            loptica.speedX*=-1;
        }
        if(loptica.x+(loptica.radius/2) > 900 ){
            loptica.speedX*=-1;
        }
        if(loptica.y-(loptica.radius/2) <0 ){
            loptica.speedY*=-1;
        }
        if(loptica.y+(loptica.radius/2) > 900){
            loptica.speedY*=-1;
        }
        loptica.draw(context);
        
    }
    
}
function proveri(){
    speedX=Math.random()*(3+7)-3;
    speedY=Math.random()*(3+7)-3;
    if(Math.floor(Math.random()*2) == 0){
        speedX*=-1;
    }
    if(Math.floor(Math.random()*2) == 0){
        speedY*=-1;;
    }
    console.log(speedX);
    console.log(speedY);
}
