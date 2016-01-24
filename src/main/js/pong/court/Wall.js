rock.namespace('pong.court');

/**
 * Class representing a wall
 *
 * @param world
 *
 * @constructor
 * @extends pong.court.PongObject
 *
 * @author Luis Alberto Jiménez
 */
pong.court.Wall = function (world) {
    rock.super_(this, [pong.constants.WALL_TYPE, world]);
};

rock.extends_(pong.court.Wall, pong.court.PongObject);

pong.court.Wall.prototype.bounceBallOnRightIfNecessary = function (ball) {
    var bounce = false;
    if (this.isPongObjectOnLeft(ball)) {
        bounce = this.bounceBallOnRight(ball);
    }
    return bounce;
};

pong.court.Wall.prototype.bounceBallOnLeftIfNecessary = function (ball) {
    var bounce = false;
    if (this.isPongObjectOnRight(ball)) {
        bounce = this.bounceBallOnLeft(ball);
    }
    return bounce;
};