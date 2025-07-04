# PrimeiraAPI

Levantamento de Requisitos
Projeto: Loja de Jogos
Desenvolvedores: Enzo e Eluan


Objetivo Geral
Desenvolver um sistema de gerenciamento para uma loja de jogos, permitindo o controle de produtos (jogos), clientes e pedidos, com funcionalidades de cadastro, atualização, consulta e exclusão, além da realização de vendas com controle de estoque.


Requisitos Funcionais
Cadastro de Jogos: O sistema deve permitir o cadastro de novos jogos com os campos: título, descrição, preço, plataforma e quantidade em estoque.


Consulta e Gerenciamento de Jogos: Listar todos os jogos disponíveis, Consultar um jogo pelo seu ID, Atualizar dados de um jogo existente, Excluir jogos do sistema.


Cadastro de Clientes: Cadastrar novos clientes com nome, e-mail e telefone, Permitir consulta, edição e exclusão de clientes.


Cadastro de Pedidos: Criar um pedido associando-o a um cliente existente, Inserir múltiplos jogos em um pedido, especificando a quantidade de cada um, Calcular automaticamente o valor total do pedido com base nos itens.


Estoque: Ao realizar um pedido, o sistema deve verificar a disponibilidade em estoque, O estoque dos jogos deve ser decrementado conforme as quantidades vendidas, O sistema deve impedir a criação de pedidos com quantidades maiores que o estoque disponível.


Consulta de Pedidos: Listar todos os pedidos realizados, Consultar um pedido específico, exibindo os dados do cliente, a lista de jogos comprados e o valor total.





Requisitos Não Funcionais
O sistema deve utilizar uma API RESTful construída com Node.js (Express.js) e banco de dados MySQL.


As requisições devem aceitar e retornar dados em formato JSON.


Todas as operações devem ser validadas, garantindo que os campos obrigatórios sejam preenchidos corretamente.


O sistema deve possuir tratamento de erros com mensagens claras (ex: jogo não encontrado, estoque insuficiente, etc.).


O código deve ser versionado com Git, com boas práticas de commits e organização por branches.


A aplicação deve ser documentada com DER, scripts SQL e exemplos de uso dos endpoints.




------------__________________________________________________________________________________________________________________________________________________________________________________---------




A Linguagem da API RESTful
Cada ação que queremos realizar em uma API RESTful tem um verbo HTTP correspondente. Esses verbos estão diretamente ligados às operações básicas de manipulação de dados, conhecidas como CRUD:

GET: Usado para Obter/Ler dados (READ).
Exemplo: GET /produtos (para listar todos os produtos)

POST: Usado para Criar novos dados (CREATE).
Exemplo: POST /produtos (para adicionar um novo produto)

PUT: Usado para atualizar dados existentes (UPDATE) de forma completa.
Exemplo: PUT /produtos/123 (para atualizar o produto com ID 123)

DELETE: Usado para remover dados (DELETE).
Exemplo: DELETE /produtos/123 (para remover o produto com ID 123)

PATCH: Usado para Atualizar dados existentes (UPDATE) de forma parcial (se for cobrir, caso contrário, pode pular).




------------__________________________________________________________________________________________________________________________________________________________________________________---------




Configurando o Projeto

Para começar, você precisa ter o Node.js e o npm (ou Yarn) instalados em sua máquina.
Crie uma pasta para o seu projeto: Bash

 mkdir “ Jogos “ cd “ Jogos ”


Inicie o projeto Node.js: Este comando cria um arquivo package.json, que gerencia as informações do seu projeto e suas dependências.

 npm init -y


Instale o Express.js:

 npm install express


Crie o arquivo principal da sua aplicação: Crie um arquivo chamado “Jogos.js” na raiz da sua pasta.



------------__________________________________________________________________________________________________________________________________________________________________________________---------

 

Testando
Inicie seu servidor Express: Certifique-se de que seu Jogo.js esteja rodando (node Jogo.js).

Abra o Postman/Insomnia.

Crie uma nova requisição.

Defina o Método HTTP: Escolha entre GET, POST, PUT, DELETE.

Insira a URL da sua API:
Para listar todas as tarefas: http://localhost:3000/lojaJogo
Para buscar uma tarefa: http://localhost:3000/lojaJogo/1 (substitua 1 pelo ID desejado)

Para requisições POST/PUT:
Vá para a aba Body.
Selecione a opção raw e o tipo JSON.
Insira o JSON com os dados da tarefa (ex: {"nome": " Pou", "genero": "Entreterimento"}).

Clique em "Send".

Observe a resposta e o código de status HTTP que sua API retornou.



------------__________________________________________________________________________________________________________________________________________________________________________________---------



Conectando o Node.js ao MySQL com mysql2

Vamos usar a biblioteca mysql2 para permitir que nossa aplicação Node.js se comunique com o MySQL.

Instale o pacote mysql2: No terminal, na pasta do seu projeto Express:Bash

 npm install mysql2


Configure a conexão: Vamos criar um arquivo db.js para gerenciar nossa conexão com o banco de dados. Isso ajuda a manter o código organizado.JavaScript



------------__________________________________________________________________________________________________________________________________________________________________________________---------

READ: Listar Todas as Tarefas (GET /tarefas)
Objetivo: Obter todas as tarefas da tabela tarefas no MySQL.

app.get('/tarefas', async (req, res) => {
  try {
    // Executa a consulta SQL para selecionar todas as tarefas
    // pool.query retorna um array, onde o primeiro elemento [0] são as linhas (rows)
    const [rows] = await db.query('SELECT * FROM tarefas');
    res.json(rows); // Envia os resultados como JSON
  } catch (error) {
    console.error('Erro ao buscar tarefas:', error);
    res.status(500).send('Erro interno do servidor ao buscar tarefas.');
  }
});


READ: Buscar Tarefa por ID (GET /tarefas/:id)
Objetivo: Obter uma tarefa específica pelo seu id.
Importante: Usamos ? como placeholder para o valor do id. O mysql2 substitui esse ? com o valor fornecido no segundo argumento do query, prevenindo SQL Injection.

app.get('/tarefas/:id', async (req, res) => {
  const id = parseInt(req.params.id); // Converte o ID da URL para número

  if (isNaN(id)) {
    return res.status(400).send('ID inválido. O ID deve ser um número.');
  }

  try {
    // Consulta a tarefa pelo ID. Passamos o ID como um array para o segundo argumento.
    const [rows] = await db.query('SELECT * FROM tarefas WHERE id = ?', [id]);

    if (rows.length > 0) {
      res.json(rows[0]); // Retorna a primeira (e única) tarefa encontrada
    } else {
      res.status(404).send('Tarefa não encontrada.');
    }
  } catch (error) {
    console.error(`Erro ao buscar tarefa com ID ${id}:`, error);
    res.status(500).send('Erro interno do servidor ao buscar tarefa.');
  }
});






CREATE: Criar Nova Tarefa (POST /tarefas)
Objetivo: Inserir uma nova tarefa na tabela tarefas.

app.post('/tarefas', async (req, res) => {
  const { titulo, descricao, concluida } = req.body;

  // Validação básica de entrada
  if (!titulo) {
    return res.status(400).send('O título da tarefa é obrigatório.');
  }

  try {
    // Executa a consulta INSERT. O '?' preenche os valores da tarefa.
    const [result] = await db.query(
      'INSERT INTO tarefas (titulo, descricao, concluida) VALUES (?, ?, ?)',
      [titulo, descricao || null, concluida || false] // Usamos null para descrição se não for fornecida, e false para concluida
    );

    // O 'result' contém informações sobre a inserção, incluindo o ID gerado
    const novaTarefa = { id: result.insertId, titulo, descricao, concluida };
    res.status(201).json(novaTarefa); // Retorna a tarefa criada com status 201 (Created)
  } catch (error) {
    console.error('Erro ao criar tarefa:', error);
    res.status(500).send('Erro interno do servidor ao criar tarefa.');
  }
});


UPDATE: Atualizar Tarefa Existente (PUT /tarefas/:id)
Objetivo: Modificar uma tarefa existente pelo seu id.
app.put('/tarefas/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { titulo, descricao, concluida } = req.body;

  if (isNaN(id)) {
    return res.status(400).send('ID inválido. O ID deve ser um número.');
  }
  if (!titulo && descricao === undefined && concluida === undefined) {
      return res.status(400).send('Pelo menos um campo (titulo, descricao, ou concluida) deve ser fornecido para atualização.');
  }

  try {
    // Primeiro, verifique se a tarefa existe
    const [existingRows] = await db.query('SELECT * FROM tarefas WHERE id = ?', [id]);
    if (existingRows.length === 0) {
      return res.status(404).send('Tarefa não encontrada para atualização.');
    }

    // Construa a consulta UPDATE dinamicamente para atualizar apenas os campos fornecidos
    let updates = [];
    let params = [];
    if (titulo !== undefined) {
      updates.push('titulo = ?');
      params.push(titulo);
    }
    if (descricao !== undefined) {
      updates.push('descricao = ?');
      params.push(descricao);
    }
    if (concluida !== undefined) {
      updates.push('concluida = ?');
      params.push(concluida);
    }

    if (updates.length === 0) { // Nenhuma atualização válida foi fornecida
        return res.status(400).send('Nenhum campo válido para atualização fornecido.');
    }

    const query = `UPDATE tarefas SET ${updates.join(', ')} WHERE id = ?`;
    params.push(id); // Adiciona o ID ao final dos parâmetros

    const [result] = await db.query(query, params);

    if (result.affectedRows > 0) {
      // Após a atualização, busque a tarefa novamente para retornar os dados mais recentes
      const [updatedRows] = await db.query('SELECT * FROM tarefas WHERE id = ?', [id]);
      res.json(updatedRows[0]);
    } else {
      // Embora já tenhamos checado, esta linha é um fallback
      res.status(404).send('Tarefa não encontrada ou nenhum dado foi alterado.');
    }
  } catch (error) {
    console.error(`Erro ao atualizar tarefa com ID ${id}:`, error);
    res.status(500).send('Erro interno do servidor ao atualizar tarefa.');
  }
});







DELETE: Remover Tarefa (DELETE /tarefas/:id)
Objetivo: Excluir uma tarefa da tabela tarefas.

app.delete('/tarefas/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).send('ID inválido. O ID deve ser um número.');
  }

  try {
    const [result] = await db.query('DELETE FROM tarefas WHERE id = ?', [id]);

    if (result.affectedRows > 0) { // affectedRows indica quantas linhas foram afetadas
      res.status(204).send(); // Retorna status 204 (No Content) - sucesso sem corpo de resposta
    } else {
      res.status(404).send('Tarefa não encontrada para exclusão.');
    }
  } catch (error) {
    console.error(`Erro ao excluir tarefa com ID ${id}:`, error);
    res.status(500).send('Erro interno do servidor ao excluir tarefa.');
  }
});













