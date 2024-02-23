<script>
    let shown = false;

    let register = false;

    let loginForm;
    let registerForm;

    function login() {
        const formData = new FormData(loginForm);
        const data = new URLSearchParams();
        for (let field of formData) {
            const [key, value] = field;
            data.append(key, value);
        }

        fetch("/login?/login", {
            method: 'POST',
            body: data
        }).then(async (res) => {
            console.log(await res.json());
        });
    }

    function register() {

    }
</script>