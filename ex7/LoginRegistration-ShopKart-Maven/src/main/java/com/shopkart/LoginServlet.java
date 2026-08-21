package com.shopkart;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.sql.*;

@WebServlet("/login")
public class LoginServlet extends HttpServlet {
	protected void doPost(HttpServletRequest req, HttpServletResponse res) throws IOException {
		String sql = "SELECT id,name FROM users WHERE email=? AND password=?";
		try (Connection c = DBConnection.getConnection(); PreparedStatement p = c.prepareStatement(sql)) {
			p.setString(1, req.getParameter("email"));
			p.setString(2, req.getParameter("password"));
			try (ResultSet r = p.executeQuery()) {
				if (r.next()) {
					HttpSession s = req.getSession();
					s.setAttribute("userName", r.getString("name"));
					s.setAttribute("userId", r.getInt("id"));
					res.sendRedirect("dashboard.html");
				} else
					res.sendRedirect("login.html?error=true");
			}
		} catch (Exception e) {
			e.printStackTrace();
			res.sendRedirect("login.html?dberror=true");
		}
	}
}