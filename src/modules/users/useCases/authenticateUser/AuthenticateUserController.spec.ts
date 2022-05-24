import { Connection } from "typeorm/connection/Connection"
import request  from "supertest";
import creatConnection from "../../../../database"
import { hash } from "bcryptjs";
import { v4 as uuidV4 } from "uuid";
import { app } from "../../../../app";

let connection: Connection;

describe("Authenticate User Controller", () => {
    beforeAll(async () => {
        connection = await creatConnection();
        await connection.runMigrations();

        const id = uuidV4();
        const password = await hash("admin", 8);

        await connection.query(
            `INSERT INTO USERS(id, name, email, password, created_at, updated_at)
              values('${id}', 'admintest', 'testwil@test.com.br', '${password}', 'now()', 'now()')
            `
          );
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    });

    it("should be able to create session", async () => {
        
        const response = await request(app).post("/api/v1/sessions").send({
            name: "admintest",
            email: "testwil@test.com.br",
            password: "admin",
        })

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("token")
    });

    it("should not be able to authenticate with wrong password", async () => {
        const response = await request(app).post("/api/v1/sessions").send({
            name: "admintest",
            email: "testwil@test.com.br",
            password: "pass-error",
        });
        expect(response.status).toBe(401)
    });

    it("should not be able to authenticate with wrong email", async () => {
        const response = await request(app).post("/api/v1/sessions").send({
          email: "wrong@email.com.br",
          password: "admin",
        });
    
        expect(response.status).toBe(401);
      });

})