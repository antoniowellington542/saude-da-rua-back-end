import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { FileType } from '../entities/File';
// // import { CreateVolunteerValidation } from '../utils/validations/volunteerValidations';
// import { TVolunteerProps } from '../entities/Volunteer';
import CreateFileUseCase from '../useCases/createFile';

interface IParsedfromEventBody {
    [name: string]: any;
}

export const handler = async (
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
    const response: APIGatewayProxyResult = {
        isBase64Encoded: false,
        statusCode: 201,
        headers: {
            'content-type': 'application/json',
        },
        body: '',
    };
    const parsedBody: IParsedfromEventBody = JSON.parse(event.body);

    try {
        const fileType = event.pathParameters?.fileType || "";
        // const createVolunteerValidation = new CreateVolunteerValidation(
        //     parsedBody
        // );

        // const createVolunteerPayloadValidated: TVolunteerProps =
        //     await createVolunteerValidation.validateInput();
        const data = parsedBody?.image?.data || parsedBody?.file?.data;
        const mime = parsedBody?.image?.mime || parsedBody?.file?.mime;
        await  CreateFileUseCase.execute({
            base64File: data,
            fileType: fileType as FileType,
            fileMimeType: mime,
        });

        response.body = JSON.stringify({
            message: 'Successfully create a new file',
        });
    } catch (error) {
        response.statusCode = error.code;
        response.body = JSON.stringify({
            errorClassName: error.name,
            generalErrorMessage: error.generalErrorMessage,
            mainErrorMessage: error.mainErrorMessage,
        });
    }

    return response;
};
