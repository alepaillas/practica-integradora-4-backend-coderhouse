import { fakerES as faker } from "@faker-js/faker";

export const generateProductsMocks = (amount) => {
  const products = [];

  for (let i = 0; i < amount; i++) {
    const product = {
      title: faker.commerce.productName(),
      price: parseFloat(faker.commerce.price()),
      description: faker.lorem.paragraph(),
      thumbnail: [faker.image.url()],
      code: faker.string.uuid(),
      stock: faker.number.int({ min: 0, max: 100 }),
      status: faker.datatype.boolean(), // Va a crear productos no activos, si no se quiere eso revisar
      category: faker.commerce.department(),
    };

    products.push(product);
  }

  return products;
};
