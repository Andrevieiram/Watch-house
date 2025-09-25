document.addEventListener('DOMContentLoaded', () => {

    const checkoutForm = document.getElementById('checkout-form');
    const cepInput = document.getElementById('cep');
    const ruaInput = document.getElementById('rua');
    const numeroInput = document.getElementById('numero');
    const bairroInput = document.getElementById('bairro');
    const cidadeInput = document.getElementById('cidade');
    const ufInput = document.getElementById('uf');
    const cepStatus = document.getElementById('cep-status');


    if (cepInput) {
        cepInput.addEventListener('input', handleCEPInput);
    }

    
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(event) {
            event.preventDefault(); 
            alert('Compra finalizada com sucesso!');
            window.location.href = 'index.html';
        });
    }


    
    function maskCEP(value) {
        return value
            .replace(/\D/g, '') 
            .replace(/(\d{5})(\d)/, '$1-$2') 
            .replace(/(-\d{3})\d+?$/, '$1'); 
    }
   
    async function handleCEPInput(event) {
        const input = event.target;
        input.value = maskCEP(input.value);
        const cep = input.value.replace(/\D/g, '');

        if (cep.length === 8) {
            await fetchAddress(cep);
        } else {
            clearAddressForm();
            cepStatus.textContent = '';
        }
    }

    async function fetchAddress(cep) {
        setLoadingState(true);
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            if (!response.ok) throw new Error('Falha na requisição.');
            
            const data = await response.json();
            if (data.erro) {
                handleCEPNotFound();
            } else {
                fillAddressForm(data);
            }
        } catch (error) {
            handleNetworkError();
            console.error("Erro ao buscar CEP:", error);
        } finally {
            setLoadingState(false);
        }
    }
    
    function fillAddressForm(data) {
        ruaInput.value = data.logradouro;
        bairroInput.value = data.bairro;
        cidadeInput.value = data.localidade;
        ufInput.value = data.uf;
        cepStatus.textContent = "CEP encontrado com sucesso!";
        cepStatus.className = "status-message success";
        numeroInput.focus();
    }
        
    function clearAddressForm() {
        ruaInput.value = '';
        bairroInput.value = '';
        cidadeInput.value = '';
        ufInput.value = '';
        numeroInput.value = '';
    }

    function handleCEPNotFound() {
        clearAddressForm();
        cepStatus.textContent = "CEP não encontrado. Por favor, preencha o endereço manualmente.";
        cepStatus.className = "status-message error";
    }
   
    function handleNetworkError() {
        clearAddressForm();
        cepStatus.textContent = "Não foi possível buscar o CEP. Verifique sua conexão.";
        cepStatus.className = "status-message error";
    }

    function setLoadingState(isLoading) {
        const fieldsToToggle = [ruaInput, bairroInput, cidadeInput, ufInput];
        if (isLoading) {
            cepStatus.textContent = "Buscando CEP...";
            cepStatus.className = "status-message loading";
            fieldsToToggle.forEach(field => field.disabled = true);
        } else {
            fieldsToToggle.forEach(field => field.disabled = false);
        }
    }
});