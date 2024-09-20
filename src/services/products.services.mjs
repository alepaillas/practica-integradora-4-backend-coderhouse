import productsRepository from "../persistences/mongo/repositories/products.repository.mjs";
import { productResponseDto } from "../dto/productResponse.dto.mjs";
import customErrors from "../errors/customErrors.mjs";
import { generateProductsMocks } from "../mocks/product.mock.mjs";

const getAll = async (query, options) => {
  const products = await productsRepository.getAll(query, options);
  if (!products || products.length === 0)
    throw customErrors.notFoundError("No products found.");
  return products;
};

const getById = async (id) => {
  const productData = await productsRepository.getById(id);
  if (!productData)
    throw customErrors.notFoundError(`Product with id: ${id} not found.`);
  const product = productResponseDto(productData);
  return product;
};

const create = async (data, user) => {
  let productData = data;
  if (user.role === "premium") {
    productData = { ...data, owner: user._id };
  }
  const product = await productsRepository.create(productData);
  if (!product) throw customErrors.createError("Error creating product.");
  return product;
};

const update = async (id, data) => {
  const result = await productsRepository.update(id, data);

  // Check if the update was successful
  if (result.matchedCount === 0) {
    throw customErrors.notFoundError(`Product with id: ${id} not found.`);
  }

  // Optionally, check if the document was actually modified
  if (result.modifiedCount === 0) {
    throw customErrors.badRequestError(
      `Product with id: ${id} was found but not updated.`,
    );
  }

  const product = await productsRepository.getById(id);
  if (!product) {
    throw customErrors.notFoundError(
      `Product with id: ${id} not found after update.`,
    );
  }

  return product;
};

const deleteOne = async (id, user) => {
  const productData = await productsRepository.getById(id);
  if (user.role === "premium" && productData.owner !== user._id) {
    throw customErrors.unauthorizedError("User not authorized");
  }
  const deleted = await productsRepository.deleteOne(id);
  if (!deleted)
    throw customErrors.notFoundError(`Product with id: ${id} not found.`);
  return { message: `Product with id: ${id} successfully deleted.` };
};

// Add method for creating mock products
const createMockProducts = async (amount) => {
  const products = generateProductsMocks(amount);
  for (const product of products) {
    await productsRepository.create(product);
    if (!product) throw customErrors.createError("Error creating product.");
  }
  return products;
};

export default {
  getAll,
  getById,
  update,
  deleteOne,
  create,
  createMockProducts,
};
