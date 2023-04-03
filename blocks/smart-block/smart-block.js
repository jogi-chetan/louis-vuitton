const apiKey = // TODO

function applyGeneratedLogic(block, data) {
  const start = data.indexOf('{');
  const end = data.lastIndexOf('}');
  const json = JSON.parse(data.substring(start, end + 1));
  // const json = JSON.parse(data);

  // block.textContent = JSON.stringify(js);
  const style = document.createElement('style');
  style.textContent = json.css;
  document.head.append(style);

  eval(json.javascript);
}

export default function decorate(block) {
  block.id = 'smart-1';
  [...block.children].forEach((row) => {
    row.classList.add('row');
    [...row.children].forEach((cell) => {
      cell.classList.add('cell');
    });
  });

  const userPrompt = [...block.classList].filter((c) => c !== 'smart-block' && c !== 'block')[0].replaceAll('-', ' ');
  callChatGPTApi(userPrompt, block.innerHTML).then((data) => {
    applyGeneratedLogic(block, data);
  });

  // applyGeneratedLogic(block, `{
// "css": ".smart-block { position: relative; }\\n.smart-block .row { display: none; position: absolute; top: 0; left: 0; }\\n.smart-block .row.active { display: flex; }\\n.smart-block .row .cell { flex: 1; }\\n.smart-block .arrow { position: absolute; top: 50%; transform: translateY(-50%); width: 50px; height: 50px; border-radius: 50%; background-color: rgba(0, 0, 0, 0.5); color: #fff; font-size: 24px; font-weight: bold; text-align: center; line-height: 50px; cursor: pointer; }\\n.smart-block .arrow-left { left: 0; }\\n.smart-block .arrow-right { right: 0; }",
// "javascript": "const smartBlock = document.querySelector('.smart-block');\\nconst rows = smartBlock.querySelectorAll('.row');\\nlet activeIndex = 0;\\n\\nfunction setActive(index) {\\n rows[activeIndex].classList.remove('active');\\n rows[index].classList.add('active');\\n activeIndex = index;\\n}\\n\\nconst arrowLeft = document.createElement('div');\\narrowLeft.classList.add('arrow', 'arrow-left');\\narrowLeft.innerHTML = '<';\\narrowLeft.addEventListener('click', () => setActive((activeIndex - 1 + rows.length) % rows.length));\\nsmartBlock.appendChild(arrowLeft);\\n\\nconst arrowRight = document.createElement('div');\\narrowRight.classList.add('arrow', 'arrow-right');\\narrowRight.innerHTML = '>';\\narrowRight.addEventListener('click', () => setActive((activeIndex + 1) % rows.length));\\nsmartBlock.appendChild(arrowRight);\\n\\nsetActive(0);"
// }`);
}

// Set the API URL
// Call the ChatGPT API
async function callChatGPTApi(userPrompt, html) {
  if (!html) {
    // eslint-disable-next-line no-param-reassign
    html = '<div class="smart-block"> <div class="row"> <div class="cell"> <h3 id="build-your-a">Build Your a</h3> <img> </div> </div> <div class="row"> <div class="cell"> <h3 id="build-your-a">hello</h3> hello </div> </div> </div>';
  }
  // Define the input payload, including both system and user role messages
  const inputPayload = {
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'Assist the user to create a robust and reliable web experience. The user provides an HTML structure and instructions how it should be styled. You can not change the HTML. Write JavaScript to manipulate the HTML DOM and CSS to style according to users requirements. In the JavaScript, assume there is a declared variable called block with the user provided HTML. Prefer writing CSS over JavaScript. Create additional markup as needed using JavaScript. For images, prefer using characters like &lt; and for complex images use SVG. Apply JS and CSS to the object with id "smart-1". Generate a JSON object that contains a simple CSS snippet and a simple JavaScript snippet. You MUST ONLY the output the machine-readable JSON. return no explanation. ' },
      {
        role: 'user',
        content: `${userPrompt}\n---
    HTML: ${html} `,
      },
    ],
    temperature: 0.2,
  };

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(inputPayload),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('API response:', data.choices[0].message.content);
      return data.choices[0].message.content;
    }
    console.error('Error in API response:', response.statusText);
    return null;
  } catch (error) {
    console.error('Error calling API:', error);
    throw error;
  }
}
