import {Injectable} from "@nestjs/common";
import {DynamodbService} from "../aws/dynamodb.service";
import {CreateGuruItem} from "./interfaces/guru-item.interface";

@Injectable()
export class GuruRepository {

    private readonly tableName: string;

    constructor(private readonly db: DynamodbService) {
        this.tableName = 'guru'
    }

    public async insertItem(item: CreateGuruItem): Promise<void> {
        return this.db.putItem(this.tableName, item);
    }
}
