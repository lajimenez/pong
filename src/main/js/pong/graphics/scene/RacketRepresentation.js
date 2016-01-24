rock.namespace('pong.graphics.scene');

/**
 * Racket representation
 *
 * @param {pong.engine.RepresentationAttendant} representationAttendant
 * @param {pong.court.Racket} object
 *
 * @constructor
 * @extends pong.graphics.scene.PongObjectRepresentation
 *
 * @author Luis Alberto Jiménez
 */
pong.graphics.scene.RacketRepresentation = function (representationAttendant, object) {
    rock.super_(this, arguments);
};

rock.extends_(pong.graphics.scene.RacketRepresentation, pong.graphics.scene.PongObjectRepresentation);

pong.graphics.scene.RacketRepresentation.prototype.updateModel = function () {
    var repository = this.representationAttendant.getRepository();
    this.model = repository.getModel(pong.constants.RACKET_TYPE);
};

pong.graphics.scene.RacketRepresentation.prototype.createRenderables = function () {
    var representationAttendant = this.representationAttendant;
    var renderEngine = representationAttendant.getRenderEngine();
    var repository = representationAttendant.getRepository();

    var renderable = renderEngine.createRenderable(this.model);
    renderable.setModelAdapter(repository.getAdapter(pong.constants.RACKET_TYPE));
    this.renderables.addValue(renderable);
};