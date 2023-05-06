import {Module} from "@nestjs/common";
import {GuruService} from "./guru.service";
import {GuruRepository} from "./guru.repository";
import {GuruController} from "./guru.controller";

@Module({
    providers: [GuruService, GuruRepository],
    controllers: [GuruController]
})
export class GuruModule {

}
