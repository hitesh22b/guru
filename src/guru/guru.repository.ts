import {Injectable} from "@nestjs/common";
import {DynamodbService} from "../aws/dynamodb.service";
import {CreateGuruItem, GetGuruItem, UpdateGuruItem} from "./interfaces/guru-item.interface";
import {KeyCondition} from "../aws/interfaces/db";
import {ConditionType} from "../aws/enum/condtition-type.enum";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class GuruRepository {

    private readonly tableName: string;

    constructor(private readonly db: DynamodbService, private readonly config: ConfigService) {
        this.tableName = this.config.get<string>('TABLE_NAME');
    }

    public async insertItem(item: CreateGuruItem): Promise<void> {
        return this.db.putItem(this.tableName, item);
    }

    public async getItem(id: string): Promise<GetGuruItem | undefined> {
        const { success } = await this.db.getItem(this.tableName, { pk: 'gurus', sk: `guru:${id}`});

        const [ guru ] = success;

        return guru as GetGuruItem | undefined;
    }

    public async getAllItems(): Promise<GetGuruItem[]> {
        const keyCondition: KeyCondition = {
            primaryKey: { colName: 'pk', colValue: 'gurus'},
            secondaryKey: { colName: 'sk', colValue: 'guru:', condition: ConditionType.BEGINS_WITH}
        }
        const { items } = await this.db.query(this.tableName, keyCondition);

        return items as GetGuruItem[];
    }

    public async updateItem(id: string, updateData: UpdateGuruItem): Promise<void> {
        const keys = { pk: 'gurus', sk: `guru:${id}` }
        await this.db.updateItem(this.tableName, {
            keys,
            update: updateData,
        });
    }

    public async deleteItem(id: string): Promise<void> {
        const keys = { pk: 'gurus', sk: `guru:${id}` };

        await this.db.deleteItem(this.tableName,  keys)
    }
}
