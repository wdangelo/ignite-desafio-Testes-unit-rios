import { OperationType, Statement } from "@modules/statements/entities/Statement";
import { IStatementsRepository } from "@modules/statements/repositories/IStatementsRepository";
import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import { AppError } from "@shared/errors/AppError";
import { container, inject, injectable } from "tsyringe";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";

interface IRequest {
    receivedUserId: string;
    senderUserId: string;
    amount: number;
    description: string;
}


interface IResponse {
    statement: Statement[];
    balance: number;
  }

@injectable()
class CreateTransfersUseCase {
    constructor(
        @inject("UserRepository")
        private usersRepository: IUsersRepository,
        @inject('StatementsRepository')
        private statementsRepository: IStatementsRepository
    ){}
    
    async execute({ receivedUserId, senderUserId, amount, description }: IRequest) {
        
        const receive = await this.usersRepository.findById(receivedUserId)

        if(!receive) {
            throw new AppError("Receive already does not exist!")
        }

        const sender = await this.usersRepository.findById(senderUserId)


        if(!sender) {
            throw new AppError("Sender already does not exist!")
        }

        const balance = await this.statementsRepository.getUserBalance({
            user_id: sender.id as string,
            with_statement: true
         })

        const positive_balance = balance as IResponse;

        if(amount > positive_balance.balance) {
            throw new AppError("Insufficient balance to carry out the transaction")
        }

        const createStatement = container.resolve(CreateStatementUseCase);

        await createStatement.execute({
            amount: amount * -1,
            description,
            type: OperationType.TRANSFER,
            user_id: sender.id as string
        });

        await createStatement.execute({
            amount,
            description,
            type: OperationType.TRANSFER,
            user_id: sender.id as string
        })

        
    }
}

export { CreateTransfersUseCase }

