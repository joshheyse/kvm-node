import {Transform, TransformCallback} from 'stream';
import {PortEvent, HotKeyEvent, BuzzerEvent, HubSyncEvent, AudioSyncEvent} from './commands';

export class ReadTransform extends Transform {
  private stringBuffer = '';

  constructor(public readonly path: string) {
    super({objectMode: true});
  }

  public _transform(chunk: Buffer, _encoding: BufferEncoding, callback: TransformCallback): void {
    this.stringBuffer += chunk.toString('ascii');
    let index = this.stringBuffer.indexOf('\r\n');
    while (index > 0) {
      const line = this.stringBuffer.substring(0, index);
      this.stringBuffer = this.stringBuffer.substring(index + 2);
      index = this.stringBuffer.indexOf('\r\n');
      console.info({path: this.path, line, next: this.stringBuffer, index});

      try {
        for (let i = 0; i < parsers.length; i++) {
          const {regex, type} = parsers[i];
          const match = regex.exec(line);
          if (line === 'CH3') {
            console.log(match);
          }
          if (match) {
            this.push(new (Function.prototype.bind.apply(type, [null, ...match.slice(1)]))());
            continue;
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
    regex: /CH\-?(?<channel>1|2|3|4)/,
    type: PortEvent,
  },
  {
    regex: /Hot KEY\s*:\s*(?<status>CTRL|SHIFT|SCROLL|CAPS)/,
    type: HotKeyEvent,
  },
  {
    regex: /Buzzer\s*:\s*(?<status>ON|OFF)/,
    type: BuzzerEvent,
  },
  {
    regex: /HUB(?<hub>1|2)\s*:\s*(?<sync>Sync|1|2|3|4)/,
    type: HubSyncEvent,
  },
  {
    regex: /AUDIO\s*:\s*(?<sync>Sync|1|2|3|4)/,
    type: AudioSyncEvent,
  },
];
