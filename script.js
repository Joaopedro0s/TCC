import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc,
  updateDoc,
  arrayUnion
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Sua configuração Firebase (substitua pelos seus dados)
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_PROJETO.firebaseapp.com",
  projectId: "SEU_PROJETO",
  storageBucket: "SEU_PROJETO.appspot.com",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID"
};

// Inicialize o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', function() {
    // [Mantenha todos os elementos do DOM como no código anterior...]

    // Monitorar estado de autenticação
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // Usuário logado
            loadUserData(user.uid);
            loginBtn.style.display = 'none';
            logoutBtn.style.display = 'block';
        } else {
            // Usuário deslogado
            resetUI();
        }
    });

    // Login com Firebase
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('username').value + '@k4math.com'; // Transforma em email
        const password = document.getElementById('password').value;
        
        try {
            await signInWithEmailAndPassword(auth, email, password);
            loginModal.style.display = 'none';
            loginForm.reset();
        } catch (error) {
            alert('Erro no login: ' + error.message);
        }
    });

    // Registro com Firebase
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('regUsername').value;
        const email = username + '@k4math.com'; // Cria email fictício
        const password = document.getElementById('regPassword').value;
        const name = document.getElementById('regName').value;
        
        try {
            // 1. Cria usuário no Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            
            // 2. Salva dados adicionais no Firestore
            await setDoc(doc(db, "users", userCredential.user.uid), {
                username,
                name,
                stats: {
                    unit1: { correct: 0, wrong: 0 },
                    unit2: { correct: 0, wrong: 0 }
                },
                createdAt: new Date()
            });
            
            registerModal.style.display = 'none';
            registerForm.reset();
        } catch (error) {
            alert('Erro no registro: ' + error.message);
        }
    });

    // Logout
    logoutBtn.addEventListener('click', () => {
        signOut(auth);
    });

    // Carrega dados do usuário
    async function loadUserData(userId) {
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            const userData = docSnap.data();
            updateUserProfile(userData);
            updateProgressBars(userData.stats);
        }
    }

    // Atualiza estatísticas (exemplo quando usuário acerta uma questão)
    async function recordAnswer(unit, isCorrect) {
        const user = auth.currentUser;
        if (!user) return;
        
        const field = isCorrect ? 'correct' : 'wrong';
        const userRef = doc(db, "users", user.uid);
        
        await updateDoc(userRef, {
            [`stats.unit${unit}.${field}`]: arrayUnion(new Date())
        });
    }

    // [Mantenha as outras funções como showRandomQuote, etc...]
});

// Exemplo de uso:
// Quando usuário acerta uma questão na Unidade 1:
// recordAnswer(1, true);