import {ConditionType} from "../../enum/condtition-type.enum";

export type KeyValueType = string | number;

export interface KeyObject {
    [key: string]: KeyValueType;
}

export interface PrimaryKeyCondition {
    colName: string;
    colValue: KeyValueType;
}

export interface SecondaryKeyCondition {
    colName: string;
    colValue: KeyValueType | string[] | number[];
    condition: ConditionType;
}

export interface KeyCondition {
    primaryKey: PrimaryKeyCondition;
    secondaryKey?: SecondaryKeyCondition;
}
