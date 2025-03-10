import { v4 as uuidv4 } from 'uuid';
import { S3 } from 'aws-sdk';
import { File } from '../../entities/File';
import { ICreateFileRepository } from '../../repositories/interfaces';
import { CreateFileDTO } from './CreateFileDTO';
import { ValidationError } from '../../helpers/errors';

const s3 = new S3();
const allowedMimes = [
    'image/jpeg',
    'image/png',
    'image/jpg',
    'application/pdf',
];

export class UploadFileUseCase {
    constructor(private createFileRepository: ICreateFileRepository) {}

    public async execute(params: CreateFileDTO.Params): Promise<File> {
        if (!allowedMimes.includes(params.fileMimeType)) {
            throw new ValidationError('Invalid mime type');
        }

        const buffer = Buffer.from(params.base64File, 'base64');
        const id = uuidv4();
        const url = `https://${process.env.FILE_BUCKET_NAME}.s3-${process.env.region}.amazonaws.com/${key}`;
        const file = new File({ id, fileType: params.fileType, url });

        await s3
            .putObject({
                Body: buffer,
                Key: id,
                ContentType: params.fileMimeType,
                Bucket: process.env.FILE_BUCKET_NAME,
                ACL: 'public-read',
            })
            .promise();

        await this.createFileRepository.createFile(file);

        return file;
    }
}
