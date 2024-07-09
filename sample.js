require('dotenv').config();
const axios=require('axios')
let config = {
   headers: {
     "Content-Type": "application/json",
     "Authorization": "Bearer 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"
    }
  };
  let body= JSON.stringify({
    "model": "text-davinci-003",
    "prompt": "hey bro",
    "temperature": 0.7,
    "max_tokens": 256,
    "top_p": 1,
    "frequency_penalty": 0,
    "presence_penalty": 0
});
  axios.post("https://api.openai.com/v1/completions",body,config)
    .then((response) => {
       console.log(response.data.choices[0].text)
    })
    .catch((error) => {
      console.log(error);
    });
// return axios({
//     method: "GET",
//     url: `https://immense-waters-95169.herokuapp.com/?question=how to handle stress`,
//     data: "How can I apply for on-campus housing or off-campus housing near the university?",
//   })
//     .then((response) => {
//       let s=response.data;
//       console.log(s)
//     })
//     .catch((error) => {
//       console.log(error);
//     });
