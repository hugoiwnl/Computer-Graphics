class Tacka{
    constructor(x=0,y=0){
        this.x=x;
        this.y=y;
    }
}
class ApproxTacka extends Tacka{
    constructor(x=0,y=0,radius=5){
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
    Kliknuta(mouse){
        let racun=Math.sqrt(Math.pow(mouse.x-this.x,2)+Math.pow(mouse.y-this.y,2));
        if(racun<this.radius*2) return true;
        return false;
    }

}
class InterpTacka extends Tacka{
    constructor(x=0,y=0,stranica=10){
        super(x,y);
        this.stranica=stranica;
    }
    //crtas kvadrat kada je interpolirana tacka
    draw(context){
        context.fillRect(this.x-this.stranica/2,this.y,this.stranica,this.stranica);
        //isto oduzimam od x da bi se na sredini spojili
    }
    Kliknuta(mouse){
        return  mouse.x > this.x - this.stranica && 
                mouse.y > this.y - this.stranica && 
                mouse.x < this.x + this.stranica && 
                mouse.y < this.y + this.stranica;
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
    brojTacke(tacka){
        let counter=0;
        for(let t of this.points){
            if(tacka.x==t.x && tacka.y==t.y){
                return counter;
            }
            counter++;
        }
        return -1;
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
        this.selectedTacka=null;
        this.selected=false;
    }
    dodajTacku(tacka){
        this.points.push(tacka);
        this.napravi_curve();
    }
    brojTacke(tacka){
        let counter=0;
        for(let t of this.points){
            if(tacka.x==t.x && tacka.y==t.y){
                return counter;
            }
            counter++;
        }
        return -1;
    }
    brojuKrivulji(tacka){
        for(let c of this.curves){
            let br=c.brojTacke(tacka);
            if(br!=-1) 
                return br;
        }
        return -1;
    }
    pomeriTacku(tacka,pozicija){
        if( this.jelAproximirana(tacka) ){
            this.promeniPolozaj(tacka);
        } else {
            let index = this.brojTacke(tacka);
            
            if( index > 0){
                this.points[index-1].x += pozicija.x - tacka.x;
                this.points[index-1].y += pozicija.y - tacka.y;
            }
            if( index < this.points.length-1 ){
                this.points[index+1].x += pozicija.x - tacka.x;
                this.points[index+1].y += pozicija.y - tacka.y;
            }
        }
        
        tacka.x = pozicija.x;
        tacka.y = pozicija.y;
        this.napravi_curve();
    }

    kliknutaTacka(mouse){
        for(let curve of this.curves){
            for(let point of curve.points){
                if(point.Kliknuta(mouse)){
                    this.selectedTacka= this.points.find( (checkedPoint) => checkedPoint.x == point.x && checkedPoint.y == point.y);
                    this.selected=true;
                    return true;
                }
            }
        }
    }
    jelAproximirana(point){
        let curveIndex = this.brojuKrivulji(point);
        if( curveIndex == 1 || curveIndex == 2){
            return true;
        }
        
        return false;
    }

    //racunam razdalju
    razdalja(tacka1,tacka2){
        return Math.sqrt(Math.pow(tacka2.x-tacka1.x,2)+Math.pow(tacka2.y-tacka1.y,2));
    }
    //ugao
    ugao(tacka1,tacka2){
        return Math.atan2(tacka2.y - tacka1.y, tacka2.x - tacka1.x) * 180 / Math.PI;
    }

    promeniPolozaj(point){
        if( !this.jelAproximirana(point) ) {
            return;
        }
        let index = this.brojTacke(point);
        let uKrivulji = this.brojuKrivulji(point);
        if( uKrivulji == 1 && index > 2 ){
            let intTacka=this.points[index-1];
            let proslaAprox=this.points[index-2];
            let angle=this.ugao(point,intTacka);
            let dist=this.razdalja(point,intTacka);
            let novaPozicija=new Tacka(
                intTacka.x+dist*Math.cos(angle / 180 * Math.PI),
                intTacka.y+dist*Math.sin(angle / 180 * Math.PI)
            );
            proslaAprox.x=novaPozicija.x;
            proslaAprox.y=novaPozicija.y;
        }else if( uKrivulji == 2 && index <this.points.length-2 ){
            let intTacka=this.points[index+1];
            let sledecaAprox=this.points[index+2];
            let angle=this.ugao(point,intTacka);
            let dist=this.razdalja(point,intTacka);
            let novaPozicija=new Tacka(
                intTacka.x+dist*Math.cos(angle / 180 * Math.PI),
                intTacka.y+dist*Math.sin(angle / 180 * Math.PI)
            );
            sledecaAprox.x=novaPozicija.x;
            sledecaAprox.y=novaPozicija.y;
        }
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
        //moram da promenim poziciju tacaka za zveznost stopnje 1
        for(let c of this.curves){
            for(let p of c.points){
                this.promeniPolozaj(p); 
            }
        } 
           
    }
    crtanje(){
        for(let c of this.curves){
            let boja=document.getElementById("color_pick").value;
            c.color=boja;
            c.draw(context);
        }
    }


}
//promeni da na svaka 3 umesto svaka 4 bude crtanje, interp i approx nisu izracunane dobro inace
