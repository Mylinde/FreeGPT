const providerSelect = document.getElementById('provider');
const modelSelect = document.getElementById('model');
const modelDisplayNameMapping = {
  'gpt-4': 'GPT-4',
  'gpt-3.5-turbo': 'GPT-3.5 Turbo',
  'llama2-70b': 'LLaMA2',
  'llama3-70b-instruct': 'LLaMA3',
  'mixtral-8x7b': 'Mixtral'
};

document.addEventListener('DOMContentLoaded', (event) => {
  updateModelOptions();
  updateProviderOptions();
});

providerSelect.addEventListener('change', updateModelOptions);
modelSelect.addEventListener('click', updateProviderOptions);

function updateModelOptions() {
  
  let availableModels = [];
  const selectedProvider = providerSelect.value;

if (selectedProvider === 'g4f.Provider.Auto') {
    availableModels.push('gpt-3.5-turbo', 'gpt-4', 'mixtral-8x7b', 'llama2-70b', 'llama3-70b-instruct');
} else if (selectedProvider === 'g4f.Provider.Liaobots') {
    availableModels.push('gpt-3.5-turbo', 'gpt-4');
} else if (selectedProvider === 'g4f.Provider.You') {
    availableModels.push('gpt-3.5-turbo');
} else if (selectedProvider === 'g4f.Provider.Llama') {
    availableModels.push('llama2-70b', 'llama3-70b-instruct');
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

function removeAllChildNodes(parent) {
  while (parent.options.length > 0) {
      parent.remove(0);
  }

};

function showAllOptions() {
  Array.from(providerSelect.options).forEach(option => {
    option.style.display = "block";
  });
};

function updateProviderOptions() {

const selectedProvider = providerSelect.value;
const selectedModel = modelSelect.value;
const hiddenOptions = ['g4f.Provider.Llama', 'g4f.Provider.PerplexityLab', 'g4f.Provider.Liaobots', 'g4f.Provider.You'];

  if (selectedModel === 'gpt-3.5-turbo') {
    showAllOptions();
    hideOptions(hiddenOptions.filter(option => ['g4f.Provider.You', 'g4f.Provider.Liaobots', 'g4f.Provider.PerplexityLab'].indexOf(option) === -1));
  } else if (selectedModel === 'gpt-4') {
    showAllOptions();
    hideOptions(hiddenOptions.filter(option => ['g4f.Provider.Liaobots'].indexOf(option) === -1));
  } else if (selectedModel === 'llama2-70b') {
    showAllOptions();
    hideOptions(hiddenOptions.filter(option => ['g4f.Provider.Llama', 'g4f.Provider.PerplexityLab'].indexOf(option) === -1));
  } else if (selectedModel === 'llama3-70b-instruct') {
    showAllOptions();
    hideOptions(hiddenOptions.filter(option => ['g4f.Provider.Llama', 'g4f.Provider.PerplexityLab'].indexOf(option) === -1));
  } else if (selectedModel === 'mixtral-8x7b') {
    showAllOptions();
    hideOptions(hiddenOptions.filter(option => ['g4f.Provider.PerplexityLab'].indexOf(option) === -1));
  }
};

function hideOptions(optionsToHide) {
  optionsToHide.forEach(option => {
    const optionElement = providerSelect.querySelector(`option[value="${option}"]`);
    optionElement.style.display = "none";
  }
)};

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
