import {Transform, TransformCallback} from 'stream';

export class ReadTransform extends Transform {
  private buf: Buffer = Buffer.alloc(0);

  public _transform(chunk: Buffer, _encoding: BufferEncoding, callback: TransformCallback): void {
    this.buf = Buffer.concat([this.buf, chunk]);
    console.log(this.buf.toString('ascii'));
    console.log(this.buf.toString('hex'));
    callback();
  }
}
