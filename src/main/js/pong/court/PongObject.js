rock.namespace('pong.court');

/**
 * Class representing a generic pong object
 *
 * Top -> Big Z
 * Right -> Big X
 *
 * @param type
 * @param world
 *
 * @constructor
 * @abstract
 * @extends rock.game.universe.Object
 *
 * @author Luis Alberto Jiménez
 */
pong.court.PongObject = function (type, world) {
    rock.super_(this, [type, world]);
    this.dynamicBBOX = new pong.geometry.DynamicBBOX(this.position, 1, 1 ,1);

    this.point3_ma = new rock.geometry.Point3();
};

rock.extends_(pong.court.PongObject, rock.game.universe.Object);

pong.court.PongObject.prototype.adjustXMin = function (xMin) {
    this.dynamicBBOX.adjustXMin(xMin);
};

pong.court.PongObject.prototype.adjustXMax = function (xMax) {
    this.dynamicBBOX.adjustXMax(xMax);
};

pong.court.PongObject.prototype.isPongObjectOnLeft = function (pongObject) {
    var xLimit = this.dynamicBBOX.getXMax();
    var positionX = pongObject.getDynamicBBOX().getXMin();

    return positionX < xLimit;
};

pong.court.PongObject.prototype.isPongObjectOnRight = function (pongObject) {
    var xLimit = this.dynamicBBOX.getXMin();
    var positionX = pongObject.getDynamicBBOX().getXMax();

    return positionX > xLimit;
};

pong.court.PongObject.prototype.isPongObjectOnTop = function (pongObject) {
    var ZLimit = this.dynamicBBOX.getZMin();
    var positionZ = pongObject.getDynamicBBOX().getZMax();

    return positionZ > ZLimit;
};

pong.court.PongObject.prototype.isPongObjectOnBottom = function (pongObject) {
    var zLimit = this.dynamicBBOX.getZMax();
    var positionZ = pongObject.getDynamicBBOX().getZMin();

    return positionZ < zLimit;
};

pong.court.PongObject.prototype.adjustPongObjectToLeft = function (pongObject) {
    pongObject.adjustXMin(this.dynamicBBOX.getXMax());
};

pong.court.PongObject.prototype.adjustPongObjectToRight = function (pongObject) {
    pongObject.adjustXMax(this.dynamicBBOX.getXMin());
};

pong.court.PongObject.prototype.bounceBallOnRight = function (ball) {
    var ballBBOX = ball.getDynamicBBOX();
    var hitPoint = this.getBallHitPointDepthAxis(ball, ballBBOX.getXMin(), this.dynamicBBOX.getXMax());

    var halfBallDepth = ballBBOX.getDepth() / 2;
    var ballZMinOnHitPoint = hitPoint.getZ() - halfBallDepth;
    var ballZMaxOnHitPoint = hitPoint.getZ() + halfBallDepth;

    if (!this.intersectDepthAxisWithRange(ballZMinOnHitPoint, ballZMaxOnHitPoint)) {
        return false;
    }

    var ballPosition = ball.getPosition();
    ballPosition.setX(hitPoint.getX() + ballBBOX.getWidth() / 2);
    ballPosition.setZ(hitPoint.getZ());

    ball.setAngle(this.getBallBounceAngleDepthAxis(ball));
    return true;
};

pong.court.PongObject.prototype.bounceBallOnLeft = function (ball) {
    var ballBBOX = ball.getDynamicBBOX();
    var hitPoint = this.getBallHitPointDepthAxis(ball, ballBBOX.getXMax(), this.dynamicBBOX.getXMin());

    var halfBallDepth = ballBBOX.getDepth() / 2;
    var ballZMinOnHitPoint = hitPoint.getZ() - halfBallDepth;
    var ballZMaxOnHitPoint = hitPoint.getZ() + halfBallDepth;

    if (!this.intersectDepthAxisWithRange(ballZMinOnHitPoint, ballZMaxOnHitPoint)) {
        return false;
    }

    var ballPosition = ball.getPosition();
    ballPosition.setX(hitPoint.getX() - ballBBOX.getWidth() / 2);
    ballPosition.setZ(hitPoint.getZ());

    ball.setAngle(this.getBallBounceAngleDepthAxis(ball));
    return true;
};

pong.court.PongObject.prototype.bounceBallOnTop = function (ball) {
    var ballBBOX = ball.getDynamicBBOX();
    var hitPoint = this.getBallHitPointWidthAxis(ball, ballBBOX.getZMin(), this.dynamicBBOX.getZMax());

    var halfBallWidth = ballBBOX.getWidth() / 2;
    var ballXMinOnHitPoint = hitPoint.getX() - halfBallWidth;
    var ballXMaxOnHitPoint = hitPoint.getX() + halfBallWidth;

    if (!this.intersectWidthAxisWithRange(ballXMinOnHitPoint, ballXMaxOnHitPoint)) {
        return false;
    }

    var ballPosition = ball.getPosition();
    ballPosition.setX(hitPoint.getX());
    ballPosition.setZ(hitPoint.getZ() + ballBBOX.getDepth() / 2);

    ball.setAngle(this.getBallBounceAngleWidthAxis(ball));
    return true;
};

pong.court.PongObject.prototype.bounceBallOnBottom = function (ball) {
    var ballBBOX = ball.getDynamicBBOX();
    var hitPoint = this.getBallHitPointWidthAxis(ball, ballBBOX.getZMax(), this.dynamicBBOX.getZMin());

    var halfBallWidth = ballBBOX.getWidth() / 2;
    var ballXMinOnHitPoint = hitPoint.getX() - halfBallWidth;
    var ballXMaxOnHitPoint = hitPoint.getX() + halfBallWidth;

    if (!this.intersectWidthAxisWithRange(ballXMinOnHitPoint, ballXMaxOnHitPoint)) {
        return false;
    }

    var ballPosition = ball.getPosition();
    ballPosition.setX(hitPoint.getX());
    ballPosition.setZ(hitPoint.getZ() - ballBBOX.getDepth() / 2);

    ball.setAngle(this.getBallBounceAngleWidthAxis(ball));
    return true;
};

pong.court.PongObject.prototype.getBallHitPointDepthAxis = function (ball, ballX, wallX) {
    var hitPoint = this.point3_ma;
    var ballPosition = ball.getPosition();
    var angle = ball.getAngle();
    var rad = rock.util.GeometryUtils.degToRad(angle);

    var directionVectorX = Math.cos(rad);
    var directionVectorZ = Math.sin(rad);

    //Ax + By = C
    // directionVector = (B, -A) = (directionVectorX, directionVectorZ)
    var A = -directionVectorZ;
    var B = directionVectorX;

    // Compute C
    var C = A * ballX + B * ballPosition.getZ();

    var hitPointX = wallX;
    var hitPointZ = (-(A * hitPointX) + C) / B;

    hitPoint.setX(hitPointX);
    hitPoint.setY(0);
    hitPoint.setZ(hitPointZ);

    return hitPoint;
};

pong.court.PongObject.prototype.getBallHitPointWidthAxis = function (ball, ballZ, wallZ) {
    var hitPoint = this.point3_ma;
    var ballPosition = ball.getPosition();
    var angle = ball.getAngle();
    var rad = rock.util.GeometryUtils.degToRad(angle);

    var directionVectorX = Math.cos(rad);
    var directionVectorZ = Math.sin(rad);

    //Ax + By = C
    // directionVector = (B, -A) = (directionVectorX, directionVectorZ)
    var A = -directionVectorZ;
    var B = directionVectorX;

    // Compute C
    var C = A * ballPosition.getX() + B * ballZ;

    var hitPointZ = wallZ;
    var hitPointX = (-(B * hitPointZ) + C) / A;

    hitPoint.setX(hitPointX);
    hitPoint.setY(0);
    hitPoint.setZ(hitPointZ);

    return hitPoint;
};

pong.court.PongObject.prototype.getBallBounceAngleDepthAxis = function (ball) {
    var angle = ball.getAngle();
    var difference = 90 - angle;
    return angle + 2 * difference;
};

pong.court.PongObject.prototype.getBallBounceAngleWidthAxis = function (ball) {
    var angle = ball.getAngle();
    var difference = 180 - angle;
    return angle + 2 * difference;
};

pong.court.PongObject.prototype.intersectDepthAxisWithRange = function (minDepth, maxDepth) {
    var zMin = this.dynamicBBOX.getZMin();
    var zMax = this.dynamicBBOX.getZMax();

    return (zMin <= minDepth && minDepth <= zMax) ||
        (zMin <= maxDepth && maxDepth <= zMax) ||
        (minDepth <= zMin && zMax <= maxDepth);
};

pong.court.PongObject.prototype.intersectWidthAxisWithRange = function (miWidth, maxWidth) {
    var xMin = this.dynamicBBOX.getXMin();
    var xMax = this.dynamicBBOX.getXMax();

    return (xMin <= miWidth && miWidth <= xMax) ||
        (xMin <= maxWidth && maxWidth <= xMax) ||
        (miWidth <= xMin && xMax <= maxWidth);
};

pong.court.PongObject.prototype.intersectWidthAxis = function (pongObject) {
    var xMin = this.dynamicBBOX.getXMin();
    var xMax = this.dynamicBBOX.getXMax();

    var pongObjectXMin = pongObject.getDynamicBBOX().getXMin();
    var pongObjectXMax = pongObject.getDynamicBBOX().getXMax();

    return (xMin <= pongObjectXMin && pongObjectXMin <= xMax) ||
        (xMin <= pongObjectXMax && pongObjectXMax <= xMax) ||
        (pongObjectXMin <= xMin && xMax <= pongObjectXMax);
};

/**
 * Get the BBOX
 */
pong.court.PongObject.prototype.getDynamicBBOX = function() {
    return this.dynamicBBOX;
};

pong.court.PongObject.prototype.setDynamicBBOXWidthHeightDepth = function(width, height, depth) {
    var dynamicBBOX = this.dynamicBBOX;
    dynamicBBOX.setWidth(width);
    dynamicBBOX.setHeight(height);
    dynamicBBOX.setDepth(depth);
};

pong.court.PongObject.prototype.setDynamicBBOXCenter = function(centerX, centerY, centerZ) {
    var center = this.dynamicBBOX.getCenter();
    center.setX(centerX);
    center.setY(centerY);
    center.setZ(centerZ);
};