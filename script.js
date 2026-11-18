console.log("JavaScript conectado com sucesso!");

// Configuração da ligação com o Supabase
const SUPABASE_URL = 'https://gjsdkqaixdwrrepbqoao.supabase.co';
const SUPABASE_KEY = 'sb_publishable_4KJ5qj6h72HAjT1r1_ICpg_d-D6JW1y';

document.addEventListener('DOMContentLoaded', () => {

    // 1. Destaque de Cards (Página Início)
    const btnDestaque = document.getElementById('btn-destaque');
    const cards = document.querySelectorAll('.card-destaque');

    if (btnDestaque) {
        btnDestaque.addEventListener('click', () => {
            cards.forEach(card => card.classList.toggle('em-destaque'));

            if (btnDestaque.innerText.includes('Destacar')) {
                btnDestaque.innerText = 'Remover Destaque';
            } else {
                btnDestaque.innerText = 'Destacar Combate ao Racismo';
            }
        });
    }

    // 2. Contador de Estatísticas Animado
    const contadores = document.querySelectorAll('.contador');

    if (contadores.length > 0) {
        contadores.forEach(contador => {
            const alvo = parseFloat(contador.getAttribute('data-alvo'));
            const sufixo = contador.getAttribute('data-sufixo') || '';
            const duracao = 1500;
            const passos = 50;
            const incremento = alvo / passos;
            let valorAtual = 0;

            const timer = setInterval(() => {
                valorAtual += incremento;

                if (valorAtual >= alvo) {
                    contador.innerText = (alvo % 1 !== 0 ? alvo.toFixed(1) : alvo) + sufixo;
                    clearInterval(timer);
                } else {
                    const textoFormatado = alvo % 1 !== 0 ? valorAtual.toFixed(1) : Math.floor(valorAtual);
                    contador.innerText = textoFormatado + sufixo;
                }
            }, duracao / passos);
        });
    }

    // 3. Sistema de Abas Interativas
    const botoesAbas = document.querySelectorAll('.aba-btn');
    const conteudosAbas = document.querySelectorAll('.aba-conteudo');

    if (botoesAbas.length > 0) {
        botoesAbas.forEach(botao => {
            botao.addEventListener('click', () => {
                const abaAlvo = botao.getAttribute('data-aba');

                botoesAbas.forEach(b => b.classList.remove('ativa'));
                conteudosAbas.forEach(c => c.classList.remove('ativa'));

                botao.classList.add('ativa');
                const conteudoAtivo = document.getElementById(abaAlvo);
                if (conteudoAtivo) {
                    conteudoAtivo.classList.add('ativa');
                }
            });
        });
    }

    // 4. FAQ Expansível
    const perguntasFAQ = document.querySelectorAll('.faq-pergunta');

    if (perguntasFAQ.length > 0) {
        perguntasFAQ.forEach(pergunta => {
            pergunta.addEventListener('click', () => {
                const itemAtual = pergunta.parentElement;

                document.querySelectorAll('.faq-item').forEach(item => {
                    if (item !== itemAtual) {
                        item.classList.remove('ativo');
                    }
                });

                itemAtual.classList.toggle('ativo');
            });
        });
    }

    // 5. Enquete Anónima (localStorage do Navegador)
    // 5. Enquete Anónima Conectada ao Supabase
    const formEnquete = document.getElementById('formEnquete');
    const relatorio = document.getElementById('relatorio');
    const totalElemento = document.getElementById('total');
    const painelResultado = document.getElementById('painel-resultado');

    if (relatorio && totalElemento) {
        const nomesCategorias = {
            racismo: 'Racismo / Injúria Racial',
            bullying: 'Bullying / Intimidação',
            cyberbullying: 'Cyberbullying (Agressão online)',
            exclusao: 'Exclusão Social / Isolamento',
            nenhuma: 'Nenhuma destas situações'
        };

        async function carregarResultadosSupabase() {
            try {
                const resposta = await fetch(`${SUPABASE_URL}/rest/v1/enquete?select=categoria`, {
                    method: 'GET',
                    headers: {
                        'apikey': SUPABASE_KEY,
                        'Authorization': `Bearer ${SUPABASE_KEY}`
                    }
                });

                if (!resposta.ok) return;

                const registros = await resposta.json();
                const votos = {
                    racismo: 0,
                    bullying: 0,
                    cyberbullying: 0,
                    exclusao: 0,
                    nenhuma: 0
                };

                registros.forEach(item => {
                    if (votos.hasOwnProperty(item.categoria)) {
                        votos[item.categoria]++;
                    }
                });

                relatorio.innerHTML = '';
                const total = registros.length;

                Object.keys(votos).forEach(chave => {
                    const qtd = votos[chave];
                    const pct = total > 0 ? Math.round((qtd / total) * 100) : 0;
                    const rotulo = nomesCategorias[chave] || chave;

                    relatorio.innerHTML += `
                        <div class="barra-item">
                            <span class="barra-rotulo">${rotulo}: ${qtd} voto(s) (${pct}%)</span>
                            <div class="barra-fundo">
                                <div class="barra-progresso" style="width: ${pct}%"></div>
                            </div>
                        </div>
                    `;
                });

                totalElemento.innerText = `Total de participantes: ${total}`;
                if (painelResultado) painelResultado.style.display = 'block';
            } catch (erro) {
                console.error("Erro ao carregar enquete:", erro);
            }
        }

        // Carrega os votos existentes assim que a página abre
        carregarResultadosSupabase();

        if (formEnquete) {
            formEnquete.addEventListener('submit', async (e) => {
                e.preventDefault();

                const escolha = formEnquete.categoria ? formEnquete.categoria.value : null;
                const selectIdade = document.getElementById('faixa-etaria');
                const faixaEtaria = selectIdade && selectIdade.value ? selectIdade.value : 'Não informada';

                if (!escolha) {
                    alert("Por favor, selecione uma opção antes de enviar.");
                    return;
                }

                const btnEnquete = formEnquete.querySelector('button[type="submit"]');
                if (btnEnquete) {
                    btnEnquete.disabled = true;
                    btnEnquete.innerText = "Enviando voto...";
                }

                try {
                    const resposta = await fetch(`${SUPABASE_URL}/rest/v1/enquete`, {
                        method: 'POST',
                        headers: {
                            'apikey': SUPABASE_KEY,
                            'Authorization': `Bearer ${SUPABASE_KEY}`,
                            'Content-Type': 'application/json',
                            'Prefer': 'return=minimal'
                        },
                        body: JSON.stringify({
                            categoria: escolha,
                            faixa_etaria: faixaEtaria
                        })
                    });

                    if (resposta.ok) {
                        formEnquete.reset();
                        await carregarResultadosSupabase();
                    } else {
                        alert("Erro ao registrar voto. Verifique se a tabela 'enquete' foi criada no Supabase.");
                    }
                } catch (erro) {
                    console.error("Erro de rede na enquete:", erro);
                } finally {
                    if (btnEnquete) {
                        btnEnquete.disabled = false;
                        btnEnquete.innerText = "Enviar Resposta";
                    }
                }
            });
        }
    }

    // 7. Formulário de Denúncia Conectado ao Supabase (com E-mail)
    const simulador = document.querySelector("#simulador");
    if (simulador) {
        const titulo = simulador.querySelector("h2");
        const campos = simulador.querySelectorAll("input, select, textarea");
        const botao = document.querySelector("#btn-enviar");
        const resultado = document.querySelector("#resultado");

        // Estilização visual do formulário
        simulador.style.background = "#fff";
        simulador.style.padding = "30px";
        simulador.style.borderRadius = "15px";
        simulador.style.border = "2px solid #c62828";
        simulador.style.boxShadow = "0 5px 25px rgba(198, 40, 40, 0.15)";
        simulador.style.maxWidth = "600px";
        simulador.style.margin = "30px auto";

        if (titulo) {
            titulo.style.color = "#b71c1c";
            titulo.style.textAlign = "center";
            titulo.style.marginBottom = "25px";
        }

        campos.forEach(campo => {
            campo.style.width = "100%";
            campo.style.padding = "12px";
            campo.style.margin = "8px 0 18px";
            campo.style.border = "1px solid #ccc";
            campo.style.borderRadius = "8px";
            campo.style.boxSizing = "border-box";
        });

        if (botao) {
            botao.style.background = "#c62828";
            botao.style.color = "#fff";
            botao.style.padding = "14px 25px";
            botao.style.border = "none";
            botao.style.borderRadius = "8px";
            botao.style.cursor = "pointer";
            botao.style.fontWeight = "bold";
            botao.style.width = "100%";

            botao.addEventListener("click", async (e) => {
                e.preventDefault();

                const nomeInput = document.querySelector("#nome");
                const emailInput = document.querySelector("#email");
                const descInput = document.querySelector("#descricao-denuncia");

                const nome = nomeInput && nomeInput.value.trim() !== "" ? nomeInput.value.trim() : "Anónimo";
                const email = emailInput && emailInput.value.trim() !== "" ? emailInput.value.trim() : "Não informado";
                const descricao = descInput ? descInput.value.trim() : "";

                if (!descricao) {
                    if (resultado) {
                        resultado.textContent = "Por favor, preencha a descrição da denúncia.";
                        resultado.style.color = "#c62828";
                        resultado.style.fontWeight = "bold";
                    }
                    return;
                }

                // Feedback de carregamento no botão
                botao.disabled = true;
                botao.innerText = "Enviando...";

                try {
                    const resposta = await fetch(`${SUPABASE_URL}/rest/v1/denuncias`, {
                        method: 'POST',
                        headers: {
                            'apikey': SUPABASE_KEY,
                            'Authorization': `Bearer ${SUPABASE_KEY}`,
                            'Content-Type': 'application/json',
                            'Prefer': 'return=minimal'
                        },
                        body: JSON.stringify({
                            nome: nome,
                            email: email,
                            descricao: descricao
                        })
                    });

                    if (resposta.ok) {
                        if (resultado) {
                            resultado.textContent = "✅ Denúncia registrada com sucesso no banco de dados!";
                            resultado.style.color = "#2e7d32";
                            resultado.style.fontWeight = "bold";
                            resultado.style.marginTop = "20px";
                        }
                        if (nomeInput) nomeInput.value = "";
                        if (emailInput) emailInput.value = "";
                        if (descInput) descInput.value = "";
                    } else {
                        const erroDetalhe = await resposta.json();
                        console.error("Erro do Supabase:", erroDetalhe);
                        if (resultado) {
                            resultado.textContent = "❌ Erro ao guardar. Verifique se a coluna 'email' foi criada no Supabase.";
                            resultado.style.color = "#c62828";
                        }
                    }
                } catch (erro) {
                    console.error("Erro de rede:", erro);
                    if (resultado) {
                        resultado.textContent = "❌ Falha de conexão com o servidor.";
                        resultado.style.color = "#c62828";
                    }
                } finally {
                    botao.disabled = false;
                    botao.innerText = "Enviar Denúncia";
                }
            });
        }
    }
});