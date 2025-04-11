import { open } from "fs/promises";
import http from "http";

/**
 * Butter - A custom nodejs framework
 */

export class Butter {
  private server: http.Server<
    typeof http.IncomingMessage,
    typeof http.ServerResponse
  >;

  private registeredRoutes: Map<
    string,
    (req: http.IncomingMessage, res: ButterResponse) => unknown
  >;

  constructor() {
    this.server = http.createServer();
    this.registeredRoutes = new Map();
    this.server.on("request", (req, res: ButterResponse) => {
      // defining custom methods
      res.status = (status) => {
        res.statusCode = status;
        return res;
      };
      res.send = (text) => {
        res.setHeader("Content-Type", "text/plain");
        res.end(text);
      };
      res.sendFile = async (path, mimeType) => {
        const fileHandle = await open(path, "r");
        const fileStream = fileHandle.createReadStream();
        res.setHeader("Content-Type", mimeType);
        fileStream.pipe(res);

        // end the stream and fileHandle after it finishes to avoid memory leaks
        fileStream.on("end", () => {
          fileStream.close();
          fileHandle.close();
        });
      };
      res.json = (object) => {
        // NOTE: can also implement streams/piping to tackle with large amounts of data
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(object));
      };

      // getting the callback based on route matches
      const cb = this.registeredRoutes.get(
        `${req.method?.toLowerCase()}_${req.url}`
      );

      // calling the callback
      if (cb) {
        cb(req, res);
      } else {
        // if no callback means route not defined
        res.status(404).json({ error: `Cannot ${req.method} ${req.url}` });
      }
    });
  }

  listen(port: number, cb?: () => void) {
    this.server.listen(port, cb);
  }

  route(
    method: HTTP_METHODS,
    route: string,
    cb: (req: http.IncomingMessage, res: ButterResponse) => unknown
  ) {
    this.registeredRoutes.set(`${method}_${route}`, cb);
  }
}

// TYPES
type HTTP_METHODS = "get" | "post" | "put" | "patch" | "delete";

type ButterResponse = {
  status: (statusCode: number) => ButterResponse;
  send: (text: string) => void;
  sendFile: (path: string, mimeType: string) => void;
  json: (obj: { [key: string]: any }) => void;
} & http.ServerResponse<http.IncomingMessage> & {
    req: http.IncomingMessage;
  };
