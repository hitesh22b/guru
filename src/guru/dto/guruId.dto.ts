import {IsUUID} from "class-validator";

export class GuruIdDto {
    @IsUUID()
    guruId!: string
}
