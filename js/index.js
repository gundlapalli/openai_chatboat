import { showLoader, scrollToBottom, hideLoader } from "./common.js";
import { getResultAndRender } from "./api.js";

const getMostRelevantQs = async (originalQuestion) => {
  try {
    debugger
    const response = await fetch('/get-closest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: originalQuestion })
    });

    if (!response.ok) {
      hideLoader();
      scrollToBottom();
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    const $output = document.querySelector(".Messages_list");
    const uniqueId = `response-${Date.now()}`;
    $output.insertAdjacentHTML(
      'beforeend',
      `<div id="${uniqueId}" class="bot-messages"></div>`
    );
    let mainDiv = document.getElementById(uniqueId);

    if (Object.values(data)[0] >= 0.5) {
      mainDiv.insertAdjacentHTML(
        'beforeend',
        `<div class="relevantQuestion mb-2">    
          <p class="fs-16 card p-2 m-0"> We can answer a question similar to what you asked <br> <b>${Object.keys(data)[0]} </b></p>
          <div class="d-flex align-items-center justify-content-end mt-2">
          <span class="px-2"> Would you like to proceed? </span>
          <span>
          <button class="btn btn-outline-primary btn-sm p-1" title="Yes" id="acceptRelevantQuestion">Yes</button>
          <button class="btn p-0 btn-outline-secondary btn-sm p-1" title="No" id="originalQuestion">No</button>
          </span>
          </div>
          </div>`
      );

      document.querySelector(`#${uniqueId} button#acceptRelevantQuestion`).addEventListener('click', () => {
        debugger
        document.querySelector(`#${uniqueId} .relevantQuestion`).remove();
        mainDiv.insertAdjacentHTML(
          'beforeend',
          `<p class="fs-16 card p-2 m-0 mb-2"> ${Object.keys(data)[0]}</p>`
        );
        showLoader(mainDiv);
        getResultAndRender(Object.keys(data)[0], mainDiv);
      });

      document.querySelector(`#${uniqueId} button#originalQuestion`).addEventListener('click', () => {
        document.querySelector(`#${uniqueId} .relevantQuestion`).remove();
        mainDiv.insertAdjacentHTML(
          'beforeend',
          `<div>    
          <div class="relevantQuestion mb-2">    
            <p class="fs-16 card p-2 m-0"> Here is what we think is the answer to your question</p>
          </div>
          </div>`
        );
        showLoader(mainDiv);
        getResultAndRender(originalQuestion, mainDiv);
      });
    } else {
      showLoader(mainDiv);
      getResultAndRender(originalQuestion, mainDiv);
    }

    scrollToBottom();
    hideLoader();
  } catch (error) {
    console.error('There was a problem with the POST request:', error);
    scrollToBottom();
    hideLoader();
  }
  };

  document
    .querySelector("#search-form")
    .addEventListener("submit", async (event) => {
      debugger
      event.preventDefault();
      const formData = new FormData(event.target);
      const question = formData.get("question");
      // appendUserMessage(question);
      debugger
      await getMostRelevantQs(question);
    });