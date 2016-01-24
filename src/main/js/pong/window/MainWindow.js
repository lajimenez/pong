rock.namespace('pong.window');

/**
 * Main game window
 *
 * @constructor
 * @extends rock.game.GameWindow
 *
 * @author Luis Alberto Jiménez
 */
pong.window.MainWindow = function (windowSystem, pongDirector) {
    rock.super_(this, arguments);
    this.addComponents();
};

rock.extends_(pong.window.MainWindow, rock.game.GameWindow);

pong.window.MainWindow.prototype.addComponents = function () {
    var font = new rock.graphics.Font('Arial', 36);
    var titleLabel = new rock.window.component.html.HTMLLabel(this, 'TITLE', true,
        font, rock.graphics.Color.WHITE.clone());
    titleLabel.id = 'titleLabel';
    titleLabel.setX(205);
    titleLabel.setY(150);
    this.addComponent(titleLabel);

    var startGameButton = new rock.window.component.Button(this, 'START_GAME_BUTTON', true);
    startGameButton.setId('startGameButton');
    startGameButton.setX(200);
    startGameButton.setY(250);
    startGameButton.setWidth(200);
    startGameButton.setHeight(50);
    startGameButton.addEventListener(rock.constants.ROCK_EVENT_CLICK,
        rock.createEventHandler(this, this.handleOnStartGameButtonClick));
    this.addComponent(startGameButton);

    var littleFont = new rock.graphics.Font('Arial', 14);
    var controlsLabel = new rock.window.component.html.HTMLLabel(this, 'CONTROLS', true,
        littleFont, rock.graphics.Color.WHITE.clone());
    controlsLabel.id = 'controlsLabel';
    controlsLabel.setX(160);
    controlsLabel.setY(400);
    this.addComponent(controlsLabel);
};

pong.window.MainWindow.prototype.handleOnStartGameButtonClick = function (event) {
    this.gameDirector.start();
};