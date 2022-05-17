import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let authenticateUserUseCase: AuthenticateUserUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User",  () => {

    beforeEach(() => {
        usersRepositoryInMemory = new InMemoryUsersRepository();
        authenticateUserUseCase = new AuthenticateUserUseCase(
          usersRepositoryInMemory
        );
        createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
      });

    it("should be able to authenticate an user", async () => {
        const user: ICreateUserDTO = {
            email: "user@teste.com",
            password: "1234",
            name: "User Test",
        };


        await createUserUseCase.execute(user)

        const result = await authenticateUserUseCase.execute({
            email: user.email,
            password: user.password
        });

        expect(result).toHaveProperty("token");

    });

    it("Should not be able to authenticate an not user", async () => {
        expect(async () => {
            await authenticateUserUseCase.execute({
                email: "user@teste.com",
                password: "1234",
            });
        }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
    });

    it("should not be able to authenticate with incorrect password", async () => {
        expect(async () => {
            const user: ICreateUserDTO = {
                email: "user@teste.com",
                password: "1234",
                name: "User Test",
            };

            await createUserUseCase.execute(user);

            await authenticateUserUseCase.execute({
                email: user.email,
                password: "incorrectPass"
            })
        }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
    });
});