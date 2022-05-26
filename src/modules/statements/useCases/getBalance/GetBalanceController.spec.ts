import { Connection } from "typeorm/connection/Connection"
import request  from "supertest";
import creatConnection from "../../../../database"
import { hash } from "bcryptjs";
import { v4 as uuidV4 } from "uuid";
import { app } from "../../../../app";

let connection: Connection;

describe("Get Balance Controller", () => {
    beforeAll(async () => {
        connection = await creatConnection();
        await connection.runMigrations();

        const id = uuidV4();
        const password = await hash("admin", 8);
    
        await connection.query(
            `INSERT INTO USERS(id, name, email, password, created_at, updated_at)
              values('${id}', 'admin', 'admin@admin.com.br', '${password}','now()', 'now()')
            `
          );
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    });

    it("should be able to get balance", async () => {
        const responseToken = await request(app).post("/api/v1/sessions").send({
            email: "admin@admin.com.br",
            password: "admin",
        });

        const { token } = responseToken.body;

        await request(app).post("/api/v1/statements/deposit").send({
            amount: 100,
            description: "deposit test",
        }).set({
            Authorization: `Bearer ${token}`,
        });

        const response = await request(app).get("/api/v1/statements/balance").set({
            Authorization: `Bearer ${token}`,
        });
        expect(response.status).toBe(200);
        expect(response.body.statement[0]).toHaveProperty("id")
        expect(response.body).toHaveProperty("balance")
        expect(response.body.balance).toEqual(100)
    });

});