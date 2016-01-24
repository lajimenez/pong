rock.namespace('pong.graphics.scene');

/**
 * Ball representation
 *
 * @param {pong.engine.RepresentationAttendant} representationAttendant
 * @param {pong.court.Ball} object
 *
 * @constructor
 * @extends pong.graphics.scene.PongObjectRepresentation
 *
 * @author Luis Alberto Jiménez
 */
pong.graphics.scene.BallRepresentation = function (representationAttendant, object) {
    rock.super_(this, arguments);
};

rock.extends_(pong.graphics.scene.BallRepresentation, pong.graphics.scene.PongObjectRepresentation);

pong.graphics.scene.BallRepresentation.prototype.updateModel = function () {
    var repository = this.representationAttendant.getRepository();
    this.model = repository.getModel(pong.constants.BALL_TYPE);
};

pong.graphics.scene.BallRepresentation.prototype.createRenderables = function () {
    var representationAttendant = this.representationAttendant;
    var renderEngine = representationAttendant.getRenderEngine();
    var repository = representationAttendant.getRepository();

    var renderable = renderEngine.createRenderable(this.model);
    renderable.setModelAdapter(repository.getAdapter(pong.constants.BALL_TYPE));
    this.renderables.addValue(renderable);
};