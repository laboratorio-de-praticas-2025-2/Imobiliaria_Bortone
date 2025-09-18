import { Router } from "express";

const router = Router();

router.get("/whatsapp", (req, res) => {
    const telefone = "5513981400403";
    const mensagem = encodeURIComponent(
        "Olá, gostaria de falar com um vendedor para esclarecer dúvidas."
    );
    const url = `https://wa.me/${telefone}?text=${mensagem}`;
    res.redirect(url);
});

export default router;