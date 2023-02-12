let category_element = document.querySelector(".quiz-info .category span");
let question_num_element = document.querySelector(
  ".quiz-info .question_num span"
);

let question_element = document.querySelector(".answer_area .question");
let answers_area_element = document.querySelector(".answer_area .answers ul");

let submit_element = document.querySelector(".the_test button");

let finished_questions_element = document.querySelector(
  ".rank .finished_questions ul"
);
let countdown_element = document.querySelector(".the_test .rank .countdown");
let result_element = document.querySelector(".the_test .rank .result");
let start_button = document.querySelector(".the_test .rank .start");

category_element.textContent = "Html";
let saw_question = 0;
let right_answer = 0;
let question_num;

fetch("html_questions.json")
  .then((response) => response.json())
  .then((json) => {
    question_num = json.length;
    question_num_element.textContent = question_num;
    creat_bullets(question_num);
    start_button.onclick = () => {
      start_button.remove();
      creat_question(json);
    };
  });

function make_check() {
  [...answers_area_element.children].forEach((el) => {
    el.onclick = () => {
      el.firstElementChild.checked = true;
    };
  });
}

function creat_bullets(question_num) {
  for (i = 0; i < question_num; i++) {
    let li = document.createElement("li");
    finished_questions_element.appendChild(li);
  }
}

function creat_question(json) {
  random_question = Math.floor(Math.random(json) * json.length);
  let current_question = json.splice(random_question, 1)[0];
  let current_question_keys = Object.keys(current_question);
  answers_area_element.innerHTML = "";
  for (i in current_question_keys) {
    if (i == 0) {
      question_element.textContent = current_question[current_question_keys[i]];
    } else if (i != 5) {
      let li = document.createElement("li");
      let input = document.createElement("input");
      let label = document.createElement("label");
      input.type = "radio";
      input.name = "answer";
      label.textContent = current_question[current_question_keys[i]];
      li.appendChild(input);
      li.appendChild(label);
      answers_area_element.appendChild(li);
    }
  }
  [...finished_questions_element.children][saw_question].className = "on";
  let answer = current_question[current_question_keys[i]];
  make_check();
  countdown(answer, json);
}

function countdown(answer, json) {
  countdown_element.textContent = 7;
  let counter = setInterval(() => {
    countdown_element.textContent--;
    submit_element.addEventListener("click", () => {
      countdown_element.textContent = 1;
    });
    if (countdown_element.textContent == 0) {
      clearInterval(counter);
      submit(answer, json);
    }
  }, 1000);
}

function submit(answer, json) {
  submit_element.style.pointerEvents = "none";
  submit_element.style.opacity = "50%";
  let user_answer_input =
    document.querySelector(
      ".answer_area .answers ul input[name='answer']:checked"
    ) || false;
  check(user_answer_input, answer);
  if (json.length) {
    setTimeout(() => {
      submit_element.style.pointerEvents = "initial";
      submit_element.style.opacity = "initial";
      [...finished_questions_element.children][saw_question].className = "saw";
      saw_question++;
      creat_question(json);
    }, 1000);
  } else {
    result();
  }
}

function check(user_answer_input, answer) {
  [...finished_questions_element.children][saw_question].className = "saw";
  if (user_answer_input) {
    let user_answear_text = user_answer_input.nextElementSibling.textContent;
    if (user_answear_text === answer) {
      user_answer_input.parentElement.style.backgroundColor = "#00ec0052";
      right_answer++;
    } else {
      user_answer_input.parentElement.style.backgroundColor = "#ff00006b";
      [...answers_area_element.children].forEach((el) => {
        if (el.lastChild.textContent === answer) {
          el.style.backgroundColor = "#00ec0052";
        }
      });
    }
  } else {
    [...answers_area_element.children].forEach((el) => {
      if (el.lastChild.textContent === answer) {
        el.style.backgroundColor = "#00ec0052";
      } else {
        el.style.backgroundColor = "#ff00006b";
      }
    });
  }
}

function result() {
  result_element.style.visibility = "initial";
  [...result_element.children][1].textContent = right_answer;
  [...result_element.children][2].textContent = question_num;
  if (right_answer >= question_num - 2) {
    [...result_element.children][0].textContent = "good";
    result_element.classList.add("good")
  } else if (right_answer >= question_num - 4) {
    [...result_element.children][0].textContent = "medium";
    result_element.classList.add("medium")
  } else {
    [...result_element.children][0].textContent = "bad";
    result_element.classList.add("bad")
  }
}
