
class Keyboard extends EventEmitter{
  constructor() {
    document.addEventListener('keydown', e => {
      console.log(e)
    })
  }
}

export const keyboard = new Keyboard();
