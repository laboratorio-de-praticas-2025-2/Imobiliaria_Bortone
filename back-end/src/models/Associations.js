import Imovel from './ImovelModel.js';
import Casa from './CasaModel.js';
import Terreno from './TerrenoModel.js';
import Blog from './BlogModel.js';
import Usuario from './UsuarioModel.js';

// 🔹 Imovel ↔ Casa
Imovel.hasOne(Casa, { foreignKey: 'imovel_id' });
Casa.belongsTo(Imovel, { foreignKey: 'imovel_id' });

// 🔹 Imovel ↔ Terreno
Imovel.hasOne(Terreno, { foreignKey: 'imovel_id' });
Terreno.belongsTo(Imovel, { foreignKey: 'imovel_id' });

// 🔹 Usuario ↔ Imovel
Usuario.hasMany(Imovel, { foreignKey: 'usuario_id' });
Imovel.belongsTo(Usuario, { foreignKey: 'usuario_id' });
