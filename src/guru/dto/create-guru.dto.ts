import {CreateGuru} from "../interfaces/guru.interfac";
import {IsNotEmpty, IsString} from "class-validator";

export class CreateGuruDto implements CreateGuru {
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsString()
    @IsNotEmpty()
    designation!: string
}
