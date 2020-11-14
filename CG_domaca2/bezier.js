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
        
        this.color = "#00FF00";
        
    }
    lerp(a,b,t){
        return (1-t)*a+t*b;
    }

    izracunajLerp(tacka1,tacka2,t){
        return new Tacka(this.lerp(tacka1.x,tacka2.x,t),this.lerp(tacka1.y,tacka2.y,t));
    }
    pocetakBezier(t){
        return this.bezierTacka(this.points,t);
    }

    bezierTacka(tacke,t){
        //rekurzivna funkcija za lerp medju tackama i na kraju dobijemo tacku na krivulji
        let lerp_tacke=[];
        for(let i=0;i<tacke.length-1;i++){
            lerp_tacke.push(this.izracunajLerp(tacke[i],tacke[i+1],t));
        }
        if(lerp_tacke.length==1) return lerp_tacke[0];
        return this.bezierTacka(lerp_tacke,t);
    }
    drawCurve(razmak){
        context.beginPath();
        context.moveTo(this.i0.x,this.i0.y);
        for(let i=0;i<1;i+=razmak){
            let point = this.pocetakBezier(i);
            context.lineTo(point.x,point.y);
        }
        context.lineTo(this.i1.x, this.i1.y);
        context.stroke();
        
    }

    draw(context){
        context.beginPath();
        context.moveTo(this.i0.x,this.i0.y);
        context.lineTo(this.a0.x,this.a0.y);
        context.moveTo(this.i1.x,this.i1.y);
        context.lineTo(this.a1.x,this.a1.y);
        context.stroke();

        context.strokeStyle=this.color;
        this.drawCurve(0.01);
        context.strokeStyle="#000000";

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
