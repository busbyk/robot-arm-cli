# robot-arm-cli
A cli to control a robotic arm that can manage the contents of a series of slots.

## Installation
To install the cli globally run: ```npm install -g```

You will then have access to the ```robot-arm``` command.

You may need to use sudo on OSX if you get permission errors. Here is [a great article](https://johnpapa.net/how-to-use-npm-global-without-sudo-on-osx/) on the subject.

## Usage
If you have installed the cli globally, run ```robot-arm``` in your terminal or command prompt.

Otherwise, use NodeJS version 6.3.1 or higher to run index.js ```node index.js```

You should see a prompt: ```robot-arm> ```. You can now enter commands for the robot-arm.

### Valid commands
- size
- add
- mv
- rm
- replay
- undo

## Assumptions
- The user would like to continually interact with the robot-arm so I have kept them in a prompt loop.
- The slots may have additional attributes in the future so I have created slots as objects with attributes.

## Future enhancements
- Error handling fails when the user undos all history. I would like to change error handling to account for an empty history object instead of a just falsy history object.
- I would like to allow the user to perform single commands without entering the prompt loop: ```robot-arm size 10```. 
