rock.namespace('pong.window');

/**
 * Show model window
 *
 * @constructor
 * @extends rock.game.GameEngineWindow
 *
 * @author Luis Alberto Jiménez
 */
pong.window.PongGameEngineWindow = function (windowSystem, pongDirector) {
    var graphicsEngine = windowSystem.getGraphicsEngine();
    var repository = windowSystem.getApplication().getRepository();
    var pongEngine = new pong.engine.PongEngine(graphicsEngine, repository);
    rock.super_(this, [windowSystem, pongDirector, pongEngine]);
    this.scoreLabel = null;

    this.createComponents();
    pongEngine.prepareGame();
};

rock.extends_(pong.window.PongGameEngineWindow, rock.game.GameEngineWindow);

pong.window.PongGameEngineWindow.prototype.createComponents = function () {
    var font = new rock.graphics.Font('Arial', 28);
    var scoreLabel = new rock.window.component.html.HTMLLabel(this, '', false,
        font, rock.graphics.Color.WHITE.clone());
    scoreLabel.id = 'scoreLabel';
    scoreLabel.setX(500);
    scoreLabel.setY(30);
    this.addComponent(scoreLabel);
    this.scoreLabel = scoreLabel;
};

pong.window.PongGameEngineWindow.prototype.updateScore = function (playerAnnotation, opponentAnnotation) {
    this.scoreLabel.setText(playerAnnotation + " - " + opponentAnnotation);
};