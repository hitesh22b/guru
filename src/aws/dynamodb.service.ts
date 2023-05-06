import {Injectable} from "@nestjs/common";
import {Item} from "./interfaces/db";
import {DynamoDBClient, DynamoDBClientConfig, PutItemInput} from "@aws-sdk/client-dynamodb";
import {DynamoDBDocumentClient, PutCommand, PutCommandInput} from "@aws-sdk/lib-dynamodb";

@Injectable()
export class DynamodbService {

    private readonly dynamodbClient: DynamoDBClient;

    private readonly documentClient: DynamoDBDocumentClient;

    constructor() {
        const marshallOptions = {
            convertClassInstanceToMap: true,
            removeUndefinedValues: true,
        };
        let dynamoDbConfig: DynamoDBClientConfig = { region: 'ap-south-1'}
        this.dynamodbClient = new DynamoDBClient(dynamoDbConfig);
        this.documentClient = DynamoDBDocumentClient.from(this.dynamodbClient, {marshallOptions});
    }

    public async putItem(tableName: string, data: Item) {
        console.log(data);
        const params: PutCommandInput = {
            TableName: tableName,
            Item: data
        }

        const command = new PutCommand(params);

        await this.documentClient.send(command);
    }
}
