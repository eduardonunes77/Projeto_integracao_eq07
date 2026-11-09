console.log("JavaScript conectado com sucesso!");

document.addEventListener('DOMContentLoaded', () => {
    
    const btnDestaque = document.getElementById('btn-destaque');
    const cards = document.querySelectorAll('.card-destaque');

    if (btnDestaque) {
        btnDestaque.addEventListener('click', () => {
            
            cards.forEach(card => {
                card.classList.toggle('em-destaque');
            });

            
            if (btnDestaque.innerText.includes('Destacar')) {
                btnDestaque.innerText = 'Remover Destaque';
            } else {
                btnDestaque.innerText = 'Destacar Combate ao Racismo';
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const contadores = document.querySelectorAll('.contador');

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
});

document.addEventListener('DOMContentLoaded', () => {
    const botoesAbas = document.querySelectorAll('.aba-btn');
    const conteudosAbas = document.querySelectorAll('.aba-conteudo');

    if (botoesAbas.length > 0) {
        botoesAbas.forEach(botao => {
            botao.addEventListener('click', () => {
                const abaAlvo = botao.getAttribute('data-aba');

                s
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
});

document.addEventListener('DOMContentLoaded', () => {
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
});

const formEnquete = document.getElementById('formEnquete');
const relatorio = document.getElementById('relatorio');
const totalElemento = document.getElementById('total');

const nomesCategorias = {
    racismo: 'Racismo / Injúria Racial',
    bullying: 'Bullying / Intimidação',
    cyberbullying: 'Cyberbullying',
    exclusao: 'Exclusão Social',
    nenhuma: 'Nenhuma situação'
};

// Busca os votos guardados na base de dados
function buscarVotos() {
    fetch('http://localhost:3000/api/enquete')
        .then(res => res.json())
        .then(votos => desenharBarras(votos));
}

function desenharBarras(votos) {
    if (!relatorio || !totalElemento) return;
    relatorio.innerHTML = '';
    let total = 0;
    Object.values(votos).forEach(v => total += v);

    Object.keys(votos).forEach(chave => {
        const qtd = votos[chave];
        const pct = total > 0 ? Math.round((qtd / total) * 100) : 0;
        relatorio.innerHTML += `
            <div class="barra-item">
                <span class="barra-rotulo">${nomesCategorias[chave]}: ${qtd} voto(s) (${pct}%)</span>
                <div class="barra-fundo">
                    <div class="barra-progresso" style="width: ${pct}%"></div>
                </div>
            </div>
        `;
    });
    totalElemento.innerText = `Total de participantes: ${total}`;
}

buscarVotos();

if (formEnquete) {
    formEnquete.addEventListener('submit', (e) => {
        e.preventDefault();
        const escolha = formEnquete.categoria.value;

        // Guarda o voto na base de dados
        fetch('http://localhost:3000/api/enquete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ categoria: escolha })
        })
        .then(() => {
            formEnquete.reset();
            buscarVotos(); // Atualiza a tela na hora!
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {

    const simulador = document.querySelector("#simulador");
    const titulo = simulador.querySelector("h2");
    const campos = simulador.querySelectorAll("input, select");
    const botao = document.querySelector("#btn-enviar");
    const resultado = document.querySelector("#resultado");

    
    simulador.style.background = "#fff";
    simulador.style.padding = "30px";
    simulador.style.borderRadius = "15px";
    simulador.style.border = "2px solid #c62828";
    simulador.style.boxShadow = "0 5px 25px rgba(198, 40, 40, 0.15)";
    simulador.style.maxWidth = "600px";
    simulador.style.margin = "30px auto";
    simulador.style.transition = "all 0.4s ease";

    
    simulador.style.opacity = "0";
    simulador.style.transform = "translateY(30px)";

    setTimeout(() => {
        simulador.style.transition = "all 0.8s ease";
        simulador.style.opacity = "1";
        simulador.style.transform = "translateY(0)";
    }, 200);

    
    titulo.style.color = "#b71c1c";
    titulo.style.textAlign = "center";
    titulo.style.marginBottom = "25px";

    
    campos.forEach(campo => {
        campo.style.width = "100%";
        campo.style.padding = "12px";
        campo.style.margin = "8px 0 18px";
        campo.style.border = "1px solid #ccc";
        campo.style.borderRadius = "8px";
        campo.style.transition = "all 0.3s ease";
        campo.style.boxSizing = "border-box";

        campo.addEventListener("focus", () => {
            campo.style.border = "2px solid #e53935";
            campo.style.boxShadow = "0 0 10px rgba(229, 57, 53, 0.3)";
        });

        campo.addEventListener("blur", () => {
            campo.style.border = "1px solid #ccc";
            campo.style.boxShadow = "none";
        });
    });

    
    botao.style.background = "#c62828";
    botao.style.color = "#fff";
    botao.style.padding = "14px 25px";
    botao.style.border = "none";
    botao.style.borderRadius = "8px";
    botao.style.cursor = "pointer";
    botao.style.fontWeight = "bold";
    botao.style.transition = "all 0.3s ease";
    botao.style.width = "100%";

    botao.addEventListener("mouseenter", () => {
        botao.style.background = "#8e0000";
        botao.style.transform = "scale(1.03)";
        botao.style.boxShadow = "0 5px 15px rgba(198,40,40,0.3)";
    });

    botao.addEventListener("mouseleave", () => {
        botao.style.background = "#c62828";
        botao.style.transform = "scale(1)";
        botao.style.boxShadow = "none";
    });

    
    botao.addEventListener("click", () => {
        const nome = document.querySelector("#nome").value.trim();
        const descricao = document.querySelector("#descricao-denuncia").value.trim();

        if (!nome || !descricao) {
            resultado.textContent = "Por favor, preencha os campos obrigatórios.";
            resultado.style.color = "#c62828";
            resultado.style.fontWeight = "bold";
            resultado.style.animation = "aparecer 0.5s ease";
            return;
        }

        resultado.textContent = "Sua denúncia foi preenchida! O envio real precisa estar conectado a um sistema seguro.";
        resultado.style.color = "#2e7d32";
        resultado.style.fontWeight = "bold";
        resultado.style.marginTop = "20px";
    });

});

document.addEventListener('DOMContentLoaded', () => {
    const botoesAbas = document.querySelectorAll('.aba-btn');
    const conteudosAbas = document.querySelectorAll('.aba-conteudo');

    if (botoesAbas.length > 0) {
        botoesAbas.forEach(botao => {
            botao.addEventListener('click', () => {
                const abaAlvo = botao.getAttribute('data-aba');

                // Remove a classe "ativa" de todos os botões e conteúdos
                botoesAbas.forEach(b => b.classList.remove('ativa'));
                conteudosAbas.forEach(c => c.classList.remove('ativa'));

                // Adiciona a classe "ativa" no botão clicado e no conteúdo correspondente
                botao.classList.add('ativa');
                const conteudoAtivo = document.getElementById(abaAlvo);
                if (conteudoAtivo) {
                    conteudoAtivo.classList.add('ativa');
                }
            });
        });
    }
});