import SerialInterface from './serialInterface';
import {ListInfoCommand, ChangePort} from './commands';

async function main() {
  const kvmA = new SerialInterface('/dev/ttyUSB0');
  await kvmA.open();
  await kvmA.sendCommand(ListInfoCommand);
  await kvmA.sendCommand(ChangePort(1));

  // const kvmB = new SerialInterface('/dev/ttyUSB1');
  // await kvmB.open();
  // await kvmB.sendCommand(ListInfoCommand);
}

main();
