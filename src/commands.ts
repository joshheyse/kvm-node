import _ from 'lodash';

export type Port = 1 | 2 | 3 | 4;
export type HotKey = 'CTRL' | 'SHIFT' | 'SCROLL' | 'CAPS';
export type Hub = 1 | 2;
export type Sync = 'Sync' | Port;
export type Status = 'ON' | 'OFF';

export type Command = {
  write(): string;
};

export const ResetBuffer: Command = {
  write(): string {
    return '\n\n\n';
  },
};

export const ListInfoCommand: Command = {
  write(): string {
    return 'k1p0';
  },
};

export function ChangePort(port: Port): Command {
  return {
    write(): string {
      return `CH${port}`;
    },
  };
}

export function SetBuzzer(on: boolean): Command {
  return {
    write(): string {
      return on ? 'buzzon' : 'buzzoff';
    },
  };
}

function getPort(port: Port | number): Port {
  if (_.isNumber(port)) {
    return parseInt(port as any) as Port;
  }
  return port as Port;
}

function getHub(hub: Hub | number): Hub {
  if (_.isNumber(hub)) {
    return parseInt(hub as any) as Hub;
  }
  return hub as Hub;
}

export class PortEvent {
  public readonly port: Port;
  constructor(port: Port | number) {
    this.port = getPort(port);
  }
}

export class HotKeyEvent {
  constructor(public readonly hotKey: HotKey) {}
}

export class BuzzerEvent {
  constructor(public readonly status: Status) {}
}

export class HubSyncEvent {
  public readonly hub: Hub;
  constructor(hub: Hub | number, public readonly hubSync: Sync) {
    this.hub = getHub(hub);
  }
}

export class AudioSyncEvent {
  constructor(public readonly hubSync: Sync) {}
}

export class MouseChangeChannelEvent {
  constructor(public readonly status: Status) {}
}
