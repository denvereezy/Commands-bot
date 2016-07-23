var fs = require('fs');
var temporal = require('temporal');

module.exports = function(fileName, robot){

    console.log("Found file", fileName);

    function executeCommands(){
        return getCommands(fileName)
          .filter(function(cmd){ return cmd.direction != "" })
          .map(function(cmd){
            return {
                delay : cmd.duration,
                task : robotCommand(cmd)
            }
          });
    }

    function getCommands(file_name){
        var commands = fs.readFileSync(file_name, 'utf8');
        var commandList = commands.split("\n");
        commandList = commandList.map(function(line){
            var lines = line.split("->");

            console.log(lines);

            if (lines.length == 1){
                return {
                };
            }
            return {
                direction : lines[1].trim(),
                duration : Number(lines[0].trim())
            };
        });

        console.log(commandList);
        return commandList;
    };

    function robotCommand(command){
        return function(){
            robot.direction(command.direction)
        }
    }


    return {

        execute : function () {
            temporal.queue(executeCommands());
        }

    }

}
