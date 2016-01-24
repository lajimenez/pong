rock.namespace('pong.engine');

/**
 * This class is responsible of handling representations
 *
 * @param {rock.game.graphics.engine.RenderEngine} renderEngine
 *
 * @param {rock.game.Repository} repository
 *
 * @constructor
 * @extends rock.game.engine.RepresentationAttendant
 *
 * @author Luis Alberto Jiménez
 */
pong.engine.RepresentationAttendant = function (renderEngine, repository) {
    rock.super_(this, arguments);
    this.representations_ma = new rock.js.Array();
};

rock.extends_(pong.engine.RepresentationAttendant, rock.game.engine.RepresentationAttendant);

pong.engine.RepresentationAttendant.prototype.createAdapters = function () {
    var renderEngine = this.renderEngine;
    var repository = this.repository;

    var ballModel =  repository.getModel(pong.constants.BALL_TYPE);
    var ballAdapter = renderEngine.createAdapter(ballModel);
    ballAdapter.build();
    repository.addAdapter(pong.constants.BALL_TYPE, ballAdapter);

    var racketModel =  repository.getModel(pong.constants.RACKET_TYPE);
    var racketAdapter = renderEngine.createAdapter(racketModel);
    racketAdapter.build();
    repository.addAdapter(pong.constants.RACKET_TYPE, racketAdapter);

    var wallModel =  repository.getModel(pong.constants.WALL_TYPE);
    var wallAdapter = renderEngine.createAdapter(wallModel);
    wallAdapter.build();
    repository.addAdapter(pong.constants.WALL_TYPE, wallAdapter);
};

pong.engine.RepresentationAttendant.prototype.createRepresentation = function (object) {
    var type = object.getType();

    var representation = null;
    switch (type) {
        case pong.constants.BALL_TYPE:
            representation = new pong.graphics.scene.BallRepresentation(this, object);
            break;
        case pong.constants.RACKET_TYPE:
            representation = new pong.graphics.scene.RacketRepresentation(this, object);
            break;
        case pong.constants.WALL_TYPE:
            representation = new pong.graphics.scene.WallRepresentation(this, object);
            break;
        default:
            ;
    }

    return representation;
};

/**
 * @see rock.game.engine.RepresentationAttendant#getRepresentations
 * @override
 */
pong.engine.RepresentationAttendant.prototype.getRepresentations = function (court) {
    // This must be cached...
    var ball = court.getBall();
    var playerRacket = court.getPlayerRacket();
    var opponentRacket = court.getOpponentRacket();
    var leftWall = court.getLeftWall();
    var rightWall = court.getRightWall();

    var representations = this.representations_ma;
    representations.clear();
    representations.addValue(ball.getRepresentation());
    representations.addValue(playerRacket.getRepresentation());
    representations.addValue(opponentRacket.getRepresentation());
    representations.addValue(leftWall.getRepresentation());
    representations.addValue(rightWall.getRepresentation());

    return representations;
};