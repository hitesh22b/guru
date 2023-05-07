export interface Item {
    [key: string]: any;
}

export interface ReadMultipleRes {
    success: Item[];
    failed: Item[];
}
