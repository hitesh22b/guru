import {Injectable} from "@nestjs/common";
import {GuruRepository} from "./guru.repository";
import {CreateGuru} from "./interfaces/guru.interfac";
import {CreateGuruItem} from "./interfaces/guru-item.interface";
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class GuruService {

    constructor(private readonly guruRepository: GuruRepository) {
    }

    public async createGuru(createGuru: CreateGuru): Promise<void> {
        console.log('here');
        const item: CreateGuruItem = {
            pk: 'gurus',
            sk: `guru:${uuidv4()}`,
            name: createGuru.name,
            designation: createGuru.designation
        }
        return this.guruRepository.insertItem(item);
    }
}
