import swaggerJSDoc from "swagger-jsdoc";

const docsURI = new URL("../docs", import.meta.url);
const docsPathname = docsURI.pathname;

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.1",
    info: {
      title: "Documentación de API E-commerce",
      version: "1.0.1",
      description: "API E-commerce",
    },
  },
  apis: [`${docsPathname}/**/*.yaml`],
};

export const specs = swaggerJSDoc(swaggerOptions);
