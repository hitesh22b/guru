export interface CreateGuruItem {
    pk: 'gurus';
    sk: string;
    guruName: string;
    designation: string;
}

export type GetGuruItem = CreateGuruItem

export interface UpdateGuruItem  extends Partial<Omit<CreateGuruItem, 'pk' | 'sk'>> {
}
