import { Connection } from "typeorm/connection/Connection"
import request  from "supertest";
import creatConnection from "../../../../database"
import { hash } from "bcryptjs";
import { v4 as uuidV4 } from "uuid";
import { app } from "../../../../app";

let connection: Connection;

describe("Show User Profile", () => {
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

    it("should be able to show user profile", async () => {


        const responseToken = await request(app).post("/api/v1/sessions").send({
            email: "admin@admin.com.br'",
            password: "admin",
        });

        console.log(responseToken.body)

        const { token } = responseToken.body;

        const response = await request(app).get("/api/v1/profile").send().set({
            Authorization: `Bearer ${token}`,
        })

        console.log(response.body)
        
        expect(response.status).toBe(201);
    });

});