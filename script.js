document.addEventListener('DOMContentLoaded', function() {
    // ============== CONFIGURAÇÕES ==============
    const BASE_URL = 'http://localhost/TCC/';
    const DEBUG_MODE = true; // Ativar para ver logs detalhados

    // ============== ELEMENTOS DO DOM ==============
    const elements = {
        loginBtn: document.getElementById('loginBtn'),
        logoutBtn: document.getElementById('logoutBtn'),
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
    elements.logoutBtn?.addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        currentUser = null;
        checkLoggedIn();
        showSuccess('Você foi desconectado');
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
});