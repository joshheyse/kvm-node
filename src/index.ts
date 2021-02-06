import SerialInterface, {EventMap} from './serialInterface';
import autobind from 'autobind-decorator';
import {ChangePort} from './commands';
import {Port} from './types';
import bunyan from 'bunyan';


@autobind
class KvmSync {

  constructor(private kvms: SerialInterface[]) {}

  public attach() {
    this.kvms.forEach(kvm => kvm.every(this.handleEvent.bind(this, kvm)));
  }

  private handleEvent(source: SerialInterface, event: keyof EventMap) {
    if(event === 'port') {
      this.kvms.forEach(dest => {
        if(dest === source || dest.port === source.port) {
          return;
        }
        dest.sendCommand(ChangePort(source.port as Port));
      });
    }
  }

}

async function main() {
  const log = bunyan.createLogger({name: 'kvm_sync', stream: process.stdout});
  const kvmA = new SerialInterface('/dev/ttyUSB0', log);
  await kvmA.open();

  const kvmB = new SerialInterface('/dev/ttyUSB1', log);
  await kvmB.open();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const kvmSync = new KvmSync([kvmA, kvmB]);
  kvmSync.attach();
  console.log('KVM Sync running');
}

main();
