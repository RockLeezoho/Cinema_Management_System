CREATE TABLE cinema (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(100) NOT NULL,
    hotline VARCHAR(15) NOT NULL,
    email VARCHAR(100) NOT NULL,
    image VARCHAR(255)
);


CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    image VARCHAR(255),
    name VARCHAR(100) NOT NULL,
    dateOfBirth DATE,
    phone VARCHAR(10) NOT NULL,
    email VARCHAR(100) NOT NULL,
    personalId VARCHAR(100),
    username VARCHAR(100),
    password VARCHAR(100),
    accountStatus VARCHAR(20) CHECK (accountStatus IN ('active', 'inactive', 'banned', 'new')),
    position VARCHAR(100),
    role VARCHAR(100) NOT NULL,
    cinemaId INTEGER REFERENCES cinema(id)
);

CREATE TABLE supplier (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(100) NOT NULL,
    suppliedItems TEXT NOT NULL,
    phone VARCHAR(10) NOT NULL,
    contractStartDate DATE NOT NULL,
    contractEndDate DATE NOT NULL
);

CREATE TABLE voucher (
    id SERIAL PRIMARY KEY,
    image VARCHAR(255),
    title VARCHAR(100) NOT NULL,
    condition TEXT NOT NULL,
    startTime TIME NOT NULL,
    endTime TIME NOT NULL
);

CREATE TABLE concession (
    id SERIAL PRIMARY KEY,
    image VARCHAR(255),
    name VARCHAR(100) NOT NULL,
    type VARCHAR(100) NOT NULL,
    importPrice NUMERIC(10,2) NOT NULL,
    sellingPrice NUMERIC(10,2) NOT NULL,
    quantity INTEGER NOT NULL,
    supplierId INTEGER NOT NULL REFERENCES supplier(id),
    voucherId INTEGER REFERENCES voucher(id)
);

CREATE TABLE available_concession (
    cinemaId INTEGER NOT NULL REFERENCES cinema(id),
    concessionId INTEGER NOT NULL REFERENCES concession(id),
    PRIMARY KEY (cinemaId, concessionId)
);

CREATE TABLE invoice (
    id SERIAL PRIMARY KEY,
    paymentMethod TEXT NOT NULL,
    paymentDate DATE NOT NULL,
    userId INTEGER NOT NULL REFERENCES users(id)
);

CREATE TABLE invoice_concession (
    invoiceId INTEGER NOT NULL REFERENCES invoice(id),
    concessionId INTEGER NOT NULL REFERENCES concession(id),
    quantity INTEGER NOT NULL,
    PRIMARY KEY (invoiceId, concessionId)
);

CREATE TABLE ticket_type (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    voucherId INTEGER REFERENCES voucher(id)
);

CREATE TABLE room (
    id SERIAL PRIMARY KEY,
    image VARCHAR(255),
    name VARCHAR(100) NOT NULL,
    numberOfSeats INTEGER NOT NULL,
    cinemaId INTEGER NOT NULL REFERENCES cinema(id)
);

CREATE TABLE seat (
    id SERIAL PRIMARY KEY,
    image VARCHAR(255),
    name VARCHAR(100) NOT NULL,
    seatType VARCHAR(100) NOT NULL,
    roomId INTEGER NOT NULL REFERENCES room(id)
);

CREATE TABLE movie (
    id SERIAL PRIMARY KEY,
    image VARCHAR(255),
    title VARCHAR(100) NOT NULL,
    type VARCHAR(100) NOT NULL,
    ageRating INTEGER NOT NULL,
    country VARCHAR(100) NOT NULL,
    director VARCHAR(50),
    performers TEXT,
    duration INTEGER NOT NULL,
    content TEXT,
    trailer TEXT NOT NULL,
    viewer INTEGER NOT NULL DEFAULT 0,
    movieStatus VARCHAR(50) CHECK (movieStatus IN ('coming_soon', 'now_showing', 'stop_showing'))
);

CREATE TABLE showtime (
    id SERIAL PRIMARY KEY,
    startTime TIME NOT NULL,
    endTime TIME NOT NULL,
    showDate DATE NOT NULL,
    movieId INTEGER NOT NULL REFERENCES movie(id),
    roomId INTEGER NOT NULL REFERENCES room(id)
);

CREATE TABLE ticket (
    id SERIAL PRIMARY KEY,
    paymentDate DATE NOT NULL,
    paymentMethod TEXT NOT NULL,
    ticketTypeId INTEGER NOT NULL REFERENCES ticket_type(id),
    userId INTEGER NOT NULL REFERENCES users(id),
    seatId INTEGER NOT NULL REFERENCES seat(id),
    showtimeId INTEGER NOT NULL REFERENCES showtime(id),
    UNIQUE(seatId, showtimeId) --Tranh chon trung ghe cung suat chieu
);
