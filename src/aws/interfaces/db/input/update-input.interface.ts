import {KeyObject} from "../key.interface";

export interface UpdateInput {
    keys: KeyObject;
    update?: Record<string, any>
}
