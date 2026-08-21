package com.shopkart;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.sql.*;

@WebServlet("/register")
public class RegisterServlet extends HttpServlet {
	protected void doPost(HttpServletRequest req, HttpServletResponse res) throws IOException {
		String sql = "INSERT INTO users(name,email,password) VALUES(?,?,?)";
		try (Connection c = DBConnection.getConnection(); PreparedStatement p = c.prepareStatement(sql)) {
			p.setString(1, req.getParameter("name"));
			p.setString(2, req.getParameter("email"));
			p.setString(3, req.getParameter("password"));
			p.executeUpdate();
			res.sendRedirect("login.html?registered=true");
		} catch (SQLIntegrityConstraintViolationException e) {
			res.sendRedirect("register.html?exists=true");
		} catch (Exception e) {
			e.printStackTrace();
			res.sendRedirect("register.html?error=true");
		}
	}
}