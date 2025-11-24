public class NewtonRaphson {

    // Evaluate polynomial f(x) for given coefficients
    public static double f(double x, double[] coef) {
        double result = 0;
        for (int i = 0; i < coef.length; i++) {
            result += coef[i] * Math.pow(x, i);
        }
        return result;
    }

    // Evaluate derivative f'(x)
    public static double fPrime(double x, double[] coef) {
        double result = 0;
        for (int i = 1; i < coef.length; i++) {
            result += i * coef[i] * Math.pow(x, i - 1);
        }
        return result;
    }

    // Newton Raphson root finder
    public static double newtonRoot(double[] coef, double guess) {
        double x = guess;
        double epsilon = 1e-6; // Accuracy
        int maxIter = 1000;

        for (int i = 0; i < maxIter; i++) {
            double fx = f(x, coef);
            double fpx = fPrime(x, coef);

            if (Math.abs(fpx) < 1e-8) {
                System.out.println("Derivative too small. Might not converge.");
                break;
            }

            double xNext = x - fx / fpx;

            if (Math.abs(xNext - x) < epsilon) {
                return xNext;
            }

            x = xNext;
        }

        return x;
    }

    public static void main(String[] args) {
        // Polynomial: x^3 - 23x^2 + 160x - 336
        double[] coef = {-336, 160, -23, 1};

        // Try different starting points to find different roots
        System.out.println("Root (guess=5): " + newtonRoot(coef, 5));
        System.out.println("Root (guess=10): " + newtonRoot(coef, 10));
        System.out.println("Root (guess=15): " + newtonRoot(coef, 15));
    }
}
