import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @ApiProperty({
    description: 'User email',
    example: 'test@test.com'
  })
  @Prop({ required: true })
  email: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
