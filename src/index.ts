import SerialInterface from './serialInterface';
import {ListInfoCommand, PortEvent, ChangePort} from './commands';

async function main() {
  const kvmA = new SerialInterface('/dev/ttyUSB0');
  await kvmA.open();
  await kvmA.sendCommand(ListInfoCommand);

  const kvmB = new SerialInterface('/dev/ttyUSB1');
  await kvmB.open();
  await kvmB.sendCommand(ListInfoCommand);
  kvmB.on('data', (data) => {
    if (data instanceof PortEvent) {
      console.log(`syncing to port ${data.port}`);
      kvmA.sendCommand(ChangePort(data.port));
    }
  });
}

main();
