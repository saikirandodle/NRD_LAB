package com.shopkart;

import java.sql.Connection;
import java.sql.DriverManager;

public class DBConnection {
	private static final String URL = "jdbc:mysql://localhost:3306/shopkart";
	private static final String USER = "root";
	private static final String PASSWORD = "Wrong@123"; // CHANGE TO YOUR MYSQL PASSWORD

	public static Connection getConnection() throws Exception {
		Class.forName("com.mysql.cj.jdbc.Driver");
		return DriverManager.getConnection(URL, USER, PASSWORD);
	}
}