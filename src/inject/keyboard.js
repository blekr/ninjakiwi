import EventEmitter from 'event-emitter';

class Keyboard extends EventEmitter {
  constructor() {
    super();
    this.closing = false;
    this.closingTIme = null;
    document.addEventListener('keydown', e => {
      if (e.isComposing || e.keyCode === 229) {
        return;
      }
      if (e.code === 'KeyE' && (e.metaKey || e.ctrlKey)) {
        this.emit('EV_FLIP');
      }
      if (e.code === 'Escape') {
        this.emit('EV_COMMAND_MODE')
        if (!this.closing || new Date().getTime() - this.closingTIme > 600) {
          this.closing = true;
          this.closingTIme = new Date().getTime();
        } else {
          this.closing = false;
          this.emit('EV_CLOSE');
        }
      }
      if (e.code === 'ArrowDown' || e.code === 'KeyJ') {
        this.emit('EV_FORWARD');
      }
      if (e.code === 'ArrowUp' || e.code === 'KeyK') {
        this.emit('EV_BACKWARD');
      }
    });
  }
}

export const keyboard = new Keyboard();
