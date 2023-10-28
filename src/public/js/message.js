(function () {
    const socketMessage = io();
  
    const formMessage = document.getElementById("form-message");
    const inputMessage = document.getElementById("input-message");
    const logMessage = document.getElementById("log-message");
  
    formMessage.addEventListener("submit", (e) => {
      e.preventDefault();
  
      const text = inputMessage.value;
  
      socketMessage.emit("new-message", { username, text });
      inputMessage.value = "";
      inputMessage.focus();
    });
  
    function updateLogMessage(messages) {
      logMessage.innerText = "";
      messages.forEach((msg) => {
        const p = document.createElement("p");
        p.innerText = `${msg.username}: ${msg.text}`;
        logMessage.appendChild(p);
      });
    }
  
    socketMessage.on("new-client", () => {
      Swal.fire({
        text: "Nuevo usuario conectado",
        toast: true,
        position: "top-right",
      });
    });
  
    let username;
  
    Swal.fire({
      title: "<strong>Ingresa tu nombre</strong>",
      input: "text",
      inputWidth: 200,
      inputLabel: "Ingrese su username",
      allowOutsideClick: false,
      inputValidator: (value) => {
        if (!value) {
          return "Por favor ingrese su usuario";
        }
      },
    }).then((result) => {
      username = result.value.trim();
      console.log(`Hola ${username}, bienvenido`);
    });
  
    socketMessage.on("notification", ({ messages }) => {
      updateLogMessage(messages);
    });
  })();
  