const generateProductErrorInfo = (product) => {
  return `One or more properties were incomplete or not valid.
    List of required properties:
    * title: needs to be a String, received ${product.title}
    * price : needs to be a Number, received ${product.price}`;
};

module.exports = generateProductErrorInfo;
