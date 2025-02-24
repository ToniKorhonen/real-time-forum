package middleware

import "regexp"

func ValidatePassword(password string) []string {
	var errors []string

	// Check for minimum length
	if len(password) < 8 {
		errors = append(errors, "Mot de passe doit être au moins 8 caractéres.")
	}

	// Check for at least one uppercase letter
	if !regexp.MustCompile(`[A-Z]`).MatchString(password) {
		errors = append(errors, "Mot de passe doit contenir au moins un majuscule.")
	}

	// Check for at least one digit
	if !regexp.MustCompile(`[0-9]`).MatchString(password) {
		errors = append(errors, "Mot de passe doit contenir au moins un numéro.")
	}

	// Check for at least one special character
	if !regexp.MustCompile(`[!@#\$%\^&\*\(\)_\+\-=\[\]\{\};:'",<>\./?\\|]`).MatchString(password) {
		errors = append(errors, "Mot de passe doit contenir au moins un caractére spécial.")
	}

	return errors
}

// Function to validate email
func IsValidEmail(email string) []string {
	// Regular expression for validating an Email
	var errors []string
	if !regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`).MatchString(email) {
		errors = append(errors, "Email invalide.")
	}
	return errors
}

func IsValidUsername(username string) []string {
	var errors []string
	if len(username) > 20 {
		errors = append(errors, "Le nom d'utilsateur ne doit pas contenir plus de 20 caractéres")
	}
	return errors
}

// Function to validate age
func IsValidAge(age string) []string {
	var errors []string
	if len(age) > 3 {
		errors = append(errors, "L'age doit être inférieur à 100")
	}
	if len(age) <= 13 {
		errors = append(errors, "L'age doit être supérieur à 13")
	}
	return errors
}
