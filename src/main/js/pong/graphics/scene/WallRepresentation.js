rock.namespace('pong.graphics.scene');

/**
 * Wall representation
 *
 * @param {pong.engine.RepresentationAttendant} representationAttendant
 * @param {pong.court.Wall} object
 *
 * @constructor
 * @extends pong.graphics.scene.PongObjectRepresentation
 *
 * @author Luis Alberto Jiménez
 */
pong.graphics.scene.WallRepresentation = function (representationAttendant, object) {
    rock.super_(this, arguments);
};

rock.extends_(pong.graphics.scene.WallRepresentation, pong.graphics.scene.PongObjectRepresentation);

pong.graphics.scene.WallRepresentation.prototype.updateModel = function () {
    var repository = this.representationAttendant.getRepository();
    this.model = repository.getModel(pong.constants.WALL_TYPE);
};

pong.graphics.scene.WallRepresentation.prototype.createRenderables = function () {
    var representationAttendant = this.representationAttendant;
    var renderEngine = representationAttendant.getRenderEngine();
    var repository = representationAttendant.getRepository();

    var renderable = renderEngine.createRenderable(this.model);
    renderable.setModelAdapter(repository.getAdapter(pong.constants.WALL_TYPE));
    this.renderables.addValue(renderable);
};