var dog, dogImg, happyDog, happyImg, database, foodS, foodStock;
var feed, addFood, fedTime, lastFed;
function preload()
{
  dogImg = loadImage("images/dogImg.png");
  happyImg = loadImage("images/dogImg1.png");
}

function setup() {
  database = firebase.database();
	createCanvas(700, 500);

  dog = createSprite(250,300,50,50);
  dog.addImage(dogImg);
  dog.scale = 0.15;

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);

  feed=createButton("Feed the dog");
  feed.position(800,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(900,95);
  addFood.mousePressed(addFoods)
}


function draw() {  
  background(46,139,87);
  foodObj.display();

  fedTime=database.ref('FeedTime');
  fedTime.on("value", function(data){
    lastFed=data.val();
  })

  fill(255,255,254);
  textSize(15);
  if(lastFed>=12){
    text("Last Feed: "+ lastFed%12+ " PM", 50, 75);
  } else if(lastFed==0){
    text("Last Feed: 12 AM", 50, 75);
  } else{ 
    text("Last Feed: "+ lastFed+ " AM", 50, 75);
  }

  drawSprites();
}

function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}

// function writeStock(x){
//   if(x<=0){
//     x=0;
//   } else {
//     x=x-1;
//   }

//   database.ref('/').update({
//     Food:x
//   })
// }

function feedDog(){
  dog.addImage(happyImg);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}