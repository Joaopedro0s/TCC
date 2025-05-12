document.addEventListener('DOMContentLoaded', function() {
    // ============== ELEMENTOS DO DOM ==============
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const closeButtons = document.querySelectorAll('.close');
    const registerBtn = document.getElementById('registerBtn');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    // Elementos de perfil
    const userAvatar = document.getElementById('userAvatar');
    const userName = document.getElementById('userName');
    const userLevel = document.getElementById('userLevel');
    
    // Elementos de progresso
    const unit1Correct = document.getElementById('unit1Correct');
    const unit1Wrong = document.getElementById('unit1Wrong');
    const unit2Correct = document.getElementById('unit2Correct');
    const unit2Wrong = document.getElementById('unit2Wrong');
    const unit1CorrectText = document.getElementById('unit1CorrectText');
    const unit1WrongText = document.getElementById('unit1WrongText');
    const unit2CorrectText = document.getElementById('unit2CorrectText');
    const unit2WrongText = document.getElementById('unit2WrongText');
    const nextChallenges = document.getElementById('nextChallenges');
    
    // Citações motivacionais
    const dailyQuote = document.getElementById('dailyQuote');
    const quoteAuthor = document.getElementById('quoteAuthor');

    // ============== VARIÁVEIS GLOBAIS ==============
    let currentUser = null;
    const BASE_URL = 'http://localhost/TCC/'; // AJUSTE CHAVE: Caminho base para a pasta TCC

    // ============== FUNÇÕES PRINCIPAIS ==============

    // 🔄 Verifica se o usuário está logado
    async function checkLoggedIn() {
        const userData = localStorage.getItem('currentUser');
        if (userData) {
            currentUser = JSON.parse(userData);
            updateUserProfile(currentUser);
            await loadUserStats(currentUser.id);
            loginBtn.style.display = 'none';
            logoutBtn.style.display = 'block';
        } else {
            resetUI();
        }
    }

    // 📊 Carrega estatísticas do usuário
    async function loadUserStats(userId) {
        try {
            const response = await fetch(`${BASE_URL}estatisticas.php?user_id=${userId}`);
            const stats = await response.json();
            updateProgressBars(stats);
        } catch (error) {
            console.error("Erro ao carregar estatísticas:", error);
        }
    }

    // 👤 Atualiza o perfil do usuário
    function updateUserProfile(user) {
        userAvatar.textContent = user.nome.charAt(0).toUpperCase();
        userName.textContent = user.nome;
        userLevel.textContent = `Nível: ${user.nivel || 'Iniciante'}`;
        
        // Cor do avatar baseada no nível
        const avatarColors = {
            'Iniciante': '#48bb78', // Verde
            'Intermediário': '#4299e1', // Azul
            'Avançado': '#9f7aea' // Roxo
        };
        userAvatar.style.backgroundColor = avatarColors[user.nivel] || '#48bb78';
    }

    // 📈 Atualiza as barras de progresso
    function updateProgressBars(stats) {
        // Unidade 1
        const unit1Total = (stats.unit1?.acertos || 0) + (stats.unit1?.erros || 0);
        const unit1CorrectPercent = unit1Total > 0 ? Math.round((stats.unit1?.acertos || 0) / unit1Total * 100) : 0;
        
        unit1Correct.style.width = `${unit1CorrectPercent}%`;
        unit1Wrong.style.width = `${100 - unit1CorrectPercent}%`;
        unit1CorrectText.textContent = `${unit1CorrectPercent}%`;
        unit1WrongText.textContent = `${100 - unit1CorrectPercent}%`;

        // Unidade 2
        const unit2Total = (stats.unit2?.acertos || 0) + (stats.unit2?.erros || 0);
        const unit2CorrectPercent = unit2Total > 0 ? Math.round((stats.unit2?.acertos || 0) / unit2Total * 100) : 0;
        
        unit2Correct.style.width = `${unit2CorrectPercent}%`;
        unit2Wrong.style.width = `${100 - unit2CorrectPercent}%`;
        unit2CorrectText.textContent = `${unit2CorrectPercent}%`;
        unit2WrongText.textContent = `${100 - unit2CorrectPercent}%`;
    }

    // 🔄 Reseta a UI quando não há usuário logado
    function resetUI() {
        userAvatar.textContent = '?';
        userName.textContent = 'Visitante';
        userLevel.textContent = 'Nível: ---';
        loginBtn.style.display = 'block';
        logoutBtn.style.display = 'none';
        
        // Reseta barras de progresso
        unit1Correct.style.width = '0%';
        unit1Wrong.style.width = '0%';
        unit2Correct.style.width = '0%';
        unit2Wrong.style.width = '0%';
        unit1CorrectText.textContent = '0%';
        unit1WrongText.textContent = '0%';
        unit2CorrectText.textContent = '0%';
        unit2WrongText.textContent = '0%';
    }

    // ============== EVENT LISTENERS ==============

    // 🔑 Login
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const usuario = document.getElementById('username').value;
        const senha = document.getElementById('password').value;

        try {
            const response = await fetch(`${BASE_URL}login.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usuario, senha })
            });
            
            const data = await response.json();
            
            if (data.sucesso) {
                currentUser = data.usuario;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                loginModal.style.display = 'none';
                await checkLoggedIn();
            } else {
                alert('Usuário ou senha incorretos!');
            }
        } catch (error) {
            console.error("Erro no login:", error);
            alert('Erro ao conectar com o servidor');
        }
    });

    // ✍️ Registro
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nome = document.getElementById('regName').value;
        const usuario = document.getElementById('regUsername').value;
        const senha = document.getElementById('regPassword').value;

        try {
            const response = await fetch(`${BASE_URL}registro.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome, usuario, senha })
            });
            
            const data = await response.json();
            
            if (data.sucesso) {
                alert('Registro realizado com sucesso! Faça login.');
                registerModal.style.display = 'none';
                loginModal.style.display = 'block';
            } else {
                alert('Erro no registro: Usuário já existe ou dados inválidos');
            }
        } catch (error) {
            console.error("Erro no registro:", error);
            alert('Erro ao conectar com o servidor');
        }
    });

    // 🚪 Logout
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        currentUser = null;
        checkLoggedIn();
    });

    // ✖️ Fechar modais
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            loginModal.style.display = 'none';
            registerModal.style.display = 'none';
        });
    });

    // 🖱️ Abrir modais
    loginBtn.addEventListener('click', () => {
        loginModal.style.display = 'block';
    });

    registerBtn.addEventListener('click', (e) => {
        e.preventDefault();
        loginModal.style.display = 'none';
        registerModal.style.display = 'block';
    });

    // ============== INICIALIZAÇÃO ==============
    checkLoggedIn();
    showRandomQuote();
    showRandomChallenges();

    // ============== FUNÇÕES AUXILIARES ==============
    
    // 💬 Mostra citação aleatória
    function showRandomQuote() {
        const quotes = [
            { text: "A matemática é a linguagem do universo.", author: "Galileo Galilei" },
            { text: "Sem matemática, não há nada que você possa fazer.", author: "Stephen Hawking" },
            { text: "A matemática é a rainha das ciências.", author: "Carl Friedrich Gauss" }
        ];
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        dailyQuote.textContent = `"${randomQuote.text}"`;
        quoteAuthor.textContent = `- ${randomQuote.author}`;
    }

    // 🎯 Mostra desafios aleatórios
    function showRandomChallenges() {
        const challenges = [
            "Multiplicação Avançada",
            "Divisão Básica",
            "Frações",
            "Geometria Espacial"
        ];
        nextChallenges.innerHTML = '';
        
        // Seleciona 3 desafios aleatórios
        const shuffled = [...challenges].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 3);
        
        selected.forEach(challenge => {
            const li = document.createElement('li');
            li.textContent = challenge;
            nextChallenges.appendChild(li);
        });
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
            
            const data = await response.json();
            if (data.sucesso) {
                await loadUserStats(currentUser.id);
            }
        } catch (error) {
            console.error("Erro ao registrar resposta:", error);
        }
    }
});