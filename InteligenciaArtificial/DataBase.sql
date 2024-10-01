CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Roles table
CREATE TABLE Roles (
    RoleID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    RoleName VARCHAR(50) UNIQUE NOT NULL,
    Description TEXT,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);  

CREATE TABLE Users (
    UserID UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    Username VARCHAR(50) UNIQUE NOT NULL,
    LastName VARCHAR(100) NOT NULL,
    FirstName VARCHAR(100) NOT NULL,
    Email VARCHAR(255) UNIQUE NOT NULL,
    Password VARCHAR(255) NOT NULL,
    RegistrationDate DATE NOT NULL,
    LastLogin TIMESTAMP,  -- Cambio de DATETIME a TIMESTAMP
    RoleID INT NOT NULL,
    Status VARCHAR(20) DEFAULT 'Active',
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Se eliminó ON UPDATE
    FOREIGN KEY (RoleID) REFERENCES Roles(RoleID)
);

-- Categories table
CREATE TABLE Categories (
    CategoryID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,  -- Genera un valor único automáticamente
    CategoryName VARCHAR(100) UNIQUE NOT NULL,
    Description TEXT,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP  
);


-- Questionnaires table
CREATE TABLE Questionnaires (
    QuestionnaireID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    Title VARCHAR(255) NOT NULL,
    Description TEXT,
    CreatorUserID UUID,
    CategoryID INT,
    NumberOfQuestions INT,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
    FOREIGN KEY (CreatorUserID) REFERENCES Users(UserID),
    FOREIGN KEY (CategoryID) REFERENCES Categories(CategoryID)
);

CREATE TABLE Questions (
    QuestionID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    QuestionnaireID INT,
    QuestionContent TEXT NOT NULL,
    QuestionType VARCHAR(50) NOT NULL,
    Score INT NOT NULL,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
    FOREIGN KEY (QuestionnaireID) REFERENCES Questionnaires(QuestionnaireID)
);

-- Answers table
CREATE TABLE Answers (
    AnswerID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    QuestionID INT,
    AnswerContent TEXT NOT NULL,
    IsCorrect BOOLEAN NOT NULL,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
    FOREIGN KEY (QuestionID) REFERENCES Questions(QuestionID)
);

-- Publications table
CREATE TABLE Publications (
    PublicationID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    Title VARCHAR(255) NOT NULL,
    Description TEXT,
    CategoryID INT,
    AuthorUserID UUID,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
    FOREIGN KEY (CategoryID) REFERENCES Categories(CategoryID),
    FOREIGN KEY (AuthorUserID) REFERENCES Users(UserID)
);

-- Medals table
CREATE TABLE Medals (
    MedalID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    MedalName VARCHAR(50) UNIQUE NOT NULL,
    Description TEXT,
    RequiredCorrectAnswers INT NOT NULL,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP  
);

-- UserProgress table
CREATE TABLE UserProgress (
    ProgressID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    UserID UUID,
    QuestionnaireID INT,
    CompletionDate DATE,
    CorrectAnswers INT,
    MedalID INT,
    Score DECIMAL(5,2),
    AttemptNumber INT,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (QuestionnaireID) REFERENCES Questionnaires(QuestionnaireID),
    FOREIGN KEY (MedalID) REFERENCES Medals(MedalID)
);

-- UserFinalProgress table
CREATE TABLE UserFinalProgress (
    FinalProgressID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    UserID UUID,
    CompletionDate DATE,
    TotalMedals INT CHECK (TotalMedals >= 0),
    FinalScore DECIMAL(5,2),
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

-- PublicationQuestionnaire junction table
CREATE TABLE PublicationQuestionnaire (
    PublicationID INT,
    QuestionnaireID INT,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
    PRIMARY KEY (PublicationID, QuestionnaireID),
    FOREIGN KEY (PublicationID) REFERENCES Publications(PublicationID),
    FOREIGN KEY (QuestionnaireID) REFERENCES Questionnaires(QuestionnaireID)
);

CREATE TABLE sessions (
    token UUID PRIMARY KEY,  
    hostname VARCHAR(64) NOT NULL,
    user_id UUID NOT NULL,  -- Equivalente a UNIQUEIDENTIFIER en SQL Server
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,  -- Equivalente a DATETIMEOFFSET en SQL Server
    CONSTRAINT session_user_id_fk FOREIGN KEY (user_id) REFERENCES users(UserID) ON DELETE CASCADE ON UPDATE CASCADE
);