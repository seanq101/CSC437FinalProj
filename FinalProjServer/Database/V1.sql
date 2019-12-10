create table Person (
   id int auto_increment primary key,
   firstName varchar(30),
   lastName varchar(30) not null,
   email varchar(30) not null,
   password varchar(50),
   whenRegistered datetime(3) not null,
   termsAccepted datetime(3),
   role int unsigned not null, # 0 normal, 1 admin
   unique key(email)
);

create table Conversation (
   id int auto_increment primary key,
   ownerId int,
   title varchar(80) not null,
   lastMessage datetime(3),
   constraint FKMessage_ownerId foreign key (ownerId) references Person(id)
    on delete cascade,
   unique key UK_title(title)
);

create table Entry (
   id int auto_increment primary key,
   ownerId int,
   title varchar(80) not null,
   waveHeight int not null,
   content varchar(1000) not null,
   rating int not null,
   loc varchar(80) not null,
   pub int not null,
   whenSurfed datetime(3) not null,
   picURL varchar(500),
   userName varchar(80),
   boardId int,
   constraint FKMessage_boardId foreign key (boardId) references Board(id)
    on delete cascade
);

create table Board (
   id int auto_increment primary key,
   prId int,
   bName varchar(80) not null,
   heightFT int not null,
   heightIN int not null,
   picURL varchar(500),
   constraint FKMessage_prId foreign key (prId) references Person(id)
    on delete cascade
);

create table Message (
   id int auto_increment primary key,
   cnvId int not null,
   prsId int not null,
   whenMade datetime(3) not null,
   content varchar(5000) not null,
   email varchar(100) not null,
   constraint FKMessage_cnvId foreign key (cnvId) references Conversation(id)
    on delete cascade,
   constraint FKMessage_prsId foreign key (prsId) references Person(id)
    on delete cascade
);

insert into Person (firstName, lastName, email, password, whenRegistered, role)
            VALUES ("Joe", "Admin", "adm@11.com", "password", NOW(), 1);
