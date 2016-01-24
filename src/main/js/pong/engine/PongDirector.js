rock.namespace('pong.engine');

/**
 * @constructor
 * @extends rock.game.engine.GameDirector
 *
 * @author Luis Alberto Jiménez
 */
pong.engine.PongDirector = function (windowSystem) {
    rock.super_(this, arguments);
};

rock.extends_(pong.engine.PongDirector, rock.game.engine.GameDirector);

pong.engine.PongDirector.prototype.start = function () {
    var pongGameEngineWindow = this.windowSystem.getWindow(pong.constants.PONG_GAME_ENGINE_WINDOW);
    this.windowSystem.setCurrentWindow(pongGameEngineWindow);
};

pong.engine.PongDirector.prototype.resume = function () {};

pong.engine.PongDirector.prototype.load = function () {};

pong.engine.PongDirector.prototype.save = function () {};

pong.engine.PongDirector.prototype.handleGameState = function (gameState) {
    var windowSystem, playAgainWindow;
    var result = gameState.getResult();

    if (result == rock.game.engine.GameState.FINISH_GAME) {
        windowSystem = this.windowSystem;
        playAgainWindow = windowSystem.getWindow(pong.constants.PLAY_AGAIN_WINDOW);
        var winner = gameState.getWinner();
        if (winner) {
            playAgainWindow.setTitle(true);
        } else {
            playAgainWindow.setTitle(false);
        }
        windowSystem.setCurrentWindow(playAgainWindow);
    }

};