rock.namespace('pong.court');

/**
 * Class representing a racket
 *
 * @param world
 *
 * @constructor
 * @extends pong.court.PongObject
 *
 * @author Luis Alberto Jiménez
 */
pong.court.Racket = function (world) {
    rock.super_(this, [pong.constants.RACKET_TYPE, world]);

    this.MAX_DIFFERENCE = 500; // milliseconds
    this.MAX_ANGLE_VARIATION = 45; // degrees

    this.velocity = null;
    this.movingLeft = false;
    this.movingRight = false;
    this.startingMovingTime = null;
};

rock.extends_(pong.court.Racket, pong.court.PongObject);

pong.court.Racket.prototype.resetMovement = function () {
    this.movingLeft = false;
    this.movingRight = false;
    this.startingMovingTime = null;
};

pong.court.Racket.prototype.move = function (timeVariation, moveLeft, moveRight) {
    if (!this.updateMovement(moveLeft, moveRight)) {
        return;
    }

    var velocity = this.velocity;
    var distance = timeVariation * velocity;
    if (moveLeft) {
        distance = -distance;
    }

    var position = this.position;
    var currentX = position.getX();
    position.setX(currentX + distance);

    this.adjustPosition()
};

pong.court.Racket.prototype.isMoving = function () {
    return this.movingLeft || this.movingRight;
};

pong.court.Racket.prototype.adjustPosition = function () {
    var leftWall = this.world.getLeftWall();
    var rightWall = this.world.getRightWall();

    if (leftWall.isPongObjectOnLeft(this)) {
        leftWall.adjustPongObjectToLeft(this);
    }

    if (rightWall.isPongObjectOnRight(this)) {
        rightWall.adjustPongObjectToRight(this);
    }
};

/**
 *
 * @param moveLeft
 * @param moveRight
 *
 * @return {Boolean} return if the racket must move
 */
pong.court.Racket.prototype.updateMovement = function (moveLeft, moveRight) {
    if (moveLeft && moveRight || !(moveLeft || moveRight)) {
        this.movingLeft = false;
        this.movingRight = false;
        return false;
    }

    // Direction changed
    if (!(this.movingLeft && moveLeft || this.movingRight && moveRight)) {
        this.startingMovingTime = Date.now();
    }

    this.movingLeft = moveLeft;
    this.movingRight = moveRight;

    if (!this.isMoving()) {
        return false;
    }

    if (moveLeft) {
        this.movingLeft = true;
    }

    if (moveRight) {
        this.movingRight = true;
    }

    return true;
};

pong.court.Racket.prototype.bounceBallOnTopIfNecessary = function (ball) {
    var bounce = false;
    if (this.isPongObjectOnBottom(ball)) {
        bounce = this.bounceBallOnTop(ball);
        if (bounce && this.isMoving() && !this.isTouchingWall()) {
            this.adjustBallAfterBounce(ball);
        }
    }
    return bounce;
};

pong.court.Racket.prototype.bounceBallOnBottomIfNecessary = function (ball) {
    var bounce = false;
    if (this.isPongObjectOnTop(ball)) {
        bounce = this.bounceBallOnBottom(ball);
        if (bounce && this.isMoving() && !this.isTouchingWall()) {
            this.adjustBallAfterBounce(ball);
        }
    }
    return bounce;
};

pong.court.Racket.prototype.adjustBallAfterBounce = function (ball) {
    var startingMovingTime = this.startingMovingTime;
    var MAX_DIFFERENCE = this.MAX_DIFFERENCE;
    var movingRight = this.movingRight;
    var movingLeft = this.movingLeft;
    var now = Date.now();
    var difference = now - startingMovingTime;

    if (difference > MAX_DIFFERENCE) {
        difference = MAX_DIFFERENCE;
    }

    var angleDifference = (difference * this.MAX_ANGLE_VARIATION) / MAX_DIFFERENCE;
    var angle = ball.getAngle();
    var newAngle = 0;

    if (180 <= angle && angle < 360) {
        if (movingRight) {
            newAngle = angle + angleDifference;
        } else if (movingLeft) {
            newAngle = angle - angleDifference;
        }

        // We have to assure that ball direction (up/down) doesn't change
        if (newAngle >= 360) {
            newAngle = 359;
        }

        if (newAngle <= 180) {
            newAngle = 181;
        }
    }

    if (0 <= angle && angle < 180) {
        if (movingRight) {
            newAngle = angle - angleDifference;
        } else if (movingLeft) {
            newAngle = angle + angleDifference;
        }

        // We have to assure that ball direction (up/down) doesn't change
        if (newAngle >= 180) {
            newAngle = 179;
        }

        if (newAngle <= 0) {
            newAngle = 1;
        }
    }

    newAngle = this.adjustAngleMustMoveUpperOrDown(newAngle);
    ball.setAngle(newAngle);
};

pong.court.Racket.prototype.adjustAngleMustMoveUpperOrDown = function (angle) {
    var MINIMAL_ANGLE = 15;
    var _180_LESS_MINIMAL = 180 - MINIMAL_ANGLE;
    var _180_PLUS_MINIMAL = 180 + MINIMAL_ANGLE;
    var _360_LESS_MINIMAL = 360 - MINIMAL_ANGLE;

    var newAngle = angle;

    if (0 <= newAngle && newAngle < MINIMAL_ANGLE) {
        newAngle = MINIMAL_ANGLE;
    }

    if (_180_LESS_MINIMAL < newAngle && newAngle <= 180) {
        newAngle = _180_LESS_MINIMAL;
    }

    if (180 <= newAngle && newAngle < _180_PLUS_MINIMAL) {
        newAngle = _180_PLUS_MINIMAL;
    }

    if (_360_LESS_MINIMAL < newAngle && newAngle <= 360) {
        newAngle = _360_LESS_MINIMAL;
    }

    return newAngle;
};

pong.court.Racket.prototype.isTouchingWall = function () {
    var court = this.world;
    var dynamicBBOX = this.dynamicBBOX;
    var leftWallDynamicBBOX = court.getLeftWall().getDynamicBBOX();
    var rightWallDynamicBBOX = court.getRightWall().getDynamicBBOX();

    if (dynamicBBOX.getXMin() == leftWallDynamicBBOX.getXMax()) {
        return true;
    }
    if (dynamicBBOX.getXMax() == rightWallDynamicBBOX.getXMin()) {
        return true;
    }

    return false;

};

/**
 * Get the velocity
 */
pong.court.Racket.prototype.getVelocity = function() {
    return this.velocity;
};

/**
 * Set the velocity
 *
 * @param velocity the value
 */
pong.court.Racket.prototype.setVelocity = function(velocity) {
    this.velocity = velocity;
};