import { expect } from "chai";
import supertest from "supertest";
import envConfig from "../config/env.config.mjs";
import mongoose, { mongo } from "mongoose";
import { userModel } from "../persistences/mongo/models/user.model.mjs";

const requester = supertest(`${envConfig.BASE_URL}:${envConfig.PORT}`);

describe("Test de sesión", async function () {
  this.timeout(5000); // mocha tiene un timeout de 2s por defecto que no alcanza para MongoDb

  before(async () => {
    console.log("Conectando a MongoDb");
    await mongoose.connect(envConfig.MONGO_URI); // Return the promise
  });

  it("[POST] /api/session/register este endpoint debe registrar un usuario", async () => {
    const newUser = {
      first_name: "User",
      last_name: "Test",
      email: "user@test.com",
      password: "123456",
      age: 99,
    };

    const { status, _body, ok } = await requester
      .post("/api/session/register")
      .send(newUser);
    // console.log(status);
    // console.log(_body);
    // console.log(ok);
    expect(status).to.be.equal(201);
    expect(ok).to.be.equal(true);
    expect(_body.status).to.be.equal("success");
  });

  let cookie;
  it("[POST] /api/session/login este endpoint debe logear un usuario", async () => {
    const loginUser = {
      email: "user@test.com",
      password: "123456",
    };

    const { status, _body, ok, headers } = await requester
      .post("/api/session/login")
      .send(loginUser);
    // console.log(status);
    // console.log(_body);
    // console.log(ok);
    // console.log(headers);
    const cookieResult = headers["set-cookie"][0];
    // console.log(cookieResult);
    cookie = {
      name: cookieResult.split("=")[0],
      value: cookieResult.split("=")[1],
    };
    expect(status).to.be.equal(200);
    expect(ok).to.be.equal(true);
    expect(_body.payload.first_name).to.be.equal("User");
    expect(_body.payload.last_name).to.be.equal("Test");
    expect(_body.payload.role).to.be.equal("user");
  });

  it("[GET] /api/session/current este endpoint debe mostrar la información del usuario logeado", async () => {
    const { status, _body, ok } = await requester
      .get("/api/session/current")
      .set("Cookie", [`${cookie.name}=${cookie.value}`]);
    // console.log(status);
    // console.log(_body);
    // console.log(ok);
    expect(status).to.be.equal(200);
    expect(ok).to.be.equal(true);
    expect(_body.payload.first_name).to.be.equal("User");
    expect(_body.payload.last_name).to.be.equal("Test");
    expect(_body.payload.role).to.be.equal("user");
  });

  after(async () => {
    await userModel.deleteOne({ email: "user@test.com" });
    mongoose.disconnect();
  });
});
