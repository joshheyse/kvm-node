import SerialInterface from './serialInterface';
import {ListInfoCommand} from './commands';

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function main() {
  const kvmA = new SerialInterface('/dev/ttyUSB0');
  await kvmA.open();
  await kvmA.sendCommand(ListInfoCommand);

  const kvmB = new SerialInterface('/dev/ttyUSB1');
  await kvmB.open();
  await kvmB.sendCommand(ListInfoCommand);
}

main();
