rock.namespace('pong.court');

/**
 * Class representing the goal area
 *
 * @param world
 *
 * @constructor
 * @extends pong.court.PongObject
 *
 * @author Luis Alberto Jiménez
 */
pong.court.GoalArea = function (world) {
    rock.super_(this, [pong.constants.GOAL_AREA_TYPE, world]);
};

rock.extends_(pong.court.GoalArea, pong.court.PongObject);

pong.court.GoalArea.prototype.hasScoredGoalTop = function (ball) {
    return this.isPongObjectOnBottom(ball);
};

pong.court.GoalArea.prototype.hasScoredGoalBottom = function (ball) {
    return this.isPongObjectOnTop(ball);
};