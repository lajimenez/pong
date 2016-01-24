rock.namespace('pong.graphics.scene');

/**
 * Pong object representation
 *
 * @param {pong.engine.RepresentationAttendant} representationAttendant
 * @param {pong.court.Ball} object
 *
 * @constructor
 * @abstract
 * @extends rock.game.graphics.scene.Representation
 *
 * @author Luis Alberto Jiménez
 */
pong.graphics.scene.PongObjectRepresentation = function (representationAttendant, object) {
    rock.super_(this, arguments);
};

rock.extends_(pong.graphics.scene.PongObjectRepresentation, rock.game.graphics.scene.Representation);

pong.graphics.scene.PongObjectRepresentation.prototype.update = function () {
    this.updateRenderablesModelMatrixFromPosition();
};