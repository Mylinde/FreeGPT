const providerSelect = document.getElementById('provider');
const modelSelect = document.getElementById('model');

const modelDisplayNameMapping = {
  'gpt-4': 'GPT-4',
  'gpt-3.5-turbo': 'GPT-3.5 Turbo',
  'llama2-70b': 'LLaMA2',
  'mixtral-8x7b': 'Mixtral'
};

providerSelect.addEventListener('change', updateModelOptions);

function updateModelOptions() {
  
  let availableModels = [];
  const selectedProvider = providerSelect.value;

if (selectedProvider === 'g4f.Provider.Auto') {
    availableModels.push('gpt-3.5-turbo', 'gpt-4', 'mixtral-8x7b', 'llama2-70b');
} else if (selectedProvider === 'g4f.Provider.Bing') {
    availableModels.push('gpt-4');
} else if (selectedProvider === 'g4f.Provider.Liaobots') {
    availableModels.push('gpt-3.5-turbo', 'gpt-4');
} else if (selectedProvider === 'g4f.Provider.You') {
    availableModels.push('gpt-3.5-turbo');
} else if (selectedProvider === 'g4f.Provider.Llama2') {
    availableModels.push('llama2-70b');
} else if (selectedProvider === 'g4f.Provider.PerplexityLab') {
    availableModels.push('mixtral-8x7b', 'llama2-70b');
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

updateModelOptions();

function removeAllChildNodes(parent) {
  while (parent.options.length > 0) {
      parent.remove(0);
  }

};

function showAllOptions() {
  Array.from(providerSelect.options).forEach(option => {
    option.style.display = "block";
  });
}

modelSelect.addEventListener('change', () => {

const selectedModel = modelSelect.value;
const hiddenOptions = ['g4f.Provider.Llama2', 'g4f.Provider.PerplexityLab', 'g4f.Provider.Bing', 'g4f.Provider.Liaobots', 'g4f.Provider.You'];
  
  if (selectedModel === 'gpt-3.5-turbo') {
    showAllOptions();
    providerSelect.value = 'g4f.Provider.Auto';
    hideOptions(hiddenOptions.filter(option => ['g4f.Provider.You', 'g4f.Provider.Liaobots',].indexOf(option) === -1));
  } else if (selectedModel === 'gpt-4') {
    showAllOptions();
    providerSelect.value = 'g4f.Provider.Auto';
    hideOptions(hiddenOptions.filter(option => ['g4f.Provider.Bing', 'g4f.Provider.Liaobots'].indexOf(option) === -1));
  } else if (selectedModel === 'llama2-70b') {
    showAllOptions();
    providerSelect.value = 'g4f.Provider.Auto';
    hideOptions(hiddenOptions.filter(option => ['g4f.Provider.Llama2', 'g4f.Provider.PerplexityLab'].indexOf(option) === -1));
  } else if (selectedModel === 'mixtral-8x7b') {
    showAllOptions();
    providerSelect.value = 'g4f.Provider.Auto';
    hideOptions(hiddenOptions.filter(option => ['g4f.Provider.PerplexityLab'].indexOf(option) === -1));
  }
});

document.addEventListener('DOMContentLoaded', (event) => {
  updateModelOptions(); // Aufruf beim Laden der Seite
});

function hideOptions(optionsToHide) {
  optionsToHide.forEach(option => {
    const optionElement = providerSelect.querySelector(`option[value="${option}"]`);
    optionElement.style.display = "none";
  })};