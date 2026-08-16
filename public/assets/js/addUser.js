const formAddUser = document.getElementById("form-add-user");

if (formAddUser) {
    formAddUser.addEventListener("submit", async (event) => {
        try {
            event.preventDefault();

            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            const raw = JSON.stringify({
                firstname: firstname.value,
                lastname: lastname.value,
                email: email.value,
            });

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow",
            };

            const response = await fetch("/api/users", requestOptions);
            const data = await response.json();

            if (response.status != 201) {
                return alert(data.message);
            }

            let mensaje = `${data.message}, con ID:\n${data.user.id}`;

            alert(mensaje);

            formAddUser.reset();

            setTimeout(() => {
                location.href = "/users";
            }, 1500);
        } catch (error) {
            console.log(error);
            alert("Error al intentar crear el usuario.");
        }
    });
}
