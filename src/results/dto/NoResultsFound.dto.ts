import { ApiProperty } from "@nestjs/swagger";

export class NoResultsFoundDto {
    @ApiProperty({
        description: 'Message',
        example: 'No results match specified parameters.',
        required: true,
    })
    message: string;

    @ApiProperty({
        description: 'Status code',
        example: 404,
        required: true,
    })
    status: number;
}