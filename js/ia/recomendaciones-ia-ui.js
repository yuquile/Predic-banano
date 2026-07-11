import { buildCropContext, streamOllamaChat } from './ollama-service.js';

let messagesHistory = [];
let isGenerating = false;

// Elementos del DOM
const chatMessages = document.getElementById('chatMessages');
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');
const btnSend = document.getElementById('btnSend');
const btnNewChat = document.getElementById('btnNewChat');
const errorAlert = document.getElementById('errorAlert');
const errorText = document.getElementById('errorText');

/**
 * Añade una burbuja de mensaje al chat y scrollea hacia abajo
 */
function appendMessage(role, text) {
    const wrapper = document.createElement('div');
    wrapper.className = `message-bubble ${role === 'user' ? 'message-user' : 'message-ai'}`;
    
    // Si es IA, usar Marked.js para renderizar Markdown (si está disponible), si no, texto plano
    if (role === 'ai') {
        if (typeof marked !== 'undefined') {
            wrapper.innerHTML = marked.parse(text);
        } else {
            wrapper.innerText = text;
        }
    } else {
        wrapper.innerText = text;
    }

    chatMessages.appendChild(wrapper);
    scrollToBottom();
    return wrapper;
}

/**
 * Muestra u oculta el indicador de escribiendo
 */
let typingIndicatorObj = null;
function toggleTypingIndicator(show) {
    if (show && !typingIndicatorObj) {
        typingIndicatorObj = document.createElement('div');
        typingIndicatorObj.className = 'message-bubble message-ai typing-indicator';
        typingIndicatorObj.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        chatMessages.appendChild(typingIndicatorObj);
        scrollToBottom();
    } else if (!show && typingIndicatorObj) {
        typingIndicatorObj.remove();
        typingIndicatorObj = null;
    }
}

function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function setInputState(disabled) {
    chatInput.disabled = disabled;
    btnSend.disabled = disabled;
    if (!disabled) chatInput.focus();
}

function showError(msg) {
    errorText.innerText = msg;
    errorAlert.classList.remove('hidden');
    setTimeout(() => errorAlert.classList.add('hidden'), 8000);
}

/**
 * Inicia una nueva conversación con el contexto actual de la finca
 */
async function initChat() {
    chatMessages.innerHTML = '';
    messagesHistory = [];
    setInputState(true);
    
    toggleTypingIndicator(true);
    const cropContext = await buildCropContext();
    
    // Mensaje automático inicial del usuario (oculto en UI, pero se envía a IA)
    const initPrompt = `${cropContext}`;
    messagesHistory.push({ role: 'user', content: initPrompt });

    // Enviar primer contexto para que la IA dé su reporte inicial
    let aiFullResponse = "";
    let currentBubble = null;

    await streamOllamaChat(
        messagesHistory,
        (chunk) => {
            if (!currentBubble) {
                toggleTypingIndicator(false);
                currentBubble = appendMessage('ai', '');
            }
            aiFullResponse += chunk;
            if (typeof marked !== 'undefined') {
                currentBubble.innerHTML = marked.parse(aiFullResponse);
            } else {
                currentBubble.innerText = aiFullResponse;
            }
            scrollToBottom();
        },
        (errorMsg) => {
            toggleTypingIndicator(false);
            showError(errorMsg);
            appendMessage('ai', '❌ No se pudo generar el reporte inicial debido a un error de conexión con Ollama.');
        }
    );

    if (aiFullResponse) {
        messagesHistory.push({ role: 'assistant', content: aiFullResponse });
    }
    
    setInputState(false);
}

// Event Listeners
chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (isGenerating || !chatInput.value.trim()) return;

    const userText = chatInput.value.trim();
    chatInput.value = '';
    
    appendMessage('user', userText);
    messagesHistory.push({ role: 'user', content: userText });
    
    isGenerating = true;
    setInputState(true);
    toggleTypingIndicator(true);

    let aiFullResponse = "";
    let currentBubble = null;

    await streamOllamaChat(
        messagesHistory,
        (chunk) => {
            if (!currentBubble) {
                toggleTypingIndicator(false);
                currentBubble = appendMessage('ai', '');
            }
            aiFullResponse += chunk;
            if (typeof marked !== 'undefined') {
                currentBubble.innerHTML = marked.parse(aiFullResponse);
            } else {
                currentBubble.innerText = aiFullResponse;
            }
            scrollToBottom();
        },
        (errorMsg) => {
            toggleTypingIndicator(false);
            showError(errorMsg);
            appendMessage('ai', '❌ Error de conexión al generar la respuesta.');
        }
    );

    if (aiFullResponse) {
        messagesHistory.push({ role: 'assistant', content: aiFullResponse });
    }
    
    isGenerating = false;
    setInputState(false);
});

btnNewChat.addEventListener('click', () => {
    if (!isGenerating) {
        initChat();
    }
});

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    initChat();
});
