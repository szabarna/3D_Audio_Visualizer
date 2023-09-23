import { Buffer } from 'buffer';

const toBase64 = (byteArray:number[]) => {
    return Buffer.from(byteArray).toString('base64');
}

export { toBase64 };