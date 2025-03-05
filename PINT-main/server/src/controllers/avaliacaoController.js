const AvaliacaoEstabelecimento = require('../models/avaliacaoEstabelecimentoModel');
const AvaliacaoEvento = require('../models/avaliacaoEventoModel');
const Evento = require('../models/eventoModel');
const Estabelecimento = require('../models/estabelecimentoModel');
const Utilizador = require('../models/utilizadorModel');
const Voto = require('../models/VotoModel');
const Notificacao = require('../models/notificacaoModel');
const Sequelize = require('sequelize');
const Inscricao = require('../models/inscricaoModel');

exports.listarAvaliacoesEstabelecimento = async (req, res) => {
    try {
        const idEstabelecimento = req.params.id || req.query.idEstabelecimento;

        const data = await AvaliacaoEstabelecimento.findAll({
            where: { 
                idEstabelecimento: idEstabelecimento,
                estado: true,
                idPai: null
            }, 
            include: [
                { 
                    model: Utilizador, 
                    as: 'utilizador', 
                    attributes: ['nome', 'foto', 'id_google'] 
                },
                { 
                    model: Utilizador, 
                    as: 'admin', 
                    attributes: ['nome'] 
                },
                {
                    model: Estabelecimento,
                    as: 'estabelecimento',
                    attributes: ['nome','idPosto']
                }
            ],
        });

        
        const media = await AvaliacaoEstabelecimento.findOne({
            where: { 
                idEstabelecimento: idEstabelecimento,
                estado: true,
            },
            attributes: [[Sequelize.fn('avg', Sequelize.col('classificacao')), 'media']]
        });

        res.json({
            success: true,
            data,
            media: media.get('media')
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Erro: ' + err.message,
        });
    }
};

exports.CriarAvaliacaoEstabelecimento = async (req, res) => {
    try {
        const { idUtilizador, classificacao, comentario } = req.body;
        const idEstabelecimento = req.params.id; 

        console.log(idUtilizador)

        if (!classificacao && !comentario) {
            return res.status(400).json({
                success: false,
                error: 'Por favor, forneça uma classificação ou comentário.',
            });
        }

        const user = await Utilizador.findByPk(idUtilizador);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'Utilizador não encontrado.',
            });
        }

        const estabelecimento = await Estabelecimento.findByPk(idEstabelecimento);
        if (!estabelecimento) {
            return res.status(404).json({
                success: false,
                error: 'Estabelecimento não encontrado.',
            });
        }

        const notificacao = await Notificacao.create({
            idUtilizador: estabelecimento.idCriador, 
            titulo: 'Nova Avaliação',
            descricao: `Tem uma nova avaliação no seu estabelecimento: ${estabelecimento.nome}`,
            estado: false,
            data: new Date()
        });

        const avaliacao = await AvaliacaoEstabelecimento.create({
            idUtilizador,
            idEstabelecimento,
            classificacao,
            comentario,
            estado: true,
        });

        res.json({
            success: true,
            data: avaliacao,
            notificacao: notificacao
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Erro: ' + err.message,
        });
    }
}

exports.editarAvaliacaoEstabelecimento = async (req, res) => {
    try {
        const { classificacao, comentario, estado } = req.body;
        const idAvaliacao = req.params.id;

        const avaliacao = await AvaliacaoEstabelecimento.findByPk(idAvaliacao);
        if (!avaliacao) {
            return res.status(404).json({
                success: false,
                error: 'Avaliação não encontrada.',
            });
        }

        if (classificacao) {
            avaliacao.classificacao = classificacao;
        }

        if (comentario) {
            avaliacao.comentario = comentario;
        }

        if (estado !== undefined) { 
            avaliacao.estado = estado;
        }

        await avaliacao.save();

        res.json({
            success: true,
            data: avaliacao,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Erro: ' + err.message,
        });
    }
}

exports.apagarAvaliacaoEstabelecimento = async (req, res) => {
    try {
        const idAvaliacao = req.params.id;

        const apagarVotos = async (avaliacaoId) => {
            try {
                // Substitua 'Voto' pelo nome correto do seu modelo de Voto, se for diferente
                await Voto.destroy({
                    where: { idEstabelecimento: avaliacaoId }
                });
            } catch (err) {
                throw new Error(`Erro ao apagar votos da avaliação ${avaliacaoId}: ${err.message}`);
            }
        };

        const apagarFilhos = async (avaliacaoId) => {
            let respostas;
            try {
                respostas = await AvaliacaoEstabelecimento.findAll({
                    where: { idPai: avaliacaoId }
                });
            } catch (err) {
                throw new Error(`Erro ao buscar respostas da avaliação ${avaliacaoId}: ${err.message}`);
            }

            for (const resposta of respostas) {
                try {
                    await apagarFilhos(resposta.id);
                } catch (err) {
                    throw new Error(`Erro ao apagar respostas filhas da resposta ${resposta.id}: ${err.message}`);
                }
                try {
                    await resposta.destroy();
                } catch (err) {
                    throw new Error(`Erro ao apagar resposta ${resposta.id}: ${err.message}`);
                }
            }

            // Primeiro, apagar os votos associados à avaliação
            await apagarVotos(avaliacaoId);

            try {
                const avaliacao = await AvaliacaoEstabelecimento.findByPk(avaliacaoId);
                await avaliacao.destroy();
            } catch (err) {
                throw new Error(`Erro ao apagar avaliação ${avaliacaoId}: ${err.message}`);
            }
        };

        await apagarFilhos(idAvaliacao);

        res.json({
            success: true,
            message: 'Avaliação, todas as respostas e votos relacionados deletados com sucesso.',
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: `Erro ao apagar avaliação, respostas e votos: ${err.message}`,
        });
    }
};



exports.listarAvaliacoesEvento = async (req, res) => {
    try {
        const idEvento = req.params.id || req.query.idEvento;

        const data = await AvaliacaoEvento.findAll({
            where: { 
                idEvento,
                estado: true,
                idPai: null
            },
            include: [
                { 
                    model: Utilizador, 
                    as: 'utilizador', 
                    attributes: ['nome', 'foto', 'id_google'] 
                },
                { 
                    model: Utilizador, 
                    as: 'admin', 
                    attributes: ['nome'] 
                },
                {
                    model: Evento,
                    as: 'evento',
                    attributes: ['titulo','idPosto']
                }
            ],
        });
        res.json({
            success: true,
            data,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Erro: ' + err.message,
        });
    }
}

exports.CriarAvaliacaoEvento = async (req, res) => {
    try {
        const { idUtilizador, classificacao, comentario } = req.body;
        const idEvento = req.params.id; 

        // Verifica se classificação ou comentário foram fornecidos
        if (!classificacao && !comentario) {
            return res.status(400).json({
                success: false,
                error: 'Por favor, forneça uma classificação ou comentário.',
            });
        }

        // Verifica se o utilizador existe
        const user = await Utilizador.findByPk(idUtilizador);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'Utilizador não encontrado.',
            });
        }

        // Verifica se o evento existe
        const evento = await Evento.findByPk(idEvento);
        if (!evento) {
            return res.status(404).json({
                success: false,
                error: 'Evento não encontrado.',
            });
        }

        // Cria a avaliação
        const avaliacao = await AvaliacaoEvento.create({
            idUtilizador,
            idEvento,
            classificacao,
            comentario,
            estado: true,
        });

        // Envia notificação para o criador do evento
        const notificacaoCriador = await Notificacao.create({
            idUtilizador: evento.idCriador,
            titulo: 'Nova Avaliação',
            descricao: `Tem uma nova avaliação no seu evento: ${evento.titulo}`,
            estado: false,
            data: new Date()
        });

        // Envia notificação para todos os utilizadores inscritos no evento
        const inscritos = await Inscricao.findAll({
            where: { idEvento: idEvento },
            include: [{ model: Utilizador, as: 'utilizador' }]
        });

        const notificacoes = [];
        for (const inscricao of inscritos) {
            const utilizador = inscricao.utilizador;

            try {
                const notificacao = await Notificacao.create({
                    idUtilizador: utilizador.id,
                    titulo: 'Nova Avaliação no Evento',
                    descricao: `Existem novas avaliações no evento onde se inscreveu: ${evento.titulo}`,
                    estado: false,
                    data: new Date()
                });

                notificacoes.push(notificacao);
            } catch (notificacaoError) {
                console.error(`Erro ao criar notificação para o utilizador ${utilizador.id}:`, notificacaoError);
            }
        }

        res.json({
            success: true,
            data: avaliacao,
            notificacoesCriador: notificacaoCriador,
            notificacoesInscritos: notificacoes
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Erro: ' + err.message,
        });
    }
};


exports.editarAvaliacaoEvento = async (req, res) => {
    try {
        const { classificacao, comentario, estado } = req.body; 
        const idAvaliacao = req.params.id;

        const avaliacao = await AvaliacaoEvento.findByPk(idAvaliacao);
        if (!avaliacao) {
            return res.status(404).json({
                success: false,
                error: 'Avaliação não encontrada.',
            });
        }

        if (classificacao) {
            avaliacao.classificacao = classificacao;
        }

        if (comentario) {
            avaliacao.comentario = comentario;
        }

        if (estado !== undefined) { 
            avaliacao.estado = estado;
        }

        await avaliacao.save();

        res.json({
            success: true,
            data: avaliacao,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Erro: ' + err.message,
        });
    }
}

exports.apagarAvaliacaoEvento = async (req, res) => {
    try {
        const idAvaliacao = req.params.id;

        const avaliacao = await AvaliacaoEvento.findByPk(idAvaliacao);
        if (!avaliacao) {
            return res.status(404).json({
                success: false,
                error: 'Avaliação não encontrada.',
            });
        }

        await avaliacao.destroy();

        res.json({
            success: true,
            data: avaliacao,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Erro: ' + err.message,
        });
    }
}

exports.listarAvaliacoesUtilizador = async (req, res) => {
    try {
        const idUtilizador = req.params.idUtilizador;
        
        const avaliacoesEstabelecimento = await AvaliacaoEstabelecimento.findAll({
            where: { idUtilizador, estado: true },
            include: [
                { 
                    model: Utilizador, 
                    as: 'utilizador', 
                    attributes: ['nome', 'foto'] 
                },
                { 
                    model: Utilizador, 
                    as: 'admin', 
                    attributes: ['nome'] 
                },
                { 
                    model: Estabelecimento, 
                    as: 'estabelecimento', 
                    attributes: ['nome'] 
                },
            ],
        });

        const avaliacoesEvento = await AvaliacaoEvento.findAll({
            where: { idUtilizador, estado: true },
            include: [
                { 
                    model: Utilizador, 
                    as: 'utilizador', 
                    attributes: ['nome', 'foto'] 
                },
                { 
                    model: Utilizador, 
                    as: 'admin', 
                    attributes: ['nome'] 
                },
                { 
                    model: Evento, 
                    as: 'evento', 
                    attributes: ['titulo'] 
                },
            ],
        });

        // Contadores
        const contadorAvaliacoesEstabelecimento = avaliacoesEstabelecimento.length;
        const contadorAvaliacoesEvento = avaliacoesEvento.length;
        const contadorAvaliacoes = contadorAvaliacoesEstabelecimento + contadorAvaliacoesEvento;

        const data = [...avaliacoesEstabelecimento, ...avaliacoesEvento];

        res.json({
            success: true,
            data,
            contadorAvaliacoes,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Erro: ' + err.message,
        });
    }
}


exports.AvaliacaoEventoPorValidar = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ success: false, message: "Utilizador não autenticado." });
    }

    const idPosto = req.user.idPosto;

    try {
        const avaliacoesEvento = await AvaliacaoEvento.findAll({
            include: [{
                model: Evento,
                as: 'evento',
                where: { idPosto: idPosto }, 
            }, {
                model: Utilizador,
                as: 'utilizador',
                attributes: ['id', 'nome', 'email']
            }],
            where: { estado: false }
        });

        res.json({ success: true, data: avaliacoesEvento, contador: avaliacoesEvento.length,});
    } catch (error) {
        res.status(500).json({ success: false, message: "Erro ao procurar avaliações: " + error.message });
    }
};

exports.AvaliacaoEstabelecimentoPorValidar = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ success: false, message: "Utilizador não autenticado." });
    }

    const idPosto = req.user.idPosto;

    try {
        const avaliacoesEstabelecimento = await AvaliacaoEstabelecimento.findAll({
            include: [{
                model: Estabelecimento,
                as: 'estabelecimento',
                where: { idPosto: idPosto }, 
            }, {
                model: Utilizador,
                as: 'utilizador',
                attributes: ['id', 'nome', 'email']
            }],
            where: { estado: false }
        });

        res.json({ success: true, data: avaliacoesEstabelecimento, contador: avaliacoesEstabelecimento.length, 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erro ao procurar avaliações: " + error.message });
    }
};

exports.upvote = async (req, res) => {
    try {
        const { tipoEntidade, idEntidade } = req.body;
        const userId = req.user.id;

        const Avaliacao = tipoEntidade === 'estabelecimentos' ? AvaliacaoEstabelecimento : AvaliacaoEvento;

        let voto = await Voto.findOne({
            where: {
                idUtilizador: userId,
                ...(tipoEntidade === 'estabelecimentos' ? { idEstabelecimento: idEntidade } : { idEvento: idEntidade }),
            },
        });

        if (voto) {
            if (voto.tipo === true) {
                await voto.destroy();
                await Avaliacao.decrement('upvotes', { where: { id: idEntidade } });
                res.json({ message: 'Upvote removido', voted: false });
            } else {
                voto.tipo = true;
                await voto.save();
                await Avaliacao.increment('upvotes', { where: { id: idEntidade } });
                await Avaliacao.decrement('downvotes', { where: { id: idEntidade } });
                res.json({ message: 'Alterado para upvote', voted: true });
            }
        } else {
            voto = await Voto.create({ idUtilizador: userId, [tipoEntidade === 'estabelecimentos' ? 'idEstabelecimento' : 'idEvento']: idEntidade, tipo: true });
            await Avaliacao.increment('upvotes', { where: { id: idEntidade } });
            res.json({ message: 'Upvote adicionado', voted: true });
        }
    } catch (error) {
        console.error('Error upvoting:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};



exports.downvote = async (req, res) => {
    try {
        const { tipoEntidade, idEntidade } = req.body;
        const userId = req.user.id;

        const Avaliacao = tipoEntidade === 'estabelecimentos' ? AvaliacaoEstabelecimento : AvaliacaoEvento;

        let voto = await Voto.findOne({
            where: {
                idUtilizador: userId,
                ...(tipoEntidade === 'estabelecimentos' ? { idEstabelecimento: idEntidade } : { idEvento: idEntidade }),
            },
        });

        if (voto) {
            if (voto.tipo === false) {
                await voto.destroy();
                await Avaliacao.decrement('downvotes', { where: { id: idEntidade } });
                res.json({ message: 'Downvote removido', voted: false });
            } else {
                voto.tipo = false;
                await voto.save();
                await Avaliacao.increment('downvotes', { where: { id: idEntidade } });
                await Avaliacao.decrement('upvotes', { where: { id: idEntidade } });
                res.json({ message: 'Alterado para downvote', voted: true });
            }
        } else {
            voto = await Voto.create({ idUtilizador: userId, [tipoEntidade === 'estabelecimentos' ? 'idEstabelecimento' : 'idEvento']: idEntidade, tipo: false });
            await Avaliacao.increment('downvotes', { where: { id: idEntidade } });
            res.json({ message: 'Downvote adicionado', voted: true });
        }
    } catch (error) {
        console.error('Error downvoting:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


exports.responderAvaliacaoEvento = async(req, res) => {
    try {
        const { idAvaliacao } = req.params;
        const { comentario, classificacao } = req.body;
        const idUtilizador = req.user.id;

        const avaliacao = await AvaliacaoEvento.findByPk(idAvaliacao);
        if (!avaliacao) {
            return res.status(404).json({ success: false, message: 'Avaliação não encontrada.' });
        }

        const user = await Utilizador.findByPk(idUtilizador);
        if (!user) {
            return res.status(404).json({ success: false, message: 'Utilizador não encontrado.' });
        }
        
        const evento = await Evento.findByPk(avaliacao.idEvento);
        if (!evento) {
            return res.status(404).json({ success: false, message: 'Evento não encontrado.' });
        }

        const resposta = await AvaliacaoEvento.create({
            idUtilizador,
            idEvento: avaliacao.idEvento,
            idPai: idAvaliacao,
            comentario,
            classificacao,
            estado: true,
        });

        if (avaliacao) {
            const evento = await Evento.findByPk(avaliacao.idEvento);

            await Notificacao.create({
            idUtilizador: avaliacao.idUtilizador, 
            titulo: 'Nova resposta à sua avaliação',
            descricao: `Tem uma nova resposta à sua avaliação em ${evento?.titulo}!`,
            estado: false, 
            data: new Date(),
            });
        }

        res.json({ success: true, data: resposta });
    } catch (error) {
        console.error('Erro ao responder ao comentário:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

exports.getFilhosEvento = async(req, res) => {
    try {
        const { idAvaliacao } = req.params;

        const filhos = await AvaliacaoEvento.findAll({
            where: { idPai: idAvaliacao },
            include: [
                { 
                    model: Utilizador, 
                    as: 'utilizador', 
                    attributes: ['nome', 'foto'] 
                },
            ],
        });

        const contador = filhos.length;

        res.json({ success: true, data: filhos, contador });
    } catch (error) {
        console.error('Erro ao obter respostas:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

exports.responderAvaliacaoEstabelecimento = async(req, res) => {
    try {
        const { idAvaliacao } = req.params;
        const { comentario, classificacao } = req.body;
        const idUtilizador = req.user.id;

        const avaliacao = await AvaliacaoEstabelecimento.findByPk(idAvaliacao);
        if (!avaliacao) {
            return res.status(404).json({ success: false, message: 'Avaliação não encontrada.' });
        }

        const user = await Utilizador.findByPk(idUtilizador);
        if (!user) {
            return res.status(404).json({ success: false, message: 'Utilizador não encontrado.' });
        }

        const estabelecimento = await Estabelecimento.findByPk(avaliacao.idEstabelecimento);
        if (!estabelecimento) {
            return res.status(404).json({ success: false, message: 'Estabelecimento não encontrado.' });
        }

        const resposta = await AvaliacaoEstabelecimento.create({
            idUtilizador,
            idEstabelecimento: avaliacao.idEstabelecimento,
            idPai: idAvaliacao,
            comentario,
            classificacao,
            estado: true,
        });

        await Notificacao.create({
            idUtilizador: avaliacao.idUtilizador, 
            titulo: 'Nova resposta à sua avaliação',
            descricao: `Tem uma nova resposta à sua avaliação em ${estabelecimento.nome}!`, 
            estado: false, 
            data: new Date(),
        });

        res.json({ success: true, data: resposta });
    } catch (error) {
        console.error('Erro ao responder ao comentário:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

exports.getFilhosEstabelecimento = async(req, res) => {
    try {
        const { idAvaliacao } = req.params;

        const filhos = await AvaliacaoEstabelecimento.findAll({
            where: { idPai: idAvaliacao },
            include: [
                { 
                    model: Utilizador, 
                    as: 'utilizador', 
                    attributes: ['nome', 'foto'] 
                },
            ],
        });

        res.json({ success: true, data: filhos });
    } catch (error) {
        console.error('Erro ao obter respostas:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}