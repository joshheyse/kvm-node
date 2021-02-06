import _ from 'lodash';

export type Port = '1' | '2' | '3' | '4';
export type HotKey = 'CTRL' | 'SHIFT' | 'SCROLL' | 'CAPS';
export type Hub = '1' | '2';
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
      return `ch${port}`;
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

export class PortEvent {
  constructor(public readonly port: Port) {}
}

export class HotKeyEvent {
  constructor(public readonly hotKey: HotKey) {}
}

export class BuzzerEvent {
  constructor(public readonly status: Status) {}
}

export class HubSyncEvent {
  constructor(public readonly hub: Hub, public readonly hubSync: Sync) {}
}

export class AudioSyncEvent {
  constructor(public readonly hubSync: Sync) {}
}

export class MouseChangeChannelEvent {
  constructor(public readonly status: Status) {}
}
