class Tacka{
    constructor(x=0,y=0){
        this.x=x;
        this.y=y;
    }
}
class ApproxTacka extends Tacka{
    constructor(x=0,y=0,radius=4){
        super(x,y);
        this.radius=radius;
    }
    //kada je aprox onda je krug
    draw(context){
        context.beginPath();
        context.arc(this.x,this.y+this.radius,this.radius,0,2*Math.PI);
        //dodajem radius na y da bi se spojili na sredini
        context.fill();
    }

}
class InterpTacka extends Tacka{
    constructor(x=0,y=0,stranica=9){
        super(x,y);
        this.stranica=stranica;
    }
    //crtas kvadrat kada je interpolirana tacka
    draw(context){
        context.fillRect(this.x-this.stranica/2,this.y,this.stranica,this.stranica);
        //isto oduzimam od x da bi se na sredini spojili
    }
}
class Curve{
    constructor(i0,a0,a1,i1){
        this.points = [
            new InterpTacka(i0.x, i0.y),
            new ApproxTacka(a0.x, a0.y),
            new ApproxTacka(a1.x, a1.y),
            new InterpTacka(i1.x, i1.y)
        ];
        this.i0 = this.points[0];
        this.a0 = this.points[1];
        this.a1 = this.points[2];
        this.i1 = this.points[3];
        
        this.color = "#000000";
        
    }

    draw(context){
        context.beginPath();
        context.moveTo(this.i0.x,this.i0.y);
        context.lineTo(this.a0.x,this.a0.y);
        context.moveTo(this.i1.x,this.i1.y);
        context.lineTo(this.a1.x,this.a1.y);
        context.stroke();

        context.strokeStyle=this.color;

        this.i0.draw(context);
        this.a0.draw(context);
        this.a1.draw(context);
        this.i1.draw(context);
    }
}
class Menager{
    constructor(){
        this.points = [];
        this.curves=[];
        this.color = "#000000";

    }
    dodajTacku(tacka){
        this.points.push(tacka);
        this.napravi_curve();
    }

    napravi_curve(){
        this.curves=[];
        if(this.points.length<4)
            return;
        else{
            this.curves.push(
                new Curve(
                    this.points[0],
                    this.points[1],
                    this.points[2],
                    this.points[3])
            )
        
            for(let i=3;i<this.points.length-3;i+=3){
                this.curves.push(
                    new Curve(
                        this.points[i],
                        this.points[i+1],
                        this.points[i+2],
                        this.points[i+3])
                )
            }
            
        }
        this.crtanje();    
    }
    crtanje(){
        for(let c of this.curves){
            c.draw(context);
        }
    }
}
//promeni da na svaka 3 umesto svaka 4 bude crtanje, interp i approx nisu izracunane dobro inace
