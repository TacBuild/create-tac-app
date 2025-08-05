import chalk from 'chalk';
import ora from 'ora';

export class Logger {
  constructor() {
    this.verbose = false;
    this.spinner = null;
  }

  setVerbose(verbose) {
    this.verbose = verbose;
  }

  info(message) {
    console.log(chalk.blue('ℹ'), message);
  }

  success(message) {
    console.log(chalk.green('✓'), message);
  }

  warn(message) {
    console.log(chalk.yellow('⚠'), message);
  }

  error(message) {
    console.log(chalk.red('✗'), message);
  }

  debug(message) {
    if (this.verbose) {
      console.log(chalk.gray('→'), message);
    }
  }

  startSpinner(message) {
    this.spinner = ora(message).start();
    return this.spinner;
  }

  stopSpinner(message, success = true) {
    if (this.spinner) {
      if (success) {
        this.spinner.succeed(message);
      } else {
        this.spinner.fail(message);
      }
      this.spinner = null;
    }
  }

  updateSpinner(message) {
    if (this.spinner) {
      this.spinner.text = message;
    }
  }
}