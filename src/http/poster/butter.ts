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
    (req: ButterRequest, res: ButterResponse) => unknown
  >;

  private registeredMiddlewares: MiddlewareFunction[];

  constructor() {
    this.server = http.createServer();
    this.registeredRoutes = new Map();
    this.registeredMiddlewares = [];

    this.server.on("request", (req: ButterRequest, res: ButterResponse) => {
      // --------------------- RESPONSE ---------------------
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

      // run middlewares (global)
      const runMiddlewares = (
        req: ButterRequest,
        res: ButterResponse,
        middlewares: MiddlewareFunction[],
        index: number
      ) => {
        // run route handler after all the middlewares
        if (index === middlewares.length) {
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
        } else {
          middlewares[index](req, res, () => {
            runMiddlewares(req, res, middlewares, index + 1);
          });
        }
      };

      runMiddlewares(req, res, this.registeredMiddlewares, 0);
    });
  }

  listen(port: number, cb?: () => void) {
    this.server.listen(port, cb);
  }

  route(
    method: HTTP_METHODS,
    route: string,
    cb: (req: ButterRequest, res: ButterResponse) => unknown
  ) {
    this.registeredRoutes.set(`${method}_${route}`, cb);
  }

  beforeEach(middlewareFunction: MiddlewareFunction) {
    this.registeredMiddlewares.push(middlewareFunction);
  }
}

// TYPES
type HTTP_METHODS = "get" | "post" | "put" | "patch" | "delete";

type ButterResponse = {
  status: (statusCode: number) => ButterResponse;
  send: (text: string) => void;
  sendFile: (path: string, mimeType: string) => void;
  json: (obj: CustomObject) => void;
} & http.ServerResponse<http.IncomingMessage> & {
    req: http.IncomingMessage;
  };

type ButterRequest = {
  [key: string]: any;
} & http.IncomingMessage;

type CustomObject = { [key: string]: any };

type MiddlewareFunction = (
  req: ButterRequest,
  res: ButterResponse,
  next: (...args: any[]) => void
) => void;
