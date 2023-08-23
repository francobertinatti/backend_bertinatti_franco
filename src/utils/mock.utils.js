const { faker } = require("@faker-js/faker");
const uuid = require("uuid");

const generateProducts = () => {
  const mockProducts = [];

  for (let i = 1; i <= 100; i++) {
    const product = {
      _id: faker.database.mongodbObjectId(),
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: faker.commerce.price(),
      stock: faker.string.numeric(),
      code: uuid.v4(),
      category: faker.commerce.productAdjective(),
      status: true,
      img: faker.image.urlLoremFlickr({ category: "abstract" }),
    };

    mockProducts.push(product);
  }

  return mockProducts;
};

module.exports = generateProducts;
