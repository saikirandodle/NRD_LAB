package sessiontracking;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@WebServlet("/sessionTransaction")
public class SessionTransactionServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;

    @Override
    protected void doGet(HttpServletRequest request,
                          HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("text/html;charset=UTF-8");
        PrintWriter out = response.getWriter();

        String transaction = request.getParameter("transaction");

        HttpSession session = request.getSession();

        @SuppressWarnings("unchecked")
        ArrayList<String> history =
                (ArrayList<String>) session.getAttribute("history");

        if (history == null) {
            history = new ArrayList<>();
        }

        if (transaction != null && !transaction.trim().isEmpty()) {
            history.add(transaction.trim());
        }

        session.setAttribute("history", history);

        out.println("<!DOCTYPE html>");
        out.println("<html>");
        out.println("<head><title>HTTP Session Transaction History</title></head>");
        out.println("<body>");

        out.println("<h1>Transaction History using HTTP Session</h1>");
        out.println("<h3>Transaction History:</h3>");
        out.println("<ol>");

        for (String item : history) {
            out.println("<li>" + escapeHtml(item) + "</li>");
        }

        out.println("</ol>");

        out.println("<a href='session.html'>Add Another Transaction</a>");
        out.println("<br><br>");
        out.println("<a href='logout'>Logout / Destroy Session</a>");

        out.println("</body>");
        out.println("</html>");
    }

    private String escapeHtml(String value) {
        return value.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#39;");
    }
}
