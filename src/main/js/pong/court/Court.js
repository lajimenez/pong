rock.namespace('pong.court');

/**
 * Class representing the court
 *
 * @param {rock.game.engine.GameEngine} gameEngine
 *
 * @constructor
 * @extends rock.game.universe.World
 *
 * @author Luis Alberto Jiménez
 */
pong.court.Court = function (gameEngine) {
    rock.super_(this, arguments);

    this.ball = null;

    this.playerRacket = null;
    this.opponentRacket = null;

    this.leftWall = null;
    this.rightWall = null;

    this.playerGoalArea = null;
    this.opponentGoalArea = null;

    this.isMovingPlayerRacketLeft = false;
    this.isMovingPlayerRacketRight = false;

    // all times are milliseconds
    this.lastTime = null;
    this.currentTime = null;
    this.timeVariation = -1;

    this.PLAYER_RACKET_VELOCITY = 0.045; // 3d units / milliseconds (WTF!!!)
    this.OPPONENT_RACKET_VELOCITY = 0.03; // 3d units / milliseconds
    this.BALL_VELOCITY = 0.05; // 3d units / milliseconds

    this.WALL_DEPTH = 100;
    this.RACKET_WIDTH = 10;
    this.DEFAULT_SIZE_VALUE = 1;

    this.COURT_WIDTH = 60;
    this.COURT_DEPTH = this.WALL_DEPTH;

    this.playerAnnotation = 0;
    this.opponentAnnotation = 0;

    this.MAX_ANNOTATION = 3;

    this.CELEBRATION_TIME = 2300; //milliseconds

    this.createPongObjects();
};

rock.extends_(pong.court.Court, rock.game.universe.World);

pong.court.Court.NO_WINNER = 0;

pong.court.Court.PLAYER_WINNER = 1;

pong.court.Court.OPPONENT_WINNER = 2;

pong.court.Court.prototype.createPongObjects = function () {
    var WALL_DEPTH = this.WALL_DEPTH;
    var RACKET_WIDTH = this.RACKET_WIDTH;
    var DEFAULT_SIZE_VALUE = this.DEFAULT_SIZE_VALUE;
    var COURT_WIDTH = this.COURT_WIDTH;

    var ball = new pong.court.Ball(this);
    ball.setVelocity(this.BALL_VELOCITY);
    ball.setDynamicBBOXWidthHeightDepth(DEFAULT_SIZE_VALUE, DEFAULT_SIZE_VALUE ,DEFAULT_SIZE_VALUE);

    var playerRacket = new pong.court.Racket(this);
    playerRacket.setVelocity(this.PLAYER_RACKET_VELOCITY);
    playerRacket.setDynamicBBOXWidthHeightDepth(RACKET_WIDTH, DEFAULT_SIZE_VALUE ,DEFAULT_SIZE_VALUE);

    var opponentRacket = new pong.court.OpponentRacket(this);
    opponentRacket.setVelocity(this.OPPONENT_RACKET_VELOCITY);
    opponentRacket.setDynamicBBOXWidthHeightDepth(RACKET_WIDTH, DEFAULT_SIZE_VALUE ,DEFAULT_SIZE_VALUE);

    var leftWall = new pong.court.Wall(this);
    leftWall.setDynamicBBOXWidthHeightDepth(DEFAULT_SIZE_VALUE, DEFAULT_SIZE_VALUE ,WALL_DEPTH);

    var rightWall = new pong.court.Wall(this);
    rightWall.setDynamicBBOXWidthHeightDepth(DEFAULT_SIZE_VALUE, DEFAULT_SIZE_VALUE ,WALL_DEPTH);

    var playerGoalArea = new pong.court.GoalArea(this);
    playerGoalArea.setDynamicBBOXWidthHeightDepth(COURT_WIDTH, DEFAULT_SIZE_VALUE ,DEFAULT_SIZE_VALUE);

    var opponentGoalArea = new pong.court.GoalArea(this);
    opponentGoalArea.setDynamicBBOXWidthHeightDepth(COURT_WIDTH, DEFAULT_SIZE_VALUE ,DEFAULT_SIZE_VALUE);

    this.ball = ball;
    this.playerRacket = playerRacket;
    this.opponentRacket = opponentRacket;
    this.leftWall = leftWall;
    this.rightWall = rightWall;
    this.playerGoalArea = playerGoalArea;
    this.opponentGoalArea = opponentGoalArea;

    this.hasScored = false;
    this.scoreTime = null;
};

pong.court.Court.prototype.prepareGame = function () {
    this.resetAnnotation();
    this.resetGameObjects();
    this.resetTimes();
    this.resetMovement();
};

pong.court.Court.prototype.resetAnnotation = function () {
    this.playerAnnotation = 0;
    this.opponentAnnotation = 0;
};

pong.court.Court.prototype.resetGameObjects = function () {
    var HALF_COURT_DEPTH = this.COURT_DEPTH / 2;
    var HALF_COURT_WIDTH = this.COURT_WIDTH / 2;
    var HALF_DEFAULT_SIZE_VALUE = this.DEFAULT_SIZE_VALUE / 2;

    var racketCenterDistance = HALF_COURT_DEPTH + HALF_DEFAULT_SIZE_VALUE;
    var wallCenterDistance = HALF_COURT_WIDTH + HALF_DEFAULT_SIZE_VALUE;
    var goalAreaCenterDistance = HALF_COURT_DEPTH + HALF_DEFAULT_SIZE_VALUE;

    this.resetBall();

    var playerRacket = this.getPlayerRacket();
    playerRacket.setDynamicBBOXCenter(0, 0, racketCenterDistance);

    var opponentRacket = this.getOpponentRacket();
    opponentRacket.setDynamicBBOXCenter(0, 0, -racketCenterDistance);

    var leftWall = this.getLeftWall();
    leftWall.setDynamicBBOXCenter(-wallCenterDistance, 0, 0);

    var rightWall = this.getRightWall();
    rightWall.setDynamicBBOXCenter(wallCenterDistance, 0, 0);

    var playerGoalArea = this.getPlayerGoalArea();
    playerGoalArea.setDynamicBBOXCenter(0, 0, goalAreaCenterDistance);

    var opponentGoalArea = this.getOpponentGoalArea();
    opponentGoalArea.setDynamicBBOXCenter(0, 0, -goalAreaCenterDistance);
};

pong.court.Court.prototype.resetBall = function () {
    var ball = this.getBall();
    ball.setDynamicBBOXCenter(1, 0, 0);
    var angle = rock.util.JsUtils.getRandomNumber(70, 110);
    ball.setAngle(angle);

    this.hasScored = false;
};

pong.court.Court.prototype.resetTimes = function () {
    this.lastTime = null;
    this.currentTime = null;
    this.timeVariation = -1;
};

pong.court.Court.prototype.resetMovement = function () {
    this.isMovingPlayerRacketLeft = false;
    this.isMovingPlayerRacketRight = false;
};

pong.court.Court.prototype.runLogic = function (gameState) {
    this.updateTime();
    if (!this.isCelebrating(gameState)) {
        this.updatePlayerRacket();
        this.updateOpponentRacket();
        this.updateBall(gameState);
        this.isGoal(gameState);
    }
};

pong.court.Court.prototype.updateTime = function () {
    // Update the lastTime. The value will be the old currentTime
    this.lastTime = this.currentTime;

    var currentTime = Date.now();
    if (this.lastTime == null) {
        this.lastTime = currentTime;
    }

    this.timeVariation = currentTime - this.lastTime;
    this.currentTime = currentTime;
};

pong.court.Court.prototype.updatePlayerRacket = function () {
    this.playerRacket.move(this.timeVariation, this.isMovingPlayerRacketLeft, this.isMovingPlayerRacketRight);
};

pong.court.Court.prototype.updateOpponentRacket = function () {
    this.opponentRacket.prepareToKick(this.ball, this.timeVariation);
};

pong.court.Court.prototype.updateBall = function (gameState) {
    var bounce = this.ball.move(this.timeVariation);
    if (bounce) {
        gameState.getEvents().addValue(pong.engine.PongState.BALL_BOUND_EVENT);
    }
};

pong.court.Court.prototype.isGoal = function (gameState) {
    var ball = this.ball;
    var goal = false;
    if (this.playerGoalArea.hasScoredGoalBottom(ball)) {
        this.opponentAnnotation++;
        goal = true;
    }
    if (this.opponentGoalArea.hasScoredGoalTop(ball)) {
        this.playerAnnotation++;
        goal = true;
    }

    if (goal) {
        gameState.getEvents().addValue(pong.engine.PongState.GOAL_EVENT);
        this.hasScored = true;
        this.scoreTime = Date.now();
    }
};

pong.court.Court.prototype.isCelebrating = function (gameState) {
    var hasScored = this.hasScored;
    var now;
    if (!hasScored) {
        return false;
    } else {
        now = Date.now();
        if (now - this.scoreTime > this.CELEBRATION_TIME) {
            // Celebration has finished
            this.resetBall();
            this.checkWinner(gameState);
            this.hasScored = false;
            return false;
        }
        return true;
    }
};

pong.court.Court.prototype.checkWinner = function (gameState) {
    var winner = this.getWinner();

    if (winner === pong.court.Court.PLAYER_WINNER) {
        gameState.getEvents().addValue(pong.engine.PongState.PLAYER_WINS_EVENT);
    } else if (winner === pong.court.Court.OPPONENT_WINNER) {
        gameState.getEvents().addValue(pong.engine.PongState.PLAYER_LOST_EVENT);
    }
};

pong.court.Court.prototype.getWinner = function () {
    var MAX_ANNOTATION = this.MAX_ANNOTATION;
    if (this.playerAnnotation == MAX_ANNOTATION) {
        return pong.court.Court.PLAYER_WINNER;
    }

    if (this.opponentAnnotation == MAX_ANNOTATION) {
        return pong.court.Court.OPPONENT_WINNER;
    }

    return pong.court.Court.NO_WINNER;
};

/**
 * Get the ball
 */
pong.court.Court.prototype.getBall = function() {
    return this.ball;
};

/**
 * Set the ball
 *
 * @param ball the value
 */
pong.court.Court.prototype.setBall = function(ball) {
    this.ball = ball;
};

/**
 * Get the playerRacket
 */
pong.court.Court.prototype.getPlayerRacket = function() {
    return this.playerRacket;
};

/**
 * Set the playerRacket
 *
 * @param playerRacket the value
 */
pong.court.Court.prototype.setPlayerRacket = function(playerRacket) {
    this.playerRacket = playerRacket;
};

/**
 * Get the opponentRacket
 */
pong.court.Court.prototype.getOpponentRacket = function() {
    return this.opponentRacket;
};

/**
 * Set the opponentRacket
 *
 * @param opponentRacket the value
 */
pong.court.Court.prototype.setOpponentRacket = function(opponentRacket) {
    this.opponentRacket = opponentRacket;
};

/**
 * Get the leftWall
 */
pong.court.Court.prototype.getLeftWall = function() {
    return this.leftWall;
};

/**
 * Set the leftWall
 *
 * @param leftWall the value
 */
pong.court.Court.prototype.setLeftWall = function(leftWall) {
    this.leftWall = leftWall;
};

/**
 * Get the rightWall
 */
pong.court.Court.prototype.getRightWall = function() {
    return this.rightWall;
};

/**
 * Set the rightWall
 *
 * @param rightWall the value
 */
pong.court.Court.prototype.setRightWall = function(rightWall) {
    this.rightWall = rightWall;
};

/**
 * Get the playerGoalArea
 */
pong.court.Court.prototype.getPlayerGoalArea = function() {
    return this.playerGoalArea;
};

/**
 * Set the playerGoalArea
 *
 * @param playerGoalArea the value
 */
pong.court.Court.prototype.setPlayerGoalArea = function(playerGoalArea) {
    this.playerGoalArea = playerGoalArea;
};

/**
 * Get the opponentGoalArea
 */
pong.court.Court.prototype.getOpponentGoalArea = function() {
    return this.opponentGoalArea;
};

/**
 * Set the opponentGoalArea
 *
 * @param opponentGoalArea the value
 */
pong.court.Court.prototype.setOpponentGoalArea = function(opponentGoalArea) {
    this.opponentGoalArea = opponentGoalArea;
};

/**
 * Get the isMovingPlayerRacketLeft
 */
pong.court.Court.prototype.getIsMovingPlayerRacketLeft = function() {
    return this.isMovingPlayerRacketLeft;
};

/**
 * Set the isMovingPlayerRacketLeft
 *
 * @param isMovingPlayerRacketLeft the value
 */
pong.court.Court.prototype.setIsMovingPlayerRacketLeft = function(isMovingPlayerRacketLeft) {
    this.isMovingPlayerRacketLeft = isMovingPlayerRacketLeft;
};

/**
 * Get the isMovingPlayerRacketRight
 */
pong.court.Court.prototype.getIsMovingPlayerRacketRight = function() {
    return this.isMovingPlayerRacketRight;
};

/**
 * Set the isMovingPlayerRacketRight
 *
 * @param isMovingPlayerRacketRight the value
 */
pong.court.Court.prototype.setIsMovingPlayerRacketRight = function(isMovingPlayerRacketRight) {
    this.isMovingPlayerRacketRight = isMovingPlayerRacketRight;
};

/**
 * Get the playerAnnotation
 */
pong.court.Court.prototype.getPlayerAnnotation = function() {
    return this.playerAnnotation;
};

/**
 * Get the opponentAnnotation
 */
pong.court.Court.prototype.getOpponentAnnotation = function() {
    return this.opponentAnnotation;
};

/**
 * Get court width
 */
pong.court.Court.prototype.getCourtWidth = function() {
    return this.COURT_WIDTH;
};

/**
 * Get court depth
 */
pong.court.Court.prototype.getCourtDepth = function() {
    return this.COURT_DEPTH;
};