import models from "../models";

const createPublicidade = async (req, res) => {
    try {
        const newAdData = req.body;
        const createAd = await models.Publicidade.create(newAdData);

        res.status(201).json(createAd);

    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Erro ao criar a publicicade." });
    }
};


export default createPublicidade;