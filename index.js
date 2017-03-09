#!/usr/bin/env node

const readline = require('readline');
const RobotArmController = require('./model/RobotArmController');
const robotArmController = new RobotArmController();

const validCommands = ['size', 'add', 'mv', 'rm', 'replay', 'undo']

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'robot-arm> '
});

console.log('Welcome to the robot arm cli!');
rl.prompt();

rl.on('line', input => {
  switch(input) {
    case 'quit':
    case 'exit':
    case 'done':
    case 'stop':
    case 'wicked over it':
      rl.close();
      break;
    default:
      let tokens = input.trim().split(' ');

      if(validCommands.includes(tokens[0])) {
        let cmd = tokens[0];
        let args = tokens.slice(1);

        robotArmController.performAction(cmd, args, (response) => { // controller will always send back a user-readable response
          console.log(response);
        });
      } else {
        console.log(`Sorry, that\'s not a valid command. You can say: ${validCommands.toString()}`);
      }

      break;
  }
  rl.prompt();
}).on('close', () => {
  console.log('latah!');
  process.exit(0);
});
