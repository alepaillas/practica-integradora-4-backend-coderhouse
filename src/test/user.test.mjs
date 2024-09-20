import mongoose from "mongoose";
import envConfig from "../config/env.config.mjs";
import userRepository from "../persistences/mongo/repositories/users.repository.mjs";
import { expect } from "chai";

describe("Test User Repository", function () {
  this.timeout(5000); // mocha tiene un timeout de 2s por defecto que no alcanza para MongoDb

  before(async () => {
    console.log("Conectando a MongoDb");
    await mongoose.connect(envConfig.MONGO_URI); // Return the promise
  });

  //   beforeEach(() => {
  //     console.log("Se ejecuta antes de cada test que tenemos");
  //   });

  it("Obtener todos los usuarios", async () => {
    const users = await userRepository.getAll();
    expect(users).to.be.an("object");
    // console.log(users);
  });

  let userId;
  let userEmail;
  it("Crear un usuario", async () => {
    const newUser = {
      first_name: "User",
      last_name: "Test",
      email: "user@test.com",
      password: "123456",
      age: 99,
    };
    const user = await userRepository.create(newUser);
    userId = user._id.toString();
    userEmail = user.email;
    expect(user.first_name).to.equal("User");
    expect(user.last_name).to.equal("Test");
    expect(user.email).to.equal("user@test.com");
    expect(user.password).to.equal("123456"); // en repository no hasheamos contraseña
    expect(user.age).to.equal(99);
    expect(user.role).to.equal("user");
    // console.log("Aquí está el usuario");
  });

  it("Obtener un usuario por id", async () => {
    const user = await userRepository.getById(userId);
    // console.log(user);
    expect(user).to.be.an("object");
  });

  it("Obtener un usuario por email", async () => {
    const user = await userRepository.getByEmail(userEmail);
    // console.log(user);
    expect(user).to.be.an("object");
  });

  it("Actualizar usuario", async () => {
    const user = await userRepository.update(userId, {
      first_name: "User update",
      last_name: "Update",
      age: 50,
    });
    expect(user.first_name).to.equal("User update");
    expect(user.last_name).to.equal("Update");
    expect(user.age).to.equal(50);
  });

  it("Eliminar un usuario por id", async () => {
    await userRepository.deleteOne(userId);
    const user = await userRepository.getById(userId);
    expect(user).to.be.null;
  });

  after(async () => {
    // console.log("Eliminando usuario de prueba");
    // await userRepository.deleteOne(userId);
    console.log("Desconectando MongoDb");
    await mongoose.disconnect();
  });

  //   afterEach(() => {
  //     console.log("Se ejecuta al finalizar cada test");
  //   });
});
