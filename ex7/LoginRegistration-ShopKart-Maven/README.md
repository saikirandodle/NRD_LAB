# ShopKart - Java Servlet Shopping Cart Application

A simple shopping-cart web application built using **Java Servlets, Maven, MySQL, HTML, CSS, and Bootstrap 5**.

## Features

- User Registration
- User Login
- MySQL database integration
- Dashboard
- Product Catalogue
- Shopping Cart
- Bootstrap responsive UI
- Maven WAR packaging
- Apache Tomcat 11 deployment

## Technology Stack

| Technology | Version |
|---|---|
| Java | 17+ |
| Apache Tomcat | 11.0.x |
| Maven | 3.9.x |
| MySQL | 8.x+ |
| Jakarta Servlet API | 6.1.0 |
| Bootstrap | 5.3.x |

> **Important:** Tomcat 11 requires Java 17 or newer. Java 11 is not supported by Tomcat 11.

## Project Structure

```text
ShopKart/
├── pom.xml
├── database.sql
├── .gitignore
└── src/
    └── main/
        ├── java/
        │   └── com/shopkart/
        │       ├── DBConnection.java
        │       ├── LoginServlet.java
        │       └── RegisterServlet.java
        └── webapp/
            ├── login.html
            ├── register.html
            ├── dashboard.html
            ├── catalogue.html
            ├── cart.html
            └── style.css
```

# Prerequisites

Install the following:

- JDK 17 or newer
- Apache Maven 3.9.x
- Apache Tomcat 11
- MySQL 8.x or newer
- Eclipse IDE (optional)

Check Java:

```bash
java -version
```

Check Maven:

```bash
mvn -version
```

Maven should show Java 17 or newer.

# Database Setup

Start MySQL using MySQL Workbench or the MySQL command line.

Run the included:

```text
database.sql
```

It creates:

```text
Database: shopkart
Table: users
```

You can verify:

```sql
SHOW DATABASES;

USE shopkart;

SHOW TABLES;

SELECT * FROM users;
```

## Configure MySQL Password

Open:

```text
src/main/java/com/shopkart/DBConnection.java
```

Find:

```java
private static final String PASSWORD = "root";
```

Change it to your actual MySQL password.

For example:

```java
private static final String PASSWORD = "mysql123";
```

Also verify:

```java
private static final String USER = "root";
```

The default database connection is:

```text
jdbc:mysql://localhost:3306/shopkart
```

If MySQL uses another port, change the port in `DBConnection.java`.

# Build Using Maven

Open a terminal in the project root, where `pom.xml` is located.

Run:

```bash
mvn clean package
```

A successful build ends with:

```text
BUILD SUCCESS
```

The WAR file will be created at:

```text
target/shopkart.war
```

You can also build while skipping tests:

```bash
mvn clean package -DskipTests
```

# Run Using Eclipse + Tomcat 11

## 1. Import Maven Project

In Eclipse:

```text
File
→ Import
→ Maven
→ Existing Maven Projects
```

Select the ShopKart project folder and click **Finish**.

## 2. Configure JDK 17

Go to:

```text
Window
→ Preferences
→ Java
→ Installed JREs
```

Add/select JDK 17.

Then check:

```text
Project
→ Properties
→ Java Compiler
```

Make sure Java 17 is selected.

## 3. Configure Tomcat 11

Go to:

```text
Window
→ Preferences
→ Server
→ Runtime Environments
→ Add
```

Select:

```text
Apache Tomcat v11.0
```

Select your Tomcat directory, for example:

```text
D:\SMEC\apache-tomcat-11.0.25
```

Select JDK 17 as the runtime.

> If Eclipse does not show **Tomcat v11.0**, install/update the Eclipse Web Tools Platform (WTP) or use a current Eclipse IDE for Enterprise Java and Web Developers.

## 4. Add the Project to Tomcat

Open:

```text
Window
→ Show View
→ Servers
```

Create:

```text
Tomcat v11.0 Server
```

Right-click the server:

```text
Add and Remove...
```

Move:

```text
shopkart
```

to **Configured**, then click **Finish**.

## 5. Start Tomcat

Right-click:

```text
Tomcat v11.0 Server
```

Select:

```text
Start
```

Wait for Tomcat to start successfully.

## 6. Open the Application

Open:

```text
http://localhost:8080/shopkart/login.html
```

# Run Using Standalone Tomcat

Build the project:

```bash
mvn clean package
```

Copy:

```text
target/shopkart.war
```

to:

```text
D:\SMEC\apache-tomcat-11.0.25\webapps\
```

Start Tomcat:

```text
D:\SMEC\apache-tomcat-11.0.25\bin\startup.bat
```

Then open:

```text
http://localhost:8080/shopkart/login.html
```

To stop Tomcat:

```text
shutdown.bat
```

# Application Flow

```text
login.html
    |
    +-- New User
    |      |
    |      v
    |  register.html
    |      |
    |      v
    |  RegisterServlet
    |      |
    |      v
    |  MySQL users table
    |
    +-- Existing User
           |
           v
       LoginServlet
           |
           v
       MySQL verification
           |
           v
       dashboard.html
           |
           v
       catalogue.html
           |
           v
          cart.html
```

# Test Registration

Open:

```text
http://localhost:8080/shopkart/register.html
```

Example:

```text
Name: Sai
Email: sai@gmail.com
Password: 12345
```

After registration, verify:

```sql
USE shopkart;
SELECT * FROM users;
```

# Test Login

Open:

```text
http://localhost:8080/shopkart/login.html
```

Enter the registered email and password.

Successful login redirects to:

```text
dashboard.html
```

# Test Catalogue

Open:

```text
http://localhost:8080/shopkart/catalogue.html
```

Products include:

- Smartphone
- Laptop
- Headphones
- Smart Watch
- Camera
- Gaming Console

Click **Add +** to add products to the cart.

# Test Shopping Cart

Open:

```text
http://localhost:8080/shopkart/cart.html
```

The cart supports:

- View products
- Increase quantity
- Decrease quantity
- Place order
- Continue shopping

The demo cart uses browser `localStorage`.

# Troubleshooting

## `invalid target release: 17`

Check:

```bash
mvn -version
```

If Maven shows Java 11, configure Maven/Eclipse to use JDK 17.

## Tomcat says Java 17 is required

Tomcat 11 requires Java 17 or newer.

Use:

```text
JDK 17+
```

## Tomcat 11 is not shown in Eclipse

Your Eclipse installation may not have the Tomcat 11 server adapter. Install/update Eclipse Web Tools Platform (WTP), or use a current Eclipse IDE for Enterprise Java and Web Developers.

## 404 Not Found

Verify:

```text
http://localhost:8080/shopkart/login.html
```

Also check Eclipse's **Servers** view and make sure `shopkart` is deployed.

## MySQL connection error

Check:

1. MySQL Server is running.
2. Database `shopkart` exists.
3. Table `users` exists.
4. MySQL username is correct.
5. MySQL password in `DBConnection.java` is correct.
6. MySQL port is correct.

## Port 8080 already in use

Change the Tomcat HTTP port from:

```text
8080
```

to:

```text
8081
```

Then use:

```text
http://localhost:8081/shopkart/login.html
```

# Git Commands

Initialize Git:

```bash
git init
```

Add files:

```bash
git add .
```

Commit:

```bash
git commit -m "Initial ShopKart application"
```

Add GitHub repository:

```bash
git remote add origin YOUR_GITHUB_REPOSITORY_URL
```

Push:

```bash
git branch -M main
git push -u origin main
```

# Security Note

This project is intended for learning/demo purposes.

The sample application stores passwords as plain text for simplicity. A production application should use secure password hashing such as BCrypt or Argon2.

Do not commit real database passwords or other secrets to GitHub.

# Author

ShopKart - Java Servlet / Maven / MySQL / Bootstrap Learning Project
