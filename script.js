let scene,msg;
let rnd = (l,u) => Math.floor(Math.random()*(u-l)+l);
let $ = (el) => document.getElementById(el);

let balloons = [], cupcakes = [], cakes, threshold = 7, soundFlag = true;
let gifts = [];
let count = 0, count2 = 0, count3 = 0;
let point,cheering,choochoo,blop;

window.onload = ()=>{
  scene = $("scene");
  msg = $("msg")
  cakes = [$("cake"),$("cake2")]
  
  /*
  point = $("point")
  cheering = $("cheering")
  blop = $("blop")
  choochoo = $("choochoo")
  choochoo.volume = 0.05;
  */
  choochoo = loadSound("sounds/choochoo.mp3")
  point = loadSound("sounds/metal.wav")
  blop = loadSound("sounds/blop.mp3")
  cheering = loadSound("sounds/cheering.mp3")
  setSoundVolume(choochoo,0.1);

  for(let i = 0; i < 20; i++){
    let x = rnd(-20,20);
    let y = rnd(2,20);
    let z = rnd(-20,20);
    gifts.push(new Gift("gift" + rnd(1,4),x,y,z));
  }
  document.body.addEventListener('touchstart', function(){playSound(choochoo);hideIntro();}, false)
  document.body.addEventListener('click', function(){playSound(choochoo);hideIntro();}, false)
}


function hideIntro(){
    intro.object3D.position.z -= 0.2
    if(intro.object3D.position.z < -50){
        intro.setAttribute("visible","false")
        loop();
    }else{
        setTimeout(hideIntro,10)
    }
}

function loop(){
  //if(soundFlag) choochoo.play();
  
  if(count == threshold){
    msg.setAttribute("value","");
    //if(soundFlag) cheering.play();
    playSound(cheering)
    $("instructions").setAttribute("visible",false);
    $("status").setAttribute("visible",false);
    $("instructions2").setAttribute("visible",true);
    $("status2").setAttribute("visible",true);
    for(let i = 0; i < 50; i++){
      x = rnd(-20,20);
      y = rnd(15,100);
      z = rnd(-20,20);
      cupcakes.push(new Cupcakes(x,y,z,1.5));
    }
    for(let gift of gifts){
      gift.obj.remove();
    }
    gifts = [];
    count++;
  }
  if(count2 == threshold){
    //if(soundFlag) cheering.play();
    playSound(cheering);
    $("instructions2").setAttribute("visible",false);
    $("status2").setAttribute("visible",false);
    $("instructions3").setAttribute("visible",true);
    $("status3").setAttribute("visible",true);
    for(let i = 0; i < 200; i++){
      let x = rnd(-20,20);
      let y = rnd(-150,-3);
      let z = rnd(-20,20);
      balloons.push(new Balloon(x,y,z));
    }
    for(let cupcake of cupcakes){
      cupcake.obj.remove();
    }
    cupcakes = [];
    count2++;
  }
  if(count > threshold){
    for(let cupcake of cupcakes){
      cupcake.move();
    }
  }
  if(count2 > threshold){
    for(let balloon of balloons){
      balloon.move();
    }
    if(count3 % 4 == 0){
      //cheering.play();
      //playSound(cheering)
    }
  }
  if(count3 == 3){
    //if(soundFlag) cheering.play();
    //playSound(cheering);
    $("instructions3").setAttribute("visible",false);
    $("sign").setAttribute("visible",true);
    $("name").setAttribute("visible",true);
    $("cake").setAttribute("visible",true);
    $("cake2").setAttribute("visible",true);
  }
  if(count3 >= 3){
    for(let cake of cakes){
      if(cake.object3D.position.y > 0.05){
        cake.object3D.position.y -= 0.2;
      }
    } 
  }
  
  for(let gift of gifts){
    gift.move();
  }

  setTimeout(loop,30);
}

class Entity{
  constructor(model,x,y,z,scale = 1,container=scene){
      this.obj = document.createElement("a-entity")
      this.obj.setAttribute("gltf-model",`#${model}`);
      this.obj.setAttribute("position",{x:x,y:y,z:z});
      this.obj.setAttribute("scale",{x:scale, y:scale, z:scale});
      container.append(this.obj);
  }
}

class Balloon extends Entity{
  constructor(x,y,z){
    super("balloon",x,y,z,0.01);
    this.obj.setAttribute("data-raycastable")
    this.obj.addEventListener("mouseenter",()=>{
      if(this.obj.getAttribute("visible")){
        this.obj.setAttribute("visible",false);
        $("status3").object3D.position.x = -count3 * 0.5
        new Entity("balloon",count3 * 1,0,0,0.01,$("status3"));
        //if(soundFlag) blop.play();
        playSound(blop);
        count3++;
      }
    })
  }
  move(){
    this.obj.object3D.position.y += 0.025;
  }
}
class Cupcakes extends Entity{
  constructor(x,y,z){
    super("cupcake",x,y,z);
    this.obj.setAttribute("data-raycastable")
    this.obj.addEventListener("mouseenter",()=>{
      if(this.obj.getAttribute("visible")){
        this.obj.setAttribute("visible",false);
        $("status2").object3D.position.x = -count2 * 0.5
        new Entity("cupcake",count2 * 1.5,0,0,1,$("status2"));
        //if(soundFlag) blop.play();
        playSound(blop);
        count2++;
      }
    })
  }
  move(){
    if(this.obj.object3D.position.y > 0){
      this.obj.object3D.position.y -= 0.1;
    }
    
  }
}

class Gift extends Entity{
  constructor(model,x,y,z){
    super(model,x,y,z);
    this.x = x; this.dx = rnd(2,5) / 100 * (-1) ** rnd(0,2);
    this.y = y; this.dy = rnd(2,5) / 100 * (-1) ** rnd(0,2);
    this.z = z; this.dz = rnd(2,5) / 100 * (-1) ** rnd(0,2);
    this.model = model;
    this.obj.setAttribute("data-raycastable")
    this.obj.addEventListener("mouseenter",()=>{
      if(this.obj.getAttribute("visible")){
        this.obj.setAttribute("visible",false);  
        //if(soundFlag) point.play();
        playSound(point);
        $("status").object3D.position.x = -count * 1.25
        new Entity(this.model,count * 1.75,0,0,0.4,$("status"));
        count++;
      }
    })
  }
  move(){
    this.x += this.dx;
    this.y += this.dy;
    this.z += this.dz;
    if(this.x > 20 || this.x < -20) this.dx = -this.dx;
    if(this.y > 20 || this.y < -20) this.dy = -this.dy;
    if(this.z > 20 || this.z < -20) this.dz = -this.dz;
    this.obj.object3D.position.x = this.x;
    this.obj.object3D.position.y = this.y;
    this.obj.object3D.position.z = this.z;
  }
}