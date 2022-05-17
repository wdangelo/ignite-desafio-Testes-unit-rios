import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { compare } from "bcryptjs";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let showUserProfileUseCase: ShowUserProfileUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Show user profile", () => {
    beforeEach(() => {
        usersRepositoryInMemory = new InMemoryUsersRepository();
        showUserProfileUseCase = new ShowUserProfileUseCase(
          usersRepositoryInMemory
        );
        createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory)
      });

      it("should be able to list user's profile", async () => {
        const user = {
          name: "user test",
          email:"user@email.com",
          password: "abc12345",
        };
    
        const userInsert = await createUserUseCase.execute({
          name: user.name,
          email: user.email,
          password: user.password
        });
    
        expect(userInsert).toHaveProperty("id");
        const listUser = await showUserProfileUseCase.execute(userInsert.id as string)
    
        const passwordCompare = await compare(user.password, listUser.password);
    
        expect(listUser).toHaveProperty("id")
        expect(listUser.email).toEqual(user.email)
        expect(listUser.name).toEqual(user.name)
        expect(passwordCompare).toBe(true)
      });
    
      it("should not be able to list un-existing user's profile", async () => {
        expect(async () => {
          const user_id = "mmm98765432123"
          await showUserProfileUseCase.execute(user_id)
        }).rejects.toBeInstanceOf(ShowUserProfileError)
      })
});