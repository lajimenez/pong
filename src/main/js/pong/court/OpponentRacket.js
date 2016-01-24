rock.namespace('pong.court');

/**
 * Class representing an opponent racket
 *
 * @param world
 *
 * @constructor
 * @extends pong.court.Racket
 *
 * @author Luis Alberto Jiménez
 */
pong.court.OpponentRacket = function (world) {
    rock.super_(this, [world]);

    this.dummyBall = new pong.court.Ball(world);
    this.wasBallMovingTop = false;
    this.expectedOpponentHitPoint = null;
};

rock.extends_(pong.court.OpponentRacket, pong.court.Racket);

pong.court.OpponentRacket.prototype.prepareToKick = function (ball, timeVariation) {
    this.goToHitPoint(ball, timeVariation);
    //this.follow(ball, timeVariation);
};

pong.court.OpponentRacket.prototype.goToHitPoint = function (ball, timeVariation) {
    var expectedOpponentHitPoint, expectedOpponentHitPointX, dynamicBBOX, centerX, margin, canMove, isTouchingWall;
    var dummyBall = this.dummyBall;

    if (ball.isMovingBottom()) {
        // Changed ball direction and is moving ahead to the racket
        if (this.wasBallMovingTop) {
            dummyBall.initFromBallInfo(ball);
            this.expectedOpponentHitPoint = dummyBall.getOpponentGoalAreaHitPosition();
        }

        expectedOpponentHitPoint = this.expectedOpponentHitPoint;
        expectedOpponentHitPointX = expectedOpponentHitPoint.getX();
        dynamicBBOX = this.dynamicBBOX;
        margin = dynamicBBOX.getWidth() / 8;
        centerX = dynamicBBOX.getCenter().getX();

        // This is a restriction to make the opponent a worse player :)
        canMove = ball.getDynamicBBOX().getCenter().getZ() < -15;

        if (centerX < (expectedOpponentHitPointX - margin) && canMove) {
            this.move(timeVariation, false, true);
        } else if (centerX > (expectedOpponentHitPointX + margin) && canMove) {
            this.move(timeVariation, true, false);
        } else {
            this.move(timeVariation, false, false);
        }
    }

    this.wasBallMovingTop = ball.isMovingTop();
};

// This implementation try to follow the ball position
pong.court.OpponentRacket.prototype.follow = function (ball, timeVariation) {
    var ballDynamicBox = ball.getDynamicBBOX();
    var dynamicBBOX = this.dynamicBBOX;
    var ballCenter = ballDynamicBox.getCenter();
    var ballCenterX = ballCenter.getX();
    var ballCenterZ = ballCenter.getZ();
    var centerX = dynamicBBOX.getCenter().getX();

    if (ballCenterZ > -25) {
        return;
    }

    //var intersect = this.intersectWidthAxis(ball);
    var distance = Math.abs(ballCenterX - centerX);
    //if (!intersect && distance > 50) {
    if (distance > (dynamicBBOX.getWidth() / 2)) {
        var moveLeft = false;
        var moveRight = false;

        if (centerX < ballCenterX) {
            moveRight = true;
        } else {
            moveLeft = true;
        }

        this.move(timeVariation, moveLeft, moveRight);
    }
};
