import { Module } from '@nestjs/common';
import {AwsModule} from "./aws/aws.module";
import {GuruModule} from "./guru/guru.module";

@Module({
  imports: [AwsModule, GuruModule],
})
export class AppModule {}
