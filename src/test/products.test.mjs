import { expect } from "chai";
import supertest from "supertest";
import envConfig from "../config/env.config.mjs";
import mongoose from "mongoose";

const requester = supertest(`${envConfig.BASE_URL}:${envConfig.PORT}`);

describe("Test de productos", async function () {
  this.timeout(5000); // mocha tiene un timeout de 2s por defecto que no alcanza para MongoDb

  let cookie;
  before(async () => {
    console.log("Conectando a MongoDb");
    await mongoose.connect(envConfig.MONGO_URI);

    const loginUser = {
      email: "contacto@alepaillas.com",
      password: "123456",
    };
    const { status, _body, ok, headers } = await requester
      .post("/api/session/login")
      .send(loginUser);
    // console.log(status);
    // console.log(_body);
    // console.log(ok);
    const cookieResult = headers["set-cookie"][0];
    cookie = {
      name: cookieResult.split("=")[0],
      value: cookieResult.split("=")[1],
    };
  });

  let productId;
  it("[POST] /api/products este endpoint debe crear un producto", async () => {
    const newProduct = {
      title: "Producto test",
      price: 123,
      description: "Producto de prueba",
      thumbnail: [],
      code: "abc123",
      stock: 1,
      status: true,
      category: "Categoría de prueba",
    };

    const { status, _body, ok } = await requester
      .post("/api/products")
      .send(newProduct)
      .set("Cookie", [`${cookie.name}=${cookie.value}`]);
    // console.log(status);
    // console.log(_body);
    // console.log(ok);
    productId = _body.payload._id;
    // console.log(productId);
    expect(status).to.be.equal(201);
    expect(ok).to.be.equal(true);
    expect(_body.payload.title).to.be.equal("Producto test");
    expect(_body.payload.price).to.be.equal(123);
    expect(_body.payload.description).to.be.equal("Producto de prueba");
    expect(_body.payload.thumbnail).to.be.an("array");
    expect(_body.payload.code).to.be.equal("abc123");
    expect(_body.payload.stock).to.be.equal(1);
    expect(_body.payload.status).to.be.equal(true);
    expect(_body.payload.category).to.be.equal("Categoría de prueba");
  });

  it("[GET] /api/products/:pid este endpoint debe devolver un producto", async () => {
    const { status, _body, ok } = await requester
      .get(`/api/products/${productId}`)
      .set("Cookie", [`${cookie.name}=${cookie.value}`]);
    // console.log(status);
    // console.log(_body);
    // console.log(ok);
    expect(status).to.be.equal(200);
    expect(ok).to.be.equal(true);
    expect(_body.payload.title).to.be.equal("Producto test");
    expect(_body.payload.price).to.be.equal(123);
    expect(_body.payload.description).to.be.equal("Producto de prueba");
    expect(_body.payload.thumbnail).to.be.an("array");
    expect(_body.payload.product_code).to.be.equal("abc123"); // modificado por DTO
    expect(_body.payload.stock).to.be.equal(1);
    expect(_body.payload.category).to.be.equal("Categoría de prueba");
  });

  it("[GET] /api/products/ este endpoint debe devolver todos los productos", async () => {
    const { status, _body, ok } = await requester
      .get(`/api/products/`)
      .set("Cookie", [`${cookie.name}=${cookie.value}`]);
    // console.log(status);
    // console.log(_body);
    // console.log(ok);
    expect(status).to.be.equal(200);
    expect(ok).to.be.equal(true);
    expect(_body.products.docs).to.be.an("array");
    expect(_body.products.totalDocs).to.be.a("number");
    expect(_body.products.limit).to.be.equal(10);
    expect(_body.products.totalPages).to.be.a("number");
    expect(_body.products.page).to.be.equal(1);
    expect(_body.products.pagingCounter).to.be.equal(1);
    expect(_body.products.hasPrevPage).to.be.a("boolean");
    expect(_body.products.hasNextPage).to.be.a("boolean");
    expect(_body.products.prevPage).to.be.equal(null);
    expect(_body.products.nextPage).to.be.a("number");
  });

  it("[PUT] /api/products/:pid este endpoint debe modificar un producto", async () => {
    const updatedProduct = {
      title: "Producto test actualizado",
      price: 1234,
      description: "Producto de prueba actualizado",
      thumbnail: [],
      code: "abc1234",
      stock: 2,
      status: false,
      category: "Categoría de prueba actualizada",
    };

    const { status, _body, ok } = await requester
      .put(`/api/products/${productId}`)
      .send(updatedProduct)
      .set("Cookie", [`${cookie.name}=${cookie.value}`]);
    // console.log(status);
    // console.log(_body);
    // console.log(ok);
    expect(status).to.be.equal(200);
    expect(ok).to.be.equal(true);
    expect(_body.payload.title).to.be.equal("Producto test actualizado");
    expect(_body.payload.price).to.be.equal(1234);
    expect(_body.payload.description).to.be.equal(
      "Producto de prueba actualizado",
    );
    expect(_body.payload.thumbnail).to.be.an("array");
    expect(_body.payload.code).to.be.equal("abc1234");
    expect(_body.payload.stock).to.be.equal(2);
    expect(_body.payload.status).to.be.equal(false);
    expect(_body.payload.category).to.be.equal(
      "Categoría de prueba actualizada",
    );
  });

  it("[DELETE] /api/products/:pid este endpoint debe eliminar un producto", async () => {
    const { status, _body, ok } = await requester
      .delete(`/api/products/${productId}`)
      .set("Cookie", [`${cookie.name}=${cookie.value}`]);
    // console.log(status);
    // console.log(_body);
    // console.log(ok);
    expect(status).to.be.equal(200);
    expect(ok).to.be.equal(true);
  });

  after(async () => {
    console.log("Desconectando MongoDb");
    mongoose.disconnect();
  });
});
