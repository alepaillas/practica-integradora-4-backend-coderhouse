import { expect } from "chai";
import supertest from "supertest";
import envConfig from "../config/env.config.mjs";
import mongoose from "mongoose";
import cartsRepository from "../persistences/mongo/repositories/carts.repository.mjs";
import productsRepository from "../persistences/mongo/repositories/products.repository.mjs";

const requester = supertest(`${envConfig.BASE_URL}:${envConfig.PORT}`);

describe("Test de productos", async function () {
  this.timeout(5000); // mocha tiene un timeout de 2s por defecto que no alcanza para MongoDb

  let cookie;
  let productId;
  let productId2;
  before(async () => {
    console.log("Conectando a MongoDb");
    await mongoose.connect(envConfig.MONGO_URI);

    const loginUser = {
      email: "luna@celebracioneslunita.com",
      password: "123456",
    };
    console.log("Haciendo login de user");
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
    console.log("Creando un producto de prueba");
    const product = await productsRepository.create(newProduct);
    productId = product._id.toString();

    const newProduct2 = {
      title: "Producto test 2",
      price: 1234,
      description: "Producto de prueba 2",
      thumbnail: [],
      code: "abc1234",
      stock: 1,
      status: true,
      category: "Categoría de prueba",
    };
    console.log("Creando un producto de prueba 2");
    const product2 = await productsRepository.create(newProduct2);
    productId2 = product2._id.toString();
  });

  // Solo admin puede ver todos los carritos
  it("[GET] /api/carts este endpoint debe devolver todos los carritos", async () => {
    const loginUser = {
      email: "contacto@alepaillas.com",
      password: "123456",
    };
    const { headers } = await requester
      .post("/api/session/login")
      .send(loginUser);
    const cookieResult = headers["set-cookie"][0];
    const adminCookie = {
      name: cookieResult.split("=")[0],
      value: cookieResult.split("=")[1],
    };

    const { status, _body, ok } = await requester
      .get("/api/carts")
      .set("Cookie", [`${adminCookie.name}=${adminCookie.value}`]);
    // console.log(status);
    // console.log(_body);
    // console.log(ok);
    expect(status).to.be.equal(200);
    expect(ok).to.be.equal(true);
    expect(_body.payload).to.be.an("array");
    expect(_body.payload[0].products).to.be.an("array");
  });

  let cartId;
  it("[POST] /api/carts este endpoint debe crear un nuevo carrito", async () => {
    const { status, _body, ok } = await requester
      .post("/api/carts")
      .set("Cookie", [`${cookie.name}=${cookie.value}`]);
    // console.log(status);
    // console.log(_body);
    // console.log(ok);
    expect(status).to.be.equal(201);
    expect(ok).to.be.equal(true);

    cartId = _body.payload._id.toString();

    expect(_body.payload.products).to.be.an("array");
  });

  it("[GET] /api/carts/:cid este endpoint debe devolver un carrito", async () => {
    const { status, _body, ok } = await requester
      .get(`/api/carts/${cartId}`)
      .set("Cookie", [`${cookie.name}=${cookie.value}`]);
    // console.log(status);
    // console.log(_body);
    // console.log(ok);
    expect(status).to.be.equal(200);
    expect(ok).to.be.equal(true);
    expect(_body.payload.products).to.be.an("array");
  });

  it("[POST] /api/carts/:cid/product/:pid este endpoint debe agregar un producto a un carrito", async () => {
    const { status, _body, ok } = await requester
      .post(`/api/carts/${cartId}/product/${productId}`)
      .set("Cookie", [`${cookie.name}=${cookie.value}`]);
    // console.log(status);
    // console.log(_body);
    // console.log(ok);
    const {
      status: status2,
      _body: _body2,
      ok: ok2,
    } = await requester
      .post(`/api/carts/${cartId}/product/${productId2}`)
      .set("Cookie", [`${cookie.name}=${cookie.value}`]);
    // console.log(status2);
    // console.log(_body2);
    // console.log(ok2);
    expect(status).to.be.equal(201);
    expect(ok).to.be.equal(true);
    expect(_body.payload.products[0].quantity).to.be.equal(1);
    expect(_body.payload.products[0].product._id).to.be.equal(productId);
    expect(_body2.payload.products[1].quantity).to.be.equal(1);
    expect(_body2.payload.products[1].product._id).to.be.equal(productId2);
  });

  it("[DELETE] /api/carts/:cid/product/:pid este endpoint debe eliminar un producto del carrito", async () => {
    const { status, _body, ok } = await requester
      .delete(`/api/carts/${cartId}/product/${productId}`)
      .set("Cookie", [`${cookie.name}=${cookie.value}`]);
    // console.log(status);
    // console.log(_body);
    // console.log(ok);
    expect(status).to.be.equal(201);
    expect(ok).to.be.equal(true);
  });

  it("[PUT] /api/carts/:cid/product/:pid este endpoint debe actualizar la cantidad de ejemplares de un producto del carrito", async () => {
    const { status, _body, ok } = await requester
      .put(`/api/carts/${cartId}/product/${productId2}`)
      .set("Cookie", [`${cookie.name}=${cookie.value}`])
      .send({ quantity: 10 });
    // console.log(status);
    // console.log(_body);
    // console.log(ok);
    expect(status).to.be.equal(201);
    expect(ok).to.be.equal(true);
    expect(_body.payload.products[0].quantity).to.be.equal(10);
  });

  it("[GET] /api/carts/:cid/product/:pid este endpoint debe generar un ticket para comprar el carrito", async () => {
    const { status, _body, ok } = await requester
      .get(`/api/carts/${cartId}/purchase`)
      .set("Cookie", [`${cookie.name}=${cookie.value}`]);
    // console.log(status);
    // console.log(_body);
    // console.log(ok);
    expect(status).to.be.equal(200);
    expect(ok).to.be.equal(true);

    expect(_body.payload).to.be.an("object");
    expect(_body.payload.code).to.be.an("string");
    // solo compramos product2 porque eliminamos product1
    // además actualizamos la cantidad a 10 ejemplares
    expect(_body.payload.amount).to.be.equal(12340);
    expect(_body.payload.purchaser).to.be.equal("luna@celebracioneslunita.com");
    expect(_body.payload.cart).to.be.equal(cartId);
    const parsedDate = new Date(_body.payload.purchase_datetime);
    expect(parsedDate).to.be.instanceOf(Date);
    expect(isNaN(parsedDate.getTime())).to.be.false; // Ensures the date is valid

    expect(_body.updatedCart).to.be.an("object");
    expect(_body.updatedCart._id).to.be.equal(cartId);

    expect(_body.productsNotInStock).to.be.an("array");
    expect(_body.productsNotInStock[0]).to.be.an("object");
    // esperamos que productId2 no esté en stock porque lo creamos con stock 1 y queremos comprar 10
    expect(_body.productsNotInStock[0]._id).to.be.equal(productId2);
  });

  it("[DELETE] /api/carts/:cid este endpoint debe eliminar todos los productos de un carrito", async () => {
    const { status, _body, ok } = await requester
      .delete(`/api/carts/${cartId}`)
      .set("Cookie", [`${cookie.name}=${cookie.value}`]);
    // console.log(status);
    // console.log(_body);
    // console.log(ok);
    expect(status).to.be.equal(200);
    expect(ok).to.be.equal(true);
    expect(_body.payload.products).to.be.an("array").that.is.empty;
  });

  after(async () => {
    console.log("Eliminando carrito creado");
    await cartsRepository.deleteOne(cartId);
    console.log("Eliminando producto creado");
    await productsRepository.deleteOne(productId);
    console.log("Eliminando producto 2 creado");
    await productsRepository.deleteOne(productId2);
    console.log("Desconectando MongoDb");
    mongoose.disconnect();
  });
});
