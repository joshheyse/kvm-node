import SerialPort from 'serialport';
import {Command} from './commands';

export default class SerialInterface {
  private serialPort: SerialPort;

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
    this.serialPort.on('data', (data: Buffer) => {
      this.onData(data);
    });
  }

  private onData(data: Buffer) {
    const dataString = data.toString('ascii');
    console.log(`SerialPort ${this.path} data`, dataString);
  }

  public async open(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.serialPort.open((err) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  }

  public async sendCommand(command: Command): Promise<void> {
    return new Promise((resolve, reject) => {
      const commandText = command.write() + '\n';
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
