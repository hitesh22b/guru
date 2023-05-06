import {Body, Controller, Get, Post} from "@nestjs/common";
import {CreateGuruDto} from "./dto/create-guru.dto";
import {GuruService} from "./guru.service";

@Controller('gurus')
export class GuruController {

    constructor(private readonly guruService: GuruService) {
    }

    @Get()
    getGuru() {
        return "TODO: to be implemented"
    }

    @Post()
    createGuru(@Body() createGuru: CreateGuruDto) {
        return this.guruService.createGuru(createGuru);
    }
}
