/* Catálogo de la Tienda Andina (marca ficticia, precios en pesos colombianos) */

window.PRODUCTOS = [
  {
    id: "CAF-001",
    nombre: "Café de origen Tolima 500 g",
    categoria: "Café",
    precio: 38000,
    color: "#6B4226",
    sigla: "TOL",
    descripcion: "Café tostado medio, notas a panela y cítricos. Cultivado en las montañas del Tolima."
  },
  {
    id: "CAF-002",
    nombre: "Café especial Huila 250 g",
    categoria: "Café",
    precio: 29000,
    color: "#8A5A3B",
    sigla: "HUI",
    descripcion: "Café de especialidad con notas frutales y acidez brillante."
  },
  {
    id: "CAF-003",
    nombre: "Café descafeinado Nariño 340 g",
    categoria: "Café",
    precio: 32000,
    color: "#4E3524",
    sigla: "NAR",
    descripcion: "Descafeinado por proceso natural, cuerpo suave y final dulce."
  },
  {
    id: "CAC-001",
    nombre: "Chocolate de mesa 500 g",
    categoria: "Cacao",
    precio: 18000,
    color: "#5A2E1F",
    sigla: "CHO",
    descripcion: "Pastillas de chocolate de mesa con cacao colombiano, ideal para el desayuno."
  },
  {
    id: "CAC-002",
    nombre: "Barra de chocolate 70 % 80 g",
    categoria: "Cacao",
    precio: 14000,
    color: "#3F2117",
    sigla: "70%",
    descripcion: "Chocolate oscuro con 70 % de cacao fino de aroma."
  },
  {
    id: "ART-001",
    nombre: "Sombrero vueltiao",
    categoria: "Artesanías",
    precio: 150000,
    color: "#2F6B4F",
    sigla: "SOM",
    descripcion: "Sombrero tejido a mano en caña flecha, símbolo cultural de Colombia."
  },
  {
    id: "ART-002",
    nombre: "Mochila tejida a mano",
    categoria: "Artesanías",
    precio: 220000,
    color: "#A0442C",
    sigla: "MOC",
    descripcion: "Mochila artesanal tejida en hilo con diseños geométricos."
  },
  {
    id: "ACC-001",
    nombre: "Prensa francesa 600 ml",
    categoria: "Accesorios",
    precio: 85000,
    color: "#3C4A5C",
    sigla: "PRE",
    descripcion: "Prensa francesa de vidrio y acero para preparar café en casa."
  }
];

window.MARCA = "Tienda Andina";

window.buscarProducto = function (id) {
  return window.PRODUCTOS.find(function (p) { return p.id === id; }) || null;
};

window.formatoCOP = function (n) {
  return "$" + Math.round(n).toLocaleString("es-CO");
};
