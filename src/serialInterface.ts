import autobind from 'autobind-decorator';
import {Bus} from 'strongbus';
import SerialPort from 'serialport';
import {Port, HotKey, Sync, Status, Hub} from './types';
import {Command, PortEvent, HotKeyEvent, BuzzerEvent, HubSyncEvent, AudioSyncEvent, ListInfoCommand, ResetBuffer} from './commands';
import {ReadTransform} from './readTransformer';
import {sleep} from './utils';

export type EventMap = {
  port: void;
  hotKey: void;
  buzzer: void;
  hub: Hub;
  audio: void;
};

@autobind
export default class SerialInterface {
  private serialPort: SerialPort;

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

  constructor(public readonly path: string) {
    this.serialPort = new SerialPort(this.path, {
      baudRate: 115200,
      dataBits: 8,
      stopBits: 1,
      xoff: true,
      parity: 'none',
      autoOpen: false,
    });
    this.serialPort.on('open', () => {
      console.log(`SerialPort ${path} open`);
    });
    this.serialPort.on('close', () => {
      console.log(`SerialPort ${path} close`);
    });
    this.serialPort.on('drain', () => {
      console.log(`SerialPort ${path} drain`);
    });
    this.serialPort.on('error', (err: Error | null) => {
      console.error(`SerialPort ${path} error`, err);
    });
    const transform = new ReadTransform(this.path);
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

  private onData(data: any) {
    console.log(`SerialPort ${this.path}`, data);
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
  }

  public async open(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.serialPort.open(async (err) => {
        if (err) {
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
    return new Promise((resolve, reject) => {
      const commandText = command.write() + '\r';
      console.log(`SerialPort ${this.path} sent ${commandText}`);
      this.serialPort.write(commandText, 'ascii');
      this.serialPort.drain((err: Error | null | undefined) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  }
}
