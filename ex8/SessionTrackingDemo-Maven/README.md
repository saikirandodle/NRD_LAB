# SessionTrackingDemo - Maven Dynamic Web Project

## NRD Lab Exercise

Maintaining the transactional history of any user is very important.
Explore the various session tracking mechanisms:

1. Cookies
2. HTTP Session

## Compatibility

- Java 17
- Maven 3.8+
- Jakarta Servlet 6.0
- Apache Tomcat 10.1+
- Eclipse IDE

## Build

```bash
mvn clean package
```

Generated WAR:

```text
target/SessionTrackingDemo.war
```

Deploy the WAR to Tomcat 10.1+.

Open:

```text
http://localhost:8080/SessionTrackingDemo/
```

## Eclipse

Import using:

File -> Import -> Maven -> Existing Maven Projects

Then:

Right-click project -> Run As -> Run on Server

## Verify Java

Run:

```bash
java -version
mvn -version
```

Both should use Java 17.

## Session Tracking

### Cookies
Transaction history is stored in a browser cookie.

### HTTP Session
Transaction history is stored in the server-side HTTP session.

### Logout
The logout servlet invalidates the current HTTP session.
