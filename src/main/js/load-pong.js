// Load all scripts
function loadPong(sourcePath) {
    var scriptsToLoad = [
        'constants.js',

        'geometry/DynamicBBOX.js',

        'court/PongObject.js',
        'court/Ball.js',
        'court/Wall.js',
        'court/Racket.js',
        'court/OpponentRacket.js',
        'court/GoalArea.js',
        'court/Court.js',

        'graphics/scene/PongObjectRepresentation.js',
        'graphics/scene/BallRepresentation.js',
        'graphics/scene/WallRepresentation.js',
        'graphics/scene/RacketRepresentation.js',

        'engine/RepresentationAttendant.js',
        'engine/PongState.js',
        'engine/PongDirector.js',
        'engine/PongEngine.js',

        'window/MainWindow.js',
        'window/PlayAgainWindow.js',
        'window/PongGameEngineWindow.js',
        'Pong.js'
    ];

    var i;
    for (i = 0; i < scriptsToLoad.length; i++) {
        document.write('<script src="' + sourcePath + scriptsToLoad[i] + '"><\/script>');
    }
}