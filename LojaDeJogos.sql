drop database if exists lojadejogos;
create database lojadejogos;
use lojadejogos;

create table Clientes (
    id int auto_increment primary key,
    nome varchar(100) not null,
    email varchar(100) not null,
    telefone varchar(20)
);

create table Jogos (
    id int auto_increment primary key,
    titulo varchar(100) not null,
    preco decimal(10,2) not null,
    plataforma varchar(50),
    quantidade_estoque int
);

create table Pedidos (
    id int auto_increment primary key,
    cliente_id int not null,
    data_pedido date,
    valor_total decimal(10,2),
    foreign key (cliente_id) references clientes(id)
);

create table ItensPedido (
    id int auto_increment primary key,
    pedido_id int not null,
    jogo_id int not null,
    quantidade int not null,
    preco_unitario decimal(10,2) not null,
    foreign key (pedido_id) references pedidos(id),
    foreign key (jogo_id) references jogos(id)
);