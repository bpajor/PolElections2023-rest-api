import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class AccessTokenResponseDto {
  @ApiProperty({
    description: 'JWT token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpvaG5AZXhhbXBsZS5jb20iLCJpYXQiOjE2MjYyNjYxNzUsImV4cCI6MTYyNjI2OTM3NX0.7r9Z5V6qk1jY4wZ8F5g1xQXW0DZ6y8w3Z1gX5N2Vq4Q'
  })
  @IsString()
  readonly 'access-token': string;
}