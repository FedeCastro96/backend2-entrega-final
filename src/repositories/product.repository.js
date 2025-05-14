import ProductModel from "../dao/models/product.model.js";

//Repositorio para manejar las operaciones de productos en la base de datos

class ProductRepository {
  //Crea un nuevo producto en la base de datos
  async create(productData) {
    try {
      const newProduct = new ProductModel(productData);
      await newProduct.save();
      return newProduct;
    } catch (error) {
      throw new Error(`Error al crear el producto: ${error.message}`);
    }
  }

  //Obtiene una lista paginada de productos con opciones de filtrado y ordenamiento

  async findAll(options = {}) {
    const { limit = 10, page = 1, sort, query } = options;
    try {
      const skip = (page - 1) * limit;
      let queryOptions = {};

      if (query) {
        queryOptions = { category: query };
      }

      const sortOptions = {};
      if (sort) {
        if (sort === "asc" || sort === "desc") {
          sortOptions.price = sort === "asc" ? 1 : -1;
        }
      }

      const productos = await ProductModel.find(queryOptions)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit);

      const totalProducts = await ProductModel.countDocuments(queryOptions);
      const totalPages = Math.ceil(totalProducts / limit);
      const hasPrevPage = page > 1;
      const hasNextPage = page < totalPages;

      return {
        docs: productos,
        totalPages,
        prevPage: hasPrevPage ? page - 1 : null,
        nextPage: hasNextPage ? page + 1 : null,
        page,
        hasPrevPage,
        hasNextPage,
        prevLink: hasPrevPage
          ? `/api/products?limit=${limit}&page=${
              page - 1
            }&sort=${sort}&query=${query}`
          : null,
        nextLink: hasNextPage
          ? `/api/products?limit=${limit}&page=${
              page + 1
            }&sort=${sort}&query=${query}`
          : null,
      };
    } catch (error) {
      throw new Error(`Error al obtener los productos: ${error.message}`);
    }
  }

  //Busca un producto por su ID

  async findById(id) {
    try {
      const product = await ProductModel.findById(id);
      if (!product) {
        throw new Error(`No se encontró ningún producto con el ID: ${id}`);
      }
      return product;
    } catch (error) {
      throw new Error(`Error al buscar producto por ID: ${error.message}`);
    }
  }

  //Busca un producto por su código

  async findByCode(code) {
    try {
      const product = await ProductModel.findOne({ code: code });
      return product;
    } catch (error) {
      throw new Error(`Error al buscar producto por código: ${error.message}`);
    }
  }

  //Actualiza un producto existente

  async update(id, productData) {
    try {
      const updatedProduct = await ProductModel.findByIdAndUpdate(
        id,
        productData,
        { new: true }
      );
      if (!updatedProduct) {
        throw new Error(
          `No se encontró ningún producto con el ID: ${id} para actualizar`
        );
      }
      return updatedProduct;
    } catch (error) {
      throw new Error(`Error al actualizar el producto: ${error.message}`);
    }
  }

  // Elimina un producto

  async delete(id) {
    try {
      const deletedProduct = await ProductModel.findByIdAndDelete(id);
      if (!deletedProduct) {
        throw new Error(
          `No se encontró ningún producto con el ID: ${id} para eliminar`
        );
      }
      return deletedProduct;
    } catch (error) {
      throw new Error(`Error al eliminar el producto: ${error.message}`);
    }
  }
}

export default ProductRepository;
