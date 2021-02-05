import {Transform, TransformCallback} from 'stream';

export class ReadTransform extends Transform {
  private buffer = '';

  public _transform(chunk: Buffer, _encoding: BufferEncoding, callback: TransformCallback): void {
    const str = chunk.toString('ascii');
    this.buffer += str;
    const crIndex = this.buffer.indexOf('\r');
    if (crIndex) {
      console.log('CR INDEX', crIndex);
    }
    callback();
  }
}
