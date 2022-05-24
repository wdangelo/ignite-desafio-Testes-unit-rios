import { Connection } from "typeorm/connection/Connection"
import request  from "supertest";
import creatConnection from "../../../../database"

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

        const response = await request(app).post("/api/v1/users/").send({
            name: "test",
            email: "wil@test.com.br",
            password: "a1b2c3",
        })

        expect(response.status).toBe(201);
    });

})