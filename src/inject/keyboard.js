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
        if (!this.closing || new Date().getTime() - this.closingTIme > 600) {
          this.closing = true;
          this.closingTIme = new Date().getTime();
        } else {
          this.closing = false;
          this.emit('EV_CLOSE');
        }
      }
    });
  }
}

export const keyboard = new Keyboard();
