import {Injectable, NotFoundException} from "@nestjs/common";
import {GuruRepository} from "./guru.repository";
import {CreateGuru, GetGuru, UpdateGuru} from "./interfaces/guru.interfac";
import {CreateGuruItem, GetGuruItem} from "./interfaces/guru-item.interface";
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class GuruService {

    constructor(private readonly guruRepository: GuruRepository) {
    }

    public async createGuru(createGuru: CreateGuru): Promise<void> {
        const item: CreateGuruItem = {
            pk: 'gurus',
            sk: `guru:${uuidv4()}`,
            guruName: createGuru.name,
            designation: createGuru.designation
        }
        return this.guruRepository.insertItem(item);
    }

    public async getAllGurus(): Promise<GetGuru[]> {
        const guruItems = await this.guruRepository.getAllItems();

        return guruItems.map(item => {
            return this.formatGuruItem(item);
        })
    }

    public async getGuru(guruId: string): Promise<GetGuru> {
        const guruItem =  await this.guruRepository.getItem(guruId);

        if(!guruItem) {
            throw new NotFoundException('guru not found');
        }

        return this.formatGuruItem(guruItem);
    }

    public async updateGuru(guruId: string, updateGuru: UpdateGuru): Promise<void> {
        const guruItem =  await this.guruRepository.getItem(guruId);

        if(!guruItem) {
            throw new NotFoundException('guru not found');
        }

        await this.guruRepository.updateItem(guruId, {
            ...(updateGuru.name && { guruName: updateGuru.name}),
            ...(updateGuru.designation && { designation: updateGuru.designation})
        });
    }

    public async deleteGuru(guruId: string): Promise<void> {
        const guruItem =  await this.guruRepository.getItem(guruId);

        if(!guruItem) {
            throw new NotFoundException('guru not found');
        }

        await this.guruRepository.deleteItem(guruId);
    }

    private formatGuruItem(guruItem: GetGuruItem): GetGuru {
        const [, guruId] = guruItem.sk.split(':')
        return {
            guruId,
            name: guruItem.guruName,
            designation: guruItem.designation
        }
    }
}
