const providerSelect = document.getElementById('provider');
const modelSelect = document.getElementById('model');
const modelDisplayNameMapping = {
  'gpt-4': 'GPT-4',
  'gpt-3.5-turbo': 'GPT-3.5 Turbo',
  'llama2-70b': 'LLaMA2',
  'llama3-70b-instruct': 'LLaMA3',
  'mixtral-8x7b': 'Mixtral',
  'openchat_3.5': 'openchat'
};

const providerDisplayNameMapping = {
  'g4f.Provider.Liaobots': 'Liaobots',
  'g4f.Provider.You': 'You',
  'g4f.Provider.DeepInfra': 'DeepInfra',
  'g4f.Provider.PerplexityLab': 'Perplexity Labs'
};

document.addEventListener('DOMContentLoaded', (event) => {
  updateModelOptions();
  updateProviderOptions();
});

providerSelect.addEventListener('change', updateModelOptions);
modelSelect.addEventListener('change', updateProviderOptions);

function updateModelOptions() {
  let availableModels = [];
  const selectedProvider = providerSelect.value;

  if (selectedProvider === 'g4f.Provider.Auto') {
    availableModels.push('gpt-3.5-turbo', 'gpt-4', 'mixtral-8x7b', 'llama2-70b', 'llama3-70b-instruct', 'openchat_3.5');
  } else if (selectedProvider === 'g4f.Provider.Liaobots') {
    availableModels.push('gpt-3.5-turbo', 'gpt-4');
  } else if (selectedProvider === 'g4f.Provider.You') {
    availableModels.push('gpt-3.5-turbo');
  } else if (selectedProvider === 'g4f.Provider.DeepInfra') {
    availableModels.push('openchat_3.5');
  } else if (selectedProvider === 'g4f.Provider.PerplexityLab') {
    availableModels.push('mixtral-8x7b', 'llama2-70b', 'llama3-70b-instruct', 'gpt-3.5-turbo');
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
    availableProviders.push('g4f.Provider.PerplexityLab', 'g4f.Provider.Liaobots', 'g4f.Provider.You', 'g4f.Provider.DeepInfra');
  } else if (selectedModel === 'gpt-4') {
    availableProviders.push('g4f.Provider.Liaobots');
  } else if (selectedModel === 'llama2-70b' || selectedModel === 'llama3-70b-instruct' || selectedModel === 'mixtral-8x7b') {
    availableProviders.push('g4f.Provider.PerplexityLab');
  } else if (selectedModel === 'openchat_3.5') {
    availableProviders.push('g4f.Provider.DeepInfra');
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
const llama2 = document.getElementById("llama2");
const mixtral = document.getElementById("mixtral");

  if (selectedModel === 'gpt-3.5-turbo') {  
    gpt4.classList.remove("show");
    llama2.classList.remove("show"); 
    mixtral.classList.remove("show");
    gpt3.classList.toggle("show");  
  } if (selectedModel === 'gpt-4') {  
    gpt3.classList.remove("show");  
    llama2.classList.remove("show"); 
    mixtral.classList.remove("show");
    gpt4.classList.toggle("show");
  } if (selectedModel === 'llama2-70b') {  
    gpt3.classList.remove("show");
    gpt4.classList.remove("show");
    mixtral.classList.remove("show");
    llama2.classList.toggle("show");   
  } if (selectedModel === 'mixtral-8x7b') {  
    gpt3.classList.remove("show");
    gpt4.classList.remove("show");
    llama2.classList.remove("show");
    mixtral.classList.toggle("show");  
  }
};
