import chalk from 'chalk';

const pluralise = (count) => (count === 1 ? '' : 's');

const warn = `${chalk.yellow('\u26A0')}`;

const error = `${chalk.red('\u2716')}`;

export default function formatEslintResults(results) {
  let errors = 0;
  let warnings = 0;
  let maxSeverity = 0;

  for (const result of results) {
    if (result.errorCount < 1 && result.warningCount < 1) continue;

    errors += result.errorCount;
    warnings += result.warningCount;

    console.group(`\n${result.filePath}`);
    for (const msg of result.messages) {
      const icon = msg.severity === 2 ? error : warn;

      if (msg.severity > maxSeverity) maxSeverity = msg.severity;

      console.log(
        `${msg.line}:${msg.column}  ${icon} ${msg.message}  ${msg.ruleId}\n`,
      );
    }
    console.groupEnd();
  }

  if (errors < 1 && warnings < 1) return;

  const icon = maxSeverity === 2 ? error : warn;

  let problems = errors + warnings;
  problems = `${problems} problem${pluralise(problems)}`;

  errors = chalk.red(`${errors} error${pluralise(errors)}`);
  warnings = chalk.yellow(`${warnings} warning${pluralise(warnings)}`);

  console.log(`${icon} ${problems} (${errors}, ${warnings})\n`);
}
