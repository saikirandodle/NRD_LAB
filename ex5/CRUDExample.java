import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class CRUDExample {
//JDBC URL, username, and password of MySQL server

	private static final String JDBC_URL = "jdbc:mysql://localhost:3306/testdb";
	private static final String USERNAME = "root";
	private static final String PASSWORD = "Wrong@123";

	public static void main(String[] args) {
		try {
			Class.forName("com.mysql.cj.jdbc.Driver");
//Step1: Establishing a connection
			Connection connection = DriverManager.getConnection(JDBC_URL, USERNAME, PASSWORD);
//Step2: Creating a statement
			Statement statement = connection.createStatement();
// Step 3: Performing CRUD operations 
			createRecord(statement, 1, "JohnDoe", 50000);
			readRecords(statement);
			updateRecord(statement, 1, "JohnUpdated", 55000);
			readRecords(statement);
			deleteRecord(statement, 1);
			readRecords(statement);
//Step4:Closingresources
			statement.close();
			connection.close();
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		}
		catch (SQLException e) {
			e.printStackTrace();
		}

	}

//Create a new record in the database
	private static void createRecord(Statement statement, int id, String name, int salary) throws SQLException {
		String insertQuery = "INSERT INTO employee(id, name, salary)VALUES(" + id + ",'" + name + "', " + salary + ")";
		statement.executeUpdate(insertQuery);
		System.out.println("Record created successfully.");
	}

//Read all records from the database
	private static void readRecords(Statement statement) throws SQLException {
		String selectQuery = "SELECT * FROM employee";
		ResultSet resultSet = statement.executeQuery(selectQuery);
		System.out.println("ID\tName\tSalary");
		while (resultSet.next()) {
			int id = resultSet.getInt("id");
			String name = resultSet.getString("name");
			int salary = resultSet.getInt("salary");
			System.out.println(id + "\t" + name + "\t" + salary);
		}
		System.out.println();
	}

//Updatearecordinthedatabase
	private static void updateRecord(Statement statement, int id, String newName, int newSalary) throws SQLException {
		String updateQuery = "UPDATE employee SET name='" + newName + "', salary = " + newSalary + " WHERE id = " + id;
		statement.executeUpdate(updateQuery);
		System.out.println("Record updated successfully.");
	}

//Deletearecordfromthe database
	private static void deleteRecord(Statement statement, int id) throws SQLException {
		String deleteQuery = "DELETE FROM employee WHERE id=" + id;
		statement.executeUpdate(deleteQuery);
		System.out.println("Record deleted successfully.");
	}
}
