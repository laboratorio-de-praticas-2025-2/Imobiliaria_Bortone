import Imovel from './Imovel.js';
import Casa from './Casa.js';
import Terreno from './Terreno.js';
import Usuario from './Usuario.js';
import ImagemImovel from './ImagemImovel.js';

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
