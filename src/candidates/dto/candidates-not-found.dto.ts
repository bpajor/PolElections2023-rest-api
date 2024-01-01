import { ApiProperty } from "@nestjs/swagger";

export class CandidatesNotFoundDto {
    @ApiProperty({
        description: 'message',
        example: 'Candidates not found',
    })
    readonly message: string;

    @ApiProperty({
        description: 'statusCode',
        example: 404,
    })
    readonly statusCode: number;
}