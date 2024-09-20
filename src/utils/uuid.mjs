// funcion de chatGPT para generar UUIDs
/*
  Utiliza una expresión regular /[xy]/g para hacer coincidir cada caracter 'x' y 'y' en la cadena de plantilla del UUID.
  Para cada caracter coincidente, genera un dígito hexadecimal aleatorio (r) utilizando Math.random() y manipulación de bits (| 0).
  Para los caracteres 'x', utiliza el dígito aleatorio directamente.
  Para los caracteres 'y', aplica operaciones específicas de bits ((r & 0x3 | 0x8)) 
  para asegurar que el UUID cumpla con la especificación de la versión 4 de UUID.
  Convierte cada dígito aleatorio en una cadena hexadecimal utilizando .toString(16) y devuelve la cadena UUID final.
*/
export const generateUUID = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8; // operador ternario
    return v.toString(16);
  });
};

// para validar los UUID generados
export const validateUUID = (uuid) => {
  const regex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return regex.test(uuid);
};
// Example usage:
// const uuid = generateUUID();
// console.log(uuid); // Output: something like "3d16f03e-08b4-4c08-9e1d-78bfbf7b0ac5"
