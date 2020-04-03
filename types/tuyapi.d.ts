/// <reference types="node" />

declare module "tuyapi" {
  import { EventEmitter } from "events";

  interface CommonObject {
    [key: string]: string | number | undefined | null;
  }

  export interface TuyaAPIFindOptions {
    /**
     * Find true to return array of all found devices
     */
    all?: boolean;

    /**
     * how long, in seconds, to wait for device
     * to be resolved before timeout error is thrown
     * default: 10;
     */
    timeout?: number;
  }

  export interface TuyaAPIFindResponse extends CommonObject {}

  export interface TuyaAPIOptions {
    /**
     * ID of device
     */
    id: string;

    /**
     * encryption key of device
     */
    key: string;
    /**
     * IP of device
     */
    ip: string;

    /**
     * product key of device
     */
    productKey?: string;

    /**
     * port of device
     */
    port?: number;
    /**
     * protocol version
     */
    version?: string;
  }

  export interface TuyaAPISetOptions {
    /**
     * DPS index to set
     */
    dps: number;

    /**
     * value to set
     */
    set?: any;

    /**
     *  Whether or not multiple properties should be set with options.data
     */
    multiple?: boolean;

    /**
     * Multiple properties to set at once. See above.
     */
    data?: { [key: string]: string | number };
  }

  export interface TuyaAPISetResponse extends CommonObject {}

  export class TuyAPI extends EventEmitter {
    constructor(options: TuyaAPIOptions);
    get(options?: any): Promise<boolean | any>;
    set(options: TuyaAPISetOptions): Promise<TuyaAPISetResponse>;
    find(
      options?: TuyaAPIFindOptions
    ): Promise<Boolean | TuyaAPIFindResponse[]>;
    connect(): Promise<boolean>;
    disconnect(): void;
    isConnected(): boolean;
  }

  export default TuyAPI;
}
