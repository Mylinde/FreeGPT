const providerSelect = document.getElementById('provider');
const modelSelect = document.getElementById('model');
const modelDisplayNameMapping = {
  'gpt-4': 'GPT-4',
  'gpt-3.5-turbo': 'GPT-3.5 Turbo',
  'llama3-8b': 'LLaMA3',
  'mixtral-8x7b': 'Mixtral',
  'phi-3-mini': 'Phi-3-mini',
  'gemma-1.1-7b-it': 'Gemma'
};

const providerDisplayNameMapping = {
  'g4f.Provider.Auto': 'Auto',
  'g4f.Provider.Liaobots': 'Liaobots',
  'g4f.Provider.HuggingFace': 'HuggingFace'
};

document.addEventListener('DOMContentLoaded', (event) => {
  updateModelOptions();
  updateProviderOptions();
});

//providerSelect.addEventListener('change', updateModelOptions);
modelSelect.addEventListener('change', updateProviderOptions);

function updateModelOptions() {
  let availableModels = [];
  const selectedProvider = providerSelect.value;

  if (selectedProvider === 'g4f.Provider.Auto') {
    availableModels.push('gpt-3.5-turbo', 'gpt-4', 'llama3-8b', 'mixtral-8x7b', 'phi-3-mini', 'gemma-1.1-7b-it');
  } else if (selectedProvider === 'g4f.Provider.Liaobots') {
    availableModels.push('gpt-3.5-turbo', 'gpt-4');
  } else if (selectedProvider === 'g4f.Provider.HuggingFace') {
    availableModels.push('mixtral-8x7b', 'llama3-8b', 'phi-3-mini', 'gemma-1.1-7b-it');
  }

  let modelSelect = document.getElementById('model');
  removeAllChildNodes(modelSelect);

  availableModels.forEach(model => {
    let option = document.createElement('option');
    option.value = model;
    option.textContent = modelDisplayNameMapping[model] || model;
    modelSelect.appendChild(option);
  });
};

function updateProviderOptions() {
  let availableProviders = [];
  const selectedModel = modelSelect.value;

  if (selectedModel === 'gpt-3.5-turbo') {
    availableProviders.push('g4f.Provider.Auto', 'g4f.Provider.Liaobots', 'g4f.Provider.HuggingFace');
  } else if (selectedModel === 'gpt-4') {
    availableProviders.push('g4f.Provider.Liaobots');
  } else if (selectedModel === 'llama3-8b') {
    availableProviders.push('g4f.Provider.HuggingFace');
  } else if (selectedModel === 'mixtral-8x7b') {
    availableProviders.push('g4f.Provider.HuggingFace');
  } else if (selectedModel === 'phi-3-mini') {
    availableProviders.push('g4f.Provider.HuggingFace');
  } else if (selectedModel === 'gemma-1.1-7b-it') {
    availableProviders.push('g4f.Provider.HuggingFace');
  }

  let providerSelect = document.getElementById('provider');
  removeAllChildNodes(providerSelect);

  availableProviders.forEach(provider => {
    let option = document.createElement('option');
    option.value = provider;
    option.textContent = providerDisplayNameMapping[provider] || provider;
    providerSelect.appendChild(option);
  });
};

function removeAllChildNodes(parent) {
  while (parent.options.length > 0) {
    parent.remove(0);
  }
};

function showModelInfo() {

const selectedModel = modelSelect.value;
const gpt3 = document.getElementById("gpt3");
const gpt4 = document.getElementById("gpt4");
const llama = document.getElementById("llama");
const mixtral = document.getElementById("mixtral");
const phi = document.getElementById("phi");
const gemma = document.getElementById("gemma");

  if (selectedModel === 'gpt-3.5-turbo') {  
    gpt4.classList.remove("show");
    llama .classList.remove("show"); 
    mixtral.classList.remove("show");
    phi.classList.remove("show");
    gemma.classList.remove("show");
    gpt3.classList.toggle("show"); 
  } if (selectedModel === 'gpt-4') {  
    gpt3.classList.remove("show");  
    llama.classList.remove("show"); 
    mixtral.classList.remove("show");
    phi.classList.remove("show");
    gemma.classList.remove("show");
    gpt4.classList.toggle("show");
  } if (selectedModel === 'llama3-8b') {  
    gpt3.classList.remove("show");
    gpt4.classList.remove("show");
    mixtral.classList.remove("show");
    phi.classList.remove("show");
    gemma.classList.remove("show");
    llama.classList.toggle("show");   
  } if (selectedModel === 'mixtral-8x7b') {  
    gpt3.classList.remove("show");
    gpt4.classList.remove("show");
    phi.classList.remove("show");
    gemma.classList.remove("show");
    llama.classList.remove("show");
    mixtral.classList.toggle("show");   
  } if (selectedModel === 'phi-3-mini') {  
    gpt3.classList.remove("show");
    gpt4.classList.remove("show");
    gemma.classList.remove("show");
    llama.classList.remove("show");
    mixtral.classList.remove("show");    
    phi.classList.toggle("show");   
  } if (selectedModel === 'gemma-1.1-7b-it') {  
    gpt3.classList.remove("show");
    gpt4.classList.remove("show");
    llama.classList.remove("show");
    mixtral.classList.remove("show");    
    phi.classList.remove("show");    
    gemma.classList.toggle("show");   
  }
};
