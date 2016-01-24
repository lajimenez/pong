rock.namespace('pong.engine');

/**
 * @constructor
 * @extends rock.game.engine.GameState
 *
 * @author Luis Alberto Jiménez
 */
pong.engine.PongState = function () {
    rock.super_(this);

    this.winner = false;
};

rock.extends_(pong.engine.PongState, rock.game.engine.GameState);

pong.engine.PongState.BALL_BOUND_EVENT = 1001;

pong.engine.PongState.GOAL_EVENT = 1002;

pong.engine.PongState.PLAYER_WINS_EVENT = 1003;

pong.engine.PongState.PLAYER_LOST_EVENT = 1004;

/**
 * Get the winner
 */
pong.engine.PongState.prototype.getWinner = function() {
    return this.winner;
};

/**
 * Set the winner
 *
 * @param winner the value
 */
pong.engine.PongState.prototype.setWinner = function(winner) {
    this.winner = winner;
};