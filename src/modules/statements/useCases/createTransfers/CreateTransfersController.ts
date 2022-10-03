import { Request,  Response } from "express";
import { container } from "tsyringe";
import { CreateTransfersUseCase } from "./CreateTransfersUseCase";



class CreateTransfersController {
    async handle(request: Request, response: Response){
        const { user_id: receivedUserId } = request.params
        const { amount, description } = request.body;

        const createTransfersUseCase = container.resolve(CreateTransfersUseCase)

        await createTransfersUseCase.execute({
            amount,
            receivedUserId,
            description,
            senderUserId: request.user.id
        });

    }
}

export{ CreateTransfersController };