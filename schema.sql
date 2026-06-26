IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='users' AND xtype='U')
BEGIN
    CREATE TABLE users (
        email NVARCHAR(255) PRIMARY KEY,
        password NVARCHAR(255) NOT NULL,
        role NVARCHAR(50) NOT NULL CHECK (role IN ('USER', 'ADMIN')),
        last_login DATETIME NULL
    );
END;

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='tasks' AND xtype='U')
BEGIN
    CREATE TABLE tasks (
        id INT IDENTITY(1,1) PRIMARY KEY,
        title NVARCHAR(255) NOT NULL,
        description NVARCHAR(MAX) NULL,
        status NVARCHAR(50) NOT NULL CHECK (status IN ('TODO', 'IN_PROGRESS', 'DONE')),
        assigned_to NVARCHAR(255) NOT NULL,
        created_at DATETIME NOT NULL DEFAULT GETDATE(),
        CONSTRAINT fk_tasks_users FOREIGN KEY (assigned_to) REFERENCES users(email) ON DELETE CASCADE
    );
END;

IF NOT EXISTS (SELECT * FROM users WHERE email = 'admin@ariel.com')
BEGIN
    INSERT INTO users (email, password, role, last_login)
    VALUES ('admin@ariel.com', '$2a$10$LZnUk4vpcDxjB2xOZELBEO65PbTzTYKYk9ST8XDNygMPy0rNEIPMe', 'ADMIN', GETDATE());
END;

IF NOT EXISTS (SELECT * FROM users WHERE email = 'alice@ariel.com')
BEGIN
    INSERT INTO users (email, password, role, last_login)
    VALUES ('alice@ariel.com', '$2a$10$bf8lFpXsEbZY.T5yCTg6NeqKKtNRAIUS1wPqgfJjkF4mqaDc29o6a', 'USER', GETDATE());
END;

IF NOT EXISTS (SELECT * FROM users WHERE email = 'bob@ariel.com')
BEGIN
    INSERT INTO users (email, password, role, last_login)
    VALUES ('bob@ariel.com', '$2a$10$bf8lFpXsEbZY.T5yCTg6NeqKKtNRAIUS1wPqgfJjkF4mqaDc29o6a', 'USER', GETDATE());
END;

IF NOT EXISTS (SELECT * FROM users WHERE email = 'charlie@ariel.com')
BEGIN
    INSERT INTO users (email, password, role, last_login)
    VALUES ('charlie@ariel.com', '$2a$10$bf8lFpXsEbZY.T5yCTg6NeqKKtNRAIUS1wPqgfJjkF4mqaDc29o6a', 'USER', GETDATE());
END;


IF NOT EXISTS (SELECT * FROM tasks WHERE title = 'Setup Project Structure')
BEGIN
    INSERT INTO tasks (title, description, status, assigned_to, created_at)
    VALUES (
        'Setup Project Structure',
        'Setup the base repository configuration for the backend (Spring Boot) and frontend (Angular) modules.',
        'DONE',
        'alice@ariel.com',
        DATEADD(day, -4, GETDATE())
    );
END;

IF NOT EXISTS (SELECT * FROM tasks WHERE title = 'Configure Security Filter Chain')
BEGIN
    INSERT INTO tasks (title, description, status, assigned_to, created_at)
    VALUES (
        'Configure Security Filter Chain',
        'Implement JWT interceptor, authentication filter, and security endpoint protection rules.',
        'IN_PROGRESS',
        'bob@ariel.com',
        DATEADD(day, -3, GETDATE())
    );
END;

IF NOT EXISTS (SELECT * FROM tasks WHERE title = 'Design User Interface Layout')
BEGIN
    INSERT INTO tasks (title, description, status, assigned_to, created_at)
    VALUES (
        'Design User Interface Layout',
        'Create premium glassmorphic dashboard views and login panels using Tailwind CSS v4 utility styling.',
        'TODO',
        'charlie@ariel.com',
        DATEADD(day, -2, GETDATE())
    );
END;

IF NOT EXISTS (SELECT * FROM tasks WHERE title = 'Database Connection String')
BEGIN
    INSERT INTO tasks (title, description, status, assigned_to, created_at)
    VALUES (
        'Database Connection String',
        'Verify connection stability with MS SQL Server container instance running locally on WSL port 1433.',
        'DONE',
        'bob@ariel.com',
        DATEADD(day, -1, GETDATE())
    );
END;

IF NOT EXISTS (SELECT * FROM tasks WHERE title = 'Prepare Technical Walkthrough')
BEGIN
    INSERT INTO tasks (title, description, status, assigned_to, created_at)
    VALUES (
        'Prepare Technical Walkthrough',
        'Draft walkthrough document listing all file mappings, seed users, and steps to verify application features.',
        'TODO',
        'alice@ariel.com',
        GETDATE()
    );
END;

IF NOT EXISTS (SELECT * FROM tasks WHERE title = 'Final Performance Audit')
BEGIN
    INSERT INTO tasks (title, description, status, assigned_to, created_at)
    VALUES (
        'Final Performance Audit',
        'Conduct code audit for redundant layers and abstractions using the project ponytail guidelines.',
        'TODO',
        'admin@ariel.com',
        GETDATE()
    );
END;
