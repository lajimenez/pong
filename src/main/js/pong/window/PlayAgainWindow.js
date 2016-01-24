rock.namespace('pong.window');

/**
 * Play again window
 *
 * @constructor
 * @extends rock.game.GameWindow
 *
 * @author Luis Alberto Jiménez
 */
pong.window.PlayAgainWindow = function (windowSystem, pongDirector) {
    rock.super_(this, arguments);
    this.victoryLabel = null;
    this.defeatLabel = null;
    this.addComponents();
};

rock.extends_(pong.window.PlayAgainWindow, rock.game.GameWindow);

pong.window.PlayAgainWindow.prototype.addComponents = function () {
    var font = new rock.graphics.Font('Arial', 36);
    var victoryLabel = new rock.window.component.html.HTMLLabel(this, 'VICTORY', true,
        font, rock.graphics.Color.WHITE.clone());
    victoryLabel.id = 'victoryLabel';
    victoryLabel.setX(230);
    victoryLabel.setY(150);
    this.victoryLabel = victoryLabel;

    var defeatLabel = new rock.window.component.html.HTMLLabel(this, 'DEFEAT', true,
        font, rock.graphics.Color.WHITE.clone());
    defeatLabel.id = 'defeatLabel';
    defeatLabel.setX(230);
    defeatLabel.setY(150);
    this.defeatLabel = defeatLabel;

    var playAgainButton = new rock.window.component.Button(this, 'PLAY_AGAIN_GAME_BUTTON', true);
    playAgainButton.setId('playAgainButton');
    playAgainButton.setX(200);
    playAgainButton.setY(250);
    playAgainButton.setWidth(200);
    playAgainButton.setHeight(50);
    playAgainButton.addEventListener(rock.constants.ROCK_EVENT_CLICK,
        rock.createEventHandler(this, this.handleOnStartGameButtonClick));
    this.addComponent(playAgainButton);
};

pong.window.PlayAgainWindow.prototype.handleOnStartGameButtonClick = function (event) {
    this.gameDirector.start();
};

pong.window.PlayAgainWindow.prototype.setTitle = function (winner) {
    var victoryLabel = this.victoryLabel;
    var defeatLabel = this.defeatLabel;

    this.removeComponent(defeatLabel);
    this.removeComponent(victoryLabel);

    if (winner) {
        this.addComponent(victoryLabel);
    } else {
        this.addComponent(defeatLabel);
    }
};