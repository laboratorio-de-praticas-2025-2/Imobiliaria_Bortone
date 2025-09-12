import Imovel from './ImovelModel.js';
import Casa from './CasaModel.js';
import Terreno from './TerrenoModel.js';
import Usuario from './UsuarioModel.js';
import ImagemImovel from './ImagemImovelModel.js';

// 🔹 Imovel ↔ Casa (1:1)
Imovel.hasOne(Casa, { 
    foreignKey: 'imovel_id',
    as: 'casa'
});
Casa.belongsTo(Imovel, { 
    foreignKey: 'imovel_id',
    as: 'imovel'
});
// 🔹 Imovel ↔ Casa (1:1)
Imovel.hasOne(Casa, { 
    foreignKey: 'imovel_id',
    as: 'casa'
});
Casa.belongsTo(Imovel, { 
    foreignKey: 'imovel_id',
    as: 'imovel'
});

// 🔹 Imovel ↔ Terreno (1:1)
Imovel.hasOne(Terreno, { 
    foreignKey: 'imovel_id',
    as: 'terreno'
});
Terreno.belongsTo(Imovel, { 
    foreignKey: 'imovel_id',
    as: 'imovel'
});
// 🔹 Imovel ↔ Terreno (1:1)
Imovel.hasOne(Terreno, { 
    foreignKey: 'imovel_id',
    as: 'terreno'
});
Terreno.belongsTo(Imovel, { 
    foreignKey: 'imovel_id',
    as: 'imovel'
});

// 🔹 Usuario ↔ Imovel (1:N)
Usuario.hasMany(Imovel, { 
    foreignKey: 'usuario_id',
    as: 'imoveis'
});
Imovel.belongsTo(Usuario, { 
    foreignKey: 'usuario_id',
    as: 'usuario'
});

// 🔹 ImagemImovel ↔ Imovel (1:N)
Imovel.hasMany(ImagemImovel, {
    foreignKey: 'imovel_id',
    as: 'imagem_imovel'
    });
ImagemImovel.belongsTo(Imovel, {
    foreignKey: 'imovel_id',
    as: 'imoveis'
});

export { Imovel, Casa, Terreno, Usuario, ImagemImovel };
