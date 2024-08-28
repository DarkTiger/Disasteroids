var game = new Phaser.Game(1280, 900, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });


var ship;
var bullet;
var bullets;
var bulletTime = 0;
var space;
var asteroidLarge;
var asteroidMedium;
var asteroidSmall;
var asteroids = [];
var lifes = 5;
var life1;
var life2;
var life3;
var life4;
var life5;
var life;
var asteroidsCount;
var rocket;
var rocketAnim;
var explosion;
var emitterIsPlaying = false;
var gameStarted = false;
var buttonEasyStart;
var buttonMediumStart;
var buttonHardStart;
var buttonExit;
var logo;
var firePressed = false;
var shipIsFlamed = false;
var text;
var ufo;
var ufoExist = false;
var ufoCanSpawn = false;

var upKey;
var downKey;
var leftKey;
var rightKey;
var spaceKey;


function preload()
{
    game.load.image('ship', 'assets/sprite/shipNormal.png');
    game.load.image('bullet', 'assets/sprite/rocketBullet.png');
    game.load.image('space', 'assets/sprite/space4.jpg');
    game.load.image('spaceMenu', 'assets/sprite/space3.jpg');
    game.load.image('asteroidLarge', 'assets/sprite/asteroidBig.png');
    game.load.image('asteroidMedium', 'assets/sprite/asteroidMedium.png');
    game.load.image('asteroidSmall', 'assets/sprite/asteroidSmall.png');
    game.load.image('asteroidMedium', 'assets/sprite/asteroidMedium.png');
    game.load.image('asteroidSmall', 'assets/sprite/asteroidSmall.png');
    game.load.image('disasteroids', 'assets/sprite/disasteroids.png');
    game.load.image('victory', 'assets/sprite/victory.png');
    game.load.image('gameover', 'assets/sprite/gameover.png');
    game.load.image('life', 'assets/sprite/shipMini.png');
    game.load.image('shipFlamed', 'assets/sprite/shipFlames.png');
    game.load.image('ufo', 'assets/sprite/ufo.png');

    game.load.spritesheet('explosion', 'assets/spritesheets/explosion.png', 64, 64, 25);
    game.load.spritesheet('buttonEasy', 'assets/spritesheets/buttonPlayEasy.png', 256, 99);
    game.load.spritesheet('buttonMedium', 'assets/spritesheets/buttonPlayMedium.png', 256, 99);
    game.load.spritesheet('buttonHard', 'assets/spritesheets/buttonPlayHard.png', 256, 99);
    game.load.spritesheet('buttonExit', 'assets/spritesheets/buttonExit.png', 64, 25);
}


function create()
{
    game.time.advancedTiming = true;

    game.renderer.clearBeforeRender = false;
    game.renderer.roundPixels = true;

    game.physics.startSystem(Phaser.Physics.ARCADE);

    upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    mainMenu();
}


function mainMenu()
{
    game.add.tileSprite(0, 0, game.width, game.height, 'spaceMenu');

    ufoCanSpawn = false;
    lifes = 5;

    createAsteroids(15);
    
    logo = game.add.sprite(game.width / 2 - 640, 0, 'disasteroids');
    
    buttonEasyStart = game.add.button(game.width / 2 - 128, 405, 'buttonEasy', function () { startGame(1) }, this, 1, 0, 1);
    buttonMediumStart = game.add.button(game.width / 2 - 128, 535, 'buttonMedium', function () { startGame(2) }, this, 1, 0, 1);
    buttonHardStart = game.add.button(game.width / 2 - 128, 665, 'buttonHard', function () { startGame(3) }, this, 1, 0, 1);
}


function createAsteroids(number)
{
    for (var i = 0; i < number; i++)
    {
        var x = 640, y = 450;
       
        while (x > 540 && x < 740 && y > 350 && y < 550)
        {
            x = Math.floor(Math.random() * game.width);
            y = Math.floor(Math.random() * game.height);
        }
        
        asteroidLarge = game.add.sprite(x, y, 'asteroidLarge');
        asteroidLarge.anchor.set(0.5);

        game.physics.enable(asteroidLarge, Phaser.Physics.ARCADE);
        asteroidLarge.body.drag.set(0);
        asteroidLarge.body.maxVelocity.set(300);

        var rotSpeed = Math.floor(Math.random() * 20);
        var speed = Math.floor(Math.random() * 100);
        var angle = Math.floor(Math.random() * 360, +1);

        asteroidLarge.body.angularVelocity = rotSpeed;

        asteroidLarge.body.velocity.x = game.rnd.integerInRange(-speed, speed);
        asteroidLarge.body.velocity.y = game.rnd.integerInRange(-speed, speed);

        asteroids[i] = asteroidLarge;
    }
}


function startGame(index)
{
    game.add.tileSprite(0, 0, game.width, game.height, 'space');

    for (var i = 0; i < asteroids.length; i++)
    {
        asteroids[i].kill();
    }

    asteroids = [];
    
    logo.kill();
    buttonEasyStart.kill();
    buttonMediumStart.kill();
    buttonHardStart.kill();

    buttonExit = game.add.button(game.width - 80, 10, 'buttonExit', function () { gameStarted = false; game.state.restart(); }, this, 1, 0, 1);

    ship = game.add.sprite(game.width / 2, game.height / 2, 'ship');
    ship.anchor.set(0.5);

    game.physics.enable(ship, Phaser.Physics.ARCADE);

    ship.body.drag.set(100);
    ship.body.maxVelocity.set(300);

    life1 = game.add.sprite(10, 10, 'life');
    life2 = game.add.sprite(40, 10, 'life');
    life3 = game.add.sprite(70, 10, 'life');
    life4 = game.add.sprite(100, 10, 'life');
    life5 = game.add.sprite(130, 10, 'life');

    if (index == 1)
    {
        asteroidsCount = 5;
    }
    else if (index == 2)
    {
        asteroidsCount = 10;
    }
    else if (index == 3)
    {
        asteroidsCount = 20;
    }
    createAsteroids(asteroidsCount);
        
    gameStarted = true;
}


function update()
{
    if (gameStarted)
    {
        if (asteroidsCount == 0)
        {
            gameStarted = false;
            ship.kill();
            var victory = game.add.sprite(0, 250, 'victory');
        }

        if (lifes == 0)
        {
            gameStarted = false;
            ship.kill();
            var gameover = game.add.sprite(0, 250, 'gameover');
        }

        game.physics.arcade.collide(ship, asteroids, shipDestroy, null, this);
        game.physics.arcade.collide(bullet, asteroids, asteroidDestroy, null, this);


        if (leftKey.isDown)
        {
            ship.body.angularVelocity = -200;
        }
        else if (rightKey.isDown)
        {
            ship.body.angularVelocity = 200;
        }
        else
        {
            ship.body.angularVelocity = 0;
        }
    
        if (upKey.isDown)
        {
            game.physics.arcade.accelerationFromRotation(ship.rotation, 250, ship.body.acceleration);

            if (!shipIsFlamed)
            {
                shipIsFlamed = true;
                ship.loadTexture('shipFlamed', 0);
            }
        }
        else if (downKey.isDown)
        {
            game.physics.arcade.accelerationFromRotation(ship.rotation, -100, ship.body.acceleration);
        }
        else
        {
            if (shipIsFlamed)
            {
                shipIsFlamed = false;
                ship.loadTexture('ship', 0);
            }
            
            ship.body.acceleration.set(0);
        }

        if (spaceKey.isDown && !firePressed)
        {
            fireBullet();
            firePressed = true;
        }
        else if (!spaceKey.isDown)
        {
            firePressed = false;
        }
        
        screenWrap(ship);
        game.world.wrap(ship, 32);
    }


    if (ufoCanSpawn)
    {
        ufoCanSpawn = false;
        setTimeout(function () { createUfo(); }, 50000);
    }

    if (ufoExist)
    {
        game.physics.arcade.collide(bullet, ufo, ufoDestroy, null, this);
        screenWrap(ufo);
        game.world.wrap(ufo, 16);
    }

    asteroids.forEach(screenWrap, this);
    game.world.wrap(asteroidLarge, 64);
}


function fireBullet()
{
    if (game.time.now > bulletTime)
    {
        bullet = game.add.sprite(ship.body.x + 29, ship.body.y + 19, 'bullet');
        bullet.anchor.set(0.5);

        game.physics.enable(bullet, Phaser.Physics.ARCADE);
        bullet.body.drag.set(0);
        bullet.enableBody = true;

        bullet.lifespan = 2000;
        bullet.rotation = ship.rotation;
        game.physics.arcade.velocityFromRotation(ship.rotation, 500, bullet.body.velocity);
        bulletTime = game.time.now + 1000;
    }
}


function createUfo()
{
    ufoExist = true;
    ufoCanSpawn = false;

    ufo = game.add.sprite(0, Math.floor(Math.random(game.width)), 'ufo');
    ufo.anchor.set(0.5);

    game.physics.enable(ufo, Phaser.Physics.ARCADE);
    ufo.body.drag.set(0);
    ufo.body.maxVelocity.set(300);

    ufo.body.velocity.x = game.rnd.integerInRange(-150, 150);
    ufo.body.velocity.y = game.rnd.integerInRange(-150, 150);

    ufo.lifespan = 10000;
    setTimeout(function () { ufo.kill(); ufoExist = false; }, 10000);

    if (ufoCanSpawn)
    {
        setTimeout(function () { createUfo(); }, 50000);
    }
}


function shipDestroy(ship, asteroid)
{
    explosion = game.add.sprite(ship.body.x + 29, ship.body.y + 19, 'explosion', 40);
    explosion.anchor.set(0.5);
    explosionAnim = explosion.animations.add('explosion');
    explosionAnim.play(40, false, true);

    lifes--;

    if (lifes < 5 && lifes > 0)
    {
        ufoCanSpawn = true;
    }

    ship.kill();

    changeLifes();

    if (lifes > 0)
    {
        setTimeout(function () { shipSpawn(); }, 2000);
    }
}


function changeLifes()
{
    life1.kill();
    life2.kill();
    life3.kill();
    life4.kill();
    life5.kill();
    
    if (lifes == 5)
    {
        life1.reset(10, 10);
        life2.reset(40, 10);
        life3.reset(70, 10);
        life4.reset(100, 10);
        life5.reset(130, 10);
    }
    else if (lifes == 4)
    {
        life1.reset(10, 10);
        life2.reset(40, 10);
        life3.reset(70, 10);
        life4.reset(100, 10);
    }
    else if (lifes == 3)
    {
        life1.reset(10, 10);
        life2.reset(40, 10);
        life3.reset(70, 10);
    }
    else if (lifes == 2)
    {
        life1.reset(10, 10);
        life2.reset(40, 10);
    }
    else if (lifes == 1)
    {
        life1.reset(10, 10);
    }
}


function shipSpawn()
{
    var positionIsEmpty = false;
    var x, y;

    while (!positionIsEmpty || x < 200 || x > 1080 || y < 200 || y > 700)
    {
        x = Math.floor(Math.random() * game.width - 200, +200);
        y = Math.floor(Math.random() * game.height - 200, +200);

        if (x < 0)
        {
            x *= -1;
        }

        if (y < 0)
        {
            y *= -1;
        }

        for (var i = 0; i < asteroids.length; i++)
        {
            positionIsEmpty = true;

            if (asteroids[i].x > x - 200 && asteroids[i].x < x + 200 && asteroids[i].y > x - 200 && asteroids[i].y < x + 200)
            {
                positionIsEmpty = false;
                break;
            }
        }
    }

    ship.reset(x, y);
}


function asteroidDestroy(bullet, asteroid)
{
    explosion = game.add.sprite(bullet.x, bullet.y, 'explosion', 40);
    explosion.anchor.set(0.5);
    explosionAnim = explosion.animations.add('explosion');
    explosionAnim.play(40, false, true);

    bullet.kill();

    /*explosion = game.add.sprite(asteroid.x, asteroid.y, 'explosion', 40);
    explosion.anchor.set(0.5);
    explosionAnim = explosion.animations.add('explosion');
    explosionAnim.play(40, false, true);*/

    var newAsteroid = null;
    var newAsteroidType = "";
    var newAsteroidSpeed = 0;
    var newAsteroidRotSpeed = 0;

    if (asteroid.key == "asteroidLarge")
    {
        newAsteroidType = "asteroidMedium";
        newAsteroidSpeed = 200;
        newAsteroidRotSpeed = 50;
    }
    else if (asteroid.key == "asteroidMedium")
    {
        newAsteroidType = "asteroidSmall";
        newAsteroidSpeed = 250;
        newAsteroidRotSpeed = 100;
    }
        
    for (var i = 0; i < asteroids.length; i++)
    {
        if (asteroid.x == asteroids[i].x && asteroid.y == asteroids[i].y)
        {
            asteroids.splice(i, 1);
            break;
        }
    }
    asteroidsCount--;


    if (asteroid.key != "asteroidSmall")
    {
        for (var i = 0; i < 2; i++)
        {
            newAsteroid = game.add.sprite(asteroid.x, asteroid.y, newAsteroidType);
            newAsteroid.anchor.set(0.5);

            game.physics.enable(newAsteroid, Phaser.Physics.ARCADE);
            newAsteroid.body.drag.set(0);
            newAsteroid.body.maxVelocity.set(300);

            var rotSpeed = Math.floor(Math.random() * newAsteroidRotSpeed);
            var speed = Math.floor(Math.random() * newAsteroidSpeed);
            var angle = Math.floor(Math.random() * 360, +1);

            newAsteroid.body.angularVelocity = rotSpeed;

            newAsteroid.body.velocity.x = game.rnd.integerInRange(-speed, speed);
            newAsteroid.body.velocity.y = game.rnd.integerInRange(-speed, speed);

            asteroids.push(newAsteroid);

            asteroidsCount += 1;
        }
    }
    
    asteroid.kill();
}

function ufoDestroy(bullet, ufo)
{
    explosion = game.add.sprite(bullet.x, bullet.y, 'explosion', 40);
    explosion.anchor.set(0.5);
    explosionAnim = explosion.animations.add('explosion');
    explosionAnim.play(40, false, true);

    bullet.kill();

    explosion = game.add.sprite(ufo.x, ufo.y, 'explosion', 20);
    explosion.anchor.set(0.5);
    explosionAnim = explosion.animations.add('explosion');
    explosionAnim.play(30, false, true);

    ufo.kill();

    lifes++;

    changeLifes();

    if (lifes < 5 && lifes > 0)
    {
        ufoCanSpawn = true;
    }
}


function screenWrap(sprite)
{
    if (sprite.x < 0)
    {
        sprite.x = game.width;
    }
    else if (sprite.x > game.width)
    {
        sprite.x = 0;
    }

    if (sprite.y < 0)
    {
        sprite.y = game.height;
    }
    else if (sprite.y > game.height)
    {
        sprite.y = 0;
    }
}


function render()
{
    if (gameStarted)
    {
        game.debug.text("Asteroidi: " + asteroidsCount, 200, 32);
        game.debug.text("by daniele.franceschini@live.it", game.width/2 - 120, 32);
        game.debug.text("FPS: " + game.time.fps, game.width - 180, 32);
    }
}