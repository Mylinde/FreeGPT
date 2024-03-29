const modelSelect = document.getElementById('model');
const providerSelect = document.getElementById('provider');

function showAllOptions() {
  Array.from(providerSelect.options).forEach(option => {
    option.style.display = "block";
  });
}

modelSelect.addEventListener('change', () => {
  showAllOptions();

const selectedModel = modelSelect.value;
const hiddenOptions = ['g4f.Provider.Llama2', 'g4f.Provider.PerplexityLab', 'g4f.Provider.Bing', 'g4f.Provider.Liaobots', 'g4f.Provider.You'];
  
  if (selectedModel === 'gpt-3.5-turbo') {
    providerSelect.value = 'g4f.Provider.Auto';
    hideOptions(hiddenOptions.filter(option => ['g4f.Provider.You', 'g4f.Provider.Liaobots',].indexOf(option) === -1));
  } else if (selectedModel === 'gpt-4') {
    providerSelect.value = 'g4f.Provider.Auto';
    hideOptions(hiddenOptions.filter(option => ['g4f.Provider.Bing', 'g4f.Provider.Liaobots'].indexOf(option) === -1));
  } else if (selectedModel === 'llama2-70b') {
    providerSelect.value = 'g4f.Provider.Auto';
    hideOptions(hiddenOptions.filter(option => ['g4f.Provider.Llama2', 'g4f.Provider.PerplexityLab'].indexOf(option) === -1));
  } else if (selectedModel === 'mixtral-8x7b') {
    providerSelect.value = 'g4f.Provider.Auto';
    hideOptions(hiddenOptions.filter(option => ['g4f.Provider.PerplexityLab'].indexOf(option) === -1));
  }
});

function hideOptions(optionsToHide) {
  optionsToHide.forEach(option => {
    const optionElement = providerSelect.querySelector(`option[value="${option}"]`);
    optionElement.style.display = "none";
  })
}
  