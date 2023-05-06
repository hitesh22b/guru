import {INestApplicationContext} from "@nestjs/common";
import {NestFactory} from "@nestjs/core";
import {AppModule} from "./app.module";

describe('app', () => {
    let app: INestApplicationContext;

    beforeAll(async () => {
        app = await NestFactory.create(AppModule);
    });

    it('should be defined', () => {
        expect(app).toBeDefined();
    });
})
