rock.namespace('pong.court');

/**
 * Class representing a ball
 *
 * @param world
 *
 * @constructor
 * @extends pong.court.PongObject
 *
 * @author Luis Alberto Jiménez
 */
pong.court.Ball = function (world) {
    rock.super_(this, [pong.constants.BALL_TYPE, world]);
    this.velocity = null;
    this.angle = null;
};

rock.extends_(pong.court.Ball, pong.court.PongObject);

pong.court.Ball.prototype.move = function (timeVariation) {
    this.moveStraight(timeVariation);
    var bounceOnWall = this.bounceOnWalls();
    var bounceOnRacket = this.bounceOnRackets();

    return bounceOnWall || bounceOnRacket;
};

pong.court.Ball.prototype.moveStraight = function(timeVariation) {
    var velocity = this.velocity;
    var distance = timeVariation * velocity;

    var rad = rock.util.GeometryUtils.degToRad(this.angle);
    var varX = Math.cos(rad) * distance;
    var varZ = Math.sin(rad) * distance;

    var position = this.getPosition();
    position.setX(position.getX() + varX);
    position.setZ(position.getZ() + varZ);
};

pong.court.Ball.prototype.bounceOnWalls = function () {
    var leftWall = this.world.getLeftWall();
    var rightWall = this.world.getRightWall();
    var bounce = false;

    if (this.isMovingLeft()) {
        bounce = leftWall.bounceBallOnRightIfNecessary(this);
    }

    if (this.isMovingRight()) {
        bounce = bounce || rightWall.bounceBallOnLeftIfNecessary(this);
    }

    return bounce;
};

pong.court.Ball.prototype.bounceOnRackets = function () {
    var playerRacket = this.world.getPlayerRacket();
    var opponentRacket = this.world.getOpponentRacket();
    var bounce = false;

    if (this.isMovingTop()) {
        bounce = playerRacket.bounceBallOnBottomIfNecessary(this);
    }

    if (this.isMovingBottom()) {
        bounce = bounce || opponentRacket.bounceBallOnTopIfNecessary(this);
    }

    return bounce;
};

pong.court.Ball.prototype.getOpponentGoalAreaHitPosition = function () {
    var court = this.world;
    var cathetus1 = court.getCourtDepth();
    var cathetus2 = court.getCourtWidth();
    var hypotenuse =  Math.sqrt(Math.pow(cathetus1, 2) + Math.pow(cathetus2, 2));

    var maxDistance = hypotenuse * 1.10; // we add an extra to more secure
    var timeNeeded = maxDistance / this.getVelocity();

    this.moveStraight(timeNeeded);
    var bounceOnWall = this.bounceOnWalls();
    while (bounceOnWall) {
        this.moveStraight(timeNeeded);
        bounceOnWall = this.bounceOnWalls();
    }

    var opponentGoalArea = court.getOpponentGoalArea();
    return this.getBallHitPointWidthAxis(this, this.dynamicBBOX.getZMin(), opponentGoalArea.getDynamicBBOX().getZMax());
};

pong.court.Ball.prototype.isMovingLeft = function () {
    var angle = this.angle;
    return 90 < angle && angle < 270;
};

pong.court.Ball.prototype.isMovingRight = function () {
    var angle = this.angle;
    return (0 < angle && angle < 90) ||
        (270 < angle && angle < 360);
};

pong.court.Ball.prototype.isMovingTop = function () {
    var angle = this.angle;
    return 0 < angle && angle < 180;
};

pong.court.Ball.prototype.isMovingBottom = function () {
    var angle = this.angle;
    return 180 < angle && angle < 360;
};

pong.court.Ball.prototype.initFromBallInfo = function (ball) {
    this.setVelocity(ball.getVelocity());
    this.setAngle(ball.getAngle());
    var position = this.getPosition();
    var ballPosition = ball.getPosition();
    position.setX(ballPosition.getX());
    position.setZ(ballPosition.getZ());
};

/**
 * Get the velocity
 */
pong.court.Ball.prototype.getVelocity = function() {
    return this.velocity;
};

/**
 * Set the velocity
 *
 * @param velocity the value
 */
pong.court.Ball.prototype.setVelocity = function(velocity) {
    this.velocity = velocity;
};

/**
 * Get the angle
 */
pong.court.Ball.prototype.getAngle = function() {
    return this.angle;
};

/**
 * Set the angle
 *
 * @param angle the value
 */
pong.court.Ball.prototype.setAngle = function(angle) {
    this.angle = rock.util.GeometryUtils.normalizeAngle(angle);
};