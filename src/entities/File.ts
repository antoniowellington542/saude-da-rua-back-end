import { constEnumType } from '../utils/ConstEnumType';

export const FileType: { [x: string]: 'IMAGE' | 'PDF' } = {
    IMAGE: 'IMAGE',
    PDF: 'PDF',
};

interface TFileProps {
    id?: string;

    fileType: constEnumType<typeof FileType>;
    url: string;
    createdAt?: Number;
    updatedAt?: Number;
}

export class File {
    public readonly id: string;

    public readonly fileType: constEnumType<typeof FileType>;

    public url: string;

    public createdAt: Number;

    constructor(props: TFileProps) {
        Object.assign(this, {
            ...props,
            createdAt: props.createdAt || Date.now(),
        });
    }
}
