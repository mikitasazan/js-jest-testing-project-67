import { Command } from 'commander';
import { pageLoader } from '../src/page-loader.js';

const program = new Command();

program
  .description('utils for download html files')
  .version('0.0.1')
  .option('-o, --output <path>', 'file path to write file')
  .argument('<url>', 'url for download')
  .action(async (url) => {
    const options = program.opts();
    const { output } = options;

    pageLoader(url, output);
  });

program.parse();
