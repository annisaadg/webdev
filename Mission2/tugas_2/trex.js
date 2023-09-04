//board
let board;
let boardWidth = 700;
let boardHeight = 200;
let context;

//dino
let dinoWidth = 58;
let dinoHeight = 64;
let dinoX = 20;
let dinoY = boardHeight - dinoHeight;
let dinoImg;

let dino = {
    x : dinoX,
    y : dinoY,
    width : dinoWidth,
    height : dinoHeight
}

//cactus
let cactusArray = [];

let cactus1Width = 24;
let cactus2Width = 49;
let cactus3Width = 82;

let cactusHeight = 50;
let cactusX = 600;
let cactusY = boardHeight - cactusHeight;

let cactus1Img;
let cactus2Img;
let cactus3Img;
let gameoverImg = new Image();
gameoverImg.src = "./img/game-over.png";


//physics
let velocityX = -8; // Kecepatan bergerak kaktus ke kiri
let velocityY = 0;
let gravity = .5;

let gameOver = false;
let score = 0;

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;

    context = board.getContext("2d"); // Digunakan untuk menggambar di papan permainan

    dinoImg = new Image();
    dinoImg.src = "./img/dino.png";
    dinoImg.onload = function() {
        context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
    }

    cactus1Img = new Image();
    cactus1Img.src = "./img/cactus1.png";

    cactus2Img = new Image();
    cactus2Img.src = "./img/cactus2.png";

    cactus3Img = new Image();
    cactus3Img.src = "./img/cactus3.png";

    // Tambahkan event click pada gambar reset
    const resetImage = document.getElementById("resetImage");
    resetImage.addEventListener("click", function() {
        // Muat ulang halaman saat gambar diklik
        location.reload();
    });

    requestAnimationFrame(update);
    setInterval(placeCactus, 1000); //1000 milliseconds = 1 second
    document.addEventListener("keydown", moveDino);
}

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        // menampilkan tampilan ketika game over
        context.drawImage(gameoverImg, (boardWidth-386)/2, (boardHeight-40)/2, 386, 40);
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    //dino
    velocityY += gravity;
    dino.y = Math.min(dino.y + velocityY, dinoY); //mengaplikasikan gaya gravitasi kepada dino.y, making sure it doesn't exceed the ground
    context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);

    //cactus
    for (let i = 0; i < cactusArray.length; i++) {
        let cactus = cactusArray[i];
        cactus.x += velocityX;
        context.drawImage(cactus.img, cactus.x, cactus.y, cactus.width, cactus.height);

        if (detectCollision(dino, cactus)) {
            gameOver = true;
            dinoImg.src = "./img/dino-dead.png";
            dinoImg.onload = function() {
                context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
            }
        }
    }

    context.fillStyle = "black";
    context.font = "20px courier";
    score++;
    const scoreText = "Score: " + score; // akumulasi score
    context.fillText(scoreText, 5, 20);
        
}

function moveDino(e) {
    if (gameOver) {
        return;
    }

    if ((e.code == "Space" || e.code == "ArrowUp") && dino.y == dinoY) {
        //jump
        velocityY = -10;
        dinoImg.src = "./img/dino-jump.png";
    }
    else if (e.code == "ArrowDown" && dino.y == dinoY) {
        //duck
        dinoImg.src = "./img/dino-duck1.png";
    }

}

function placeCactus() {
    if (gameOver) {
        return;
    }

    //place cactus
    let cactus = {
        img : null,
        x : cactusX,
        y : cactusY,
        width : null,
        height: cactusHeight
    }

    let placeCactusChance = Math.random(); //0 - 0.9999...

    if (placeCactusChance > .90) { //10% you get cactus3
        cactus.img = cactus3Img;
        cactus.width = cactus3Width;
        cactusArray.push(cactus);
    }
    else if (placeCactusChance > .70) { //30% you get cactus2
        cactus.img = cactus2Img;
        cactus.width = cactus2Width;
        cactusArray.push(cactus);
    }
    else if (placeCactusChance > .50) { //50% you get cactus1
        cactus.img = cactus1Img;
        cactus.width = cactus1Width;
        cactusArray.push(cactus);
    }

    if (cactusArray.length > 5) {
        cactusArray.shift(); //Hapus elemen pertama dari array agar array tidak terus bertambah
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&   //Sudut kiri atas a tidak mencapai sudut kanan atas b
           a.x + a.width > b.x &&   //Sudut kanan atas a melewati sudut kiri atas b
           a.y < b.y + b.height &&  //Sudut kiri atas a tidak mencapai sudut kiri bawah b 
           a.y + a.height > b.y;    //Sudut kiri bawah a melewati sudut kiri atas b
}