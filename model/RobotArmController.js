class RobotArmController {
  constructor() {
    this.history;
  }

  performAction(cmd, args, cb) {
    if(this[cmd] && typeof this[cmd] == 'function') {
      this[cmd](args, cb);
    } else {
      cb(`Not a valid command. Please tell Kellen he forgot to write the ${cmd} function.`);
    }
  }

  size(args, cb) {
    if(!this.validateArgs(args, 1)) {
      cb('Invalid arguments.\nUsage: size <number>');
      return;
    }

    let numSlots = args[0];

    if(!this.history) {
      let slots = [];

      for(var i=0; i<numSlots; i++) {
        slots.push({
          numBlocks: 0
        });
      }

      this.history = [];
      this.history.push(slots);
    } else {
      let newSlots = this.getCurrentSlotsCopy();

      if(numSlots > newSlots.length) {
        let numToAdd = numSlots - newSlots.length;

        for(var i=0; i<numToAdd; i++) {
          newSlots.push({
            numBlocks: 0
          });
        }
      } else { // validateArgs made sure numSlots is > 0
        newSlots.splice(numSlots);
      }

      this.history.push(newSlots);
    }

    cb(this.getSlotString(this.history));
  }

  add(args, cb) {
    if(!this.validateArgs(args, 1)) {
      cb('Invalid arguments.\nUsage: size <number>');
      return;
    }

    this.modifySlot('add', args, cb);
  }

  mv(args, cb) {
    if(!this.validateArgs(args, 2)) {
      cb('Invalid arguments.\nUsage: size <number>');
      return;
    }

    this.modifySlot('mv', args, cb);
  }

  rm(args, cb) {
    if(!this.validateArgs(args, 1)) {
      cb('Invalid arguments.\nUsage: size <number>');
      return;
    }

    this.modifySlot('rm', args, cb);
  }

  modifySlot(cmd, args, cb) {
    if(!this.history) {
      cb('No slots initialized yet. Please initialize slots with: size <number>');
      return;
    }

    let newSlots = this.getCurrentSlotsCopy(),
        slotPos = args[0] - 1;

    if(newSlots.length - 1 < slotPos) {
      cb('Please enter a valid slot number.');
      return;
    }

    switch(cmd) {
      case 'add':
        newSlots[slotPos].numBlocks++;
        break;
      case 'mv':
        let startPos = slotPos,
            endPos = args[1] - 1;

        if(newSlots[startPos].numBlocks) {
          newSlots[startPos].numBlocks--;
          newSlots[endPos].numBlocks++
        } else {
          cb(`There are no blocks in slot #${startPos + 1} to move.`);
          return;
        }
        break;
      case 'rm':
        if(newSlots[slotPos].numBlocks) {
          newSlots[slotPos].numBlocks--;
        } else {
          cb(`There are no blocks in slot #${slotPos + 1} to remove.`);
        }
        break;
    }

    this.history.push(newSlots);
    cb(this.getSlotString(this.history));
  }

  replay(args, cb) {
    if(!this.validateArgs(args, 1)) {
      cb('Invalid arguments.\nUsage: size <number>');
      return;
    }

    if(args[0] > this.history.length) {
      cb('Please enter a valid number of transactions to replay.');
      return;
    }

    let replayFromPosition = this.history.length - args[0],
        replayString = '';

    for(var i=replayFromPosition; i<this.history.length; i++) {
      replayString += '\n------------\n';
      replayString += this.getSlotString(this.history, i);
    }

    cb(replayString);
  }

  undo(args, cb) {
    if(!this.validateArgs(args, 1)) {
      cb('Invalid arguments.\nUsage: size <number>');
      return;
    }

    if(args[0] > this.history.length) {
      cb('Please enter a valid number of transactions to undo.');
      return;
    } else if(args[0] == this.history.length) { // TODO handle undoing of all history
      cb('You cannot undo all history.'); // disallowing undoing all history because the error handling for most methods dont' handle if there is a history object but it's empty. Ran out of time :)
      return;
    }

    let undoFromPosition = this.history.length - args[0];

    this.history = this.history.splice(0, undoFromPosition);

    cb(this.getSlotString(this.history));
  }

  validateArgs(args, numArgs) {
    let valid = true;

    if(args.length != numArgs) valid = false;

    for(var i=0; i<numArgs; i++) {
      if(isNaN(args[i]) || args[i] < 0) valid = false; // all args should be numbers right now
    }

    return valid;
  }

  getSlotString(history, position) {
    let slots = history[(typeof position !== 'undefined') ? position : history.length - 1],
        slotString = '';

    slots.forEach((slot, slotPosition) => {
      let blockString = '';

      if(slot.numBlocks) {
        for(var i=0; i<slot.numBlocks; i++) {
          blockString += 'X';
        }
      }

      slotString += `${slotPosition + 1}: ${blockString}`;
      if(slotPosition != slots.length - 1) slotString += '\n';
    })

    return slotString;
  }

  getCurrentSlotsCopy() {
    let currentSlotsCopy = this.history[this.history.length - 1].slice(),
        deepCopy = [];

    currentSlotsCopy.forEach(slot => {
      deepCopy.push({
        numBlocks: slot.numBlocks
      });
    });

    return deepCopy;
  }
}

module.exports = RobotArmController;
