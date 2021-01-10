  //Create variables here
  var dog,foodS,foodStock, database;
  var dogImg,dogImg2;

  var milkimg;
  var lastFed, fedTime, foodObj;
  var food1, gameState;
  var readState, bedImg, washroomImg, gardenImg;

  function preload()
  {
    //load images here
    dogImg=loadImage("petimages/Dog.png");
    dogImg2=loadImage(" petimages/Happy.png");
    bedImg=loadImage(" petimages/Bed Room.png");
    washroomImg=loadImage(" petimages/Wash Room.png");
    gardenImg=loadImage(" petimages/Garden.png");
  }

  function setup() {
    createCanvas(600, 500);

    dog=createSprite(250,300,20,20)
    dog.addImage(dogImg);
    dog.scale=0.2;

    database=firebase.database();
    foodStock=database.ref("Food");
    foodStock.on("value",readStock);

    food1=new Food();

    feed=createButton("Feed the Dog");
    feed.position(700,95);
    feed.mousePressed(feedDog);
    
    addFood=createButton("Add Food");
    addFood.position(800,95);
    addFood.mousePressed(addFoods);

    readState=database.ref('gameState');
    readState.on("value",function(data){
      gameState=data.val();
    })

  }

  function draw() {  
    background(46,139,87);

   /* if ( keyWentDown( UP_ARROW ) ){
      writeStock(foodS);
      dog.addImage(dogImg2);
    } */

    noStroke();
    fill("white")
    textSize("90")
    text("Note:Press UP_ARROW key to feed Drago Milk",80,30);

    fill("blue")
    textSize("60")
    text("Food Remaining:"+ foodS,170,200);

    food1.display();

    fedTime=database.ref('FeedTime');
    fedTime.on("value",function(data){
      lastFed=data.val();
    })

    if(lastFed>=12){
      text("Last Feed :"+lastFed%12 +"PM",350,30);
    }
    else
    if(lastFed==0){
      text("Last Feed : 12 AM",350,30);
    }
    else{
    text("Last Feed :" + lastFed + "AM",350,30);
    }

    if(gameState!="Hungry"){
      feed.hide();
      addFood.hide();
      dog.remove();
    }else{
      feed.show();
      addFood.show();
      dog.addImage(dogImg);
    }

    currentTime=hour();
    if(currentTime==(lastFed+1)){
      update("Playing");
      food1.garden();
    }else if(currentTime==(lastFed+2)){
      update("Sleeping");
      food1.bedroom();
    }else if(currentTime>(lastFed+1) && currentTime<=(lastFed+4)){
      update("Bathing");
      food1.washroom();
    }else{
      update("Hungry");
      food1.display();
    }

    drawSprites();
  }

  function readStock( data ){

    foodS=data.val();
    food1.updateFoodStock(foodS);

  }

  function feedDog(){
    dog.addImage(dogImg2);

    food1.updateFoodStock(food1.getFoodStock()-1);
    database.ref('/').update({
      Food: food1.getFoodStock(),
      FeedTime:hour()
    })
  }

  function addFoods(){
    foodS++;
    database.ref('/').update({
      Food:foodS
    })
  }

  function update(state){
    database.ref('/').update({
      gameState:state
    })
  }
