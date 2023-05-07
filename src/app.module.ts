import {Module} from '@nestjs/common';
import {AwsModule} from "./aws/aws.module";
import {GuruModule} from "./guru/guru.module";
import {ConfigModule} from "@nestjs/config";

@Module({
    imports: [
      AwsModule,
      GuruModule,
      ConfigModule.forRoot({ isGlobal: true})],
})
export class AppModule {
}
