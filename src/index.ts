import SerialInterface from './serialInterface';
import {ListInfoCommand} from './commands';

async function main() {
  const kvmA = new SerialInterface('/dev/ttyUSB0');
  await kvmA.open();
  kvmA.sendCommand(ListInfoCommand);
}

main();
