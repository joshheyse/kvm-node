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
  await sleep(1000);
  for (let i = 0; i < 10; i++) {
    kvmA.sendCommand(ListInfoCommand);
    await sleep(10000);
  }
}

main();
