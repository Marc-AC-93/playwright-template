import { ConfigManager } from '../config/ConfigManager';

function createBox(title: string, items: Array<{ label: string }>, minWidth = 60): string {
  const result: string[] = [];

  const lines = items.map(item => item.label);

  const maxLineLength = Math.max(...lines.map(line => line.length), title.length + 2, minWidth - 4);

  const boxWidth = maxLineLength + 4;

  result.push(`\n${title}:`);
  result.push(`   ┌${'─'.repeat(boxWidth - 2)}┐`);

  for (const line of lines) {
    const padding = ' '.repeat(boxWidth - line.length - 4);
    result.push(`   │ ${line}${padding} │`);
  }
  result.push(`   └${'─'.repeat(boxWidth - 2)}┘\n`);

  return result.join('\n');
}

async function globalSetup() {
  const headerLine = '='.repeat(60);
  console.log(`\n🔧 ${headerLine}`);
  console.log('🔧  GLOBAL TEST SETUP');
  console.log(`🔧 ${headerLine}`);

  const configManager = ConfigManager.getInstance();
  const testConfig = configManager.config;
  const portalUrl = testConfig.PORTAL_URL;
  const apiUrl = testConfig.API_URL;

  console.log(
    createBox('📋 Test Configuration', [
      { label: `Env:  ${testConfig.ENV}` },
      { label: `Url:  ${portalUrl}` },
      { label: `Api:  ${apiUrl}` },
    ])
  );
}

export default globalSetup;
