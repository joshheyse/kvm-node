import SerialPort from 'serialport';

async function openSerialPort(path: string): Promise<SerialPort> {
  return new Promise((resolve, reject) => {
    let serialPort: SerialPort;
    serialPort = new SerialPort(path, {
      baudRate: 115200,
      dataBits: 8,
      stopBits: 1,
      xoff: true,
      parity: 'none'
    }, (response: Error|null|undefined) => {
      if(response instanceof Error) {
        reject(response);
      }
      resolve(serialPort);
    });
  });
}

async function main() {
  const primaryKVM = await openSerialPort('/dev/ttyUSB0');
  console.log('SerialPort opened');
  primaryKVM.on('data', (d: string) => console.log(d));
  primaryKVM.on('error', (err) => console.error(err));
  primaryKVM.on('close', () => console.log('SerialPort closed'));
  primaryKVM.on('drain', () => console.log('SerialPort drained'));
  primaryKVM.write('K1P0\n', 'ascii');
  primaryKVM.drain();
}

main();

