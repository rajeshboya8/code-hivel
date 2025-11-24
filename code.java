import java.util.*;
import org.json.JSONObject;

public class PolynomialFromRoots {

    // Function to multiply two polynomials
    private static int[] multiply(int[] poly1, int[] poly2) {
        int[] result = new int[poly1.length + poly2.length - 1];

        for (int i = 0; i < poly1.length; i++) {
            for (int j = 0; j < poly2.length; j++) {
                result[i + j] += poly1[i] * poly2[j];
            }
        }
        return result;
    }

    public static void main(String[] args) {

        // Sample JSON input
        String jsonInput = "{ \"keys\": {\"n\":4, \"k\":3},"
                + "\"1\":{\"base\":\"10\",\"value\":\"4\"},"
                + "\"2\":{\"base\":\"2\",\"value\":\"111\"},"
                + "\"3\":{\"base\":\"10\",\"value\":\"12\"},"
                + "\"6\":{\"base\":\"4\",\"value\":\"213\"} }";

        JSONObject obj = new JSONObject(jsonInput);

        int n = obj.getJSONObject("keys").getInt("n");
        int k = obj.getJSONObject("keys").getInt("k");

        List<Integer> roots = new ArrayList<>();

        // Read first k roots
        int count = 0;
        for (String key : obj.keySet()) {
            if (key.equals("keys")) continue;

            if (count == k) break;

            JSONObject rootObj = obj.getJSONObject(key);
            int base = Integer.parseInt(rootObj.getString("base"));
            String value = rootObj.getString("value");

            int decimalRoot = Integer.parseInt(value, base);
            roots.add(decimalRoot);
            count++;
        }

        // Start with polynomial P(x) = 1
        int[] polynomial = {1};

        // Multiply for each (x - r)
        for (int root : roots) {
            int[] term = {1, -root}; // x - r
            polynomial = multiply(polynomial, term);
        }

        // Print coefficients
        System.out.println("Polynomial Coefficients:");
        for (int coef : polynomial) {
            System.out.print(coef + " ");
        }
    }
}
