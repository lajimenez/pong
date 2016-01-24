rock.namespace('pong');

/**
 * Pong application
 *
 * @constructor
 * @extends rock.game.Game
 *
 * @author Luis Alberto Jiménez
 */
pong.Pong = function (idDiv, urlResources) {
    var initParams = new rock.app.InitApplicationParams(idDiv, 600, 500, rock.constants.CONTEXT_WEBGL, urlResources);
    rock.super_(this, [initParams]);
};

rock.extends_(pong.Pong, rock.game.Game);

/**
 * @override
 * @see rock.app.Application#start
*/
pong.Pong.prototype.start = function () {
    this.addPongGameStyle();
    this.initResources();
};

/**
 * Create and add the pong game style
 */
pong.Pong.prototype.addPongGameStyle = function () {
    var PONG_GAME_STYLE_ID = 'PONG_GAME_STYLE_ID';
    var rockStyle = new rock.window.style.Style(PONG_GAME_STYLE_ID);

    rockStyle.addColor(rock.window.style.StyleManager.WINDOW_BACKGROUND_COLOR,
        new rock.graphics.Color(0, 0, 0));

    rockStyle.addColor(rock.window.style.StyleManager.COMPONENT_BACKGROUND_COLOR,
        new rock.graphics.Color(0, 0, 0));

    rockStyle.addColor(rock.window.style.StyleManager.COMPONENT_COLOR,
        new rock.graphics.Color(255, 255, 255));

    rockStyle.addColor(rock.window.style.StyleManager.COMPONENT_COLOR_2,
        new rock.graphics.Color(50, 50, 50));

    rockStyle.addColor(rock.window.style.StyleManager.COMPONENT_FONT_COLOR,
        new rock.graphics.Color(255, 255, 255));

    rockStyle.addFont(rock.window.style.StyleManager.COMPONENT_FONT,
        new rock.graphics.Font(rock.constants.DEFAULT_FONT_TYPE, 20));

    var styleManager = this.styleManager;
    styleManager.addStyle(rockStyle);
    styleManager.setCurrentStyle(PONG_GAME_STYLE_ID);

};

pong.Pong.prototype.initResources = function () {

    var resourceLoaderWindow = new rock.window.ResourceLoaderWindow(this.windowSystem);
    this.windowSystem.registerWindow(pong.constants.RESOURCE_LOADER_WINDOW, resourceLoaderWindow);

    this.windowSystem.setCurrentWindow(resourceLoaderWindow);

    var urlResources = this.urlResources;
    var elemsToLoad = [];

    // I18n
    var baseI18NPath = urlResources + 'i18n/';
    elemsToLoad.push(new rock.resource.loader.ResourceLoaderElement(pong.constants.RES_ID_I18N_EN,
        rock.constants.RESOURCE_TYPE_JSON,
        new rock.network.HTTPRequestParams(baseI18NPath + 'en.json', null, null)));

    // Model
    var baseModelPath = urlResources + 'model/';
    elemsToLoad.push(new rock.resource.loader.ResourceLoaderElement(pong.constants.RES_ID_MODEL_BALL,
        rock.constants.RESOURCE_TYPE_JSON,
        new rock.network.HTTPRequestParams(baseModelPath + 'ball.json', null, null)));
    elemsToLoad.push(new rock.resource.loader.ResourceLoaderElement(pong.constants.RES_ID_MODEL_RACKET,
        rock.constants.RESOURCE_TYPE_JSON,
        new rock.network.HTTPRequestParams(baseModelPath + 'racket.json', null, null)));
    elemsToLoad.push(new rock.resource.loader.ResourceLoaderElement(pong.constants.RES_ID_MODEL_WALL,
        rock.constants.RESOURCE_TYPE_JSON,
        new rock.network.HTTPRequestParams(baseModelPath + 'wall.json', null, null)));

    // Audio
    var baseAudioPath = urlResources + 'audio/';
    elemsToLoad.push(new rock.resource.loader.ResourceLoaderElement(pong.constants.RES_ID_AUDIO_BOUNCE_BALL,
        rock.constants.RESOURCE_TYPE_AUDIO,
        new rock.network.HTTPRequestParams(baseAudioPath + 'bounceBall.wav', null, null)));
    elemsToLoad.push(new rock.resource.loader.ResourceLoaderElement(pong.constants.RES_ID_AUDIO_GOAL,
        rock.constants.RESOURCE_TYPE_AUDIO,
        new rock.network.HTTPRequestParams(baseAudioPath + 'goal.wav', null, null)));

    resourceLoaderWindow.addEventListener(
        rock.resource.event.ResourceWindowCompleteEvent.RESOURCE_WINDOW_COMPLETE,
        rock.createEventHandler(this, this.onResourceLoaderWindowComplete));

    resourceLoaderWindow.loadResources(elemsToLoad);
};

pong.Pong.prototype.onResourceLoaderWindowComplete = function (event) {
    var resourceLoaderWindow = event.getSource();
    var resourceLoaderManager = resourceLoaderWindow.getResourceLoaderManager();

    if (resourceLoaderManager.hasErrors()) {
        throw new rock.error.RockError(this.resourceManager.getString('ERROR_LOADING_RESOURCES'));
    }

    var repository = this.repository;

    // I18n
    var jsonI18NEn = resourceLoaderManager.getLoadedResource(pong.constants.RES_ID_I18N_EN).getValue();
    this.resourceManager.loadStrings(jsonI18NEn);

    // Model
    var ballModel = this.getModel(resourceLoaderManager, repository, pong.constants.RES_ID_MODEL_BALL);
    repository.addModel(pong.constants.BALL_TYPE, ballModel);

    var racketModel = this.getModel(resourceLoaderManager, repository, pong.constants.RES_ID_MODEL_RACKET);
    repository.addModel(pong.constants.RACKET_TYPE, racketModel);

    var wallModel = this.getModel(resourceLoaderManager, repository, pong.constants.RES_ID_MODEL_WALL);
    repository.addModel(pong.constants.WALL_TYPE, wallModel);

    // Audio
    var bounceBallAudio = resourceLoaderManager.getLoadedResource(pong.constants.RES_ID_AUDIO_BOUNCE_BALL).getValue();
    repository.addAudio(pong.constants.RES_ID_AUDIO_BOUNCE_BALL, bounceBallAudio);

    var goalAudio = resourceLoaderManager.getLoadedResource(pong.constants.RES_ID_AUDIO_GOAL).getValue();
    repository.addAudio(pong.constants.RES_ID_AUDIO_GOAL, goalAudio);

    var windowSystem = this.windowSystem;
    var pongDirector = new pong.engine.PongDirector(windowSystem);

    var mainWindow = new pong.window.MainWindow(this.windowSystem, pongDirector);
    var playAgainWindow = new pong.window.PlayAgainWindow(this.windowSystem, pongDirector);
    var pongGameEngineWindow = new pong.window.PongGameEngineWindow(this.windowSystem, pongDirector);

    windowSystem.registerWindow(pong.constants.MAIN_WINDOW, mainWindow);
    windowSystem.registerWindow(pong.constants.PLAY_AGAIN_WINDOW, playAgainWindow);
    windowSystem.registerWindow(pong.constants.PONG_GAME_ENGINE_WINDOW, pongGameEngineWindow);

    windowSystem.setCurrentWindow(mainWindow);
};

pong.Pong.prototype.getModel = function (resourceLoaderManager, repository, id) {
    var JSONModel = resourceLoaderManager.getLoadedResource(id).getValue();
    var model = rock.game.graphics.model.JSONModelUtils.createPhongModelGroup(JSONModel);
    return model.getModels()[0];
};
