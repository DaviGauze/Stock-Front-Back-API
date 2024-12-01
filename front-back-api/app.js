async function iniciar() {
    await inserirAcoesNoBanco(); 
    await listarAcoes();        
}

async function buscarAcoesExterna() {
    const urlApi = 'https://brapi.dev/api/quote/list';
    try {
        const response = await fetch(urlApi);
        const data = await response.json();

        if (data && data.stocks) {
            return data.stocks; 
        }
    } catch (error) {
        console.error("Erro ao buscar ações da API externa:", error);
    }
    return [];
}

async function inserirAcoesNoBanco() {
    const acoes = await buscarAcoesExterna();

    if (acoes.length > 0) {
        for (const acao of acoes) {
            if (acao.stock && acao.close !== undefined && acao.change !== undefined && acao.name) {
                const simbolo = encodeURIComponent(acao.stock);
                const preco = encodeURIComponent(acao.close);
                const variacao = encodeURIComponent(acao.change);
                const nome = encodeURIComponent(acao.name);

                console.log(`Ação: ${acao.stock}, Preço: ${acao.close}, Variação: ${acao.change}, Nome: ${acao.name}`);

                if (isNaN(acao.close) || isNaN(acao.change)) {
                    console.error(`Dados inválidos para a ação ${acao.stock}: preço ou variação não são números`);
                    continue;
                }

                const urlInserir = `./php/acao_inserir.php?simbolo=${simbolo}&preco=${preco}&variacao=${variacao}&nome=${nome}`;
                try {
                    const response = await fetch(urlInserir);
                    const resultado = await response.json();
                    if (resultado.status !== 'success') {
                        console.error(`Erro ao inserir a ação ${acao.stock}: ${resultado.message}`);
                    }
                } catch (error) {
                    console.error(`Erro ao inserir a ação ${acao.stock}:`, error);
                }
            } else {
                console.error(`Dados inválidos para a ação:`, acao);
            }
        }
        document.getElementById('mensagem-sucesso').style.display = 'block';
    }
}


async function listarAcoes() {
    const url = './php/acao_listar.php';
    try {
        const res = await fetch(url);
        const data = await res.json();

        if (!data || data.length === 0) {
            console.error("Nenhum dado encontrado.");
            return;
        }

        const tabela = document.getElementById('tabelaAcoes');
        let a = '';
        for (const acao of data) {
            a += `<tr>
                <td>${acao.id}</td>
                <td>${acao.simbolo}</td>
                <td>${acao.nome}</td>
                <td>${acao.preco}</td>
                <td>${acao.variacao}</td>
                <td>${acao.data_atualizacao}</td>
                <td>
                    <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#modalAcao" onclick="abrirAcao(${acao.id})">Alterar</button>
                </td>
                <td>
                    <button class="btn btn-danger" onclick="excluirAcao(${acao.id})">Excluir</button>
                </td>
            </tr>`;
        }
        tabela.innerHTML = a;
    } catch (error) {
        console.error("Erro ao listar ações:", error);
    }
}

async function limparBancoDeDados() {
    const url = './php/truncate.php';
    try {
        const res = await fetch(url);
        const resultado = await res.json();

        if (resultado.status === 'success') {
            console.log('Banco de dados limpo com sucesso.');
            listarAcoes(); 
        } else {
            console.error(`Erro ao limpar o banco de dados: ${resultado.message}`);
        }
    } catch (error) {
        console.error('Erro ao limpar o banco de dados:', error);
    }
}

async function pesquisarAcoes() {
    const simbolo = document.getElementById('pesquisa').value.toUpperCase();
    const url = `./php/acao_pesquisar.php?simbolo=${encodeURIComponent(simbolo)}`;
    try {
        const res = await fetch(url);
        const data = await res.json();

        const tabela = document.getElementById('tabelaAcoes');
        let a = '';
        for (const acao of data) {
            a += `<tr>
                <td>${acao.id}</td>
                <td>${acao.simbolo}</td>
                <td>${acao.nome}</td>
                <td>${acao.preco}</td>
                <td>${acao.variacao}</td>
                <td>${acao.data_atualizacao}</td>
                <td>
                    <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#modalAcao" onclick="abrirAcao(${acao.id})">Alterar</button>
                </td>
                <td>
                    <button class="btn btn-danger" onclick="excluirAcao(${acao.id})">Excluir</button>
                </td>
            </tr>`;
        }
        tabela.innerHTML = a;
    } catch (error) {
        console.error("Erro ao pesquisar ações:", error);
    }
}

async function abrirAcao(id) {
    const url = `./php/acao_selecionar.php?id=${id}`;
    try {
        const res = await fetch(url);
        const data = await res.json();

        if (data.length > 0) {
            const acao = data[0];
            document.getElementById('idacao').value = acao.id;
            document.getElementById('simbolo').value = acao.simbolo;
            document.getElementById('nome').value = acao.nome;
            document.getElementById('preco').value = acao.preco;
            document.getElementById('variacao').value = acao.variacao;

            console.log('Dados da ação carregados:', acao);
        } else {
            console.error("Ação não encontrada.");
        }
    } catch (error) {
        console.error("Erro ao buscar a ação:", error);
    }
}

async function salvarAcao() {
    const id = document.getElementById('idacao').value;
    const simbolo = document.getElementById('simbolo').value;
    const nome = document.getElementById('nome').value;
    const preco = document.getElementById('preco').value;
    const variacao = document.getElementById('variacao').value;
    const url = `./php/acao_alterar.php?id=${id}&simbolo=${encodeURIComponent(simbolo)}&nome=${encodeURIComponent(nome)}&preco=${encodeURIComponent(preco)}&variacao=${encodeURIComponent(variacao)}`;
    
    try {
        const res = await fetch(url);
        const resultado = await res.json();

        if (resultado.status === 'success') {
            console.log(`Ação ${id} alterada com sucesso.`);
            listarAcoes();
        } else {
            console.error(`Erro ao alterar a ação ${id}: ${resultado.message}`);
        }
    } catch (error) {
        console.error(`Erro ao alterar a ação ${id}:`, error);
    }
}

async function excluirAcao(id) {
    const url = `./php/acao_excluir.php?id=${id}`;
    try {
        const res = await fetch(url);
        const resultado = await res.json();

        if (resultado.status === 'success') {
            console.log(`Ação ${id} excluída com sucesso.`);
            listarAcoes();
        } else {
            console.error(`Erro ao excluir a ação ${id}: ${resultado.message}`);
        }
    } catch (error) {
        console.error(`Erro ao excluir a ação ${id}:`, error);
    }
}

async function listarLogs() {
    const url = './php/listar_logs.php';
    try {
        const res = await fetch(url);
        const data = await res.json();

        console.log("Dados recebidos:", data);

        if (!data || data.length === 0) {
            console.error("Nenhum log encontrado.");
            return;
        }

        const logTable = document.getElementById('logTable');
        let htmlContent = '';
        for (const log of data) {
            htmlContent += `<tr>
                <td>${log.idlog}</td>
                <td>${log.datahora}</td>
                <td>${log.numeroregistros}</td>
            </tr>`;
        }
        logTable.innerHTML = htmlContent;

        var logModal = new bootstrap.Modal(document.getElementById('logModal'));
        logModal.show();
    } catch (error) {
        console.error("Erro ao listar logs:", error);
    }
}

async function registrarQuantidade(quantidade) {
    try {
        const res = await fetch(`./php/registro_logs.php?quantidade=${quantidade}`);
        const data = await res.json();
        if (data.erro) {
            console.error("Erro:", data.erro);
            alert("Erro ao registrar: " + data.erro);
        } else {
            console.log("Registrado com sucesso:", data.linhas_inseridas);
            alert("Registrado com sucesso.");
        }
    } catch (error) {
        console.error("Erro:", error);
        alert("Erro ao registrar: " + error);
    }
}









