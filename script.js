document.addEventListener('DOMContentLoaded', function() {
    // ============== CONFIGURAÇÕES ==============
    const BASE_URL = 'http://localhost/TCC/';
    const DEBUG_MODE = true; // Ativar para ver logs detalhados

    // ============== ELEMENTOS DO DOM ==============
    const elements = {
        loginBtn: document.getElementById('loginBtn'),
        logoutBtn: document.getElementById('logoutBtn'),
        loginModal: document.getElementById('loginModal'),
        registerModal: document.getElementById('registerModal'),
        closeButtons: document.querySelectorAll('.close'),
        registerBtn: document.getElementById('registerBtn'),
        loginForm: document.getElementById('loginForm'),
        registerForm: document.getElementById('registerForm'),
        userAvatar: document.getElementById('userAvatar'),
        userName: document.getElementById('userName'),
        userLevel: document.getElementById('userLevel'),
        // Elementos de progresso
        unit1Correct: document.getElementById('unit1Correct'),
        unit1Wrong: document.getElementById('unit1Wrong'),
        unit2Correct: document.getElementById('unit2Correct'),
        unit2Wrong: document.getElementById('unit2Wrong'),
        unit1CorrectText: document.getElementById('unit1CorrectText'),
        unit1WrongText: document.getElementById('unit1WrongText'),
        unit2CorrectText: document.getElementById('unit2CorrectText'),
        unit2WrongText: document.getElementById('unit2WrongText'),
        nextChallenges: document.getElementById('nextChallenges'),
        // Citações
        dailyQuote: document.getElementById('dailyQuote'),
        quoteAuthor: document.getElementById('quoteAuthor')
    };

    let currentUser = null;

    // ============== FUNÇÕES PRINCIPAIS ==============
    async function checkLoggedIn() {
        const userData = localStorage.getItem('currentUser');
        if (userData) {
            try {
                currentUser = JSON.parse(userData);
                updateUserProfile(currentUser);
                await loadUserStats(currentUser.id);
                toggleAuthUI(true);
            } catch (e) {
                if (DEBUG_MODE) console.error("Erro ao analisar userData:", e);
                localStorage.removeItem('currentUser');
                toggleAuthUI(false);
            }
        } else {
            toggleAuthUI(false);
        }
    }

    async function loadUserStats(userId) {
        try {
            const response = await fetch(`${BASE_URL}estatisticas.php?user_id=${userId}`);
            await checkJsonResponse(response);
            const stats = await response.json();
            updateProgressBars(stats);
        } catch (error) {
            if (DEBUG_MODE) console.error("Erro ao carregar estatísticas:", error);
            showError('Erro ao carregar progresso');
        }
    }

    function updateUserProfile(user) {
        elements.userAvatar.textContent = user.nome.charAt(0).toUpperCase();
        elements.userName.textContent = user.nome;
        elements.userLevel.textContent = `Nível: ${user.nivel || 'Iniciante'}`;
        
        const avatarColors = {
            'Iniciante': '#48bb78',
            'Intermediário': '#4299e1',
            'Avançado': '#9f7aea'
        };
        elements.userAvatar.style.backgroundColor = avatarColors[user.nivel] || '#48bb78';
    }

    function updateProgressBars(stats) {
        // Implementação existente...
    }

    function toggleAuthUI(isLoggedIn) {
        elements.loginBtn.style.display = isLoggedIn ? 'none' : 'block';
        elements.logoutBtn.style.display = isLoggedIn ? 'block' : 'none';
        if (!isLoggedIn) resetUI();
    }

    function resetUI() {
        // Implementação existente...
    }

    // ============== MANIPULAÇÃO DE FORMULÁRIOS ==============
    elements.loginForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        await handleLogin(
            elements.loginForm.querySelector('#username').value,
            elements.loginForm.querySelector('#password').value
        );
    });

    elements.registerForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        await handleRegister(
            elements.registerForm.querySelector('#regName').value,
            elements.registerForm.querySelector('#regUsername').value,
            elements.registerForm.querySelector('#regPassword').value
        );
    });

    async function handleLogin(usuario, senha) {
        try {
            if (DEBUG_MODE) console.log("Iniciando login...");
            
            const response = await fetch(`${BASE_URL}login.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usuario, senha })
            });

            const data = await checkJsonResponse(response);
            
            if (data.sucesso) {
                currentUser = data.usuario;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                elements.loginModal.style.display = 'none';
                await checkLoggedIn();
                showSuccess('Login realizado com sucesso!');
            } else {
                showError(data.mensagem || 'Credenciais inválidas');
            }
        } catch (error) {
            if (DEBUG_MODE) console.error("Erro no login:", error);
            showError(error.message || 'Erro ao conectar com o servidor');
        }
    }

    async function handleRegister(nome, usuario, senha) {
        try {
            if (DEBUG_MODE) console.log("Iniciando registro...");
            
            const response = await fetch(`${BASE_URL}registro.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome, usuario, senha })
            });

            const data = await checkJsonResponse(response);
            
            if (data.sucesso) {
                showSuccess('Registro realizado com sucesso!');
                elements.registerModal.style.display = 'none';
                elements.loginModal.style.display = 'block';
                // Preenche automaticamente o login
                elements.loginForm.querySelector('#username').value = usuario;
                elements.loginForm.querySelector('#password').value = senha;
            } else {
                showError(data.erro || 'Erro no registro');
            }
        } catch (error) {
            if (DEBUG_MODE) console.error("Erro no registro:", error);
            showError(error.message || 'Erro ao conectar com o servidor');
        }
    }

    // ============== UTILITÁRIOS ==============
    async function checkJsonResponse(response) {
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const errorText = await response.text();
            throw new Error(`Resposta inválida do servidor: ${errorText.substring(0, 100)}`);
        }
        return response.json();
    }

    function showError(message) {
        alert(`Erro: ${message}`);
        if (DEBUG_MODE) console.error(message);
    }

    function showSuccess(message) {
        alert(`Sucesso: ${message}`);
        if (DEBUG_MODE) console.log(message);
    }

    // ============== EVENT LISTENERS ==============
    elements.loginBtn?.addEventListener('click', () => {
        elements.loginModal.style.display = 'block';
        elements.registerModal.style.display = 'none';
    });

    elements.registerBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        elements.registerModal.style.display = 'block';
        elements.loginModal.style.display = 'none';
    });

    elements.logoutBtn?.addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        currentUser = null;
        checkLoggedIn();
        showSuccess('Você foi desconectado');
    });

    elements.closeButtons?.forEach(button => {
        button.addEventListener('click', () => {
            elements.loginModal.style.display = 'none';
            elements.registerModal.style.display = 'none';
        });
    });

    // ============== INICIALIZAÇÃO ==============
    checkLoggedIn();
    showRandomQuote();
    showRandomChallenges();

    // ============== FUNÇÕES AUXILIARES ==============
    function showRandomQuote() {
        // Implementação existente...
    }

    function showRandomChallenges() {
        // Implementação existente...
    }

    // ============== REGISTRAR ACERTO/ERRO ==============
    async function registerAnswer(unidade, acertou) {
        if (!currentUser) return;
        
        try {
            const response = await fetch(`${BASE_URL}estatisticas.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id_usuario: currentUser.id,
                    unidade: unidade,
                    tipo: acertou ? 'acerto' : 'erro'
                })
            });
            
            const data = await checkJsonResponse(response);
            if (data.sucesso) {
                await loadUserStats(currentUser.id);
            }
        } catch (error) {
            if (DEBUG_MODE) console.error("Erro ao registrar resposta:", error);
        }
    }
});

