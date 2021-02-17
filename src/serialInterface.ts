import autobind from 'autobind-decorator';
import bunyan from 'bunyan';
import {Bus} from 'strongbus';
import SerialPort from 'serialport';
import {Port, HotKey, Sync, Status, Hub, Wakeup} from './types';
import {Command, ListInfoCommand, ResetBuffer} from './commands';
import {PortEvent, HotKeyEvent, BuzzerEvent, HubSyncEvent, AudioSyncEvent, WakeupEvent} from './events';
import {ReadTransform} from './readTransformer';
import {sleep} from './utils';

export type EventMap = {
  port: void;
  hotKey: void;
  buzzer: void;
  hub: Hub;
  audio: void;
  wakeup: Wakeup;
};

type SerialInterfaceOptions = {
  wakeupThrottle: number
};


type LastWakeup = {
  [key in Wakeup]?: number;
};

@autobind
export default class SerialInterface {

  private readonly serialPort: SerialPort;
  private readonly _log: bunyan;
  private readonly _options: SerialInterfaceOptions;

  private _bus = new Bus<EventMap>();
  public on = this._bus['on'];
  public any = this._bus['any'];
  public every = this._bus['every'];

  private _port: Port | undefined;
  private _hotKey: HotKey | undefined;
  private _buzzer: Status | undefined;
  private _hub1: Sync | undefined;
  private _hub2: Sync | undefined;
  private _audio: Sync | undefined;


  private _lastWakeup: LastWakeup = {};

  constructor(public readonly path: string, log: bunyan, options?: SerialInterfaceOptions) {
    this._log = log.child({path});
    this._options  = Object.assign({}, {wakeupThrottle: 5}, options);
    this.serialPort = new SerialPort(this.path, {
      baudRate: 115200,
      dataBits: 8,
      stopBits: 1,
      xoff: true,
      parity: 'none',
      autoOpen: false,
    });
    this.serialPort.on('close', () => this.onClose);
    this.serialPort.on('open', () => {
      this._log.info('open');
    });
    this.serialPort.on('drain', () => {
      this._log.info('drain');
    });
    this.serialPort.on('error', (err: Error | null) => {
      this._log.error('error', err);
    });
    const transform = new ReadTransform(this.path, this._log);
    transform.on('data', this.onData);

    this.serialPort.pipe(transform);
  }

  public get port(): Port|undefined {
    return this._port;
  }

  public get hotKey(): HotKey|undefined {
    return this._hotKey;
  }

  public get buzzer(): Status|undefined {
    return this._buzzer;
  }

  public get hub1(): Sync|undefined {
    return this._hub1;
  }

  public get hub2(): Sync|undefined {
    return this._hub2;
  }

  public get audio(): Sync|undefined {
    return this._audio;
  }

  public canSendWakeup(wakeup: Wakeup): boolean {
    const now = (new Date()).valueOf();
    if (!this._lastWakeup[wakeup] || ((now - this._lastWakeup[wakeup]!) > this._options.wakeupThrottle)) {
      this._lastWakeup[wakeup] = now;
      return true;
    }
    return false;
  }

  private onData(data: any) {
    this._log.info('data', data);
    if (data instanceof PortEvent) {
      this._port = data.port;
      this._bus.emit('port', undefined);
    }
    else if (data instanceof HotKeyEvent) {
      this._hotKey = data.hotKey;
      this._bus.emit('hotKey', undefined);
    }
    else if (data instanceof BuzzerEvent) {
      this._buzzer = data.status;
      this._bus.emit('buzzer', undefined);
    }
    else if (data instanceof HubSyncEvent) {
      if (data.hub === '1') {
        this._hub1 = data.sync;
      }
      else if (data.hub === '2') {
        this._hub2 = data.sync;
      }
      this._bus.emit('hub', data.hub);
    }
    else if (data instanceof AudioSyncEvent) {
      this._audio = data.sync;
      this._bus.emit('audio', undefined);
    }
    else if (data instanceof WakeupEvent) {
      this._lastWakeup[data.wakeup] = (new Date()).valueOf();
      this._bus.emit('wakeup', data.wakeup);
    }
  }

  private async onClose() {
    this._log.info('close');
    while(!this.serialPort.isOpen) {
      sleep(100);
      try {
        await this.open();
      }
      catch {
        this._log.info('failed to open during reopen');
      }
    }
  }

  public async open(): Promise<void> {
    this._log.info('openning');
    return new Promise((resolve, reject) => {
      this.serialPort.open(async (err) => {
        if (err) {
          this._log.info('error oppening', err);
          reject(err);
        }
        // Wait for connection to open
        sleep(400);
        this.sendCommand(ResetBuffer);
        sleep(100);
        this.sendCommand(ResetBuffer);
        sleep(100);
        this.sendCommand(ListInfoCommand);
        sleep(400);
        resolve();
      });
    });
  }

  public async sendCommand(command: Command): Promise<void> {
    if(command.canSend && !command.canSend(this)) {
      return;
    }
    return new Promise((resolve, reject) => {
      const commandText = command.write();
      this._log.info(`sent ${commandText}`);
      this.serialPort.write(commandText + '\r', 'ascii');
      this.serialPort.drain((err: Error | null | undefined) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  }
}
