import productsServices from "../services/products.services.mjs";
import customErrors from "../errors/customErrors.mjs";

const getAll = async (req, res, next) => {
  try {
    const { limit, page, sort, category, status } = req.query;
    const options = {
      limit: parseInt(limit, 10) || 10,
      page: parseInt(page, 10) || 1,
      sort: {
        price: sort === "asc" ? 1 : -1,
      },
      lean: true,
    };

    if (
      isNaN(options.page) ||
      options.page < 1 ||
      options.page > Number.MAX_SAFE_INTEGER / options.limit
    ) {
      throw customErrors.badRequestError(
        "La página buscada debe ser un número entero positivo dentro de un rango válido.",
      );
    }

    let products;
    if (status) {
      products = await productsServices.getAll({ status }, options);
    } else if (category) {
      products = await productsServices.getAll({ category }, options);
    } else {
      products = await productsServices.getAll({}, options);
    }

    if (products.totalPages < options.page || options.page <= 0) {
      throw customErrors.badRequestError("Página fuera de rango.");
    }

    res.status(200).json({ status: "success", products });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await productsServices.getById(id);
    res.status(200).json({ status: "success", payload: product });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const product = req.body;
    // Validate that 'title' and 'price' are provided
    if (!product.title || !product.price) {
      throw customErrors.badRequestError(
        "Both 'title': 'string' and 'price': 'number' are required.",
      );
    }
    const newProduct = await productsServices.create(product, req.user);
    res.status(201).json({ status: "success", payload: newProduct });
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.code) {
      const duplicateError = customErrors.badRequestError(
        `Producto con código "${error.keyValue.code}" ya existe. Elija un código único para el producto.`,
      );
      next(duplicateError);
    } else {
      next(error);
    }
  }
};

const deleteOne = async (req, res, next) => {
  try {
    const { id } = req.params;
    await productsServices.deleteOne(id, req.user);
    res.status(200).json({ status: "success" });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const productData = req.body;
    const updatedProduct = await productsServices.update(id, productData);
    res.status(200).json({ status: "success", payload: updatedProduct });
  } catch (error) {
    next(error);
  }
};

// Add controller method for creating mock products
const createMockProducts = async (req, res, next) => {
  try {
    const { amount } = req.query; // Get the amount from query parameters
    const products = await productsServices.createMockProducts(
      parseInt(amount, 10) || 5,
    ); // Default to 5 if not provided
    res.status(200).json({ status: "success", products });
  } catch (error) {
    next(error);
  }
};

export default {
  getAll,
  getById,
  create,
  update,
  deleteOne,
  createMockProducts,
};
