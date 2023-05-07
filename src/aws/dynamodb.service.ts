import {Injectable, Param} from "@nestjs/common";
import {Item, KeyCondition, ReadMultipleRes} from "./interfaces/db";
import {DynamoDBClient, DynamoDBClientConfig, GetItemCommand, PutItemInput} from "@aws-sdk/client-dynamodb";
import {
    DeleteCommand, DeleteCommandInput,
    DynamoDBDocumentClient,
    GetCommand,
    GetCommandInput,
    PutCommand,
    PutCommandInput, QueryCommand, QueryCommandInput, UpdateCommand,
    UpdateCommandInput
} from "@aws-sdk/lib-dynamodb";
import {KeyObject} from "./interfaces/db/key.interface";
import {UpdateInput} from "./interfaces/db/input/update-input.interface";
import {GetUpdateExpression} from "./interfaces/db/get-update-expression";
import {ConditionType} from "./enum/condtition-type.enum";
import {ConditionExpression} from "./interfaces/db/input/condition-expression.interface";
import {QueryRes} from "./interfaces/db/query-res.interface";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class DynamodbService {

    private readonly dynamodbClient: DynamoDBClient;

    private readonly client: DynamoDBDocumentClient;

    constructor(private readonly config: ConfigService) {
        let region = this.config.get<string>('AWS_DEPLOYMENT_REGION');
        const marshallOptions = {
            convertClassInstanceToMap: true,
            removeUndefinedValues: true,
        };
        let dynamoDbConfig: DynamoDBClientConfig = { region }
        this.dynamodbClient = new DynamoDBClient(dynamoDbConfig);
        this.client = DynamoDBDocumentClient.from(this.dynamodbClient, {marshallOptions});
    }

    public async putItem(tableName: string, data: Item): Promise<void> {
        const params: PutCommandInput = {
            TableName: tableName,
            Item: data
        }

        const command = new PutCommand(params);

        await this.client.send(command);
    }

    public async getItem(tableName: string, keys: KeyObject): Promise<ReadMultipleRes> {
        const params: GetCommandInput = {
            TableName: tableName,
            Key: keys
        }

        try {
            const command = new GetCommand(params);
            const {Item: item} = await this.client.send(command);

            if (item && Object.keys(item).length) {
                return {success: [item], failed: []};
            }

            return {success: [], failed: []};
        } catch (_err) {
            return {success: [], failed: [keys]};
        }
    }

    public async updateItem(tableName: string, input: UpdateInput): Promise<void> {
        let updateAttributes = this.getUpdateAttributes(input.update);

        const params: UpdateCommandInput = {
            TableName: tableName,
            Key: input.keys,
            UpdateExpression: updateAttributes.UpdateExpression,
            ExpressionAttributeValues: updateAttributes.ExpressionAttributeValues,
            ReturnValues: 'ALL_NEW',
        }

        const command = new UpdateCommand(params);

        await this.client.send(command);
    }

    public async deleteItem(tableName: string, keys: KeyObject): Promise<void> {

        const params: DeleteCommandInput = {
            TableName: tableName,
            Key: keys,
        }

        const command = new DeleteCommand(params);

        await this.client.send(command)
    }

    public async query(tableName: string, keyCondition: KeyCondition): Promise<QueryRes> {
        let conditionExpression = this.getKeyConditionExpression(keyCondition)
        const params: QueryCommandInput = {
            TableName: tableName,
            KeyConditionExpression: conditionExpression.conditionExpression,
            ExpressionAttributeValues: conditionExpression.expressionAttributeValue,
        }

        const command = new QueryCommand(params);
        const result = await this.client.send(command);

        const { Items, Count, ScannedCount, LastEvaluatedKey } = result;
        const defaultCount = 0;

        return {
            items: Items || [],
            count: Count || defaultCount,
            scannedCount: ScannedCount,
            ...(LastEvaluatedKey && { offset: LastEvaluatedKey }),
        };
    }

    private getUpdateAttributes(attribute: Record<string, any>): GetUpdateExpression {
        let conditionString = '';
        let updateExpression = '';
        let expressionAttributeValues = {};
        const entries = Object.entries(attribute);

        entries.forEach((entry, i) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const [key, value] = entry;
            const uniqueId = `:uniqueId${i}`;

            if (i) {
                conditionString += `, ${key} = ${uniqueId}`;
            } else {
                conditionString += `${key} = ${uniqueId}`;
            }

            expressionAttributeValues[uniqueId] = value;
        });

        updateExpression += ` SET ${conditionString}`;

        return {
            UpdateExpression:  updateExpression,
            ExpressionAttributeValues: expressionAttributeValues,
        };
    }

    public getKeyConditionExpression(keys: KeyCondition): ConditionExpression {
        let conditionExpression = '';
        let expressionAttributeValue = {};
        const { primaryKey, secondaryKey } = keys;

        conditionExpression = `${primaryKey.colName} = :${primaryKey.colName}`;
        expressionAttributeValue[`:${primaryKey.colName}`] = primaryKey.colValue;

        if (secondaryKey) {
            switch (secondaryKey.condition) {
                case ConditionType.BEGINS_WITH:
                    conditionExpression += ` and ${secondaryKey.condition}(${secondaryKey.colName}  , :${secondaryKey.colName})`;
                    expressionAttributeValue[`:${secondaryKey.colName}`] = secondaryKey.colValue;
                    break;
                case ConditionType.BETWEEN: {
                    conditionExpression += ` and ${secondaryKey.colName} ${secondaryKey.condition} :start and :end`;

                    if (Array.isArray(secondaryKey.colValue)) {
                        const [start, end] = secondaryKey.colValue;

                        conditionExpression[':start'] = start;
                        expressionAttributeValue[':end'] = end;
                    }
                    break;
                }
                default:
                    conditionExpression += ` and ${secondaryKey.colName} ${secondaryKey.condition} :${secondaryKey.colName}`;
                    expressionAttributeValue[`:${secondaryKey.colName}`] = secondaryKey.colValue;
            }
        }

        return {
            conditionExpression: conditionExpression,
            expressionAttributeValue: expressionAttributeValue
        };
    }


}
