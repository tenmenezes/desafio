export function getPasswordStrength(password: string) {
    let score = 0;

    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (password.length === 0) {
        return {
            label: "",
            color: "",
            width: "0%",
        };
    }

    if (score <= 2) {
        return {
            label: "Ruim",
            color: "bg-red-500",
            width: "25%",
        };
    }

    if (score <= 4) {
        return {
            label: "Bom",
            color: "bg-orange-500",
            width: "60%",
        };
    }

    if (score === 5) {
        return {
            label: "Forte",
            color: "bg-green-500",
            width: "80%",
        };
    }

    return {
        label: "Excelente",
        color: "bg-emerald-600",
        width: "100%",
    };
}