import {ApiProperty} from "@nestjs/swagger";
import {IsDefined, IsString} from "class-validator";

export class UpdateFeatureDescriptionRequest {
  @ApiProperty()
  @IsString()
  @IsDefined()
  description: string;
}
