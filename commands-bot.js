var fs = require('fs');
var temporal = require('temporal');
var five = require("johnny-five");
var keypress = require('keypress');
var Robot = require('./utils/robot');
var Wheel = require('./utils/hbridge-wheel');
var RobotCommander = require('./robot-commander')

keypress(process.stdin);

var board = new five.Board();

board.on("ready", function() {

    console.log("Welcome to CommandsBot")
    console.log("Control CommandsBot with the arrow keys, and SPACE to stop or give it a commands file.")

    var left_wheel = new Wheel(9, 8, 256);
    var right_wheel = new Wheel(6, 7, 256);
    var robot = new Robot(left_wheel, right_wheel);
    this.repl.inject({
        robot: robot
    });


    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    process.stdin.setRawMode(true);

    //load commands

    var fileName = process.argv[2];

    var robotCommander = null;

    if (fileName) {
        robotCommander = RobotCommander(fileName, robot);
    }

    process.stdin.on('keypress', function(ch, key) {

        if (!key) return;
        if (key.name == 'q') {

            console.log('Quitting');
            process.exit();

        } else if (key.name == 'up') {

            console.log('Forward');
            robot.forward();


        } else if (key.name == 'down') {

            console.log('Backward');
            robot.reverse()

        } else if (key.name == 'left') {
            console.log('Left');
            robot.left();

        } else if (key.name == 'right') {

            console.log('Right');
            robot.right();

        } else if (key.name == 'space') {

            console.log('Stopping');
            robot.stop();

        } else if (key.ctrl && key.name == 'g') {
            console.log('=> ');
            if (robotCommander)
                robotCommander.execute();
        }
    });
});
