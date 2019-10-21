import EventEmitter from 'event-emitter';

class Keyboard extends EventEmitter {
  constructor() {
    super();
    document.addEventListener('keydown', e => {
      if (e.isComposing || e.keyCode === 229) {
        return;
      }
      if (e.code === 'KeyE' && (e.metaKey || e.ctrlKey)) {
        this.emit('EV_FLIP');
      }
      if (e.code === 'Escape') {
        this.emit('EV_CLOSE');
      }
      if (e.code === 'Enter') {
        this.emit('EV_ENTER');
      }
      if (
        e.code === 'ArrowDown' ||
        (e.code === 'KeyJ' && (e.metaKey || e.ctrlKey))
      ) {
        this.emit('EV_FORWARD');
      }
      if (
        e.code === 'ArrowUp' ||
        (e.code === 'KeyK' && (e.metaKey || e.ctrlKey))
      ) {
        this.emit('EV_BACKWARD');
      }
    });
  }
}

export const keyboard = new Keyboard();
