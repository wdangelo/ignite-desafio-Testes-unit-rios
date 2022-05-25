import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";

import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { OperationType, Statement } from "../../entities/Statement";
import { ICreateStatementDTO } from "./ICreateStatementDTO";
import { CreateStatementError } from "./CreateStatementError";

let createStatementUseCase: CreateStatementUseCase; 
let inMemoryStatementsRepository: InMemoryStatementsRepository
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create a new deposit", () => {

  beforeEach(() => {
      inMemoryUsersRepository = new InMemoryUsersRepository();
      createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);

      inMemoryStatementsRepository = new InMemoryStatementsRepository()
      createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
  });

  it("should be able to create a new deposit", async () => {

      const user: ICreateUserDTO = {
          email: "user@teste.com",
          password: "1234",
          name: "User Test",
        };
    
        const userCreated = await createUserUseCase.execute(user);
  
        const user_id = userCreated.id as string
    
        const deposit: ICreateStatementDTO = {
          user_id,
          type: "deposit" as OperationType,
          amount: 100,
          description: "DINDIN",
        }
    
        const resultDeposit = await createStatementUseCase.execute(deposit)
        expect(resultDeposit).toHaveProperty("id")
        expect(resultDeposit.user_id).toEqual(user_id)
        expect(resultDeposit.amount).toEqual(deposit.amount)
        expect(resultDeposit.type).toEqual(deposit.type)

  })

  it("should be able to make withdraw", async () => {
    const user: ICreateUserDTO = {
      email: "user@teste.com",
      password: "1234",
      name: "User Test",
    };

    const userCreated = await createUserUseCase.execute(user);

    expect(userCreated).toHaveProperty("id");
    const user_id = userCreated.id as string

    const deposit: ICreateStatementDTO = {
      user_id,
      type: "deposit" as OperationType,
      amount: 100,
      description: "DINDIN",
    }

    await createStatementUseCase.execute(deposit)

    const withdraw: ICreateStatementDTO = {
      user_id,
      type: "withdraw" as OperationType,
      amount: 100,
      description: "DINDIN",
    }

    const resultWithdraw = await createStatementUseCase.execute(withdraw)

    expect(resultWithdraw).toBeInstanceOf(Statement)
    expect(resultWithdraw).toHaveProperty("id")
    expect(resultWithdraw.user_id).toEqual(user_id)
    expect(resultWithdraw.type).toEqual(withdraw.type)
    expect(resultWithdraw.amount).toEqual(withdraw.amount)
  })

  it("should not be able to deposit/withdraw with non-existing user", async () => {
    expect(async () => {
      const user_id = "Non_existing_user-345676473"
      const deposit: ICreateStatementDTO = {
        user_id,
        type: "deposit" as OperationType,
        amount: 100,
        description: "DINDIN",
      }

      await createStatementUseCase.execute(deposit)
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound)
  })

  it("should not be able to withdraw without money", async () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        email: "1user@teste.com",
        password: "1234",
        name: "User Test",
      };

      const userCreated = await createUserUseCase.execute(user);

      expect(userCreated).toHaveProperty("id");
      const user_id = userCreated.id as string

      const withdraw: ICreateStatementDTO = {
        user_id,
        type: "withdraw" as OperationType,
        amount: 100,
        description: "DINDIN",
      }

      await createStatementUseCase.execute(withdraw)
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds)
  })


})