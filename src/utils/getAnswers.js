const inquirer = require("inquirer");

const getAnswers = async (questions) => {
  const answers = await inquirer.prompt(questions);

  return answers;
};

module.exports = getAnswers;
