const formularioResetPassword = document.getElementById(
  "form-reset-password",
);

// Extract the token from the URL
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get("token");

formularioResetPassword.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const newPassword = document.getElementById("password").value;

  const datos = {
    email,
    newPassword,
    token, // Include the token in the request body
  };

  try {
    const response = await fetch("/api/session/updatePassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datos),
    });

    if (response.ok) {
      window.location.href = "/login"; // Redirect to the main page on successful update
    } else {
      const errorResponse = await response.json(); // Parse the JSON error response
      //console.log(errorResponse);
      throw new Error(
        `Error de actualización de contraseña: ${errorResponse.text}`,
      );
    }
  } catch (error) {
    alert(error.message); // Display the more informative error message
  }
});
