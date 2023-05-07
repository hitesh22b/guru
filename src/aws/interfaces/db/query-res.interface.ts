export interface QueryRes {
    items: { [key: string]: any }[];
    count: number;
    scannedCount?: number;
    offset?: { [key: string]: string };
}
