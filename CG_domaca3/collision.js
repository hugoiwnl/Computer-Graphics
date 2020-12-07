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
class Rectangle{
    constructor(x,y,width,height){
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;
    }

    contains(ball){
        return(ball.x+ball.radius/2>=this.x && ball.x+ball.radius/2<=this.x+this.width && ball.y+ball.radius/2>=this.y && ball.y+ball.radius<=this.y+this.height);
    }

}
class QuadTree{
    constructor(bound){
        this.bound=bound;
        this.maxballs=4;
        this.balls=[];
        this.divided=false;
    }
    insert(ball){
        if(!this.bound.contains(ball)){
            return false;
        }
        if(this.balls.length<this.maxballs && !this.divided){
            this.balls.push(ball);
            return true;
        }else{
            if(!this.divided){
                this.subdivide();
            }
            if(this.northwest.insert(ball)){
                return true;
            }else if(this.southwest.insert(ball)){
                return true;
            }else if(this.northeast.insert(ball)){
                return true;
            }else if(this.southeast.insert(ball)){
                return true;
            } 
        }
        return false;
    }

    subdivide(){
        let nw=new Rectangle(this.bound.x,this.bound.y,this.bound.width/2,this.bound.height/2);
        this.northwest=new QuadTree(nw);
        let ne=new Rectangle(this.bound.x+this.bound.width/2,this.bound.y,this.bound.width/2,this.bound.height/2);
        this.northeast=new QuadTree(ne);
        let sw=new Rectangle(this.bound.x,this.bound.y+this.bound.height/2,this.bound.width/2,this.bound.height/2);
        this.southwest=new QuadTree(sw);
        let se=new Rectangle(this.bound.x+this.bound.width/2,this.bound.y+this.bound.height/2,this.bound.width/2,this.bound.height/2);
        this.southeast=new QuadTree(se);
        this.divided=true;
    }

    draw(){
        context.beginPath();
        context.rect(this.bound.x,this.bound.y,this.bound.width,this.bound.height);
        context.stroke();
        if(this.divided){
            this.northwest.draw();
            this.northeast.draw();
            this.southwest.draw();
            this.southeast.draw();
        }
    }

}
class Menager{
    constructor(){
        this.lopte=[];
    }
    render(){
        let quad=new QuadTree(new Rectangle(0,0,900,900));
        for(let loptica of this.lopte){
            quad.insert(loptica);
            loptica.update();
            loptica.draw(context);
            quad.draw();
        }
    }
}

