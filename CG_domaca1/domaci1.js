let inp=document.getElementById("inputText");
let out=document.getElementById("outputText");

class Vector4f{
  constructor(x=0,y=0,z=0,w=1){
      this.x=x;
      this.y=y;
      this.z=z;
      this.w=w;
  }
  static negate(input){
    let prvi=input.x*-1;
    let drugi=input.y*-1;
    let treci=input.z*-1;
    return new Vector4f(prvi,drugi,treci);
  }
  static add(input1,input2){
    let x=input1.x+input2.x;
    let y=input1.y+input2.y;
    let z=input1.z+input2.z;
    return new Vector4f(x,y,z);
  }
  static skalarProduct(input1,input2){
    let x=input1*input2.x;
    let y=input1*input2.y;
    let z=input1*input2.z;
    return new Vector4f(x,y,z);
  }
  static dotProduct(input1,input2){
    return input1.x*input2.x+input1.y*input2.y+input1.z*input2.z;
  }
  static crossProduct(input1,input2){
    let x=input1.y*input2.z-input1.z*input2.y;
    let y=input1.z*input2.x-input1.x*input2.z;
    let z=input1.x*input2.y-input1.y*input2.x;
    return new Vector4f(x,y,z);
  }
  static length(input){
    return Math.sqrt(Math.pow(input.x,2)+Math.pow(input.y,2)+Math.pow(input.z,2));
  }
  static normalize(input){
    let l=length(input);
    if(l==0){
      console.error("You can't normalize a vector with no length!")
    }else{
      let x=input.x/l;
      let y=input.y/l;
      let z=input.z/l;
      return new Vector4f(x,y,z);
    }
  }
  static project(input1,input2){
    let gore=dotProduct(input1,input2);
    let dole=Math.pow(length(input2),2);
    let sk=gore/dole;
    return skalarProduct(sk,input2);
  }
  static cosPhi(input1,input2){
    let skalarni=dotProduct(input1,input2);
    let prvi_l=length(input1);
    let drugi_l=length(input2);
    let cos=skalarni/(prvi_l*drugi_l);
    return Math.cos(cos);
  }
}
class Matrix4f{
  constructor(values=new Array(4).fill(0).map(() => new Array(4).fill(0))){
    this.values=values;
  }
  static negate(input){
    let m=new Matrix4f();
    for(let i=0;i<input.values.length;i++){
      for(let j=0;j<input.values[0].length;j++){
        m.values[i][j]=input.values[i][j]*-1;
      }
    }
    return m;
  }
  static add(input1,input2){
    let m=new Matrix4f();
    for(let i=0;i<input1.values.length;i++){
      for(let j=0;j<input1.values[0].length;j++){
        m.values[i][j]=input1.values[i][j]+input2.values[i][j];
      }
    }
    return m;
  }
  static transpose(input){
    let m=new Matrix4f();
    for(let i=0;i<input.values.length;i++){
      for(let j=0;j<input.values[0].length;j++){
        m.values[i][j]=input.values[j][i];
      }
    }
    return m;
  }
  static multiplyScalar(input1,input2){
    let m=new Matrix4f();
    for(let i=0;i<input2.values.length;i++){
      for(let j=0;j<input2.values[0].length;j++){
        m.values[i][j]=input1*input2.values[i][j];
      }
    }
    return m;
  }
  static multiply(input1,input2){
    let m=new Matrix4f();
    for(let i=0;i<input2.values.length;i++){
      for(let j=0;j<input2.values[0].length;j++){
        for(let k=0;k<input2.values.length;k++){
          m.values[i][j]+=input1.values[i][k]*input2.values[k][j];
        }
      }
    }
    return m;
  }
}
class PointMenager{
  static podeliNaArray(input){
    let rec=input.value;
    rec=rec.split("v");
    rec.shift();
    return rec;
  }
  static napraviVektor(input){
    let koordinate=input.split(" ");
    koordinate.shift();
    return new Vector4f(parseFloat(koordinate[0]),parseFloat(koordinate[1]),parseFloat(koordinate[2]));
  }
  static pretvorivString(vector){
    return `v ${vector.x.toFixed(3)} ${vector.y.toFixed(3)} ${vector.z.toFixed(3)}`
  }
}
class Transformation{
  constructor(matrika=new Matrix4f()){
    this.matrika=matrika;
    this.matrika.values[0][0]=1;
    this.matrika.values[1][1]=1;
    this.matrika.values[2][2]=1;
    this.matrika.values[3][3]=1;
  }
  translate(input){
    this.matrika.values[0][3]=input.x;
    this.matrika.values[1][3]=input.y;
    this.matrika.values[2][3]=input.z;
  }
  scale(input){
    this.matrika.values[0][0]=input.x;
    this.matrika.values[1][1]=input.y;
    this.matrika.values[2][2]=input.z;
  }
  rotateX(input){
    this.matrika.values[1][1]=Math.cos(input);
    this.matrika.values[1][2]=Math.sin(input);
    this.matrika.values[2][1]=-Math.sin(input);
    this.matrika.values[2][2]=Math.cos(input);
  }
  rotateY(input){
    this.matrika.values[0][0]=Math.cos(input);
    this.matrika.values[2][0]=-Math.sin(input);
    this.matrika.values[0][2]=Math.sin(input);
    this.matrika.values[2][2]=Math.cos(input);
  }
  rotateZ(input){
    this.matrika.values[0][0]=Math.cos(input);
    this.matrika.values[1][0]=Math.sin(input);
    this.matrika.values[0][1]=-Math.sin(input);
    this.matrika.values[1][1]=Math.cos(input);
  }
  static transformPoints(input){
    let transformation=new Transformation();

    //translate z x 1.25
    let novaTrans=new Transformation();
    novaTrans.translate(new Vector4f(1.25,0,0));
    transformation.matrika=Matrix4f.multiply(novaTrans.matrika,transformation.matrika);

    //rotacija oko z za pi/3
    novaTrans=new Transformation();
    novaTrans.rotateZ(Math.PI/3);
    transformation.matrika=Matrix4f.multiply(novaTrans.matrika,transformation.matrika);

    //translacija z 4.15
    novaTrans=new Transformation();
    novaTrans.translate(new Vector4f(0,0,4.15));
    transformation.matrika=Matrix4f.multiply(novaTrans.matrika,transformation.matrika);

    //translacija y z 3.14
    novaTrans=new Transformation();
    novaTrans.translate(new Vector4f(0,3.14,0));
    transformation.matrika=Matrix4f.multiply(novaTrans.matrika,transformation.matrika);

    //skalacija x z 1.12
    novaTrans=new Transformation();
    novaTrans.scale(new Vector4f(1.12,1.12,1));
    transformation.matrika=Matrix4f.multiply(novaTrans.matrika,transformation.matrika);

    //rotacija y z 5*pi/8
    novaTrans=new Transformation();
    novaTrans.rotateY(5*Math.PI/8);
    transformation.matrika=Matrix4f.multiply(novaTrans.matrika,transformation.matrika);

    return new Vector4f(
      transformation.matrika.values[0][0] * input.x +
      transformation.matrika.values[0][1] * input.y +
      transformation.matrika.values[0][2] * input.z +
      transformation.matrika.values[0][3] * input.w,

      transformation.matrika.values[1][0] * input.x +
      transformation.matrika.values[1][1] * input.y +
      transformation.matrika.values[1][2] * input.z +
      transformation.matrika.values[1][3] * input.w,

      transformation.matrika.values[2][0] * input.x +
      transformation.matrika.values[2][1] * input.y +
      transformation.matrika.values[2][2] * input.z +
      transformation.matrika.values[2][3] * input.w
  )
   
  }
}

var dugme=document.getElementById("dugme");
dugme.onclick=function(){
  let konacno="";
  let nesto=PointMenager.podeliNaArray(inp);
  for(let i=0;i<nesto.length;i++){
    let vektor=PointMenager.napraviVektor(nesto[i]);
    let transformiraniVektor=Transformation.transformPoints(vektor);
    let str=PointMenager.pretvorivString(transformiraniVektor);
    if(i!=nesto.length-1){
      str+="\n";
    }
    konacno+=str;
  }
  out.value=konacno;
}





















