import {Port, HotKey, Hub, Sync, Status, Wakeup} from './types';

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
  constructor(public readonly hub: Hub, public readonly sync: Sync) {}
}

export class AudioSyncEvent {
  constructor(public readonly sync: Sync) {}
}

export class MouseChangeChannelEvent {
  constructor(public readonly status: Status) {}
}

export class WakeupEvent {
  constructor(public readonly wakeup: Wakeup) {}
}
