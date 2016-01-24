rock.namespace('pong.engine');

/**
 * Pong game engine
 *
 * @param {rock.graphics.engine.WebGLGraphicsEngine} graphicsEngine
 *
 * @param {rock.game.Repository} repository
 *
 * @constructor
 * @extends rock.game.engine.GameEngine
 *
 * @author Luis Alberto Jiménez
 */
pong.engine.PongEngine = function (graphicsEngine, repository) {
    var renderEngine = new rock.game.graphics.engine.webgl.RockBasicRenderEngine(graphicsEngine);
    renderEngine.setClearColor(rock.graphics.Color.BLACK.clone());
    var representationAttendant = new pong.engine.RepresentationAttendant(renderEngine, repository);
    rock.super_(this, [renderEngine, representationAttendant]);

    this.CAMERA_POSITION = new rock.geometry.Point3(0, 50, 80);
    this.CAMERA_CENTER = new rock.geometry.Point3(0, 0, 0);
    this.CAMERA_LOOKUP = new rock.geometry.Vector3(0, 1, 0);
    this.FOV = 60;
    this.ZNEAR = 0.1;
    this.ZFAR = 200;

    this.pongState = new pong.engine.PongState();
};

rock.extends_(pong.engine.PongEngine, rock.game.engine.GameEngine);

pong.engine.PongEngine.prototype.prepareGame = function () {
    this.createLighting();
    this.createCamera();
    this.createCourt();
    this.createAdapters();
    this.createRepresentations();
};

pong.engine.PongEngine.prototype.createLighting = function () {
    var directionalLight = new rock.game.graphics.lighting.DirectionalLight();
    directionalLight.setPosition(0, 0, 1);
    directionalLight.setAmbient(255, 255, 255);
    directionalLight.setDiffuse(255, 255, 255);
    directionalLight.setSpecular(255, 255, 255);

    var directionalLighting = new rock.game.graphics.scene.DirectionalLighting();
    directionalLighting.addLight(directionalLight);
    this.lighting = directionalLighting;
};

pong.engine.PongEngine.prototype.createCamera = function () {
    var aspectRatio = this.window.getWindowSystem().getAspectRatio();
    var camera = new rock.game.graphics.scene.Camera(this.CAMERA_POSITION, this.CAMERA_CENTER, this.CAMERA_LOOKUP,
        this.FOV, aspectRatio, this.ZNEAR, this.ZFAR);
    this.camera = camera;
};

pong.engine.PongEngine.prototype.createCourt = function () {
    var court = new pong.court.Court(this);
    this.world = court;
};

pong.engine.PongEngine.prototype.createAdapters = function () {
    this.representationAttendant.createAdapters();
};

pong.engine.PongEngine.prototype.createRepresentations = function () {
    var court = this.world;
    var representationAttendant = this.representationAttendant;

    var ball = court.getBall();
    var ballRepresentation = representationAttendant.createRepresentation(ball);
    ball.setRepresentation(ballRepresentation);

    var playerRacket = court.getPlayerRacket();
    var playerRacketRepresentation = representationAttendant.createRepresentation(playerRacket);
    playerRacket.setRepresentation(playerRacketRepresentation);

    var opponentRacket = court.getOpponentRacket();
    var opponentRacketRepresentation = representationAttendant.createRepresentation(opponentRacket);
    opponentRacket.setRepresentation(opponentRacketRepresentation);

    var leftWall = court.getLeftWall();
    var leftWallRepresentation = representationAttendant.createRepresentation(leftWall);
    leftWall.setRepresentation(leftWallRepresentation);

    var rightWall = court.getRightWall();
    var rightWallRepresentation = representationAttendant.createRepresentation(rightWall);
    rightWall.setRepresentation(rightWallRepresentation);
};

pong.engine.PongEngine.prototype.initGame = function () {
    // Set all game objects initial values
    this.world.prepareGame();
    this.updateScore();
    this.pongState.setResult(rock.game.engine.GameState.IS_RUNNING);
};

pong.engine.PongEngine.prototype.runLogic = function () {
    var pongState = this.pongState;
    pongState.clearEvents();
    var court = this.world;
    court.runLogic(pongState);
    this.processEvents();
    return pongState;
};

pong.engine.PongEngine.prototype.processEvents = function () {
    var pongState = this.pongState;
    var events = pongState.getEvents();
    var i, event, repository, bounceBallAudio, goalAudio, length = events.getLength();
    for (i = 0; i < length; i++) {
        event = events.getValue(i);
        if (event === pong.engine.PongState.BALL_BOUND_EVENT) {
            repository = this.window.getApplication().getRepository();
            bounceBallAudio = repository.getAudio(pong.constants.RES_ID_AUDIO_BOUNCE_BALL);
            bounceBallAudio.play()
        } else if (event === pong.engine.PongState.GOAL_EVENT) {
            this.updateScore();
            repository = this.window.getApplication().getRepository();
            goalAudio = repository.getAudio(pong.constants.RES_ID_AUDIO_GOAL);
            goalAudio.play();
        } else if (event === pong.engine.PongState.PLAYER_WINS_EVENT) {
            pongState.setResult(rock.game.engine.GameState.FINISH_GAME);
            pongState.setWinner(true);
        } else if (event === pong.engine.PongState.PLAYER_LOST_EVENT) {
            pongState.setResult(rock.game.engine.GameState.FINISH_GAME);
            pongState.setWinner(false);
        }
    }
};

pong.engine.PongEngine.prototype.onKeyDown = function (event) {
    var keyCode = event.getKey();
    this.updateMovementOnKeyEvent(keyCode, true);
};

pong.engine.PongEngine.prototype.onKeyUp = function (event) {
    var keyCode = event.getKey();
    this.updateMovementOnKeyEvent(keyCode, false);
};

pong.engine.PongEngine.prototype.updateMovementOnKeyEvent = function (keyCode, isMoving) {
    var court = this.world;

    if (keyCode == 65 || keyCode == 37) {
        // left
        court.setIsMovingPlayerRacketLeft(isMoving);
    } else if (keyCode == 68 || keyCode == 39) {
        // right
        court.setIsMovingPlayerRacketRight(isMoving);
    }
};

pong.engine.PongEngine.prototype.updateScore = function () {
    var court = this.world;
    var playerAnnotation = court.getPlayerAnnotation();
    var opponentAnnotation = court.getOpponentAnnotation();
    this.window.updateScore(playerAnnotation, opponentAnnotation);
};

pong.engine.PongEngine.prototype.onWindowActivate = function (event) {
    this.initGame();
    this.window.start();
};

pong.engine.PongEngine.prototype.onWindowDeactivate = function (event) {
    this.window.stop();
};
