import {UpdateGuru} from "../interfaces/guru.interfac";
import {IsOptional, IsString} from "class-validator";

export class UpdateGuruDto implements UpdateGuru {

    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    designation?: string

}
