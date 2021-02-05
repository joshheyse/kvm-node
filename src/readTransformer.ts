import {Transform, TransformCallback} from 'stream';
import {PortEvent, HotKeyEvent, BuzzerEvent, HubSyncEvent, AudioSyncEvent} from './commands';

export class ReadTransform extends Transform {
  private stringBuffer = '';

  constructor() {
    super({objectMode: true});
  }

  public _transform(chunk: Buffer, _encoding: BufferEncoding, callback: TransformCallback): void {
    this.stringBuffer += chunk.toString('ascii');
    let index = this.stringBuffer.indexOf('\n');
    while (index > 0) {
      const line = this.stringBuffer.substring(0, index);
      this.stringBuffer = this.stringBuffer.substring(index);
      index = this.stringBuffer.indexOf('\n');
      console.log(line, this.stringBuffer, index);

      try {
        for (let i = 0; i < parsers.length; i++) {
          const {regex, type} = parsers[i];
          const match = regex.exec(line);
          if (match) {
            this.push(new (Function.prototype.bind.apply(type, match as any))());
            break;
          }
        }
      } catch (err) {
        console.error(err);
      }
    }
    callback();
  }
}

const parsers = [
  {
    regex: /CH\-?(?<channel>\d)/gm,
    type: PortEvent,
  },
  {
    regex: /Hot KEY\s*:\s*(?<status>CTRL|SHIFT|SCROLL|CAPS)/gm,
    type: HotKeyEvent,
  },
  {
    regex: /Buzzer\s*:\s*(?<status>ON|OFF)/gm,
    type: BuzzerEvent,
  },
  {
    regex: /HUB(?<hub>1|2)\s*:\s*(?<sync>Sync|1|2|3|4)/gm,
    type: HubSyncEvent,
  },
  {
    regex: /AUDIO\s*:\s*(?<sync>Sync|1|2|3|4)/gm,
    type: AudioSyncEvent,
  },
];
