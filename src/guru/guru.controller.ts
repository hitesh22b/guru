import {Body, Controller, Delete, Get, Param, Post, Put} from "@nestjs/common";
import {CreateGuruDto, GuruIdDto} from "./dto";
import {GuruService} from "./guru.service";
import {UpdateGuruDto} from "./dto/update-guru.dto";

@Controller('gurus')
export class GuruController {

    constructor(private readonly guruService: GuruService) {
    }

    @Get()
    getAllGurus() {
        return this.guruService.getAllGurus();
    }

    @Get(':guruId')
    getGuru(@Param() guruIdDto: GuruIdDto) {
        return this.guruService.getGuru(guruIdDto.guruId);
    }

    @Post()
    createGuru(@Body() createGuru: CreateGuruDto) {
        return this.guruService.createGuru(createGuru);
    }

    @Put(':guruId')
    updateGuru(@Param() param: GuruIdDto, @Body() updateGuru: UpdateGuruDto) {
        return this.guruService.updateGuru(param.guruId, updateGuru)
    }

    @Delete(':guruId')
    deleteGuru(@Param() param: GuruIdDto) {
        return this.guruService.deleteGuru(param.guruId);
    }
}
