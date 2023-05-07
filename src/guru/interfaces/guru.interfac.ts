export interface CreateGuru {
    name: string;
    designation: string;
}

export interface GetGuru extends CreateGuru {
    guruId: string;
}

export interface UpdateGuru extends Partial<CreateGuru> {

}
