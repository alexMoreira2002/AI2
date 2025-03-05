exports.validarEvento = async (req, res) => {
    try {
        const { idEvento } = req.body;
        const { idUtilizador } = req;
        const evento = await Evento.findByPk(idEvento);
        if (!evento) {
            return res.status(404).json({
                success: false,
                error: 'Evento não encontrado.',
            });
        }
        if (evento.idUtilizador !== idUtilizador) {
            return res.status(403).json({
                success: false,
                error: 'Não tem permissão para validar este evento.',
            });
        }
        evento.validado = true;
        await evento.save();
        res.json({
            success: true,
            data: evento,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Erro: ' + err.message,
        });
    }
}
