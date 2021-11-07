interface KeyAction {
  action: (timeElapsed: number) => any;
  key: string;
}

export default class Input {
  private static _actionMap: KeyAction[] = [];
  private static _keyMap: any = {};

  static init() {
    addEventListener('keydown', (e: KeyboardEvent) => {
      this._keyMap[e.code] = true;
    });

    addEventListener('keyup', (e: KeyboardEvent) => {
      this._keyMap[e.code] = false;
    });
  }

  static bindKeyAction(key: string, action: (timeElapsed: number) => void) {
    this._actionMap.push({
      key,
      action
    });
  }

  static update(timeElapsed: number) {
    this._actionMap.forEach(({ key, action }) => {
      if (this._keyMap[key]) {
        action(timeElapsed);
      }
    });
  }
}
