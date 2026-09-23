package sessiontracking;

import java.io.IOException;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/cookieTransaction")
public class CookieTransactionServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;

    @Override
    protected void doGet(HttpServletRequest request,
                          HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("text/html;charset=UTF-8");

        PrintWriter out = response.getWriter();

        String transaction = request.getParameter("transaction");

        if (transaction == null || transaction.trim().isEmpty()) {
            transaction = "No transaction entered";
        }

        transaction = transaction.trim();

        String history = "";

        // Read existing cookie
        Cookie[] cookies = request.getCookies();

        if (cookies != null) {

            for (Cookie cookie : cookies) {

                if ("transactionHistory".equals(cookie.getName())) {

                    try {
                        byte[] decoded =
                                Base64.getDecoder()
                                     .decode(cookie.getValue());

                        history = new String(
                                decoded,
                                StandardCharsets.UTF_8
                        );

                    } catch (IllegalArgumentException e) {
                        history = "";
                    }

                    break;
                }
            }
        }

        // Add new transaction
        if (!history.isEmpty()) {
            history += " | ";
        }

        history += transaction;

        // Encode history before storing in cookie
        String encodedHistory =
                Base64.getEncoder()
                     .encodeToString(
                         history.getBytes(StandardCharsets.UTF_8)
                     );

        Cookie transactionCookie =
                new Cookie("transactionHistory", encodedHistory);

        transactionCookie.setMaxAge(24 * 60 * 60);

        transactionCookie.setPath(
                request.getContextPath().isEmpty()
                        ? "/"
                        : request.getContextPath()
        );

        response.addCookie(transactionCookie);

        // Display result
        out.println("<!DOCTYPE html>");
        out.println("<html>");
        out.println("<head>");
        out.println("<title>Cookie Transaction History</title>");
        out.println("</head>");

        out.println("<body>");

        out.println("<h1>Transaction History Using Cookies</h1>");

        out.println("<p><b>New Transaction:</b> "
                + escapeHtml(transaction)
                + "</p>");

        out.println("<h3>Transaction History:</h3>");

        out.println("<ol>");

        String[] transactions = history.split("\\|");

        for (String item : transactions) {

            out.println("<li>"
                    + escapeHtml(item.trim())
                    + "</li>");
        }

        out.println("</ol>");

        out.println("<br>");

        out.println("<a href=\"cookie.html\">");
        out.println("Add Another Transaction");
        out.println("</a>");

        out.println("<br><br>");

        out.println("<a href=\"session.html\">");
        out.println("Try HTTP Session");
        out.println("</a>");

        out.println("</body>");
        out.println("</html>");
    }

    private String escapeHtml(String value) {

        return value
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#39;");
    }
}