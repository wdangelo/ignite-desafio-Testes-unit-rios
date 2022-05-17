import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";

import { hash } from 'bcryptjs';
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase; 
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Create User", () => {

    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    });

    it("should be able to create a new user", async () => {

        const passwordHash = await hash("password", 8);
        const user = {
            email: "test@email.com",
            name: "User Name Test",
            password: passwordHash,
        }

        await createUserUseCase.execute({
            email: user.email,
            name: user.name,
            password: user.password
        })

        const createUser = await inMemoryUsersRepository.findByEmail(user.email);

        expect(createUser).toHaveProperty("id");

    })
})