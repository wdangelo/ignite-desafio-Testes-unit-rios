import { Connection } from "typeorm/connection/Connection"
import request  from "supertest";
import creatConnection from "../../../../database"
import { hash } from "bcryptjs";

import { app } from "../../../../app";

let connection: Connection;

describe("Create User Controller", () => {
    beforeAll(async () => {
        connection = await creatConnection();
        await connection.runMigrations();

    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    });

    it("should be able to create an user", async () => {
        const password = await hash("admin", 8)
        const response = await request(app).post("/api/v1/users/").send({
            name: "test",
            email: "wil@test.com.br",
            password: password,
        })

        expect(response.status).toBe(201);
    });

})