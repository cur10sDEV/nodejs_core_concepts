import { createReadStream, createWriteStream } from "fs";
import path from "path";
import {
  createBrotliCompress,
  createBrotliDecompress,
  createGunzip,
  createGzip,
} from "zlib";

// NOTE: These compression/decompression methods returns a "TRANSFORM" stream
//  that changes the data along the way and returns it for any writeStream to ingest it

// #################################### GZIP ####################################

// compress
const gzipCompressSrc = createReadStream(
  path.join(__dirname, "../../test.txt")
);
const gzipCompressDest = createWriteStream(
  path.join(__dirname, "../../test-compressed.gz")
);
gzipCompressSrc.pipe(createGzip()).pipe(gzipCompressDest);

// decompress
const gzipUncompressSrc = createReadStream(
  path.join(__dirname, "../../test-compressed.gz")
);
const gzipUncompressDest = createWriteStream(
  path.join(__dirname, "../../test-uncompressed.txt")
);
gzipUncompressSrc.pipe(createGunzip()).pipe(gzipUncompressDest);

// #################################### GZIP ####################################

// #################################### BROTLI ####################################

// compress
const brotliCompressSrc = createReadStream(
  path.join(__dirname, "../../test.txt")
);
const brotliCompressDest = createWriteStream(
  path.join(__dirname, "../../test-compressed.gz")
);
brotliCompressSrc.pipe(createBrotliCompress()).pipe(brotliCompressDest);

// decompress
const brotliUncompressSrc = createReadStream(
  path.join(__dirname, "../../test-compressed.gz")
);
const brotliUncompressDest = createWriteStream(
  path.join(__dirname, "../../test-uncompressed.txt")
);
brotliUncompressSrc.pipe(createBrotliDecompress()).pipe(brotliUncompressDest);

// #################################### BROTLI ####################################

/* 

Compressing responses from the server 

1. Using Proxy like Nginx

2. Custom Solution
  - read headers `Content-Encoding: gzip, deflate, br, zstd` 
  - set headers `Content-Encoding` , `Content-Length: [compressed size]` (or can be removed in favour of `Transfer-Encoding: chunked` for varying size)
  - ability to compress only certain type of data with certain type of compression algo.(mimeTypes)
  - set a minimum length of response body for compression, lower than that will not compress it
  - send responses with appropriate/supported compression

3. npm packages

!!! IMPORTANT !!!
>> DO NOT COMPRESS SENSITIVE DATA LIKE TOKENS, etc.
>> BECAUSE OF THE BREACH ATTACK (when using COMPRESSION + ENCRYPTION(HTTPS))

NOTE>> `Cache` the compressed results to avoid duplication of efforts

NOTE>> Also minify your files before deployment

*/
