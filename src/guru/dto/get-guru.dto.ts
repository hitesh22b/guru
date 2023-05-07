import {GetGuru} from "../interfaces/guru.interfac";

export class GetGuruDto implements GetGuru {

    designation!: string;

    guruId!: string;

    name!: string;
}
