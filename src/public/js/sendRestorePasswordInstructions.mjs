const formularioResetPassword = document.getElementById(
  "form-send-restore-password-instructions",
);

formularioResetPassword.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value;

  const datos = {
    email,
  };

  try {
    const response = await fetch("/api/email/restorePassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datos),
    });

    if (response.ok) {
      window.location.href = "/restorePasswordThanks"; // Redirect to the main page on successful update
    } else {
      const errorResponse = await response.json(); // Parse the JSON error response
      //console.log(errorResponse);
      throw new Error(`Error al enviar email: ${errorResponse.text}`);
    }
  } catch (error) {
    alert(error.message); // Display the more informative error message
  }
});
