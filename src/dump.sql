create table usuario(
    id serial primary key,
    nome text not null,
    nome_loja text not null,
    email text unique,
    senha text not null
);

create table produtos(
    id serial primary key,
    usuario_id int not null, 
    nome text not null,
    quantidade int not null,
    categoria text not,
    preco int not null,
    descricao text not null,
    imagem text
)