const suggestionBox  = document.getElementById("suggestions-box");
import{sendPrompt,promptUpdate} from "./main_v4.js";

async function make_suggestion() {
    try {
      let instruction = `
  You are a tool-using assistant. You must always respond by choosing the correct tool from the list and strictly following its response format.
  
  
  ## Task:
  - Generate a text that reflects a certain mood, abiance, activity expireienced by a human being (eg : late night drive, night out with friends, day at the beach ...).
  - Be creative and imaginative.
    - The text should be a single paragraph.
    - MAXIMUM 20 words.

- Do **not** explain your answer.
- Do **not** generate anything outside of JSON.

FOLLOW EXATLY THE RESPONSE FORMAT BELOW:
    ## Response Format:
    {
        "tool": "text-generator",
        "data": "<your text here>"
    }
  
  Now, respond correctly in JSON format.
  `;
  
  
      const response = await fetch("http://100.103.187.82:3000/api/gemma", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "gemma-3-4b-it",
          prompt: instruction,
          max_tokens: 4000,
        }),
      });
  
      const data = await response.json();
      
      const responseText = data.choices[0]?.text || "";
  
      // Extract JSON using regex
      const match = responseText.match(/```json\s*([\s\S]*?)\s*```/);
      let responseJson;
      try {
        if (match) {
          responseJson = JSON.parse(match[1]); // Parse the extracted JSON block
        } else {
          responseJson = JSON.parse(responseText.trim()); // Parse the raw response if no block is found
        }
      } catch (error) {
        textInput.placeholder = "Error parsing response. Please try again.";
        console.error("Error parsing JSON:", error, "Raw response:", responseText);
        return null;
      }
      buildSuggestion(responseJson.data)
      console.log("SUGGESTION:", responseJson.data);
      return responseJson;
    } catch (error) {
      console.error("Error in API request:", error);
    }
  }

function buildSuggestion(data){
    const suggestion = document.createElement("div");
    suggestion.classList.add("suggestion");

    const suggestionText = document.createElement("p");
    suggestionText.innerHTML = data;
    suggestionText.classList.add("suggestion-text");
    suggestion.appendChild(suggestionText);
    suggestion.addEventListener("click", () => {
        promptUpdate(data);
    });
    
    suggestionBox.appendChild(suggestion);
  
}

  export { make_suggestion };