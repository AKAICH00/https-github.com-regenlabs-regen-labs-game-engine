#!/usr/bin/env node

import { Command } from 'commander';
import { setup } from './commands/setup';

const program = new Command();

program
  .name('game-platform')
  .description('CLI tool for Telegram Game Platform')
  .version('0.1.0');

program
  .command('setup')
  .description('Setup a new game for the platform')
  .argument('<game-folder>', 'Name of the game folder')
  .option('--admin', 'Run in admin mode (bypass developer checks)')
  .action(setup);

program.parse();
