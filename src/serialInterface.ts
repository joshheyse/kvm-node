import autobind from 'autobind-decorator';
import {EventEmitter} from 'events';
import SerialPort from 'serialport';
import {Command} from './commands';
import {ReadTransform} from './readTransformer';

@autobind
export default class SerialInterface extends EventEmitter {
  private serialPort: SerialPort;

  constructor(public readonly path: string) {
    super();
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

  private onData(data: any) {
    console.log(`SerialPort ${this.path}`, data);
    this.emit('data', data);
  }

  public async open(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.serialPort.open((err) => {
        if (err) {
          reject(err);
        }
        setTimeout(async () => {
          resolve();
        }, 400);
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
